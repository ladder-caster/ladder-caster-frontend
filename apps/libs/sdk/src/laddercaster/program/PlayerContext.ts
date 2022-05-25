import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
import { Caster, Client, Game, Item, ItemFeature, SLOTS_PUBKEY,GameConstantsContextInterface } from '.';
import * as anchor from '@project-serum/anchor';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import resources from 'sdk/src/laddercaster/config/resources.json';
import { deserializeUnchecked } from 'borsh';
import {
  AccountInfo,
  Keypair,
  ParsedAccountData,
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  SYSVAR_SLOT_HASHES_PUBKEY,
  Transaction,
} from '@solana/web3.js';
import {
  MetadataData,
  Metadata,
  MetadataProgram,
} from '@metaplex-foundation/mpl-token-metadata';
import axios from 'axios';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import { Environment } from './Client';
const { SystemProgram } = anchor.web3;
import { TYPE_RES1, TYPE_RES2, TYPE_RES3,LADA_TOKEN_ACCOUNT } from 'core/remix/state';
//import {gameConstantsContext} from '../../laddercaster';
async function getMerkle() {
  return await axios.get(
    'https://arweave.net/m5iJHpCZWIaAJNd9YrQC7knBiCKjwFR-mLgc8tXYjNE',
  );
}

async function buildMerkleTree(url: string): Promise<MerkleTree> {
  const merkelTree = (await axios.get(url)).data;

  return new MerkleTree(merkelTree, keccak256, {
    sortPairs: true,
    hashLeaves: true,
  });
}

let merkle: any = undefined;

async function getMerkleSingleton() {
  if (merkle === undefined) {
    merkle = (await getMerkle()).data;
  }

  return merkle;
}

export type ResourcesPK = {
  seasons: {
    0: {
      gameAccount: string;
      gameAccountProd: string;
      gameAccountProdPriv: string;
    };
    1: {
      gameAccount: string;
      gameAccountProd: string;
      gameAccountProdPriv: string;
    };
  };
};
//constants of cached data used throughout the app
const gameConstantsContext:GameConstantsContextInterface = require("./GameConstantsContext").default
export class PlayerContext {
  
  constructor() {}

  async getPlayer() {
    const [, playerAccount] = await this.getAccounts();
    return await gameConstantsContext.Client.program.account.player.fetch(playerAccount);
  }

  async getResources() {
    await gameConstantsContext.hydrateAccountBalances();

    return {
      [TYPE_RES1]: gameConstantsContext.resource1Balance,
      [TYPE_RES2]: gameConstantsContext.resource2Balance,
      [TYPE_RES3]: gameConstantsContext.resource3Balance,
      lada: gameConstantsContext.ladaBalance ,
      sol: gameConstantsContext.solBalance,
    };
  }

  async getSOLBalance() {
    await gameConstantsContext.hydrateAccountBalances();
    return gameConstantsContext.solBalance;
  }

  async getInventory() {
    const [, playerAccount] = await this.getAccounts();

    const itemArray = (
      await gameConstantsContext.Client.program.account.item.all([
        {
          memcmp: {
            offset: 40,
            bytes: playerAccount.toBase58(),
          },
        },
      ])
    ).map((item) => {
      return { ...(item.account as Item), publicKey: item.publicKey };
    });

    return itemArray;
  }

  async getCasters() {
    const [, playerAccount] = await this.getAccounts();

    const casterArray = (
      await gameConstantsContext.Client.program.account.caster.all([
        { memcmp: { offset: 18, bytes: playerAccount.toBase58() } },
      ])
    ).map((caster) => {
      return { ...caster.account, publicKey: caster.publicKey };
    });

    return casterArray;
  }

  static getGamePK(env: Environment, season: number) {
    switch (env) {
      case 'localprod':
      case 'mainnet': {
        return resources.seasons[season].gameAccountProd;
      }
      case 'mainnet-priv': {
        return resources.seasons[season].gameAccountProdPriv;
      }
      case 'devnet': {
        return resources.seasons[season].gameAccount;
      }
    }
  }

  async getPreSeasonCasters() {
    const casterArray = (
      await gameConstantsContext.Client.program.account.caster.all([
        { memcmp: { offset: 18, bytes: gameConstantsContext.previousPlayerTokenAccount.toBase58() } },
      ])
    ).map((caster) => {
      return { ...caster.account, publicKey: caster.publicKey };
    });

    return casterArray;
  }

  async getItem(itemPK: anchor.web3.PublicKey) {
    return await gameConstantsContext.Client.program.account.item.fetch(itemPK);
  }

  async initPlayer() {
    const [
      gameAccount,
      playerAccount,
      ,
      game,
      ,
      season,
    ] = await this.getAccounts();

    const tx = new Transaction();

    try {
      await this.getPlayer();
    } catch (e) {
      tx.add(
        gameConstantsContext.Client.program.instruction.initPlayer({
          accounts: {
            game: gameAccount,
            season: season,
            playerAccount: playerAccount,
            authority: gameConstantsContext.Client.program.provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
          },
          signers: [gameConstantsContext.Client.wallet.payer],
        }),
      );
    }

    const gameResources = [
      {
        mintAccount: game.resource1MintAccount,
        tokenAccount:gameConstantsContext.resource1TokenAccount,
      },
      {
        mintAccount: game.resource2MintAccount,
        tokenAccount: gameConstantsContext.resource1TokenAccount,
      },
      {
        mintAccount: game.resource3MintAccount,
        tokenAccount: gameConstantsContext.resource1TokenAccount,
      },
    ];

    gameResources.forEach(async (item) => {
      try {
        await gameConstantsContext.Client.connection.getTokenAccountBalance(item.tokenAccount);
      } catch (e) {
        tx.add(
          Token.createAssociatedTokenAccountInstruction(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            item.mintAccount,
            item.tokenAccount,
            gameConstantsContext.Client.wallet.publicKey,
            gameConstantsContext.Client.wallet.publicKey,
          ),
        );
      }
    });

    try {
      await gameConstantsContext.Client.connection.getTokenAccountBalance(gameConstantsContext.ladaTokenAccount);
    } catch (e) {
      tx.add(
        Token.createAssociatedTokenAccountInstruction(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          game.ladaMintAccount,
          new PublicKey(LADA_TOKEN_ACCOUNT),
          gameConstantsContext.Client.wallet.publicKey,
          gameConstantsContext.Client.wallet.publicKey,
        ),
      );
    }

    const blockhash = (await gameConstantsContext.Client.connection.getLatestBlockhash())
      .blockhash;
    tx.recentBlockhash = blockhash;
    tx.feePayer = gameConstantsContext.Client.wallet.publicKey;

    return await gameConstantsContext.Client.program.provider.send(tx);
  }

  async openChest(chestItem: Item) {
    const [gameAccount, playerAccount, , , , season] = await this.getAccounts();
    const item1 = Keypair.generate();
    const item2 = Keypair.generate();
    const item3 = Keypair.generate();
    return await gameConstantsContext.Client.program.rpc.openChest({
      accounts: {
        game: gameAccount,
        authority: gameConstantsContext.Client.program.provider.wallet.publicKey,
        player: playerAccount,
        slots: SYSVAR_SLOT_HASHES_PUBKEY,
        instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
        chest: chestItem.publicKey,
        season: season,
        item1: item1.publicKey,
        item2: item2.publicKey,
        item3: item3.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [gameConstantsContext.Client.wallet.payer, item1, item2, item3],
    });
  }

  async manualResourceburn(
    casterId: anchor.BN,
    resourceType: ItemFeature,
    amountToBurn: anchor.BN,
  ) {
    const [gameAccount, playerAccount] = await this.getAccounts();
    return await gameConstantsContext.Client.program.rpc.manualResourceburn(
      casterId,
      resourceType,
      amountToBurn,
      {
        accounts: {
          game: gameAccount,
          playerAccount: playerAccount,
          authority: gameConstantsContext.Client.program.provider.wallet.publicKey,
        },
      },
    );
  }

  async manualItemBurn(item: PublicKey) {
    const [
      gameAccount,
      playerAccount,
      ,
      game,
      gameSigner,
      season,
    ] = await this.getAccounts();
    const mintAccounts = await this.getMintAccounts(game);

    return gameConstantsContext.Client.program.rpc.manualItemBurn({
      accounts: {
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
        authority: gameConstantsContext.Client.program.provider.wallet.publicKey,
        game: gameAccount,
        player: playerAccount,
        gameSigner,
        season,
        item,
        ...mintAccounts,
      },
      signers: [gameConstantsContext.Client.wallet.payer],
    });
  }

  private async getMintAccounts(game: Game) {
    return {
      resource1MintAccount: game.resource1MintAccount,
      resource2MintAccount: game.resource2MintAccount,
      resource3MintAccount: game.resource3MintAccount,
      resource1TokenAccount: gameConstantsContext.resource1TokenAccount,
      resource2TokenAccount: gameConstantsContext.resource2TokenAccount,
      resource3TokenAccount: gameConstantsContext.resource3TokenAccount,
    };
  }

  // https://github.com/NftEyez/sol-rayz/blob/main/packages/sol-rayz/src/getParsedNftAccountsByOwner.ts
  async getNFTS() {
    const {
      value: splAccounts,
    } = await gameConstantsContext.Client.connection.getParsedTokenAccountsByOwner(
      new PublicKey(gameConstantsContext.Client.wallet.publicKey),
      {
        programId: new PublicKey(TOKEN_PROGRAM_ID),
      },
    );
      let accountsFiltered = [];
      // for loops with index incrementing iterates faster than forof/maps
      // iterates once over all NFT's instead of multiple passes to reduce overhead
      for(let i = 0;i<splAccounts.length;i++){
        let splAccount = splAccounts[i];
        const amount = splAccount.account?.data?.parsed?.info?.tokenAmount?.uiAmount;
        const decimals = splAccount.account?.data?.parsed?.info?.tokenAmount?.decimals;
        if(!(decimals === 0 && amount >= 1) )continue;
        const nft = MetadataProgram.findMetadataAccount(new PublicKey(splAccount.account?.data?.parsed?.info?.mint)).then(metaDataAddress=>{
          //console.log('metaDataAddress',metaDataAddress)
          return gameConstantsContext.Client.connection.getAccountInfo(metaDataAddress[0]).then(rawMetaData=>{
            const account = rawMetaData as AccountInfo<Buffer>;
            if(!account)return;

            return deserializeUnchecked(
              MetadataData.SCHEMA,
              MetadataData,
              account.data,
            )
          }).then(res=>{
            if(!res)return;
            
            const uri = res.data?.uri?.replace?.(/\0/g, '')
            const symbol = res.data?.symbol;
            if((uri!=='' && uri!==undefined) && (symbol==='LC')){
             return res
            }
          })
        }).catch(err=>{console.log('ERROR:',err);return;})
        accountsFiltered.push(nft)
      }
      accountsFiltered = await Promise.all(accountsFiltered).then(res=>
        res.filter(x=>x!==undefined));

    return accountsFiltered;
  }

  async mintNFTCaster(caster: Caster) {
    const nftMintKeys = Keypair.generate();
    await getMerkleSingleton();
    const uri:string = await this.getCasterUri(caster);
    //Merkle proof part
    let [leaf,tree]=await Promise.all([this.buildLeafCaster(caster, uri),buildMerkleTree(merkle['merkleLeaves']['combined'])]);
    
    const proof = tree.getProof(leaf);
    const validProof: Buffer[] = proof.map((p) => p.data);
    const mintOptions = await this.buildMintOptions('combined', 0, nftMintKeys);

    let signers = [nftMintKeys];
    if (gameConstantsContext.Client.wallet.payer) {
      signers = [gameConstantsContext.Client.wallet.payer, ...signers];
    }

    return await gameConstantsContext.Client.program.rpc.mintCaster(
      0,
     uri,
      validProof,
      {
        accounts: {
          ...mintOptions,
          caster: caster.publicKey,
        },
        signers,
      },
    );
  }

  async mintNFTItem(item: Item) {
    const nftMintKeys = Keypair.generate();

    let itemType = 'combined';
    if (item.itemType.equipment || item.itemType.spellBook) {
      if (item.itemType.spellBook) {
        itemType = 'spellbook';
      } else {
        itemType = Object.keys(item.itemType.equipment.equipmentType)[0];
      }
    }
    await getMerkleSingleton();
    const uri:string = await this.getItemUri(item, itemType);
    //Merkle proof part
    // noinspection TypeScriptValidateTypes
  
    const [leaf,tree]=await Promise.all([this.buildLeafItem(item, uri),buildMerkleTree(
      itemType === 'combined' || itemType === 'spellBook'
        ? merkle['merkleLeaves'][itemType]
        : merkle['merkleLeaves'][itemType][item.level],
    )]);

    const proof = tree.getProof(leaf);
    const validProof: Buffer[] = proof.map((p) => p.data);

    let signers = [nftMintKeys];
    if (gameConstantsContext.Client.wallet.payer) {
      signers = [gameConstantsContext.Client.wallet.payer, ...signers];
    }
    
    const mintOptions = await this.buildMintOptions(
      itemType,
      itemType === 'combined' || itemType === 'spellbook' ? 0 : item.level,
      nftMintKeys);
      console.log("SIGNERS",signers,mintOptions)
    return await gameConstantsContext.Client.program.rpc.mintItem(
      itemType === 'spellbook' ? 'spellBook' : itemType,
      itemType === 'combined' || itemType === 'spellbook' ? 0 : item.level,
      uri,
      validProof,
      {
        accounts: {
          ...mintOptions,
          item: item.publicKey,
        },
        signers,
      },
    );
  }

  async redeemNFTCaster(nftMintKeys: PublicKey) {
    const caster = Keypair.generate();
    const redeemOptions = await this.buildRedeemOptions(nftMintKeys, caster);
    return await gameConstantsContext.Client.program.rpc.redeemCaster({
      ...redeemOptions,
      accounts: {
        ...redeemOptions.accounts,
        caster: caster.publicKey,
      },
    });
  }

  async redeemNFTTwinPack(nftMintKeys: PublicKey) {
    const [gameAccount, playerAccount, , , , season] = await this.getAccounts();
    const caster1 = Keypair.generate();
    const caster2 = Keypair.generate();

    const nftToken = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      nftMintKeys,
      gameConstantsContext.Client.program.provider.wallet.publicKey,
    );

    const [metaplexTokenMetadata] = findProgramAddressSync(
      [
        Buffer.from('metadata'),
        MetadataProgram.PUBKEY.toBuffer(),
        nftMintKeys.toBuffer(),
      ],
      MetadataProgram.PUBKEY,
    );

    return await gameConstantsContext.Client.program.rpc.redeemCasters({
      accounts: {
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
        authority: gameConstantsContext.Client.program.provider.wallet.publicKey,
        game: gameAccount,
        player: playerAccount,
        season: season,
        slots: SYSVAR_SLOT_HASHES_PUBKEY,
        nftMint: nftMintKeys,
        nftToken: nftToken,
        metaplexTokenMetadataProgram: MetadataProgram.PUBKEY,
        metaplexTokenMetadata,
        caster1: caster1.publicKey,
        caster2: caster2.publicKey,
      },
      signers: [
        // gameConstantsContext.Client.wallet.payer,
        caster1,
        caster2,
      ],
    });
  }

  async redeemNFTItem(nftMintKeys: PublicKey) {
    const newItem = Keypair.generate();
    const redeemOptions = await this.buildRedeemOptions(nftMintKeys, newItem);

    return await gameConstantsContext.Client.program.rpc.redeemItem({
      ...redeemOptions,
      accounts: {
        ...redeemOptions.accounts,
        item: newItem.publicKey,
      },
    });
  }

  async getNFTUris(nfts: MetadataData[]) {
    let arr = [];
    let keys = Object.keys(nfts)
    for(let i = 0;i<keys.length;i++){
      const nft = nfts[keys[i]];
      arr.push(axios.get(nft.data.uri).then(res=>({...res,mint:nft.mint})));
    }

    arr = await Promise.all(arr).then(res=>res);
    return arr;
  }

  private async buildLeafCaster(caster: Caster, uri: string) {
    return keccak256(
      `${uri}:caster:${caster.seasonNumber}:${
        caster.version
      }:${caster.level}:${caster.edition === 1 ? 'normal' : 'limited'}`,
    );
  }

  private async buildMintOptions(
    itemType: string,
    level: number,
    nftMintKeys: Keypair,
  ) {
    const asyncDispatch = [ 
      anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from(anchor.utils.bytes.utf8.encode('metadata')),
          nftMintKeys.publicKey.toBuffer(),
        ],
        gameConstantsContext.Client.program.programId,
      ),
      Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        nftMintKeys.publicKey,
        gameConstantsContext.Client.program.provider.wallet.publicKey,
      ),
      Metadata.getPDA(
        nftMintKeys.publicKey,
      ),
    ]
    const [nftMetadataTuple,nftToken,metaplexMetadataAccount] = await Promise.all(asyncDispatch);

    const [merkleRootNft] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('merkle_roots'),
        gameConstantsContext.gameTokenAccount.toBuffer(),
        Buffer.from(itemType),
        Buffer.from(anchor.utils.bytes.utf8.encode(String(level))),
      ],
      gameConstantsContext.Client.program.programId,
    );
    const [nftMetadata]=nftMetadataTuple;
    return {
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
      authority: gameConstantsContext.Client.program.provider.wallet.publicKey,
      game: gameConstantsContext.gameTokenAccount,
      gameSigner: gameConstantsContext.gameSigner,
      season: gameConstantsContext.season,
      player: gameConstantsContext.playerTokenAccount,
      metaplexMetadataAccount: metaplexMetadataAccount,
      metaplexTokenMetadataProgram: MetadataProgram.PUBKEY,
      merkleRootNft,
      nftMint: nftMintKeys.publicKey,
      nftToken: nftToken,
      nftMetadata: nftMetadata,
    };
  }

  private async buildRedeemOptions(
    nftMintKeys: PublicKey,
    generatedPubKey: Keypair,
  ) {
    const [nftMetadataTuple,nftToken] = await Promise.all([
      anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(anchor.utils.bytes.utf8.encode('metadata')),
        nftMintKeys.toBuffer(),
      ],
      gameConstantsContext.Client.program.programId,
    ),
    Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      nftMintKeys,
      gameConstantsContext.Client.program.provider.wallet.publicKey,
    )
  ]);

    let signers = [generatedPubKey];
    if (gameConstantsContext.Client.wallet.payer) {
      signers = [gameConstantsContext.Client.wallet.payer, ...signers];
    }
    const [nftMetadata,]=nftMetadataTuple;
    return {
      accounts: {
        game: gameConstantsContext.gameTokenAccount,
        nftMint: nftMintKeys,
        nftToken: nftToken,
        nftMetadata: nftMetadata,
        player: gameConstantsContext.playerTokenAccount,
        season:gameConstantsContext.season,
        authority: gameConstantsContext.Client.program.provider.wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      },
      signers,
    };
  }

  private async getCasterUri(caster: Caster) {
    const lookupTable = (await axios.get(merkle['merkleStruct']['combined']))
      .data;

    return lookupTable['caster'][caster.seasonNumber][caster.version][
      caster.level
    ][caster.edition === 1 ? 'normal' : 'limited'];
  }

  private async getItemUri(item: Item, itemType: string) {
    const url =
      itemType === 'combined' || itemType === 'spellbook'
        ? merkle['merkleStruct'][itemType]
        : merkle['merkleStruct'][itemType][item.level];
    const lookupTable = (await axios.get(url)).data;

    switch (Object.keys(item.itemType)[0]) {
      case 'equipment': {
        const lookupRarity =
          lookupTable[Object.keys(item.itemType.equipment.feature)[0]][
          Object.keys(item.itemType.equipment.rarity)[0]
          ];
        if (lookupRarity) return lookupRarity[item.itemType.equipment.value];
        else
          return lookupTable[Object.keys(item.itemType.equipment.feature)[0]][
            this.capitalizeFirstLetter(
              Object.keys(item.itemType.equipment.rarity)[0],
            )
          ][item.itemType.equipment.value];
      }
      case 'spellBook': {
        const lookupRarity =
          lookupTable[item.level][
          Object.keys(item.itemType.spellBook.spell)[0]
          ][Object.keys(item.itemType.spellBook.costFeature)[0]][
          Object.keys(item.itemType.spellBook.rarity)[0]
          ];
        console.log(lookupRarity);
        console.log(item.itemType.spellBook.cost);
        console.log(item.itemType.spellBook.value);
        if (lookupRarity)
          return lookupRarity[item.itemType.spellBook.cost][
            item.itemType.spellBook.value
          ];
        else
          return lookupTable[item.level][
            Object.keys(item.itemType.spellBook.spell)[0]
          ][Object.keys(item.itemType.spellBook.costFeature)[0]][
            this.capitalizeFirstLetter(
              Object.keys(item.itemType.spellBook.rarity)[0],
            )
          ][item.itemType.spellBook.cost][item.itemType.spellBook.value];
      }
      case 'chest': {
        return lookupTable['chest'][item.level][item.itemType.chest.tier];
      }
    }
  }

  private capitalizeFirstLetter(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  private async buildLeafItem(item: Item,uri:string) {
    switch (Object.keys(item.itemType)[0]) {
      case 'equipment': {
        return keccak256(
          `${uri}:${Object.keys(item.itemType.equipment.equipmentType)[0]
          }:${item.level}:${Object.keys(item.itemType.equipment.feature)[0]}:${Object.keys(item.itemType.equipment.rarity)[0]
          }:${item.itemType.equipment.value}`,
        );
      }
      case 'spellbook': {
        return keccak256(
          `${uri}:spellbook:${item.level}:${Object.keys(item.itemType.spellBook.spell)[0]
          }:${Object.keys(item.itemType.spellBook.costFeature)[0]}:${Object.keys(item.itemType.spellBook.rarity)[0]
          }:${item.itemType.spellBook.cost}:${item.itemType.spellBook.value}`,
        );
      }
      case 'chest': {
        console.log('heyo');
        console.log(
          `${uri}:chest:${item.level}:${
            item.itemType.chest.tier
          }`,
        );
        return keccak256(
          `${uri}:chest:${item.level}:${item.itemType.chest.tier
          }`,
        );
      }
    }
  }

  private async getAccounts(): Promise<
    [PublicKey, PublicKey, number, Game, PublicKey, PublicKey]
  > {
    return await gameConstantsContext.getPlayerAccounts;
  }
}

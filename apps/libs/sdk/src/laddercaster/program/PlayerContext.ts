import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
import { Caster, Client, Game, Item, ItemFeature, SLOTS_PUBKEY } from '.';
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
import { TYPE_RES1, TYPE_RES2, TYPE_RES3, RESOURCE1_TOKEN_ACCOUNT, RESOURCE2_TOKEN_ACCOUNT, RESOURCE3_TOKEN_ACCOUNT, LADA_TOKEN_ACCOUNT,GAME_CONSTANTS } from 'core/remix/state';
//import {gameConstantsContext} from '../../laddercaster';
async function getMerkle() {
  return await axios.get(
    'https://arweave.net/C-spa46EfVVFX2PcbzcKwyf1Q3oZ-FwKqWFLaKyYgxM',
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

export class PlayerContext {
  private game: Game;
  private playerAccount: PublicKey;
  private playerBump: number;
  private gameSigner: PublicKey;
  private season: PublicKey;
  
  constructor(
    private client: Client,
    private playerPubKey: anchor.web3.PublicKey,
    private gamePK: string,
  ) {
    //gameConstantsContext?.hydrateGame();
   }

  async getPlayer() {
    const [, playerAccount] = await this.getAccounts();
    return await this.client.program.account.player.fetch(playerAccount);
  }

  async getResources() {
    const [, , , game] = await this.getAccounts();
    if (!localStorage.getItem(RESOURCE1_TOKEN_ACCOUNT)) {
      this.cacheTokenAccounts(game);
    }
    const asyncDispatch = [
      this.getResource(new anchor.web3.PublicKey(localStorage.getItem(RESOURCE1_TOKEN_ACCOUNT))),
      this.getResource(new anchor.web3.PublicKey(localStorage.getItem(RESOURCE2_TOKEN_ACCOUNT))),
      this.getResource(new anchor.web3.PublicKey(localStorage.getItem(RESOURCE3_TOKEN_ACCOUNT))),
      this.getResource(new anchor.web3.PublicKey(localStorage.getItem(LADA_TOKEN_ACCOUNT)))
    ];
    // prevents sync stacking of time.. e.g 1s, 3s, 2s, 2s = 8s .. async dispatch reduces to 3s
   const result = await Promise.all(asyncDispatch).then(res=>res);
    
    return {
      [TYPE_RES1]: result[0],
      [TYPE_RES2]: result[1],
      [TYPE_RES3]: result[2],
      lada: result[3] / 1e9,
      sol: (await this.getSOLBalance()) / 1e9,
    };
  }

  async getSOLBalance() {
    try {
      return await this.client.connection.getBalance(
        this.client.wallet.publicKey,
      );
    } catch (e) {
      return 0;
    }
  }

  async getInventory() {
    const [, playerAccount] = await this.getAccounts();

    const itemArray = (
      await this.client.program.account.item.all([
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
      await this.client.program.account.caster.all([
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
    const gameAccount = new anchor.web3.PublicKey(
      PlayerContext.getGamePK(process.env.REACT_APP_ENV as Environment, 0),
    );

    const [playerAccount] = findProgramAddressSync(
      [gameAccount.toBuffer(), this.playerPubKey.toBuffer()],
      this.client.program.programId,
    );

    const casterArray = (
      await this.client.program.account.caster.all([
        { memcmp: { offset: 18, bytes: playerAccount.toBase58() } },
      ])
    ).map((caster) => {
      return { ...caster.account, publicKey: caster.publicKey };
    });

    return casterArray;
  }

  async getItem(itemPK: anchor.web3.PublicKey) {
    return await this.client.program.account.item.fetch(itemPK);
  }

  async getResAccountBalance() {
    const [, , , game] = await this.getAccounts();
    const tokenAccount = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      game.resource1MintAccount,
      this.client.wallet.publicKey,
    );
    try {
      const result = await this.client.connection.getTokenAccountBalance(
        tokenAccount,
      );
      return result;
    } catch (e) {
      console.log(e);
    }
  }

  async getLadaAccountBalance() {
    const [, , , game] = await this.getAccounts();
    const tokenAccount = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      game.ladaMintAccount,
      this.client.wallet.publicKey,
    );
    try {
      return await this.client.connection.getTokenAccountBalance(tokenAccount);
    } catch (e) {
      console.log(e);
    }
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
        this.client.program.instruction.initPlayer({
          accounts: {
            game: gameAccount,
            season: season,
            playerAccount: playerAccount,
            authority: this.playerPubKey,
            systemProgram: SystemProgram.programId,
          },
          signers: [this.client.wallet.payer],
        }),
      );
    }
    if(!localStorage.getItem(RESOURCE1_TOKEN_ACCOUNT)) {
      await this.cacheTokenAccounts(game);
    }

    const resources = [
      {
        mintAccount: game.resource1MintAccount,
        tokenAccount: new PublicKey(localStorage.getItem(RESOURCE1_TOKEN_ACCOUNT)),
      },
      {
        mintAccount: game.resource2MintAccount,
        tokenAccount: new PublicKey(localStorage.getItem(RESOURCE2_TOKEN_ACCOUNT)),
      },
      {
        mintAccount: game.resource3MintAccount,
        tokenAccount: new PublicKey(localStorage.getItem(RESOURCE3_TOKEN_ACCOUNT)),
      },
    ];

    resources.forEach(async (item) => {
      try {
        await this.client.connection.getTokenAccountBalance(item.tokenAccount);
      } catch (e) {
        tx.add(
          Token.createAssociatedTokenAccountInstruction(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            item.mintAccount,
            item.tokenAccount,
            this.client.wallet.publicKey,
            this.client.wallet.publicKey,
          ),
        );
      }
    });

    try {
      await this.client.connection.getTokenAccountBalance(new PublicKey(LADA_TOKEN_ACCOUNT));
    } catch (e) {
      tx.add(
        Token.createAssociatedTokenAccountInstruction(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          game.ladaMintAccount,
          new PublicKey(LADA_TOKEN_ACCOUNT),
          this.client.wallet.publicKey,
          this.client.wallet.publicKey,
        ),
      );
    }

    const blockhash = (await this.client.connection.getLatestBlockhash())
      .blockhash;
    tx.recentBlockhash = blockhash;
    tx.feePayer = this.client.wallet.publicKey;

    return await this.client.program.provider.send(tx);
  }

  async openChest(chestItem: Item) {
    const [gameAccount, playerAccount, , , , season] = await this.getAccounts();
    const item1 = Keypair.generate();
    const item2 = Keypair.generate();
    const item3 = Keypair.generate();
    return await this.client.program.rpc.openChest({
      accounts: {
        game: gameAccount,
        authority: this.playerPubKey,
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
      signers: [this.client.wallet.payer, item1, item2, item3],
    });
  }

  async manualResourceburn(
    casterId: anchor.BN,
    resourceType: ItemFeature,
    amountToBurn: anchor.BN,
  ) {
    const [gameAccount, playerAccount] = await this.getAccounts();
    return await this.client.program.rpc.manualResourceburn(
      casterId,
      resourceType,
      amountToBurn,
      {
        accounts: {
          game: gameAccount,
          playerAccount: playerAccount,
          authority: this.playerPubKey,
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

    return this.client.program.rpc.manualItemBurn({
      accounts: {
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
        authority: this.playerPubKey,
        game: gameAccount,
        player: playerAccount,
        gameSigner,
        season,
        item,
        ...mintAccounts,
      },
      signers: [this.client.wallet.payer],
    });
  }

  private async getMintAccounts(game: Game) {
    if(!localStorage.getItem(RESOURCE1_TOKEN_ACCOUNT)){
      await this.cacheTokenAccounts(game);
    }
    const ata_resourcemint1 = new PublicKey(localStorage.getItem(RESOURCE1_TOKEN_ACCOUNT));
    const ata_resourcemint2 = new PublicKey(localStorage.getItem(RESOURCE2_TOKEN_ACCOUNT));
    const ata_resourcemint3 = new PublicKey(localStorage.getItem(RESOURCE3_TOKEN_ACCOUNT));

    return {
      resource1MintAccount: game.resource1MintAccount,
      resource2MintAccount: game.resource2MintAccount,
      resource3MintAccount: game.resource3MintAccount,
      resource1TokenAccount: ata_resourcemint1,
      resource2TokenAccount: ata_resourcemint2,
      resource3TokenAccount: ata_resourcemint3,
    };
  }

  // https://github.com/NftEyez/sol-rayz/blob/main/packages/sol-rayz/src/getParsedNftAccountsByOwner.ts
  async getNFTS() {
    const {
      value: splAccounts,
    } = await this.client.connection.getParsedTokenAccountsByOwner(
      new PublicKey(this.client.wallet.publicKey),
      {
        programId: new PublicKey(TOKEN_PROGRAM_ID),
      },
    );
      const accountsFiltered = [];
      // for loops with index incrementing iterates faster than for-of of maps
      console.log('doing it')
      for(let i = 0;i<splAccounts.length;i++){
        let splAccount = splAccounts[i];
        const amount = splAccount.account?.data?.parsed?.info?.tokenAmount?.uiAmount;
        const decimals = splAccount.account?.data?.parsed?.info?.tokenAmount?.decimals;
        if(decimals !== 0 && amount <=0 )continue;
        console.log('found nft')
        const nft = MetadataProgram.findMetadataAccount(new PublicKey(splAccount.account?.data?.parsed?.info?.mint)).then(metaDataAddress=>{
          console.log('metaDataAddress',metaDataAddress)
          this.client.connection.getMultipleAccountsInfo([metaDataAddress[0]]).then(res=>console.log(res))
          return this.client.connection.getAccountInfo(metaDataAddress[0]).then(rawMetaData=>{
            console.log('rawMetaData',rawMetaData)
            return deserializeUnchecked(
              MetadataData.SCHEMA,
              MetadataData,
              (rawMetaData as AccountInfo<Buffer>)?.data,
            )
          }) as Promise<MetadataData>
        })
        accountsFiltered.push(nft)
      }
      await Promise.all(accountsFiltered);
    // const metadataAcountsAddressPromises = await Promise.allSettled(
    //   nftAccounts.map(MetadataProgram.findMetadataAccount),
    // );

    // const metadataAccounts = [];
    // for (let i=0;i< metadataAcountsAddressPromises.length;i++) {
    //   const account = metadataAcountsAddressPromises[i];
    //   if(account && account.status === 'fulfilled'){
    //     metadataAccounts.push((account as PromiseFulfilledResult<[PublicKey, number]>)?.value[0]);
    //   }
    // }

    // const accountsRawMeta: (AccountInfo<
    //   Buffer | ParsedAccountData
    // > | null)[] = (
    //   await this.client.connection.getMultipleAccountsInfo(metadataAccounts)
    // ).filter((result) => result);

    // if (!accountsRawMeta?.length || accountsRawMeta?.length === 0) {
    //   return [];
    // }

    // const accountsDecodedMeta = await Promise.allSettled(
    //   accountsRawMeta.map((accountInfo) =>
    //     deserializeUnchecked(
    //       MetadataData.SCHEMA,
    //       MetadataData,
    //       (accountInfo as AccountInfo<Buffer>)?.data,
    //     ),
    //   ),
    // );

    // const accountsFiltered = [];
    // for(let i = 0;i<accountsDecodedMeta.length;i++){
    //   const account = accountsDecodedMeta[i];
    //   if(account && account.status === 'fulfilled'){
    //     accountsFiltered.push((account as PromiseFulfilledResult<MetadataData>)?.value);
    //   }
    // }
      console.log('accounts filtered',accountsFiltered)
    return accountsFiltered.map(nft=>nft?.value);
  }

  async mintNFTCaster(caster: Caster) {
    const nftMintKeys = Keypair.generate();
    await getMerkleSingleton();

    //Merkle proof part
    let [leaf,tree]=await Promise.all([this.buildLeafCaster(caster),buildMerkleTree(merkle['merkleLeaves']['combined'])]);
    
    const proof = tree.getProof(leaf);
    const validProof: Buffer[] = proof.map((p) => p.data);
    const mintOptions = await this.buildMintOptions('combined', 0, nftMintKeys);

    let signers = [nftMintKeys];
    if (this.client.wallet.payer) {
      signers = [this.client.wallet.payer, ...signers];
    }

    return await this.client.program.rpc.mintCaster(
      0,
      await this.getCasterUri(caster),
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
        itemType = 'spellBook';
      } else {
        itemType = Object.keys(item.itemType.equipment.equipmentType)[0];
      }
    }

    //Merkle proof part
    // noinspection TypeScriptValidateTypes
    await getMerkleSingleton();
    const [leaf,tree]=await Promise.all([this.buildLeafItem(item, itemType),buildMerkleTree(
      itemType === 'combined' || itemType === 'spellBook'
        ? merkle['merkleLeaves'][itemType]
        : merkle['merkleLeaves'][itemType][item.level],
    )]);

    const proof = tree.getProof(leaf);
    const validProof: Buffer[] = proof.map((p) => p.data);

    let signers = [nftMintKeys];
    if (this.client.wallet.payer) {
      signers = [this.client.wallet.payer, ...signers];
    }

    const mintOptions = await this.buildMintOptions(
      itemType,
      itemType === 'combined' || itemType === 'spellBook' ? 0 : item.level,
      nftMintKeys,
    );

    return await this.client.program.rpc.mintItem(
      itemType,
      itemType === 'combined' || itemType === 'spellBook' ? 0 : item.level,
      await this.getItemUri(item, itemType),
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
    return await this.client.program.rpc.redeemCaster({
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
      this.playerPubKey,
    );

    const [metaplexTokenMetadata] = findProgramAddressSync(
      [
        Buffer.from('metadata'),
        MetadataProgram.PUBKEY.toBuffer(),
        nftMintKeys.toBuffer(),
      ],
      MetadataProgram.PUBKEY,
    );

    return await this.client.program.rpc.redeemCasters({
      accounts: {
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
        authority: this.playerPubKey,
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
        // this.client.wallet.payer,
        caster1,
        caster2,
      ],
    });
  }

  async redeemNFTItem(nftMintKeys: PublicKey) {
    const newItem = Keypair.generate();
    const redeemOptions = await this.buildRedeemOptions(nftMintKeys, newItem);

    return await this.client.program.rpc.redeemItem({
      ...redeemOptions,
      accounts: {
        ...redeemOptions.accounts,
        item: newItem.publicKey,
      },
    });
  }

  async getNFTUris(nfts: MetadataData[]) {
    
    // var data = Object.keys(nfts).map((key) => nfts[key]);
    let arr = [];
    // let n = data.length;
    let keys = Object.keys(nfts)
    for(let i = 0;i<keys.length;i++){
      const nft = nfts[keys[i]];
      arr.push(axios.get(nft.data.uri).then(res=>({...res,mint:nft.mint})));
    }
    // for (let i = 0; i < n; i++) {
    //   let val = await axios.get(data[i].data.uri);
    //   arr.push({ ...val, mint: data[i].mint });
    // }

    return arr;
  }

  private async buildLeafCaster(caster: Caster) {
    return keccak256(
      `${await this.getCasterUri(caster)}:caster:${caster.version}:${caster.level
      }`,
    );
  }

  private async buildMintOptions(
    itemType: string,
    level: number,
    nftMintKeys: Keypair,
  ) {
    const [
      gameAccount,
      playerAccount,
      ,
      ,
      gameSigner,
      season,
    ] = await this.getAccounts();
    const [nftMetadata] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(anchor.utils.bytes.utf8.encode('metadata')),
        nftMintKeys.publicKey.toBuffer(),
      ],
      this.client.program.programId,
    );
    const nftToken = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      nftMintKeys.publicKey,
      this.playerPubKey,
    );
    const metaplexMetadataAccount = await Metadata.getPDA(
      nftMintKeys.publicKey,
    );

    const [merkleRootNft] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('merkle_roots'),
        gameAccount.toBuffer(),
        Buffer.from(itemType),
        Buffer.from(anchor.utils.bytes.utf8.encode(String(level))),
      ],
      this.client.program.programId,
    );

    return {
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
      authority: this.playerPubKey,
      game: gameAccount,
      gameSigner: gameSigner,
      season: season,
      player: playerAccount,
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
    const [accounts,nftMetaData,nftToken] = await Promise.all([this.getAccounts(),
      anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(anchor.utils.bytes.utf8.encode('metadata')),
        nftMintKeys.toBuffer(),
      ],
      this.client.program.programId,
    ),
    Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      nftMintKeys,
      this.playerPubKey,
    )
  ]);

    let signers = [generatedPubKey];
    if (this.client.wallet.payer) {
      signers = [this.client.wallet.payer, ...signers];
    }

    return {
      accounts: {
        game: accounts[0],
        nftMint: nftMintKeys,
        nftToken: nftToken,
        nftMetadata: nftMetaData,
        player: accounts[1],
        authority: this.playerPubKey,
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
    return lookupTable['caster'][caster.version][caster.level];
  }

  private async getItemUri(item: Item, itemType: string) {
    const url =
      itemType === 'combined' || itemType === 'spellBook'
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

  private async buildLeafItem(item: Item, itemType) {
    switch (Object.keys(item.itemType)[0]) {
      case 'equipment': {
        return keccak256(
          `${await this.getItemUri(item, itemType)}:${Object.keys(item.itemType.equipment.equipmentType)[0]
          }:${item.level}:${Object.keys(item.itemType.equipment.feature)[0]}:${Object.keys(item.itemType.equipment.rarity)[0]
          }:${item.itemType.equipment.value}`,
        );
      }
      case 'spellBook': {
        return keccak256(
          `${await this.getItemUri(item, itemType)}:spellbook:${item.level}:${Object.keys(item.itemType.spellBook.spell)[0]
          }:${Object.keys(item.itemType.spellBook.costFeature)[0]}:${Object.keys(item.itemType.spellBook.rarity)[0]
          }:${item.itemType.spellBook.cost}:${item.itemType.spellBook.value}`,
        );
      }
      case 'chest': {
        return keccak256(
          `${await this.getItemUri(item, itemType)}:chest:${item.level}:${item.itemType.chest.tier
          }`,
        );
      }
    }
  }
  private async getResource(tokenAccount: PublicKey){
    try {
      const resourceAmount = await this.client.connection.getTokenAccountBalance(
        tokenAccount,
      );

      return resourceAmount.value.amount;
    } catch (_e) {
      return 0;
    }
  }
  private async cacheTokenAccounts(game: Game) {
    if (!localStorage.getItem(RESOURCE1_TOKEN_ACCOUNT)) {
      const asyncDispatch = [
        Token.getAssociatedTokenAddress(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          game.resource1MintAccount,
          this.client.wallet.publicKey,
        ),
        Token.getAssociatedTokenAddress(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          game.resource2MintAccount,
          this.client.wallet.publicKey,
        ),
        Token.getAssociatedTokenAddress(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          game.resource3MintAccount,
          this.client.wallet.publicKey,
        ),
        Token.getAssociatedTokenAddress(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          game.ladaMintAccount,
          this.client.wallet.publicKey,
        )
      ];
      await Promise.all(asyncDispatch).then(([mint1, mint2, mint3, lada]) => {
        localStorage.setItem(RESOURCE1_TOKEN_ACCOUNT, mint1.toString());
        localStorage.setItem(RESOURCE2_TOKEN_ACCOUNT, mint2.toString());
        localStorage.setItem(RESOURCE3_TOKEN_ACCOUNT, mint3.toString());
        localStorage.setItem(LADA_TOKEN_ACCOUNT, lada.toString());
      })
    }
  }

  private async getAccounts(): Promise<
    [PublicKey, PublicKey, number, Game, PublicKey, PublicKey]
  > {
    const gameAccount = new anchor.web3.PublicKey(this.gamePK);
    if (!this.playerAccount) {
      const [playerAccount, playerBump] = findProgramAddressSync(
        [gameAccount.toBuffer(), this.playerPubKey.toBuffer()],
        this.client.program.programId,
      );
      this.playerAccount = playerAccount;
      this.playerBump = playerBump;
    }
    if (!this.game) {
      const game = (await this.client.program.account.game.fetch(
        gameAccount,
      )) as Game;
      this.game = game;
      
    }
    if(!localStorage.getItem(RESOURCE1_TOKEN_ACCOUNT)){
      this.cacheTokenAccounts(this.game);
    }
    if (!this.gameSigner) {
      const [gameSigner] = findProgramAddressSync(
        [Buffer.from('game_signer')],
        this.client.program.programId,
      );

      this.gameSigner = gameSigner;
    }

    if (!this.season) {
      const [season] = findProgramAddressSync(
        [Buffer.from('season'), new PublicKey(gameAccount).toBuffer()],
        this.client.program.programId,
      );

      this.season = season;
    }

    return [
      gameAccount,
      this.playerAccount,
      this.playerBump,
      this.game,
      this.gameSigner,
      this.season,
    ];
  }
}

import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
import { Caster, Client, Game, Item, ItemFeature, SLOTS_PUBKEY } from '.';
import * as anchor from '@project-serum/anchor';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
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
const { SystemProgram } = anchor.web3;
import { TYPE_RES1, TYPE_RES2, TYPE_RES3 } from 'core/remix/state';

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
  gameAccount: string;
  gameAccountProd: string;
  gameAccountProdPriv: string;
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
  ) {}

  async getPlayer() {
    const [, playerAccount] = await this.getAccounts();
    return await this.client.program.account.player.fetch(playerAccount);
  }

  async getResources() {
    const [, , , game] = await this.getAccounts();

    const pkArray = [
      game.resource1MintAccount,
      game.resource2MintAccount,
      game.resource3MintAccount,
      game.ladaMintAccount,
    ];

    const resourcesArray = [];

    for (let i = 0; i < pkArray.length; i++) {
      resourcesArray.push(
        await this.getResource(new anchor.web3.PublicKey(pkArray[i])),
      );
    }

    return {
      [TYPE_RES1]: resourcesArray[0],
      [TYPE_RES2]: resourcesArray[1],
      [TYPE_RES3]: resourcesArray[2],
      lada: resourcesArray[3] / 1e9,
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

    const tokenAccount = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      game.ladaMintAccount,
      this.client.wallet.publicKey,
    );

    const token1Account = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      game.resource1MintAccount,
      this.client.wallet.publicKey,
    );

    const token2Account = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      game.resource2MintAccount,
      this.client.wallet.publicKey,
    );
    const token3Account = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      game.resource3MintAccount,
      this.client.wallet.publicKey,
    );

    const resources = [
      {
        mintAccount: game.resource1MintAccount,
        tokenAccount: token1Account,
      },
      {
        mintAccount: game.resource2MintAccount,
        tokenAccount: token2Account,
      },
      {
        mintAccount: game.resource3MintAccount,
        tokenAccount: token3Account,
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
      await this.client.connection.getTokenAccountBalance(tokenAccount);
    } catch (e) {
      tx.add(
        Token.createAssociatedTokenAccountInstruction(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          game.ladaMintAccount,
          tokenAccount,
          this.client.wallet.publicKey,
          this.client.wallet.publicKey,
        ),
      );
    }

    const blockhash = (await this.client.connection.getRecentBlockhash())
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
    const ata_resourcemint1 = await this.getTokenAccount(
      game.resource1MintAccount,
    );
    const ata_resourcemint2 = await this.getTokenAccount(
      game.resource2MintAccount,
    );
    const ata_resourcemint3 = await this.getTokenAccount(
      game.resource3MintAccount,
    );

    return {
      resource1MintAccount: game.resource1MintAccount,
      resource2MintAccount: game.resource2MintAccount,
      resource3MintAccount: game.resource3MintAccount,
      resource1TokenAccount: ata_resourcemint1,
      resource2TokenAccount: ata_resourcemint2,
      resource3TokenAccount: ata_resourcemint3,
    };
  }

  private async getTokenAccount(publicKey: anchor.web3.PublicKey) {
    return await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      publicKey,
      this.client.wallet.publicKey,
    );
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

    const nftAccounts = splAccounts
      .filter((t) => {
        const amount = t.account?.data?.parsed?.info?.tokenAmount?.uiAmount;
        const decimals = t.account?.data?.parsed?.info?.tokenAmount?.decimals;
        return decimals === 0 && amount >= 1;
      })
      .map((t) => {
        const address = t.account?.data?.parsed?.info?.mint;
        return new PublicKey(address);
      });

    const metadataAcountsAddressPromises = await Promise.allSettled(
      nftAccounts.map(MetadataProgram.findMetadataAccount),
    );

    const metadataAccounts = metadataAcountsAddressPromises
      .filter((result) => result && result.status === 'fulfilled')
      .map((p) => (p as PromiseFulfilledResult<[PublicKey, number]>)?.value[0]);

    const accountsRawMeta: (AccountInfo<
      Buffer | ParsedAccountData
    > | null)[] = (
      await this.client.connection.getMultipleAccountsInfo(metadataAccounts)
    ).filter((result) => result);

    if (!accountsRawMeta?.length || accountsRawMeta?.length === 0) {
      return [];
    }

    const accountsDecodedMeta = await Promise.allSettled(
      accountsRawMeta.map((accountInfo) =>
        deserializeUnchecked(
          MetadataData.SCHEMA,
          MetadataData,
          (accountInfo as AccountInfo<Buffer>)?.data,
        ),
      ),
    );

    const accountsFiltered = accountsDecodedMeta
      .filter((result) => result && result.status === 'fulfilled')
      // .filter((t) => {
      //   const uri = (t as PromiseFulfilledResult<
      //     MetadataData
      //   >).value.data?.uri?.replace?.(/\0/g, '');
      //   return uri !== '' && uri !== undefined;
      // })
      // .filter((result) => {
      //   return (
      //     (result as PromiseFulfilledResult<MetadataData>)?.value?.data
      //       ?.symbol === 'LC'
      //   );
      // })
      .map((result) => {
        return (result as PromiseFulfilledResult<MetadataData>)?.value;
      });

    return accountsFiltered;
  }

  async mintNFTCaster(caster: Caster) {
    const nftMintKeys = Keypair.generate();
    await getMerkleSingleton();
    //Merkle proof part
    const leaf = await this.buildLeafCaster(caster);
    // noinspection TypeScriptValidateTypes
    const tree = await buildMerkleTree(merkle['merkleLeaves']['combined']);
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
    const leaf = await this.buildLeafItem(item, itemType);
    const tree = await buildMerkleTree(
      itemType === 'combined' || itemType === 'spellBook'
        ? merkle['merkleLeaves'][itemType]
        : merkle['merkleLeaves'][itemType][item.level],
    );

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
    console.log(nftMintKeys);
    console.log('Your nft: ', nftMintKeys.toString());

    const [gameAccount, playerAccount, , , , season] = await this.getAccounts();
    console.log('game account', gameAccount.toString());
    console.log('player account', playerAccount.toString());
    const caster1 = Keypair.generate();
    const caster2 = Keypair.generate();

    console.log('caster 1 account', caster1.publicKey.toString());
    console.log('caster 2 account', caster2.publicKey.toString());
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
    console.log('metaplexTokenMetadata', metaplexTokenMetadata.toString());

    try {
      console.log(
        await this.client.connection.getAccountInfo(metaplexTokenMetadata),
      );
    } catch (e) {
      console.log('fetching metaplextokenmetadata failed', e);
    }

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
    var data = Object.keys(nfts).map((key) => nfts[key]);
    let arr = [];
    let n = data.length;
    for (let i = 0; i < n; i++) {
      let val = await axios.get(data[i].data.uri);
      arr.push({ ...val, mint: data[i].mint });
    }

    return arr;
  }

  private async buildLeafCaster(caster: Caster) {
    return keccak256(
      `${await this.getCasterUri(caster)}:caster:${caster.version}:${
        caster.level
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
    const [gameAccount, playerAccount] = await this.getAccounts();
    const [nftMetadata] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(anchor.utils.bytes.utf8.encode('metadata')),
        nftMintKeys.toBuffer(),
      ],
      this.client.program.programId,
    );

    const nftToken = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      nftMintKeys,
      this.playerPubKey,
    );

    let signers = [generatedPubKey];
    if (this.client.wallet.payer) {
      signers = [this.client.wallet.payer, ...signers];
    }

    return {
      accounts: {
        game: gameAccount,
        nftMint: nftMintKeys,
        nftToken: nftToken,
        nftMetadata: nftMetadata,
        player: playerAccount,
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
          `${await this.getItemUri(item, itemType)}:${
            Object.keys(item.itemType.equipment.equipmentType)[0]
          }:${item.level}:${Object.keys(item.itemType.equipment.feature)[0]}:${
            Object.keys(item.itemType.equipment.rarity)[0]
          }:${item.itemType.equipment.value}`,
        );
      }
      case 'spellBook': {
        return keccak256(
          `${await this.getItemUri(item, itemType)}:spellbook:${item.level}:${
            Object.keys(item.itemType.spellBook.spell)[0]
          }:${Object.keys(item.itemType.spellBook.costFeature)[0]}:${
            Object.keys(item.itemType.spellBook.rarity)[0]
          }:${item.itemType.spellBook.cost}:${item.itemType.spellBook.value}`,
        );
      }
      case 'chest': {
        return keccak256(
          `${await this.getItemUri(item, itemType)}:chest:${item.level}:${
            item.itemType.chest.tier
          }`,
        );
      }
    }
  }

  private async getResource(publicKey: anchor.web3.PublicKey) {
    const tokenAccount = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      publicKey,
      this.client.wallet.publicKey,
    );

    try {
      const resourceAmount = await this.client.connection.getTokenAccountBalance(
        tokenAccount,
      );

      return resourceAmount.value.amount;
    } catch (_e) {
      return 0;
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

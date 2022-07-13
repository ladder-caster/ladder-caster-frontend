import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
import { Caster, Game, Item, ItemFeature } from '.';
import * as anchor from '@project-serum/anchor';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {
  Keypair,
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  SYSVAR_SLOT_HASHES_PUBKEY,
  Transaction,
} from '@solana/web3.js';
import {
  Metadata,
  MetadataProgram,
} from '@metaplex-foundation/mpl-token-metadata';
const { SystemProgram } = anchor.web3;
import { TYPE_RES1, TYPE_RES2, TYPE_RES3 } from 'core/remix/state';
import gameConstantsContext from './GameConstantsContext';
import arweaveUtil from '../utils/ArweaveUtil';

export class PlayerContext {
  constructor() {}

  async getPlayer() {
    return await gameConstantsContext.Client.program.account.player.fetch(
      gameConstantsContext.playerAccount,
    );
  }

  async getResources() {
    await gameConstantsContext.hydrateAccountBalances();

    return {
      [TYPE_RES1]: gameConstantsContext.resource1Balance,
      [TYPE_RES2]: gameConstantsContext.resource2Balance,
      [TYPE_RES3]: gameConstantsContext.resource3Balance,
      lada: gameConstantsContext.ladaBalance,
      sol: gameConstantsContext.solBalance,
      usdc: gameConstantsContext.usdcBalance,
    };
  }

  async getSOLBalance() {
    await gameConstantsContext.hydrateAccountBalances();
    return gameConstantsContext.solBalance;
  }

  async getInventory() {
    const itemArray = (
      await gameConstantsContext.Client.program.account.item.all([
        {
          memcmp: {
            offset: 40,
            bytes: gameConstantsContext.playerAccount.toBase58(),
          },
        },
      ])
    ).map(
      (item) =>
        [
          item.publicKey.toString(),
          { publicKey: item.publicKey, ...item.account } as Item,
        ] as [string, Item],
    );

    return new Map<string, Item>(itemArray);
  }

  async getCasters() {
    const casterArray = (
      await gameConstantsContext.Client.program.account.caster.all([
        {
          memcmp: {
            offset: 18,
            bytes: gameConstantsContext.playerAccount.toBase58(),
          },
        },
      ])
    ).map(
      (caster) =>
        [
          caster.publicKey.toString(),
          {
            publicKey: caster.publicKey,
            ...caster.account,
          } as Caster,
        ] as [string, Caster],
    );

    return new Map<string, Caster>(casterArray);
  }

  async getPreSeasonCasters() {
    const casterArray = (
      await gameConstantsContext.Client.program.account.caster.all([
        {
          memcmp: {
            offset: 18,
            bytes: gameConstantsContext.previousPlayerAccount.toBase58(),
          },
        },
      ])
    ).map(
      (caster) =>
        [
          caster.publicKey.toString(),
          {
            publicKey: caster.publicKey,
            ...caster.account,
          } as Caster,
        ] as [string, Caster],
    );

    return new Map<string, Caster>(casterArray);
  }

  async getItem(itemPK: anchor.web3.PublicKey) {
    return await gameConstantsContext.Client.program.account.item.fetch(itemPK);
  }

  async initPlayer() {
    const tx = new Transaction();

    try {
      await this.getPlayer();
    } catch (e) {
      tx.add(
        gameConstantsContext.Client.program.instruction.initPlayer({
          accounts: {
            game: gameConstantsContext.gameAccount,
            season: gameConstantsContext.season,
            playerAccount: gameConstantsContext.playerAccount,
            authority:
              gameConstantsContext.Client.program.provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
          },
          signers: [gameConstantsContext.Client.wallet.payer],
        }),
      );
    }

    const gameResources = [
      {
        mintAccount: gameConstantsContext.gameState.resource1MintAccount,
        tokenAccount: gameConstantsContext.resource1TokenAccount,
      },
      {
        mintAccount: gameConstantsContext.gameState.resource2MintAccount,
        tokenAccount: gameConstantsContext.resource2TokenAccount,
      },
      {
        mintAccount: gameConstantsContext.gameState.resource3MintAccount,
        tokenAccount: gameConstantsContext.resource3TokenAccount,
      },
    ];

    gameResources.forEach(async (item) => {
      try {
        await gameConstantsContext.Client.connection.getTokenAccountBalance(
          item.tokenAccount,
        );
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
      await gameConstantsContext.Client.connection.getTokenAccountBalance(
        gameConstantsContext.ladaTokenAccount,
      );
    } catch (e) {
      tx.add(
        Token.createAssociatedTokenAccountInstruction(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          gameConstantsContext.gameState.ladaMintAccount,
          gameConstantsContext.ladaTokenAccount,
          gameConstantsContext.Client.wallet.publicKey,
          gameConstantsContext.Client.wallet.publicKey,
        ),
      );
    }

    const blockhash = (
      await gameConstantsContext.Client.connection.getLatestBlockhash()
    ).blockhash;
    tx.recentBlockhash = blockhash;
    tx.feePayer = gameConstantsContext.Client.wallet.publicKey;

    return await gameConstantsContext.Client.program.provider.send(tx);
  }

  async openChest(chestItem: Item) {
    const item1 = Keypair.generate();
    const item2 = Keypair.generate();
    const item3 = Keypair.generate();
    return await gameConstantsContext.Client.program.rpc.openChest({
      accounts: {
        game: gameConstantsContext.gameAccount,
        authority:
          gameConstantsContext.Client.program.provider.wallet.publicKey,
        player: gameConstantsContext.playerAccount,
        slots: SYSVAR_SLOT_HASHES_PUBKEY,
        instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
        chest: chestItem.publicKey,
        season: gameConstantsContext.season,
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
    return await gameConstantsContext.Client.program.rpc.manualResourceburn(
      casterId,
      resourceType,
      amountToBurn,
      {
        accounts: {
          game: gameConstantsContext.gameAccount,
          playerAccount: gameConstantsContext.playerAccount,
          authority:
            gameConstantsContext.Client.program.provider.wallet.publicKey,
        },
      },
    );
  }

  async manualItemBurn(item: PublicKey) {
    const mintAccounts = await this.getMintAccounts(
      gameConstantsContext.gameState,
    );

    return gameConstantsContext.Client.program.rpc.manualItemBurn({
      accounts: {
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
        authority:
          gameConstantsContext.Client.program.provider.wallet.publicKey,
        game: gameConstantsContext.gameAccount,
        player: gameConstantsContext.playerAccount,
        gameSigner: gameConstantsContext.gameSigner,
        season: gameConstantsContext.season,
        item,
        ...mintAccounts,
      },
      signers: [gameConstantsContext.Client.wallet.payer],
    });
  }

  async mintNFTCaster(caster: Caster) {
    const nftMintKeys = Keypair.generate();
    const uri: string = await arweaveUtil.getCasterUri(caster);
    const leaf = arweaveUtil.buildLeafCaster(caster, uri);
    const tree = await arweaveUtil.buildMerkleTree(
      arweaveUtil.merkle['merkleLeaves']['combined'],
    );
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
    const uri: string = await arweaveUtil.getItemUri(item, itemType);
    const leaf = arweaveUtil.buildLeafItem(item, uri);
    const tree = await arweaveUtil.buildMerkleTree(
      itemType === 'combined' || itemType === 'spellBook'
        ? arweaveUtil.merkle['merkleLeaves'][itemType]
        : arweaveUtil.merkle['merkleLeaves'][itemType][item.level],
    );

    const proof = tree.getProof(leaf);
    const validProof: Buffer[] = proof.map((p) => p.data);

    let signers = [nftMintKeys];
    if (gameConstantsContext.Client.wallet.payer) {
      signers = [gameConstantsContext.Client.wallet.payer, ...signers];
    }

    const mintOptions = await this.buildMintOptions(
      itemType,
      itemType === 'combined' || itemType === 'spellbook' ? 0 : item.level,
      nftMintKeys,
    );
    console.log('SIGNERS', signers, mintOptions);
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
        authority:
          gameConstantsContext.Client.program.provider.wallet.publicKey,
        game: gameConstantsContext.gameAccount,
        player: gameConstantsContext.playerAccount,
        season: gameConstantsContext.season,
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
      Metadata.getPDA(nftMintKeys.publicKey),
    ];
    const [
      nftMetadataTuple,
      nftToken,
      metaplexMetadataAccount,
    ] = await Promise.all(asyncDispatch);

    const [merkleRootNft] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('merkle_roots'),
        gameConstantsContext.gameAccount.toBuffer(),
        Buffer.from(itemType),
        Buffer.from(anchor.utils.bytes.utf8.encode(String(level))),
      ],
      gameConstantsContext.Client.program.programId,
    );
    const [nftMetadata] = nftMetadataTuple as [anchor.web3.PublicKey, number];
    return {
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
      authority: gameConstantsContext.Client.program.provider.wallet.publicKey,
      game: gameConstantsContext.gameAccount,
      gameSigner: gameConstantsContext.gameSigner,
      season: gameConstantsContext.season,
      player: gameConstantsContext.playerAccount,
      metaplexMetadataAccount: metaplexMetadataAccount as anchor.web3.PublicKey,
      metaplexTokenMetadataProgram: MetadataProgram.PUBKEY,
      merkleRootNft,
      nftMint: nftMintKeys.publicKey,
      nftToken: nftToken as anchor.web3.PublicKey,
      nftMetadata: nftMetadata,
    };
  }

  private async buildRedeemOptions(
    nftMintKeys: PublicKey,
    generatedPubKey: Keypair,
  ) {
    const [nftMetadataTuple, nftToken] = await Promise.all([
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
      ),
    ]);

    let signers = [generatedPubKey];
    if (gameConstantsContext.Client.wallet.payer) {
      signers = [gameConstantsContext.Client.wallet.payer, ...signers];
    }
    const [nftMetadata] = nftMetadataTuple;
    return {
      accounts: {
        game: gameConstantsContext.gameAccount,
        nftMint: nftMintKeys,
        nftToken: nftToken,
        nftMetadata: nftMetadata,
        player: gameConstantsContext.playerAccount,
        season: gameConstantsContext.season,
        authority:
          gameConstantsContext.Client.program.provider.wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      },
      signers,
    };
  }
}

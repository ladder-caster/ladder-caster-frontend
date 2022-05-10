import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
import { Caster, Client, Game, Item, ItemFeature, ItemType } from '.';
import * as anchor from '@project-serum/anchor';
import {
  Keypair,
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  SYSVAR_SLOT_HASHES_PUBKEY,
  Transaction,
  TransactionSignature,
} from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { TRANSACTION_TOO_LARGE } from 'core/utils/parsers';

export class CasterContext {
  private game: Game;
  private playerAccount: PublicKey;
  private gameSigner: PublicKey;
  private season: PublicKey;

  constructor(
    private client: Client,
    private playerPubKey: anchor.web3.PublicKey,
    private gamePK: string,
    private caster?: Caster,
  ) {}

  getCasterId() {
    return this.caster?.publicKey;
  }

  async initCaster() {
    const [
      gameAccount,
      playerAccount,
      game,
      ,
      season,
    ] = await this.getAccounts();
    const playerLadaTokenAccount = await this.getTokenAccount(
      game.ladaMintAccount,
    );
    const casterKeys = anchor.web3.Keypair.generate();

    return await this.client.program.rpc.initCaster({
      accounts: {
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
        authority: this.playerPubKey,
        season: season,
        game: gameAccount,
        player: playerAccount,
        slots: SYSVAR_SLOT_HASHES_PUBKEY,
        instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
        ladaMint: game.ladaMintAccount,
        caster: casterKeys.publicKey,
        gameLadaTokenAccount: game.ladaTokenAccount,
        ladaTokenAccount: playerLadaTokenAccount,
      },
      signers: [this.client.wallet.payer, casterKeys],
    });
  }

  async casterCommitMove(lvl: number, col: number) {
    const [
      gameAccount,
      playerAccount,
      game,
      ,
      season,
    ] = await this.getAccounts();
    const mintAccounts = await this.getMintAccounts(game);
    const [gameTurnData] = await this.getGameTurnData(game, gameAccount);
    const playerLadaTokenAccount = await this.getTokenAccount(
      game.ladaMintAccount,
    );

    return await this.client.program.rpc.casterCommitMove(lvl, col, {
      accounts: {
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
        authority: this.playerPubKey,
        game: gameAccount,
        player: playerAccount,
        caster: this.caster?.publicKey,
        season: season,
        ...mintAccounts,
        gameTurnData,
      },
      signers: [this.client.wallet.payer],
    });
  }

  async refreshCaster() {
    return await this.client.program.account.caster.fetch(
      this.caster?.publicKey,
    );
  }

  async casterCommitLoot() {
    const [gameAccount, playerAccount, game] = await this.getAccounts();
    const [gameTurnData] = await this.getGameTurnData(
      game,
      gameAccount,
      this.caster.turnCommit?.turn,
    );

    return await this.client.program.rpc.casterCommitLoot({
      accounts: {
        systemProgram: anchor.web3.SystemProgram.programId,
        authority: this.playerPubKey,
        game: gameAccount,
        player: playerAccount,
        caster: new PublicKey(this.caster?.publicKey),
        gameTurnData,
      },
    });
  }

  async casterCommitCraft(item1: Item, item2: Item, item3: Item) {
    const [gameAccount, playerAccount, game] = await this.getAccounts();
    const [gameTurnData] = await this.getGameTurnData(game, gameAccount);
    const mintAccounts = await this.getMintAccounts(game);

    return await this.client.program.rpc.casterCommitCraft({
      accounts: {
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
        authority: this.playerPubKey,
        game: gameAccount,
        player: playerAccount,
        caster: this.caster?.publicKey,
        item1: item1.publicKey,
        item2: item2.publicKey,
        item3: item3.publicKey,
        gameTurnData,
        ...mintAccounts,
      },
      signers: [this.client.wallet.payer],
    });
  }

  // Swap "action" to "turn"
  // Redeem is per caster
  async casterRedeemAction() {
    const tx = new Transaction();

    const order = this.caster?.turnCommit.actions.actionOrder
      .map((value, key) => {
        return { type: key, value };
      })
      .filter((action) => action.value !== 0)
      .sort((a, b) => {
        return a.value - b.value;
      });

    let signers = [];
    for (const action of order) {
      switch (action.type) {
        case 0: {
          const itemMove = Keypair.generate();
          tx.add(await this.redeemLoot(itemMove));
          signers.push(itemMove);
          break;
        }
        case 1: {
          const itemSpell = Keypair.generate();
          tx.add(await this.redeemSpell(itemSpell));
          signers.push(itemSpell);
          break;
        }
        case 2: {
          tx.add(await this.redeemMove());
          break;
        }
        case 3: {
          const itemCraft = Keypair.generate();
          tx.add(await this.redeemCraft(itemCraft));
          signers.push(itemCraft);
          break;
        }
      }
    }

    tx.add(await this.redeemActions());
    const blockhash = (await this.client.connection.getRecentBlockhash())
      .blockhash;
    tx.recentBlockhash = blockhash;
    tx.feePayer = this.client.wallet.publicKey!;

    let txSignature;
    try {
      txSignature = await this.client.program.provider.send(tx, signers);
    } catch (e) {
      if (e.message.includes(TRANSACTION_TOO_LARGE)) {
        console.log(e);
        txSignature = await this.fallbackRedeem();
      } else {
        throw new Error(e);
      }
    }

    return txSignature;
  }

  async fallbackRedeem() {
    const transactions = [];
    const blockhash = (await this.client.connection.getRecentBlockhash())
      .blockhash;
    const order = this.caster?.turnCommit.actions.actionOrder
      .map((value, key) => {
        return { type: key, value };
      })
      .filter((action) => action.value !== 0)
      .sort((a, b) => {
        return a.value - b.value;
      });

    for (const action of order) {
      switch (action.type) {
        case 0: {
          const tx = new Transaction();
          const itemMove = Keypair.generate();
          tx.add(await this.redeemLoot(itemMove));
          tx.recentBlockhash = blockhash;
          tx.feePayer = this.client.wallet.publicKey!;
          tx.partialSign(itemMove);
          transactions.push(tx);
          break;
        }
        case 1: {
          const tx = new Transaction();
          const itemSpell = Keypair.generate();
          tx.add(await this.redeemSpell(itemSpell));
          tx.recentBlockhash = blockhash;
          tx.feePayer = this.client.wallet.publicKey!;
          tx.partialSign(itemSpell);
          transactions.push(tx);
          break;
        }
        case 2: {
          const tx = new Transaction();
          tx.add(await this.redeemMove());
          tx.recentBlockhash = blockhash;
          tx.feePayer = this.client.wallet.publicKey!;
          transactions.push(tx);
          break;
        }
        case 3: {
          const tx = new Transaction();
          const itemCraft = Keypair.generate();
          tx.add(await this.redeemCraft(itemCraft));
          tx.recentBlockhash = blockhash;
          tx.feePayer = this.client.wallet.publicKey!;
          tx.partialSign(itemCraft);
          transactions.push(tx);
          break;
        }
      }
    }
    const txRewards = new Transaction();

    txRewards.add(await this.redeemActions());
    txRewards.recentBlockhash = blockhash;
    txRewards.feePayer = this.client.wallet.publicKey!;

    transactions.push(txRewards);
    const signedTxns = await this.client.program.provider.wallet.signAllTransactions(
      transactions,
    );

    let txid;
    for (let i = 0; i < signedTxns.length; i++) {
      txid = await this.client.connection.sendRawTransaction(
        signedTxns[i].serialize(),
      );
    }

    return txid;
  }

  private async redeemActions() {
    const [
      gameAccount,
      playerAccount,
      game,
      gameSigner,
      season,
    ] = await this.getAccounts();
    const playerLadaTokenAccount = await this.getTokenAccount(
      game.ladaMintAccount,
    );
    const [gameTurnData] = await this.getGameTurnData(
      game,
      gameAccount,
      this.caster?.turnCommit?.turn,
    );
    const remainingAccounts =
      this.caster?.turnCommit?.actions.spell &&
      this.caster?.modifiers?.spellBook
        ? {
            remainingAccounts: [
              {
                pubkey: this.caster?.modifiers?.spellBook,
                isSigner: false,
                isWritable: true,
              },
            ],
          }
        : {};

    return this.client.program.instruction.casterRedeemReward({
      accounts: {
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
        authority: this.playerPubKey,
        game: gameAccount,
        season: season,
        player: playerAccount,
        caster: this.caster?.publicKey,
        gameSigner: gameSigner,
        slots: SYSVAR_SLOT_HASHES_PUBKEY,
        ladaMintAccount: game.ladaMintAccount,
        gameLadaTokenAccount: game.ladaTokenAccount,
        ladaTokenAccount: playerLadaTokenAccount,
        gameTurnData,
      },
      signers: [this.client.wallet.payer],
      ...remainingAccounts,
    });
  }

  private async redeemMove() {
    const [gameAccount, playerAccount] = await this.getAccounts();

    return this.client.program.instruction.casterRedeemMove({
      accounts: {
        game: gameAccount,
        authority: this.playerPubKey,
        player: playerAccount,
        caster: this.caster?.publicKey,
        instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
      },
      signers: [this.client.wallet.payer],
    });
  }

  private async redeemLoot(item: Keypair) {
    const [
      gameAccount,
      playerAccount,
      game,
      gameSigner,
      season,
    ] = await this.getAccounts();
    const empty = Keypair.generate();
    const mintAccounts = await this.getMintAccounts(game);
    const playerLadaTokenAccount = await this.getTokenAccount(
      game.ladaMintAccount,
    );
    const [gameTurnData] = await this.getGameTurnData(
      game,
      gameAccount,
      this.caster?.turnCommit?.turn,
    );

    return this.client.program.instruction.casterRedeemLoot({
      accounts: {
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
        rent: SYSVAR_RENT_PUBKEY,
        authority: this.playerPubKey,
        game: gameAccount,
        player: playerAccount,
        caster: this.caster?.publicKey,
        gameSigner: gameSigner,
        season: season,
        slots: SYSVAR_SLOT_HASHES_PUBKEY,
        ladaMintAccount: game.ladaMintAccount,
        gameLadaTokenAccount: game.ladaTokenAccount,
        ladaTokenAccount: playerLadaTokenAccount,
        gameTurnData,
        item: item.publicKey,
        staff: this.caster?.modifiers?.staff
          ? this.caster?.modifiers?.staff
          : empty.publicKey,
        head: this.caster?.modifiers?.head
          ? this.caster?.modifiers?.head
          : empty.publicKey,
        robe: this.caster?.modifiers?.robe
          ? this.caster?.modifiers?.robe
          : empty.publicKey,
        ...mintAccounts,
      },
      signers: [item, this.client.wallet.payer],
    });
  }

  private async redeemCraft(item) {
    const [gameAccount, playerAccount, , , season] = await this.getAccounts();

    return this.client.program.instruction.casterRedeemCraft({
      accounts: {
        game: gameAccount,
        authority: this.playerPubKey,
        player: playerAccount,
        caster: this.caster?.publicKey,
        season: season,
        slots: SYSVAR_SLOT_HASHES_PUBKEY,
        instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
        rent: SYSVAR_RENT_PUBKEY,
        systemProgram: anchor.web3.SystemProgram.programId,
        item: item.publicKey,
      },
      signers: [item, this.client.wallet.payer],
    });
  }

  private async redeemSpell(item) {
    const [
      gameAccount,
      playerAccount,
      game,
      gameSigner,
      season,
    ] = await this.getAccounts();
    const mintAccounts = await this.getMintAccounts(game);

    const empty = Keypair.generate();

    return this.client.program.instruction.casterRedeemSpell({
      accounts: {
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
        rent: SYSVAR_RENT_PUBKEY,
        authority: this.playerPubKey,
        game: gameAccount,
        season: season,
        player: playerAccount,
        caster: this.caster?.publicKey,
        gameSigner: gameSigner,
        slots: SYSVAR_SLOT_HASHES_PUBKEY,
        item: item.publicKey,
        ...mintAccounts,
      },
      signers: [item, this.client.wallet.payer],
      remainingAccounts: [
        {
          pubkey: this.caster?.modifiers?.spellBook
            ? this.caster?.modifiers?.spellBook
            : empty.publicKey,
          isSigner: false,
          isWritable: true,
        },
      ],
    });
  }

  async equipItem(equipmentItem: Item) {
    const [gameAccount, playerAccount, , ,] = await this.getAccounts();

    const itemType = Object.keys(
      equipmentItem.itemType.equipment?.equipmentType ||
        equipmentItem?.itemType,
    )[0];

    const tx = new Transaction();

    if (
      this.caster.modifiers[itemType] &&
      this.caster.modifiers[itemType].toString() !== equipmentItem.publicKey
    ) {
      tx.add(
        this.client.program.instruction.unequipItem({
          accounts: {
            game: gameAccount,
            authority: this.playerPubKey,
            player: playerAccount,
            caster: this.caster?.publicKey,
            item: this.caster.modifiers[itemType],
          },
          signers: [this.client.wallet.payer],
        }),
      );
    }
    tx.add(
      this.client.program.instruction.equipItem({
        accounts: {
          game: gameAccount,
          authority: this.playerPubKey,
          player: playerAccount,
          caster: this.caster?.publicKey,
          item: equipmentItem.publicKey,
        },
        signers: [this.client.wallet.payer],
      }),
    );

    const blockhash = (await this.client.connection.getRecentBlockhash())
      .blockhash;
    tx.recentBlockhash = blockhash;
    tx.feePayer = this.client.wallet.publicKey!;

    return await this.client.program.provider.send(tx);
  }

  async unequipItem(itemPK: PublicKey) {
    const [gameAccount, playerAccount, , , season] = await this.getAccounts();
    return await this.client.program.rpc.unequipItem({
      accounts: {
        game: gameAccount,
        authority: this.playerPubKey,
        player: playerAccount,
        caster: this.caster?.publicKey,
        item: itemPK,
      },
      signers: [this.client.wallet.payer],
    });
  }

  async castSpell(equipmentItem: Item) {
    const [
      gameAccount,
      playerAccount,
      game,
      ,
      season,
    ] = await this.getAccounts();
    const mintAccounts = await this.getMintAccounts(game);
    const [gameTurnData] = await this.getGameTurnData(game, gameAccount);

    const tx = new Transaction();

    if (
      this.caster?.modifiers?.spellBook &&
      equipmentItem.publicKey.toString() !==
        this.caster?.modifiers?.spellBook.toString()
    ) {
      tx.add(
        this.client.program.instruction.unequipItem({
          accounts: {
            game: gameAccount,
            authority: this.playerPubKey,
            player: playerAccount,
            caster: this.caster?.publicKey,
            item: this.caster?.modifiers?.spellBook,
          },
          signers: [this.client.wallet.payer],
        }),
      );
      tx.add(
        this.client.program.instruction.equipItem({
          accounts: {
            game: gameAccount,
            authority: this.playerPubKey,
            player: playerAccount,
            caster: this.caster?.publicKey,
            item: equipmentItem.publicKey,
          },
          signers: [this.client.wallet.payer],
        }),
      );
    } else {
      tx.add(
        this.client.program.instruction.equipItem({
          accounts: {
            game: gameAccount,
            authority: this.playerPubKey,
            player: playerAccount,
            caster: this.caster?.publicKey,
            item: equipmentItem.publicKey,
          },
          signers: [this.client.wallet.payer],
        }),
      );
    }

    tx.add(
      this.client.program.instruction.casterCommitSpell({
        accounts: {
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
          rent: SYSVAR_RENT_PUBKEY,
          authority: this.playerPubKey,
          game: gameAccount,
          player: playerAccount,
          caster: this.caster?.publicKey,
          slots: SYSVAR_SLOT_HASHES_PUBKEY,
          ...mintAccounts,
          spellbook: equipmentItem.publicKey,
          gameTurnData,
        },
        signers: [this.client.wallet.payer],
      }),
    );
    const blockhash = (await this.client.connection.getRecentBlockhash())
      .blockhash;
    tx.recentBlockhash = blockhash;
    tx.feePayer = this.client.wallet.publicKey!;

    return await this.client.program.provider.send(tx);
  }

  async manualResourceBurn(itemFeature: ItemFeature, amount: number) {
    const [gameAccount, playerAccount, game] = await this.getAccounts();
    const mintAccounts = await this.getMintAccounts(game);
    const [gameTurnData] = await this.getGameTurnData(game, gameAccount);

    return await this.client.program.rpc.manualResourceBurn(
      itemFeature,
      new anchor.BN(amount),
      {
        accounts: {
          systemProgram: anchor.web3.SystemProgram.programId,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
          authority: this.playerPubKey,
          game: gameAccount,
          player: playerAccount,
          caster: this.caster?.publicKey,
          gameTurnData: gameTurnData,
          ...mintAccounts,
        },
        signers: [this.client.wallet.payer],
      },
    );
  }

  //DEBUG - Devnet only
  async giveLada() {
    const [gameAccount, , game, gameSigner] = await this.getAccounts();
    const playerLadaTokenAccount = await this.getTokenAccount(
      game.ladaMintAccount,
    );

    return await this.client.program.rpc.giveLada(new anchor.BN(1000 * 1e9), {
      accounts: {
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
        authority: this.playerPubKey,
        gameSigner: gameSigner,
        game: gameAccount,
        ladaMintAccount: game.ladaMintAccount,
        gameLadaTokenAccount: game.ladaTokenAccount,
        ladaTokenAccount: playerLadaTokenAccount,
      },
    });
  }

  async giveResources() {
    const [
      gameAccount,
      playerAccount,
      game,
      gameSigner,
    ] = await this.getAccounts();
    const mintAccounts = await this.getMintAccounts(game);

    return await this.client.program.rpc.giveResources(new anchor.BN(10), {
      accounts: {
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
        authority: this.playerPubKey,
        gameSigner: gameSigner,
        game: gameAccount,
        player: playerAccount,
        ...mintAccounts,
      },
      signers: [this.client.wallet.payer],
    });
  }

  async giveItem(itemType: ItemType) {
    const [gameAccount, playerAccount, , , season] = await this.getAccounts();
    const item = Keypair.generate();

    return await this.client.program.rpc.giveItem(itemType, new anchor.BN(1), {
      accounts: {
        systemProgram: anchor.web3.SystemProgram.programId,
        game: gameAccount,
        season: season,
        authority: this.playerPubKey,
        player: playerAccount,
        slots: SYSVAR_SLOT_HASHES_PUBKEY,
        item: item.publicKey,
      },
      signers: [this.client.wallet.payer, item],
    });
  }

  async changeTile() {
    const [gameAccount] = await this.getAccounts();

    return await this.client.program.rpc.changeTile(
      { crafting: {} },
      this.caster?.modifiers.tileLevel,
      this.caster?.modifiers.tileColumn,
      {
        accounts: {
          systemProgram: anchor.web3.SystemProgram.programId,
          game: gameAccount,
        },
      },
    );
  }

  //HELPERS
  private async getGameTurnData(game: Game, gameAccount: PublicKey, turn = -1) {
    const turnNumber = turn !== -1 ? turn : game?.turnInfo?.turn;

    return await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('turn_data'),
        gameAccount.toBuffer(),
        Buffer.from(anchor.utils.bytes.utf8.encode(String(turnNumber))),
      ],
      this.client.program.programId,
    );
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

  private async getAccounts(): Promise<
    [PublicKey, PublicKey, Game, PublicKey, PublicKey]
  > {
    const gameAccount = new anchor.web3.PublicKey(this.gamePK);
    if (!this.playerAccount) {
      const [playerAccount] = findProgramAddressSync(
        [gameAccount.toBuffer(), this.playerPubKey.toBuffer()],
        this.client.program.programId,
      );
      this.playerAccount = playerAccount;
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
      this.game,
      this.gameSigner,
      this.season,
    ];
  }
}

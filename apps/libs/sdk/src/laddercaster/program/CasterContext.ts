import { Caster, Game, Item, ItemFeature, ItemType,GameConstantsContextInterface } from '.';
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
//constants of cached data used throughout the app
const gameConstantsContext:GameConstantsContextInterface = require("../program/GameConstantsContext").default
export class CasterContext {

  constructor(
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
    const casterKeys = anchor.web3.Keypair.generate();

    return await gameConstantsContext.Client.program.rpc.initCaster({
      accounts: {
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
        authority: gameConstantsContext.Client.program.provider.wallet.publicKey,
        season: season,
        game: gameAccount,
        player: playerAccount,
        slots: SYSVAR_SLOT_HASHES_PUBKEY,
        instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
        ladaMint: game.ladaMintAccount,
        caster: casterKeys.publicKey,
        gameLadaTokenAccount: game.ladaTokenAccount,
        ladaTokenAccount: gameConstantsContext.ladaTokenAccount,
      },
      signers: [gameConstantsContext.Client.wallet.payer, casterKeys],
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
 
    var asyncDispatchResult = await Promise.all([
      this.getMintAccounts(game),
      this.getGameTurnData(game, gameAccount)
    ]).then(res=>res);
    const mintAccounts = asyncDispatchResult[0];
    const gameTurnData = asyncDispatchResult[1];
    return await gameConstantsContext.Client.program.rpc.casterCommitMoveS1(lvl, col, {
      accounts: {
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
        authority: gameConstantsContext.Client.program.provider.wallet.publicKey,
        game: gameAccount,
        player: playerAccount,
        caster: this.caster?.publicKey,
        season: season,
        ...mintAccounts,
        gameTurnData,
        ladaMint: game.ladaMintAccount,
        ladaTokenAccount: gameConstantsContext.ladaTokenAccount,
      },
      signers: [gameConstantsContext.Client.wallet.payer],
    });
  }

  async refreshCaster() {
    return await gameConstantsContext.Client.program.account.caster.fetch(
      this.caster?.publicKey,
    );
  }

  async casterCommitLoot() {
    const [gameAccount, playerAccount, game] = await this.getAccounts();
    const gameTurnData = await this.getGameTurnData(
      game,
      gameAccount,
      this.caster.turnCommit?.turn,
    );

    return await gameConstantsContext.Client.program.rpc.casterCommitLoot({
      accounts: {
        systemProgram: anchor.web3.SystemProgram.programId,
        authority: gameConstantsContext.Client.program.provider.wallet.publicKey,
        game: gameAccount,
        player: playerAccount,
        caster: this.caster?.publicKey,
        gameTurnData,
      },
    });
  }

  async casterCommitCraft(item1: Item, item2: Item, item3: Item) {
    // const [gameTurnData] = await this.getGameTurnData(game, gameAccount);
    //const mintAccounts = await this.getMintAccounts(game);

    return await gameConstantsContext.Client.program.rpc.casterCommitCraftS1({
      accounts: {
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
        authority: gameConstantsContext.Client.program.provider.wallet.publicKey,
        game: gameConstantsContext.gameTokenAccount,
        player: gameConstantsContext.playerTokenAccount,
        caster: this.caster?.publicKey,
        item1: item1.publicKey,
        item2: item2.publicKey,
        item3: item3.publicKey,
        ladaMint: gameConstantsContext.gameState.ladaMintAccount,
        ladaTokenAccount: gameConstantsContext.ladaTokenAccount,
        season: gameConstantsContext.season,
      },
      signers: [gameConstantsContext.Client.wallet.payer],
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
    const blockhash = (await gameConstantsContext.Client.connection.getRecentBlockhash())
      .blockhash;
    tx.recentBlockhash = blockhash;
    tx.feePayer = gameConstantsContext.Client.wallet.publicKey!;

    let txSignature;
    try {
      txSignature = await gameConstantsContext.Client.program.provider.send(tx, signers);
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
    const blockhash = (await gameConstantsContext.Client.connection.getRecentBlockhash())
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
          tx.feePayer = gameConstantsContext.Client.wallet.publicKey!;
          tx.partialSign(itemMove);
          transactions.push(tx);
          break;
        }
        case 1: {
          const tx = new Transaction();
          const itemSpell = Keypair.generate();
          tx.add(await this.redeemSpell(itemSpell));
          tx.recentBlockhash = blockhash;
          tx.feePayer = gameConstantsContext.Client.wallet.publicKey!;
          tx.partialSign(itemSpell);
          transactions.push(tx);
          break;
        }
        case 2: {
          const tx = new Transaction();
          tx.add(await this.redeemMove());
          tx.recentBlockhash = blockhash;
          tx.feePayer = gameConstantsContext.Client.wallet.publicKey!;
          transactions.push(tx);
          break;
        }
        case 3: {
          const tx = new Transaction();
          const itemCraft = Keypair.generate();
          tx.add(await this.redeemCraft(itemCraft));
          tx.recentBlockhash = blockhash;
          tx.feePayer = gameConstantsContext.Client.wallet.publicKey!;
          tx.partialSign(itemCraft);
          transactions.push(tx);
          break;
        }
      }
    }
    const txRewards = new Transaction();

    txRewards.add(await this.redeemActions());
    txRewards.recentBlockhash = blockhash;
    txRewards.feePayer = gameConstantsContext.Client.wallet.publicKey!;

    transactions.push(txRewards);
    const signedTxns = await gameConstantsContext.Client.program.provider.wallet.signAllTransactions(
      transactions,
    );

    let txid;
    for (let i = 0; i < signedTxns.length; i++) {
      txid = await gameConstantsContext.Client.connection.sendRawTransaction(
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
    const gameTurnData = await this.getGameTurnData(
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

    return gameConstantsContext.Client.program.instruction.casterRedeemReward({
      accounts: {
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
        authority: gameConstantsContext.Client.program.provider.wallet.publicKey,
        game: gameAccount,
        season: season,
        player: playerAccount,
        caster: this.caster?.publicKey,
        gameSigner: gameSigner,
        slots: SYSVAR_SLOT_HASHES_PUBKEY,
        ladaMintAccount: game.ladaMintAccount,
        gameLadaTokenAccount: game.ladaTokenAccount,
        ladaTokenAccount: gameConstantsContext.ladaTokenAccount,
        gameTurnData,
      },
      signers: [gameConstantsContext.Client.wallet.payer],
      ...remainingAccounts,
    });
  }

  private async redeemMove() {
    const [gameAccount, playerAccount] = await this.getAccounts();

    return gameConstantsContext.Client.program.instruction.casterRedeemMove({
      accounts: {
        game: gameAccount,
        authority: gameConstantsContext.Client.program.provider.wallet.publicKey,
        player: playerAccount,
        caster: this.caster?.publicKey,
        instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
      },
      signers: [gameConstantsContext.Client.wallet.payer],
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
    const gameTurnData = await this.getGameTurnData(
      game,
      gameAccount,
      this.caster?.turnCommit?.turn,
    );

    return gameConstantsContext.Client.program.instruction.casterRedeemLoot({
      accounts: {
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
        rent: SYSVAR_RENT_PUBKEY,
        authority: gameConstantsContext.Client.program.provider.wallet.publicKey,
        game: gameAccount,
        player: playerAccount,
        caster: this.caster?.publicKey,
        season: season,
        gameSigner: gameSigner,
        slots: SYSVAR_SLOT_HASHES_PUBKEY,
        ladaMintAccount: game.ladaMintAccount,
        gameLadaTokenAccount: game.ladaTokenAccount,
        ladaTokenAccount: gameConstantsContext.ladaTokenAccount,
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
      signers: [item, gameConstantsContext.Client.wallet.payer],
    });
  }

  private async redeemCraft(item) {
    const [gameAccount, playerAccount, , , season] = await this.getAccounts();

    return gameConstantsContext.Client.program.instruction.casterRedeemCraftS1({
      accounts: {
        game: gameAccount,
        authority: gameConstantsContext.Client.program.provider.wallet.publicKey,
        player: playerAccount,
        caster: this.caster?.publicKey,
        season: season,
        slots: SYSVAR_SLOT_HASHES_PUBKEY,
        instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
        rent: SYSVAR_RENT_PUBKEY,
        systemProgram: anchor.web3.SystemProgram.programId,
        item: item.publicKey,
      },
      signers: [item, gameConstantsContext.Client.wallet.payer],
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

    return gameConstantsContext.Client.program.instruction.casterRedeemSpell({
      accounts: {
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
        rent: SYSVAR_RENT_PUBKEY,
        authority: gameConstantsContext.Client.program.provider.wallet.publicKey,
        game: gameAccount,
        season: season,
        player: playerAccount,
        caster: this.caster?.publicKey,
        gameSigner: gameSigner,
        slots: SYSVAR_SLOT_HASHES_PUBKEY,
        item: item.publicKey,
        ...mintAccounts,
      },
      signers: [item, gameConstantsContext.Client.wallet.payer],
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
    const [gameAccount, playerAccount, , , season] = await this.getAccounts();

    const itemType = Object.keys(
      equipmentItem.itemType.equipment?.equipmentType ||
        equipmentItem?.itemType,
    )[0];

    const tx = new Transaction();
      console.log("EQUIP",this.caster,itemType)
    if (
      this.caster.modifiers[itemType] &&
      this.caster.modifiers[itemType].toString() !== equipmentItem.publicKey
    ) {
      tx.add(
        gameConstantsContext.Client.program.instruction.unequipItem({
          accounts: {
            game: gameAccount,
            authority: gameConstantsContext.Client.program.provider.wallet.publicKey,
            player: playerAccount,
            caster: this.caster?.publicKey,
            item: this.caster.modifiers[itemType],
          },
          signers: [gameConstantsContext.Client.wallet.payer],
        }),
      );
    }
    tx.add(
      gameConstantsContext.Client.program.instruction.equipItem({
        accounts: {
          game: gameAccount,
          authority: gameConstantsContext.Client.program.provider.wallet.publicKey,
          player: playerAccount,
          caster: this.caster?.publicKey,
          item: equipmentItem.publicKey,
        },
        signers: [gameConstantsContext.Client.wallet.payer],
      }),
    );

    const blockhash = (await gameConstantsContext.Client.connection.getLatestBlockhash())
      .blockhash;
    tx.recentBlockhash = blockhash;
    tx.feePayer = gameConstantsContext.Client.wallet.publicKey!;

    return await gameConstantsContext.Client.program.provider.send(tx);
  }

  async unequipItem(itemPK: PublicKey) {
    const [gameAccount, playerAccount, , , season] = await this.getAccounts();
    return await gameConstantsContext.Client.program.rpc.unequipItem({
      accounts: {
        game: gameAccount,
        authority: gameConstantsContext.Client.program.provider.wallet.publicKey,
        player: playerAccount,
        caster: this.caster?.publicKey,
        item: itemPK,
      },
      signers: [gameConstantsContext.Client.wallet.payer],
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
    const gameTurnData = await this.getGameTurnData(game, gameAccount);

    const tx = new Transaction();

    if (
      this.caster?.modifiers?.spellBook &&
      equipmentItem.publicKey.toString() !==
        this.caster?.modifiers?.spellBook.toString()
    ) {
      tx.add(
        gameConstantsContext.Client.program.instruction.unequipItem({
          accounts: {
            game: gameAccount,
            authority: gameConstantsContext.Client.program.provider.wallet.publicKey,
            player: playerAccount,
            caster: this.caster?.publicKey,
            item: this.caster?.modifiers?.spellBook,
          },
          signers: [gameConstantsContext.Client.wallet.payer],
        }),
      );
      tx.add(
        gameConstantsContext.Client.program.instruction.equipItem({
          accounts: {
            game: gameAccount,
            authority: gameConstantsContext.Client.program.provider.wallet.publicKey,
            player: playerAccount,
            caster: this.caster?.publicKey,
            item: equipmentItem.publicKey,
          },
          signers: [gameConstantsContext.Client.wallet.payer],
        }),
      );
    } else {
      tx.add(
        gameConstantsContext.Client.program.instruction.equipItem({
          accounts: {
            game: gameAccount,
            authority: gameConstantsContext.Client.program.provider.wallet.publicKey,
            player: playerAccount,
            caster: this.caster?.publicKey,
            item: equipmentItem.publicKey,
          },
          signers: [gameConstantsContext.Client.wallet.payer],
        }),
      );
    }

    tx.add(
      gameConstantsContext.Client.program.instruction.casterCommitSpell({
        accounts: {
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
          rent: SYSVAR_RENT_PUBKEY,
          authority: gameConstantsContext.Client.program.provider.wallet.publicKey,
          game: gameAccount,
          player: playerAccount,
          caster: this.caster?.publicKey,
          slots: SYSVAR_SLOT_HASHES_PUBKEY,
          ...mintAccounts,
          spellbook: equipmentItem.publicKey,
          gameTurnData,
        },
        signers: [gameConstantsContext.Client.wallet.payer],
      }),
    );
    const blockhash = (await gameConstantsContext.Client.connection.getLatestBlockhash())
      .blockhash;
    tx.recentBlockhash = blockhash;
    tx.feePayer = gameConstantsContext.Client.wallet.publicKey!;

    return await gameConstantsContext.Client.program.provider.send(tx);
  }

  async manualResourceBurn(itemFeature: ItemFeature, amount: number) {
    const [gameAccount, playerAccount, game] = await this.getAccounts();
    const mintAccounts = await this.getMintAccounts(game);
    const gameTurnData = await this.getGameTurnData(game, gameAccount);

    return await gameConstantsContext.Client.program.rpc.manualResourceBurn(
      itemFeature,
      new anchor.BN(amount),
      {
        accounts: {
          systemProgram: anchor.web3.SystemProgram.programId,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
          authority: gameConstantsContext.Client.program.provider.wallet.publicKey,
          game: gameAccount,
          player: playerAccount,
          caster: this.caster?.publicKey,
          gameTurnData: gameTurnData,
          ...mintAccounts,
        },
        signers: [gameConstantsContext.Client.wallet.payer],
      },
    );
  }

  async prestigeCaster() {
    const newCaster = Keypair.generate();

    try {
      console.log(
        'old season',
        await gameConstantsContext.Client.program.account.season.fetch(gameConstantsContext.previousSeason),
      );
    } catch (e) {
      console.log(e);
    }
    try {
      console.log(
        'new season',
        await gameConstantsContext.Client.program.account.season.fetch(gameConstantsContext.season),
      );
    } catch (e) {
      console.log(e);
    }

    return await gameConstantsContext.Client.program.rpc.transferCaster({
      accounts: {
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
        authority: gameConstantsContext.Client.program.provider.wallet.publicKey,
        oldGame: gameConstantsContext.previousGameTokenAccount,
        newGame: gameConstantsContext.gameTokenAccount,
        oldPlayer: gameConstantsContext.previousPlayerTokenAccount,
        newPlayer: gameConstantsContext.playerTokenAccount,
        oldSeason: gameConstantsContext.previousSeason,
        newSeason: gameConstantsContext.season,
        oldCaster: this.caster?.publicKey,
        newCaster: newCaster.publicKey,
        slots: SYSVAR_SLOT_HASHES_PUBKEY,
        instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
        ladaMint: gameConstantsContext.gameState.ladaMintAccount,
        ladaTokenAccount: gameConstantsContext.ladaTokenAccount,
      },
      signers: [gameConstantsContext.Client.wallet.payer, newCaster],
    });
  }

  //DEBUG - Devnet only
  async giveLada() {
    const [gameAccount, , game, gameSigner] = await this.getAccounts();
    
    return await gameConstantsContext.Client.program.rpc.giveLada(new anchor.BN(1000 * 1e9), {
      accounts: {
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
        authority: gameConstantsContext.Client.program.provider.wallet.publicKey,
        gameSigner: gameSigner,
        game: gameAccount,
        ladaMintAccount: game.ladaMintAccount,
        gameLadaTokenAccount: game.ladaTokenAccount,
        ladaTokenAccount: gameConstantsContext.ladaTokenAccount,
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

    return await gameConstantsContext.Client.program.rpc.giveResources(new anchor.BN(500), {
      accounts: {
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
        authority: gameConstantsContext.Client.program.provider.wallet.publicKey,
        gameSigner: gameSigner,
        game: gameAccount,
        player: playerAccount,
        ...mintAccounts,
      },
      signers: [gameConstantsContext.Client.wallet.payer],
    });
  }

  async giveItem(itemType: ItemType) {
    const [gameAccount, playerAccount, , , season] = await this.getAccounts();
    const item = Keypair.generate();

    return await gameConstantsContext.Client.program.rpc.giveItem(itemType, new anchor.BN(1), {
      accounts: {
        systemProgram: anchor.web3.SystemProgram.programId,
        game: gameAccount,
        season: season,
        authority: gameConstantsContext.Client.program.provider.wallet.publicKey,
        player: playerAccount,
        slots: SYSVAR_SLOT_HASHES_PUBKEY,
        item: item.publicKey,
      },
      signers: [gameConstantsContext.Client.wallet.payer, item],
    });
  }

  async changeTile() {
    const [gameAccount] = await this.getAccounts();

    return await gameConstantsContext.Client.program.rpc.changeTile(
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
    if(turn!=-1 && turn!=game?.turnInfo?.turn){
      const [turnData] = await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from('turn_data'),
          gameAccount.toBuffer(),
          Buffer.from(anchor.utils.bytes.utf8.encode(String(turnNumber))),
        ],
        gameConstantsContext.Client.program.programId,
      );
      return turnData;
    }
   return gameConstantsContext.turnData;
  }

  private async getMintAccounts(game: Game) {
    return {
      resource1MintAccount: game.resource1MintAccount,
      resource2MintAccount: game.resource2MintAccount,
      resource3MintAccount: game.resource3MintAccount,
      resource1TokenAccount: gameConstantsContext.resource1TokenAccount,
      resource2TokenAccount:  gameConstantsContext.resource2TokenAccount,
      resource3TokenAccount:  gameConstantsContext.resource3TokenAccount,
    };
  }


  private async getAccounts(): Promise<
    [PublicKey, PublicKey, Game, PublicKey, PublicKey]
  > {
    return await gameConstantsContext.getCasterAccounts;
  }
}

import {
  Caster,
  Game,
  Item,
  ItemFeature,
  ItemType,
  GameConstantsContextInterface,
} from '.';
import * as anchor from '@project-serum/anchor';
import {
  Keypair,
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  SYSVAR_SLOT_HASHES_PUBKEY,
  Transaction,
} from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { TRANSACTION_TOO_LARGE } from 'core/utils/parsers';
//constants of cached data used throughout the app
const gameConstantsContext: GameConstantsContextInterface = require('../program/GameConstantsContext')
  .default;
export class CasterContext {
  constructor(private caster?: Caster) {}

  getCasterId() {
    return this.caster?.publicKey;
  }

  async refreshCaster() {
    return await gameConstantsContext.Client.program.account.caster.fetch(
      this.caster?.publicKey,
    );
  }

  async initCaster(count: number = 1) {
    var casterKP = anchor.web3.Keypair.generate();
    if (!count || count == 1) {
      const tx = new Transaction().add(
        await gameConstantsContext.Client.program.methods
          .initCaster()
          .accounts({
            systemProgram: anchor.web3.SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            rent: SYSVAR_RENT_PUBKEY,
            authority: gameConstantsContext.Client.wallet.publicKey,
            season: gameConstantsContext.season,
            game: gameConstantsContext.gameAccount,
            player: gameConstantsContext.playerAccount,
            slots: SYSVAR_SLOT_HASHES_PUBKEY,
            instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
            ladaMint: gameConstantsContext.gameState.ladaMintAccount,
            caster: casterKP.publicKey,
            gameLadaTokenAccount:
              gameConstantsContext.gameState.ladaTokenAccount,
            ladaTokenAccount: gameConstantsContext.ladaTokenAccount,
          })
          // .signers([casterKP])
          .instruction(),
      );

      tx.recentBlockhash = (
        await gameConstantsContext.Client.connection.getLatestBlockhash()
      ).blockhash;
      tx.feePayer = gameConstantsContext.Client.wallet.publicKey;

      tx.partialSign(casterKP);

      const signedTx = await gameConstantsContext.Client.wallet.signTransaction(
        tx,
      );

      return await gameConstantsContext.Client.connection.sendRawTransaction(
        signedTx.serialize(),
      );
      // return await gameConstantsContext.Client.program.rpc.initCaster({
      //   accounts: {
      //     systemProgram: anchor.web3.SystemProgram.programId,
      //     tokenProgram: TOKEN_PROGRAM_ID,
      //     rent: SYSVAR_RENT_PUBKEY,
      //     authority: gameConstantsContext.Client.wallet.publicKey,
      //     season: gameConstantsContext.season,
      //     game: gameConstantsContext.gameAccount,
      //     player: gameConstantsContext.playerAccount,
      //     slots: SYSVAR_SLOT_HASHES_PUBKEY,
      //     instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
      //     ladaMint: gameConstantsContext.gameState.ladaMintAccount,
      //     caster: casterKP.publicKey,
      //     gameLadaTokenAccount: gameConstantsContext.gameState.ladaTokenAccount,
      //     ladaTokenAccount: gameConstantsContext.ladaTokenAccount,
      //   },
      //   signers: [gameConstantsContext.Client.wallet.payer, casterKP],
      // });
    } else {
      // const tx = new Transaction();
      // for (let i = 0; i < count; i++) {
      //   casterKP = anchor.web3.Keypair.generate();
      //   tx.add(
      //     await gameConstantsContext.Client.program.methods
      //       .initCaster()
      //       .accounts({
      //         systemProgram: anchor.web3.SystemProgram.programId,
      //         tokenProgram: TOKEN_PROGRAM_ID,
      //         rent: SYSVAR_RENT_PUBKEY,
      //         authority: gameConstantsContext.Client.wallet.publicKey,
      //         season: gameConstantsContext.season,
      //         game: gameConstantsContext.gameAccount,
      //         player: gameConstantsContext.playerAccount,
      //         slots: SYSVAR_SLOT_HASHES_PUBKEY,
      //         instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
      //         ladaMint: gameConstantsContext.gameState.ladaMintAccount,
      //         caster: casterKP.publicKey,
      //         gameLadaTokenAccount:
      //           gameConstantsContext.gameState.ladaTokenAccount,
      //         ladaTokenAccount: gameConstantsContext.ladaTokenAccount,
      //       })
      //       .signers([casterKP])
      //       .transaction(),
      //   );
      //   // tx.add(
      //   //   gameConstantsContext.Client.program.instruction.initCaster({
      //   //     accounts: {
      //   //       systemProgram: anchor.web3.SystemProgram.programId,
      //   //       tokenProgram: TOKEN_PROGRAM_ID,
      //   //       rent: SYSVAR_RENT_PUBKEY,
      //   //       authority: gameConstantsContext.Client.wallet.publicKey,
      //   //       season: gameConstantsContext.season,
      //   //       game: gameConstantsContext.gameAccount,
      //   //       player: gameConstantsContext.playerAccount,
      //   //       slots: SYSVAR_SLOT_HASHES_PUBKEY,
      //   //       instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
      //   //       ladaMint: gameConstantsContext.gameState.ladaMintAccount,
      //   //       caster: casterKP.publicKey,
      //   //       gameLadaTokenAccount:
      //   //         gameConstantsContext.gameState.ladaTokenAccount,
      //   //       ladaTokenAccount: gameConstantsContext.ladaTokenAccount,
      //   //     },
      //   //     signers: [gameConstantsContext.Client.wallet.payer, casterKP],
      //   //   }),
      //   // );
      // }
      // const blockhash = (
      //   await gameConstantsContext.Client.connection.getRecentBlockhash()
      // ).blockhash;
      // tx.recentBlockhash = blockhash;
      // tx.feePayer = gameConstantsContext.Client.wallet.publicKey!;
      // let txSignature;
      // try {
      //   // txSignature = await gameConstantsContext.Client.program.provider.send(tx);
      //   const signedTx = await gameConstantsContext.Client.wallet.signTransaction(
      //     tx,
      //   );
      //   txSignature = await gameConstantsContext.Client.connection.sendRawTransaction(
      //     signedTx.serialize(),
      //   );
      // } catch (e) {
      //   if (e.message.includes(TRANSACTION_TOO_LARGE)) {
      //     console.log(e);
      //     await this.txnTooLarge(tx);
      //   } else {
      //     throw new Error(e);
      //   }
      // }
      // return txSignature;
    }
  }

  //TODO: to test
  async txnTooLarge(tx: Transaction) {
    const newTXN = new Transaction();
    const blockhash = (
      await gameConstantsContext.Client.connection.getRecentBlockhash()
    ).blockhash;
    newTXN.recentBlockhash = blockhash;
    newTXN.feePayer = gameConstantsContext.Client.wallet.publicKey!;
    const txLength = tx.signatures.length;
    const halfLength = Math.floor(txLength / 2);
    newTXN.signatures = tx.signatures.slice(0, halfLength);

    let newTxSignature;
    try {
      // newTxSignature = await gameConstantsContext.Client.program.provider.send(
      //   newTXN,
      // );

      const signedTx = await gameConstantsContext.Client.wallet.signTransaction(
        newTXN,
      );

      newTxSignature = await gameConstantsContext.Client.connection.sendRawTransaction(
        signedTx.serialize(),
      );
    } catch (e) {
      if (e.message.includes(TRANSACTION_TOO_LARGE)) {
        console.log(e);
        await this.txnTooLarge(newTXN);
      } else {
        throw new Error(e);
      }
    }
    let txSignature;
    try {
      // txSignature = await gameConstantsContext.Client.program.provider.send(tx);

      const signedTx = await gameConstantsContext.Client.wallet.signTransaction(
        tx,
      );

      txSignature = await gameConstantsContext.Client.connection.sendRawTransaction(
        signedTx.serialize(),
      );
    } catch (e) {
      if (e.message.includes(TRANSACTION_TOO_LARGE)) {
        console.log(e);
        await this.txnTooLarge(tx);
      } else {
        throw new Error(e);
      }
    }
    return newTxSignature;
  }

  //TODO: to test
  async casterCommitMove(lvl: number, col: number) {
    const asyncDispatchResult = await Promise.all([
      this.getMintAccounts(),
      this.getGameTurnData(),
    ]).then((res) => res);
    const mintAccounts = asyncDispatchResult[0];
    const gameTurnData = asyncDispatchResult[1];

    const tx = new Transaction().add(
      await gameConstantsContext.Client.program.methods
        .casterCommitMoveS1(lvl, col)
        .accounts({
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
          authority: gameConstantsContext.Client.wallet.publicKey,
          game: gameConstantsContext.gameAccount,
          player: gameConstantsContext.playerAccount,
          caster: this.caster?.publicKey,
          season: gameConstantsContext.season,
          ...mintAccounts,
          gameTurnData,
          ladaMint: gameConstantsContext.gameState.ladaMintAccount,
          ladaTokenAccount: gameConstantsContext.ladaTokenAccount,
        })
        .instruction(),
    );

    tx.recentBlockhash = (
      await gameConstantsContext.Client.connection.getLatestBlockhash()
    ).blockhash;
    tx.feePayer = gameConstantsContext.Client.wallet.publicKey;

    const signedTx = await gameConstantsContext.Client.wallet.signTransaction(
      tx,
    );

    return await gameConstantsContext.Client.connection.sendRawTransaction(
      signedTx.serialize(),
    );
    // return await gameConstantsContext.Client.program.rpc.casterCommitMoveS1(
    //   lvl,
    //   col,
    //   {
    //     accounts: {
    //       tokenProgram: TOKEN_PROGRAM_ID,
    //       systemProgram: anchor.web3.SystemProgram.programId,
    //       associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    //       rent: SYSVAR_RENT_PUBKEY,
    //       authority: gameConstantsContext.Client.wallet.publicKey,
    //       game: gameConstantsContext.gameAccount,
    //       player: gameConstantsContext.playerAccount,
    //       caster: this.caster?.publicKey,
    //       season: gameConstantsContext.season,
    //       ...mintAccounts,
    //       gameTurnData,
    //       ladaMint: gameConstantsContext.gameState.ladaMintAccount,
    //       ladaTokenAccount: gameConstantsContext.ladaTokenAccount,
    //     },
    //     signers: [gameConstantsContext.Client.wallet.payer],
    //   },
    // );
  }

  async casterCommitLoot() {
    const gameTurnData = await this.getGameTurnData(
      this.caster.turnCommit?.turn,
    );

    const tx = new Transaction().add(
      await gameConstantsContext.Client.program.methods
        .casterCommitLoot()
        .accounts({
          systemProgram: anchor.web3.SystemProgram.programId,
          authority: gameConstantsContext.Client.wallet.publicKey,
          game: gameConstantsContext.gameAccount,
          player: gameConstantsContext.playerAccount,
          caster: this.caster?.publicKey,
          gameTurnData,
        })
        .instruction(),
    );

    tx.recentBlockhash = (
      await gameConstantsContext.Client.connection.getLatestBlockhash()
    ).blockhash;
    tx.feePayer = gameConstantsContext.Client.wallet.publicKey;

    const signedTx = await gameConstantsContext.Client.wallet.signTransaction(
      tx,
    );

    return await gameConstantsContext.Client.connection.sendRawTransaction(
      signedTx.serialize(),
    );
  }

  //TODO: to test
  async casterCommitCraft(item1: Item, item2: Item, item3: Item) {
    // const [gameTurnData] = await this.getGameTurnData(game, gameAccount);
    //const mintAccounts = await this.getMintAccounts(game);

    const tx = new Transaction().add(
      await gameConstantsContext.Client.program.methods
        .casterCommitCraftS1()
        .accounts({
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
          authority: gameConstantsContext.Client.wallet.publicKey,
          game: gameConstantsContext.gameAccount,
          player: gameConstantsContext.playerAccount,
          caster: this.caster?.publicKey,
          item1: item1.publicKey,
          item2: item2.publicKey,
          item3: item3.publicKey,
          ladaMint: gameConstantsContext.gameState.ladaMintAccount,
          ladaTokenAccount: gameConstantsContext.ladaTokenAccount,
          season: gameConstantsContext.season,
        })
        .instruction(),
    );

    tx.recentBlockhash = (
      await gameConstantsContext.Client.connection.getLatestBlockhash()
    ).blockhash;
    tx.feePayer = gameConstantsContext.Client.wallet.publicKey;

    const signedTx = await gameConstantsContext.Client.wallet.signTransaction(
      tx,
    );

    return await gameConstantsContext.Client.connection.sendRawTransaction(
      signedTx.serialize(),
    );
    // return await gameConstantsContext.Client.program.rpc.casterCommitCraftS1({
    //   accounts: {
    //     tokenProgram: TOKEN_PROGRAM_ID,
    //     systemProgram: anchor.web3.SystemProgram.programId,
    //     associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    //     rent: SYSVAR_RENT_PUBKEY,
    //     authority: gameConstantsContext.Client.wallet.publicKey,
    //     game: gameConstantsContext.gameAccount,
    //     player: gameConstantsContext.playerAccount,
    //     caster: this.caster?.publicKey,
    //     item1: item1.publicKey,
    //     item2: item2.publicKey,
    //     item3: item3.publicKey,
    //     ladaMint: gameConstantsContext.gameState.ladaMintAccount,
    //     ladaTokenAccount: gameConstantsContext.ladaTokenAccount,
    //     season: gameConstantsContext.season,
    //   },
    //   signers: [gameConstantsContext.Client.wallet.payer],
    // });
  }

  // Swap "action" to "turn"
  // Redeem is per caster
  async casterRedeemAction() {
    const tx = await this.getRedeemAction(this.caster);

    let txSignature;
    try {
      // txSignature = await gameConstantsContext.Client.program.provider.send(tx);
      const signedTx = await gameConstantsContext.Client.wallet.signTransaction(
        tx,
      );

      txSignature = await gameConstantsContext.Client.connection.sendRawTransaction(
        signedTx.serialize(),
      );
    } catch (e) {
      if (e.message.includes(TRANSACTION_TOO_LARGE)) {
        txSignature = await this.fallbackRedeem(this.caster);
      } else {
        throw new Error(e);
      }
    }

    return txSignature;
  }

  async casterRedeemAllActions(casters: Caster[]) {
    const transactions = [];

    for (let caster of casters) {
      transactions.push(await this.getRedeemAction(caster));
    }

    //TODO: check if wallet has sign all function otherwise fallback
    const signedTxns = await gameConstantsContext.Client.wallet.signAllTransactions(
      transactions,
    );

    let promises = [];
    for (let i = 0; i < signedTxns.length; i++) {
      promises.push(
        gameConstantsContext.Client.connection.sendRawTransaction(
          signedTxns[i].serialize(),
        ),
      );
    }

    return await Promise.all(promises);
  }

  async getRedeemAction(caster): Promise<Transaction> {
    const tx = new Transaction();

    const order = caster?.turnCommit.actions.actionOrder
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
          tx.add(await this.redeemLoot(itemMove, caster));
          signers.push(itemMove);
          break;
        }
        case 1: {
          const itemSpell = Keypair.generate();
          tx.add(await this.redeemSpell(itemSpell, caster));
          signers.push(itemSpell);
          break;
        }
        case 2: {
          tx.add(await this.redeemMove(caster));
          break;
        }
        case 3: {
          const itemCraft = Keypair.generate();
          tx.add(await this.redeemCraft(itemCraft, caster));
          signers.push(itemCraft);
          break;
        }
      }
    }

    tx.add(await this.redeemActions(caster));
    const blockhash = (
      await gameConstantsContext.Client.connection.getRecentBlockhash()
    ).blockhash;
    tx.recentBlockhash = blockhash;
    tx.feePayer = gameConstantsContext.Client.wallet.publicKey!;
    for (const sign of signers) {
      tx.partialSign(sign);
    }

    return tx;
  }

  async fallbackRedeem(caster) {
    const transactions = [];
    const blockhash = (
      await gameConstantsContext.Client.connection.getRecentBlockhash()
    ).blockhash;
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
          tx.add(await this.redeemLoot(itemMove, caster));
          tx.recentBlockhash = blockhash;
          tx.feePayer = gameConstantsContext.Client.wallet.publicKey!;
          tx.partialSign(itemMove);
          transactions.push(tx);
          break;
        }
        case 1: {
          const tx = new Transaction();
          const itemSpell = Keypair.generate();
          tx.add(await this.redeemSpell(itemSpell, caster));
          tx.recentBlockhash = blockhash;
          tx.feePayer = gameConstantsContext.Client.wallet.publicKey!;
          tx.partialSign(itemSpell);
          transactions.push(tx);
          break;
        }
        case 2: {
          const tx = new Transaction();
          tx.add(await this.redeemMove(caster));
          tx.recentBlockhash = blockhash;
          tx.feePayer = gameConstantsContext.Client.wallet.publicKey!;
          transactions.push(tx);
          break;
        }
        case 3: {
          const tx = new Transaction();
          const itemCraft = Keypair.generate();
          tx.add(await this.redeemCraft(itemCraft, caster));
          tx.recentBlockhash = blockhash;
          tx.feePayer = gameConstantsContext.Client.wallet.publicKey!;
          tx.partialSign(itemCraft);
          transactions.push(tx);
          break;
        }
      }
    }
    const txRewards = new Transaction();

    txRewards.add(await this.redeemActions(caster));
    txRewards.recentBlockhash = blockhash;
    txRewards.feePayer = gameConstantsContext.Client.wallet.publicKey!;

    transactions.push(txRewards);
    const signedTxns = await gameConstantsContext.Client.wallet.signAllTransactions(
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

  private async redeemActions(caster: Caster) {
    const gameTurnData = await this.getGameTurnData(caster?.turnCommit?.turn);
    const remainingAccounts =
      caster?.turnCommit?.actions.spell && caster?.modifiers?.spellBook
        ? {
            remainingAccounts: [
              {
                pubkey: caster?.modifiers?.spellBook,
                isSigner: false,
                isWritable: true,
              },
            ],
          }
        : {};

    return await gameConstantsContext.Client.program.methods
      .casterRedeemReward()
      .accounts({
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
        authority: gameConstantsContext.Client.wallet.publicKey,
        game: gameConstantsContext.gameAccount,
        season: gameConstantsContext.season,
        player: gameConstantsContext.playerAccount,
        caster: caster?.publicKey,
        gameSigner: gameConstantsContext.gameSigner,
        slots: SYSVAR_SLOT_HASHES_PUBKEY,
        ladaMintAccount: gameConstantsContext.gameState.ladaMintAccount,
        gameLadaTokenAccount: gameConstantsContext.gameState.ladaTokenAccount,
        ladaTokenAccount: gameConstantsContext.ladaTokenAccount,
        gameTurnData,
      })
      .remainingAccounts(remainingAccounts.remainingAccounts || [])
      .instruction();

    // return gameConstantsContext.Client.program.instruction.casterRedeemReward({
    //   accounts: {
    //     tokenProgram: TOKEN_PROGRAM_ID,
    //     systemProgram: anchor.web3.SystemProgram.programId,
    //     associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    //     instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
    //     authority: gameConstantsContext.Client.wallet.publicKey,
    //     game: gameConstantsContext.gameAccount,
    //     season: gameConstantsContext.season,
    //     player: gameConstantsContext.playerAccount,
    //     caster: caster?.publicKey,
    //     gameSigner: gameConstantsContext.gameSigner,
    //     slots: SYSVAR_SLOT_HASHES_PUBKEY,
    //     ladaMintAccount: gameConstantsContext.gameState.ladaMintAccount,
    //     gameLadaTokenAccount: gameConstantsContext.gameState.ladaTokenAccount,
    //     ladaTokenAccount: gameConstantsContext.ladaTokenAccount,
    //     gameTurnData,
    //   },
    //   signers: [gameConstantsContext.Client.wallet.payer],
    //   ...remainingAccounts,
    // });
  }

  //TODO: to test
  private async redeemMove(caster: Caster) {
    return await gameConstantsContext.Client.program.methods
      .casterRedeemMove()
      .accounts({
        game: gameConstantsContext.gameAccount,
        authority: gameConstantsContext.Client.wallet.publicKey,
        player: gameConstantsContext.playerAccount,
        caster: caster?.publicKey,
        instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
      })
      .instruction();

    // return gameConstantsContext.Client.program.instruction.casterRedeemMove({
    //   accounts: {
    //     game: gameConstantsContext.gameAccount,
    //     authority: gameConstantsContext.Client.wallet.publicKey,
    //     player: gameConstantsContext.playerAccount,
    //     caster: caster?.publicKey,
    //     instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
    //   },
    //   signers: [gameConstantsContext.Client.wallet.payer],
    // });
  }

  private async redeemLoot(item: Keypair, caster: Caster) {
    const empty = Keypair.generate();
    const mintAccounts = await this.getMintAccounts();
    const gameTurnData = await this.getGameTurnData(caster?.turnCommit?.turn);

    return await gameConstantsContext.Client.program.methods
      .casterRedeemLoot()
      .accounts({
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
        rent: SYSVAR_RENT_PUBKEY,
        authority: gameConstantsContext.Client.wallet.publicKey,
        game: gameConstantsContext.gameAccount,
        player: gameConstantsContext.playerAccount,
        caster: caster?.publicKey,
        season: gameConstantsContext.season,
        gameSigner: gameConstantsContext.gameSigner,
        slots: SYSVAR_SLOT_HASHES_PUBKEY,
        ladaMintAccount: gameConstantsContext.gameState.ladaMintAccount,
        gameLadaTokenAccount: gameConstantsContext.gameState.ladaTokenAccount,
        ladaTokenAccount: gameConstantsContext.ladaTokenAccount,
        gameTurnData,
        item: item.publicKey,
        staff: caster?.modifiers?.staff
          ? caster?.modifiers?.staff
          : empty.publicKey,
        head: caster?.modifiers?.head
          ? caster?.modifiers?.head
          : empty.publicKey,
        robe: caster?.modifiers?.robe
          ? caster?.modifiers?.robe
          : empty.publicKey,
        ...mintAccounts,
      })
      // .signers([item])
      .instruction();
  }

  //TODO: to test
  private async redeemCraft(item: Keypair, caster: Caster) {
    return await gameConstantsContext.Client.program.methods
      .casterRedeemCraftS1()
      .accounts({
        game: gameConstantsContext.gameAccount,
        authority: gameConstantsContext.Client.wallet.publicKey,
        player: gameConstantsContext.playerAccount,
        caster: caster?.publicKey,
        season: gameConstantsContext.season,
        slots: SYSVAR_SLOT_HASHES_PUBKEY,
        instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
        rent: SYSVAR_RENT_PUBKEY,
        systemProgram: anchor.web3.SystemProgram.programId,
        item: item.publicKey,
      })
      // .signers([item])
      .instruction();
    // return gameConstantsContext.Client.program.instruction.casterRedeemCraftS1({
    //   accounts: {
    //     game: gameConstantsContext.gameAccount,
    //     authority: gameConstantsContext.Client.wallet.publicKey,
    //     player: gameConstantsContext.playerAccount,
    //     caster: caster?.publicKey,
    //     season: gameConstantsContext.season,
    //     slots: SYSVAR_SLOT_HASHES_PUBKEY,
    //     instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
    //     rent: SYSVAR_RENT_PUBKEY,
    //     systemProgram: anchor.web3.SystemProgram.programId,
    //     item: item.publicKey,
    //   },
    //   signers: [item, gameConstantsContext.Client.wallet.payer],
    // });
  }

  //TODO: to test
  private async redeemSpell(item: Keypair, caster: Caster) {
    const mintAccounts = await this.getMintAccounts();
    const empty = Keypair.generate();

    return await gameConstantsContext.Client.program.methods
      .casterRedeemSpell()
      .accounts({
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
        rent: SYSVAR_RENT_PUBKEY,
        authority: gameConstantsContext.Client.wallet.publicKey,
        game: gameConstantsContext.gameAccount,
        season: gameConstantsContext.season,
        player: gameConstantsContext.playerAccount,
        caster: caster?.publicKey,
        gameSigner: gameConstantsContext.gameSigner,
        slots: SYSVAR_SLOT_HASHES_PUBKEY,
        item: item.publicKey,
        ...mintAccounts,
      })
      .signers([item])
      .remainingAccounts([
        {
          pubkey: caster?.modifiers?.spellBook
            ? caster?.modifiers?.spellBook
            : empty.publicKey,
          isSigner: false,
          isWritable: true,
        },
      ])
      .instruction();

    // return gameConstantsContext.Client.program.instruction.casterRedeemSpell({
    //   accounts: {
    //     tokenProgram: TOKEN_PROGRAM_ID,
    //     systemProgram: anchor.web3.SystemProgram.programId,
    //     associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    //     instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
    //     rent: SYSVAR_RENT_PUBKEY,
    //     authority: gameConstantsContext.Client.wallet.publicKey,
    //     game: gameConstantsContext.gameAccount,
    //     season: gameConstantsContext.season,
    //     player: gameConstantsContext.playerAccount,
    //     caster: caster?.publicKey,
    //     gameSigner: gameConstantsContext.gameSigner,
    //     slots: SYSVAR_SLOT_HASHES_PUBKEY,
    //     item: item.publicKey,
    //     ...mintAccounts,
    //   },
    //   signers: [item, gameConstantsContext.Client.wallet.payer],
    //   remainingAccounts: [
    //     {
    //       pubkey: caster?.modifiers?.spellBook
    //         ? caster?.modifiers?.spellBook
    //         : empty.publicKey,
    //       isSigner: false,
    //       isWritable: true,
    //     },
    //   ],
    // });
  }

  async equipItem(equipmentItem: Item) {
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
        gameConstantsContext.Client.program.instruction.unequipItem({
          accounts: {
            game: gameConstantsContext.gameAccount,
            authority: gameConstantsContext.Client.wallet.publicKey,
            player: gameConstantsContext.playerAccount,
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
          game: gameConstantsContext.gameAccount,
          authority: gameConstantsContext.Client.wallet.publicKey,
          player: gameConstantsContext.playerAccount,
          caster: this.caster?.publicKey,
          item: equipmentItem.publicKey,
        },
        signers: [gameConstantsContext.Client.wallet.payer],
      }),
    );

    const blockhash = (
      await gameConstantsContext.Client.connection.getRecentBlockhash()
    ).blockhash;
    tx.recentBlockhash = blockhash;
    tx.feePayer = gameConstantsContext.Client.wallet.publicKey!;

    const signedTx = await gameConstantsContext.Client.wallet.signTransaction(
      tx,
    );

    return await gameConstantsContext.Client.connection.sendRawTransaction(
      signedTx.serialize(),
    );
    // return await gameConstantsContext.Client.program.provider.send(tx);
  }

  async unequipAllItems(items: Item[]) {
    const tx = new Transaction();
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      tx.add(
        gameConstantsContext.Client.program.transaction.unequipItem({
          accounts: {
            game: gameConstantsContext.gameAccount,
            authority: gameConstantsContext.Client.wallet.publicKey,
            player: gameConstantsContext.playerAccount,
            caster: this.caster?.publicKey,
            item: new PublicKey(item.publicKey),
          },
          signers: [gameConstantsContext.Client.wallet.payer],
        }),
      );
    }
    const blockhash = (
      await gameConstantsContext.Client.connection.getRecentBlockhash()
    ).blockhash;
    tx.recentBlockhash = blockhash;
    tx.feePayer = gameConstantsContext.Client.wallet.publicKey!;

    const signedTx = await gameConstantsContext.Client.wallet.signTransaction(
      tx,
    );

    return await gameConstantsContext.Client.connection.sendRawTransaction(
      signedTx.serialize(),
    );
    // return await gameConstantsContext.Client.program.provider.send(tx);
  }

  async equipBestGear(items: Item[]) {
    const tx = new Transaction();
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemType = item.type;
      if (
        this.caster.modifiers[itemType] &&
        this.caster.modifiers[itemType].toString() !== item.publicKey
      ) {
        tx.add(
          gameConstantsContext.Client.program.instruction.unequipItem({
            accounts: {
              game: gameConstantsContext.gameAccount,
              authority: gameConstantsContext.Client.wallet.publicKey,
              player: gameConstantsContext.playerAccount,
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
            game: gameConstantsContext.gameAccount,
            authority: gameConstantsContext.Client.wallet.publicKey,
            player: gameConstantsContext.playerAccount,
            caster: this.caster?.publicKey,
            item: item.publicKey,
          },
          signers: [gameConstantsContext.Client.wallet.payer],
        }),
      );
    }
    const blockhash = (
      await gameConstantsContext.Client.connection.getRecentBlockhash()
    ).blockhash;
    tx.recentBlockhash = blockhash;
    tx.feePayer = gameConstantsContext.Client.wallet.publicKey!;

    const signedTx = await gameConstantsContext.Client.wallet.signTransaction(
      tx,
    );

    return await gameConstantsContext.Client.connection.sendRawTransaction(
      signedTx.serialize(),
    );
    // return await gameConstantsContext.Client.program.provider.send(tx);
  }

  async unequipItem(itemPK: PublicKey) {
    const tx = new Transaction().add(
      await gameConstantsContext.Client.program.methods
        .unequipItem()
        .accounts({
          game: gameConstantsContext.gameAccount,
          authority: gameConstantsContext.Client.wallet.publicKey,
          player: gameConstantsContext.playerAccount,
          caster: this.caster?.publicKey,
          item: itemPK,
        })
        .instruction(),
    );

    tx.recentBlockhash = (
      await gameConstantsContext.Client.connection.getLatestBlockhash()
    ).blockhash;
    tx.feePayer = gameConstantsContext.Client.wallet.publicKey;

    const signedTx = await gameConstantsContext.Client.wallet.signTransaction(
      tx,
    );

    return await gameConstantsContext.Client.connection.sendRawTransaction(
      signedTx.serialize(),
    );

    return await gameConstantsContext.Client.program.rpc.unequipItem({
      accounts: {
        game: gameConstantsContext.gameAccount,
        authority: gameConstantsContext.Client.wallet.publicKey,
        player: gameConstantsContext.playerAccount,
        caster: this.caster?.publicKey,
        item: itemPK,
      },
      signers: [gameConstantsContext.Client.wallet.payer],
    });
  }

  //TODO: to test
  async castSpell(equipmentItem: Item) {
    const mintAccounts = await this.getMintAccounts();
    const gameTurnData = await this.getGameTurnData();
    const tx = new Transaction();

    if (
      this.caster?.modifiers?.spellBook &&
      equipmentItem.publicKey.toString() !==
        this.caster?.modifiers?.spellBook.toString()
    ) {
      tx.add(
        gameConstantsContext.Client.program.instruction.unequipItem({
          accounts: {
            game: gameConstantsContext.gameAccount,
            authority: gameConstantsContext.Client.wallet.publicKey,
            player: gameConstantsContext.playerAccount,
            caster: this.caster?.publicKey,
            item: this.caster?.modifiers?.spellBook,
          },
          signers: [gameConstantsContext.Client.wallet.payer],
        }),
      );
      tx.add(
        gameConstantsContext.Client.program.instruction.equipItem({
          accounts: {
            game: gameConstantsContext.gameAccount,
            authority: gameConstantsContext.Client.wallet.publicKey,
            player: gameConstantsContext.playerAccount,
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
            game: gameConstantsContext.gameAccount,
            authority: gameConstantsContext.Client.wallet.publicKey,
            player: gameConstantsContext.playerAccount,
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
          authority: gameConstantsContext.Client.wallet.publicKey,
          game: gameConstantsContext.gameAccount,
          player: gameConstantsContext.playerAccount,
          caster: this.caster?.publicKey,
          slots: SYSVAR_SLOT_HASHES_PUBKEY,
          ...mintAccounts,
          spellbook: equipmentItem.publicKey,
          gameTurnData,
        },
        signers: [gameConstantsContext.Client.wallet.payer],
      }),
    );
    const blockhash = (
      await gameConstantsContext.Client.connection.getRecentBlockhash()
    ).blockhash;
    tx.recentBlockhash = blockhash;
    tx.feePayer = gameConstantsContext.Client.wallet.publicKey!;

    const signedTx = await gameConstantsContext.Client.wallet.signTransaction(
      tx,
    );

    return await gameConstantsContext.Client.connection.sendRawTransaction(
      signedTx.serialize(),
    );
  }

  //TODO: to test
  async manualResourceBurn(itemFeature: ItemFeature, amount: number) {
    const mintAccounts = await this.getMintAccounts();
    const gameTurnData = await this.getGameTurnData();

    const tx = new Transaction().add(
      await gameConstantsContext.Client.program.methods
        .manualResourceBurn(itemFeature, new anchor.BN(amount))
        .accounts({
          systemProgram: anchor.web3.SystemProgram.programId,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
          authority: gameConstantsContext.Client.wallet.publicKey,
          game: gameConstantsContext.gameAccount,
          player: gameConstantsContext.playerAccount,
          caster: this.caster?.publicKey,
          gameTurnData: gameTurnData,
          ...mintAccounts,
        })
        .instruction(),
    );

    tx.recentBlockhash = (
      await gameConstantsContext.Client.connection.getLatestBlockhash()
    ).blockhash;
    tx.feePayer = gameConstantsContext.Client.wallet.publicKey;

    const signedTx = await gameConstantsContext.Client.wallet.signTransaction(
      tx,
    );

    return await gameConstantsContext.Client.connection.sendRawTransaction(
      signedTx.serialize(),
    );
    // return await gameConstantsContext.Client.program.rpc.manualResourceBurn(
    //   itemFeature,
    //   new anchor.BN(amount),
    //   {
    //     accounts: {
    //       systemProgram: anchor.web3.SystemProgram.programId,
    //       associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    //       tokenProgram: TOKEN_PROGRAM_ID,
    //       rent: SYSVAR_RENT_PUBKEY,
    //       authority: gameConstantsContext.Client.wallet.publicKey,
    //       game: gameConstantsContext.gameAccount,
    //       player: gameConstantsContext.playerAccount,
    //       caster: this.caster?.publicKey,
    //       gameTurnData: gameTurnData,
    //       ...mintAccounts,
    //     },
    //     signers: [gameConstantsContext.Client.wallet.payer],
    //   },
    // );
  }

  //TODO: to test
  async prestigeCaster() {
    const newCaster = Keypair.generate();

    const tx = new Transaction().add(
      await gameConstantsContext.Client.program.methods
        .transferCaster()
        .accounts({
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
          authority: gameConstantsContext.Client.wallet.publicKey,
          oldGame: gameConstantsContext.previousGameAccount,
          newGame: gameConstantsContext.gameAccount,
          oldPlayer: gameConstantsContext.previousPlayerAccount,
          newPlayer: gameConstantsContext.playerAccount,
          oldSeason: gameConstantsContext.previousSeason,
          newSeason: gameConstantsContext.season,
          oldCaster: this.caster?.publicKey,
          newCaster: newCaster.publicKey,
          slots: SYSVAR_SLOT_HASHES_PUBKEY,
          instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
          ladaMint: gameConstantsContext.gameState.ladaMintAccount,
          ladaTokenAccount: gameConstantsContext.ladaTokenAccount,
        })
        .signers([newCaster])
        .instruction(),
    );

    tx.recentBlockhash = (
      await gameConstantsContext.Client.connection.getLatestBlockhash()
    ).blockhash;
    tx.feePayer = gameConstantsContext.Client.wallet.publicKey;

    const signedTx = await gameConstantsContext.Client.wallet.signTransaction(
      tx,
    );

    return await gameConstantsContext.Client.connection.sendRawTransaction(
      signedTx.serialize(),
    );

    // return await gameConstantsContext.Client.program.rpc.transferCaster({
    //   accounts: {
    //     systemProgram: anchor.web3.SystemProgram.programId,
    //     tokenProgram: TOKEN_PROGRAM_ID,
    //     rent: SYSVAR_RENT_PUBKEY,
    //     authority: gameConstantsContext.Client.wallet.publicKey,
    //     oldGame: gameConstantsContext.previousGameAccount,
    //     newGame: gameConstantsContext.gameAccount,
    //     oldPlayer: gameConstantsContext.previousPlayerAccount,
    //     newPlayer: gameConstantsContext.playerAccount,
    //     oldSeason: gameConstantsContext.previousSeason,
    //     newSeason: gameConstantsContext.season,
    //     oldCaster: this.caster?.publicKey,
    //     newCaster: newCaster.publicKey,
    //     slots: SYSVAR_SLOT_HASHES_PUBKEY,
    //     instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
    //     ladaMint: gameConstantsContext.gameState.ladaMintAccount,
    //     ladaTokenAccount: gameConstantsContext.ladaTokenAccount,
    //   },
    //   signers: [gameConstantsContext.Client.wallet.payer, newCaster],
    // });
  }

  //DEBUG - Devnet only
  async giveLada() {
    return await gameConstantsContext.Client.program.rpc.giveLada(
      new anchor.BN(1000 * 1e9),
      {
        accounts: {
          systemProgram: anchor.web3.SystemProgram.programId,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
          authority: gameConstantsContext.Client.wallet.publicKey,
          gameSigner: gameConstantsContext.gameSigner,
          game: gameConstantsContext.gameAccount,
          ladaMintAccount: gameConstantsContext.gameState.ladaMintAccount,
          gameLadaTokenAccount: gameConstantsContext.gameState.ladaTokenAccount,
          ladaTokenAccount: gameConstantsContext.ladaTokenAccount,
        },
      },
    );
  }

  async giveResources() {
    const mintAccounts = await this.getMintAccounts();

    return await gameConstantsContext.Client.program.rpc.giveResources(
      new anchor.BN(500),
      {
        accounts: {
          systemProgram: anchor.web3.SystemProgram.programId,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
          authority: gameConstantsContext.Client.wallet.publicKey,
          gameSigner: gameConstantsContext.gameSigner,
          game: gameConstantsContext.gameAccount,
          player: gameConstantsContext.playerAccount,
          ...mintAccounts,
        },
        signers: [gameConstantsContext.Client.wallet.payer],
      },
    );
  }

  async giveItem(itemType: ItemType) {
    const item = Keypair.generate();

    return await gameConstantsContext.Client.program.rpc.giveItem(
      itemType,
      new anchor.BN(1),
      {
        accounts: {
          systemProgram: anchor.web3.SystemProgram.programId,
          game: gameConstantsContext.gameAccount,
          season: gameConstantsContext.season,
          authority: gameConstantsContext.Client.wallet.publicKey,
          player: gameConstantsContext.playerAccount,
          slots: SYSVAR_SLOT_HASHES_PUBKEY,
          item: item.publicKey,
        },
        signers: [gameConstantsContext.Client.wallet.payer, item],
      },
    );
  }

  async changeTile() {
    return await gameConstantsContext.Client.program.rpc.changeTile(
      { crafting: {} },
      this.caster?.modifiers.tileLevel,
      this.caster?.modifiers.tileColumn,
      {
        accounts: {
          systemProgram: anchor.web3.SystemProgram.programId,
          game: gameConstantsContext.gameAccount,
        },
      },
    );
  }

  //HELPERS
  private async getGameTurnData(turn = -1) {
    const turnNumber =
      turn !== -1 ? turn : gameConstantsContext.gameState?.turnInfo?.turn;
    if (turn != -1 && turn != gameConstantsContext.gameState?.turnInfo?.turn) {
      const [turnData] = await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from('turn_data'),
          gameConstantsContext.gameAccount.toBuffer(),
          Buffer.from(anchor.utils.bytes.utf8.encode(String(turnNumber))),
        ],
        gameConstantsContext.Client.program.programId,
      );
      return turnData;
    }
    return gameConstantsContext.turnData;
  }

  private async getMintAccounts() {
    return {
      resource1MintAccount: gameConstantsContext.gameState.resource1MintAccount,
      resource2MintAccount: gameConstantsContext.gameState.resource2MintAccount,
      resource3MintAccount: gameConstantsContext.gameState.resource3MintAccount,
      resource1TokenAccount: gameConstantsContext.resource1TokenAccount,
      resource2TokenAccount: gameConstantsContext.resource2TokenAccount,
      resource3TokenAccount: gameConstantsContext.resource3TokenAccount,
    };
  }
}

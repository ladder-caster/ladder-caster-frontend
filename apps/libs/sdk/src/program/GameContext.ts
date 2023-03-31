import { Game } from '.';
import * as anchor from '@project-serum/anchor';
import {
  SYSVAR_INSTRUCTIONS_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  SYSVAR_SLOT_HASHES_PUBKEY,
} from '@solana/web3.js';
import gameConstantsContext from './GameConstantsContext';

export class GameContext {
  constructor() {}

  async getGameAccount(): Promise<Game> {
    await gameConstantsContext.hydrateGame();
    return gameConstantsContext.gameState;
  }

  async crank() {
    await gameConstantsContext.hydrateGame();

    const tx = new Transaction().add(
      await gameConstantsContext.Client.program.methods
        .crank()
        .accounts({
          gameAccount: gameConstantsContext.gameAccount,
          slots: SYSVAR_SLOT_HASHES_PUBKEY,
          season: gameConstantsContext.season,
          authority: gameConstantsContext.Client.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
          instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
          rent: SYSVAR_RENT_PUBKEY,
          gameTurnData: gameConstantsContext.futureTurnData,
          currentGameTurnData: gameConstantsContext.turnData,
        })
        .instruction(),
    );

    const {
      blockhash,
    } = await gameConstantsContext.Client.connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = gameConstantsContext.Client.wallet.publicKey;

    const signedTx = await gameConstantsContext.Client.wallet.signTransaction(
      tx,
    );

    return await gameConstantsContext.Client.connection.sendRawTransaction(
      signedTx.serialize(),
    );
  }
}

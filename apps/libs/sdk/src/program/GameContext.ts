import { Game } from '.';
import * as anchor from '@project-serum/anchor';
import {
  SYSVAR_INSTRUCTIONS_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  SYSVAR_SLOT_HASHES_PUBKEY,
} from '@solana/web3.js';
import gameConstantsContext from './GameConstantsContext';
import { TransactionBuilder } from '../hooks/useMutations';

export class GameContext {
  constructor() {}

  async getGameAccount(): Promise<Game> {
    await gameConstantsContext.hydrateGame();
    return gameConstantsContext.gameState;
  }

  //TODO: to test
  async crank(): Promise<TransactionBuilder> {
    await gameConstantsContext.hydrateGame();

    const transaction = new Transaction().add(
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

    return { transaction };
  }
}

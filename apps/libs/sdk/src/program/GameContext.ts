import { Game } from '.';
import * as anchor from '@project-serum/anchor';
import {
  SYSVAR_INSTRUCTIONS_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  SYSVAR_SLOT_HASHES_PUBKEY,
} from '@solana/web3.js';
import gameConstantsContext from './GameConstantsContext';

export class GameContext {
  constructor() {}

  async getGameAccount(): Promise<Game> {
    await gameConstantsContext.hydrateGame();
    return gameConstantsContext.gameState;
  }

  //TODO: needs to accept user that cranked and give them a reward to crank
  // Might be subject to change
  async crank() {
    await gameConstantsContext.hydrateGame();
    return await gameConstantsContext.Client.program.rpc.crank({
      accounts: {
        gameAccount: gameConstantsContext.gameAccount,
        slots: SYSVAR_SLOT_HASHES_PUBKEY,
        season: gameConstantsContext.season,
        authority: gameConstantsContext.Client.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
        rent: SYSVAR_RENT_PUBKEY,
        gameTurnData: gameConstantsContext.futureTurnData,
        currentGameTurnData: gameConstantsContext.turnData,
      },
    });
  }
}

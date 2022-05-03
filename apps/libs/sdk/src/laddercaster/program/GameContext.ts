// FETCHING
// getAllTiles
// getActiveTurnInfo

// NewTurn
import { Client, Game, GameTurnInfo, SLOTS_PUBKEY } from '.';
import * as anchor from '@project-serum/anchor';
import {
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';

export class GameContext {
  constructor(private client: Client, private gamePK: string) {}

  async getGameAccount(): Promise<Game> {
    const next_game = (await this.client.program.account.game.fetch(
      new anchor.web3.PublicKey(this.gamePK),
    )) as Game;
    return next_game;
  }

  //TODO: needs to accept user that cranked and give them a reward to crank
  // Might be subject to change
  async crank() {
    const gameAccount = new anchor.web3.PublicKey(this.gamePK);
    const game = (await this.client.program.account.game.fetch(
      gameAccount,
    )) as Game;

    const [season] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from('season'), new PublicKey(gameAccount).toBuffer()],
      this.client.program.programId,
    );

    const [gameTurnData] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('turn_data'),
        new anchor.web3.PublicKey(this.gamePK).toBuffer(),
        Buffer.from(
          anchor.utils.bytes.utf8.encode(String(game?.turnInfo?.turn + 1)),
        ),
      ],
      this.client.program.programId,
    );

    const [
      currentGameTurnData,
    ] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('turn_data'),
        new anchor.web3.PublicKey(this.gamePK).toBuffer(),
        Buffer.from(
          anchor.utils.bytes.utf8.encode(String(game?.turnInfo?.turn)),
        ),
      ],
      this.client.program.programId,
    );

    return await this.client.program.rpc.crank({
      accounts: {
        gameAccount: new anchor.web3.PublicKey(this.gamePK),
        slots: SLOTS_PUBKEY,
        season: season,
        authority: this.client.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
        rent: SYSVAR_RENT_PUBKEY,
        gameTurnData: gameTurnData,
        currentGameTurnData,
      },
    });
  }
}

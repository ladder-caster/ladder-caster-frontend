import { PublicKey, RpcResponseAndContext, TokenAmount } from '@solana/web3.js';
import { utils } from '@project-serum/anchor';
import { Game, GameState, Client, Accounts, Balances } from '.';
import resources from '../config/resources.json';
import {
  TYPE_RES1,
  TYPE_RES2,
  TYPE_RES3,
  OLD_SEASON,
  ROUND_TIMELIMIT,
} from 'core/remix/state';
import { Environment } from './Client';
import config from 'web/src/utils/config';
import PDA from './fetchers/PDA';

const USDC = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

/**
 * GameConstantsContext
 * @function clientInitialized - checks whether client is initialized
 *
 */
class GameConstantsContext {
  private accounts: Accounts;
  private balances: Balances;
  private client: Client;
  private game: GameState;
  private initInterval: any;
  private updateGameInterval: any;
  private lastCrankTime: number;
  private lastTurnNumber: number;
  constructor() {}
  /**
   *
   * @param account the account to get the balance of
   * @returns the current balance of the token account
   */
  private async getTokenAccountBalance(account: PublicKey) {
    return this.client.connection.getTokenAccountBalance(account);
  }
  /**
   *
   * @returns the current SOL balance of the wallet
   */
  private async getSOLBalance() {
    return this.client.connection.getBalance(this.client.wallet.publicKey);
  }

  /**
   * Initializes all data needed across caster context and player context
   */
  private async init() {
    if (this.accounts?.gameAccount) {
      return;
    }
    const gameAccount = new PublicKey(localStorage.getItem('gamePK'));
    const previousGameAccount = new PublicKey(
      this.getGamePK(config.environment as Environment, OLD_SEASON),
    );
    //@ts-ignore
    const game = (await this.client.program.account.game.fetch(
      gameAccount,
    )) as Game;
    const wallet = this.client.wallet.publicKey;
    const programId = this.client.program.programId;
    const PDAFetcher = new PDA(this.client);

    //MAHOOSIVE get and wait for longest execution
    const asyncDispatch = [
      PDAFetcher.getTokenUserAccount(game.resource1MintAccount, wallet),
      PDAFetcher.getTokenUserAccount(game.resource2MintAccount, wallet),
      PDAFetcher.getTokenUserAccount(game.resource3MintAccount, wallet),
      PDAFetcher.getTokenUserAccount(game.ladaMintAccount, wallet),
      PDAFetcher.getTokenUserAccount(USDC, wallet),
      PublicKey.findProgramAddress([Buffer.from('game_signer')], programId),
      PublicKey.findProgramAddress(
        [Buffer.from('season'), gameAccount.toBuffer()],
        programId,
      ),
      PublicKey.findProgramAddress(
        [gameAccount.toBuffer(), this?.client?.wallet.publicKey.toBuffer()],
        programId,
      ),
      PublicKey.findProgramAddress(
        [
          previousGameAccount.toBuffer(),
          this?.client?.wallet.publicKey.toBuffer(),
        ],
        programId,
      ),
      PublicKey.findProgramAddress(
        [Buffer.from('season'), previousGameAccount.toBuffer()],
        programId,
      ),
      PublicKey.findProgramAddress(
        [
          Buffer.from('turn_data'),
          gameAccount.toBuffer(),
          Buffer.from(utils.bytes.utf8.encode(String(game.turnInfo.turn))),
        ],
        programId,
      ),
      PublicKey.findProgramAddress(
        [
          Buffer.from('turn_data'),
          gameAccount.toBuffer(),
          Buffer.from(utils.bytes.utf8.encode(String(game.turnInfo.turn + 1))),
        ],
        programId,
      ),
    ];
    const [
      resource1,
      resource2,
      resource3,
      lada,
      usdc,
      gameSigner,
      season,
      playerAccount,
      playerBump,
      previousPlayerAccount,
      previousSeason,
      turnData,
      futureTurnData,
    ] = await Promise.all(asyncDispatch)
      .then((res) => {
        if (this.initInterval) {
          clearInterval(this.initInterval);
          this.initInterval = null;
        }
        return [
          res?.[0],
          res?.[1],
          res?.[2],
          res?.[3],
          res?.[4],
          res?.[5]?.[0],
          res?.[6]?.[0],
          res?.[7]?.[0],
          res?.[7]?.[1],
          res?.[8]?.[0],
          res?.[9]?.[0],
          res?.[10]?.[0],
          res?.[11]?.[0],
        ];
      })
      .catch((err) => {
        if (!this.initInterval) {
          this.initInterval = setInterval(async () => {
            await this.init();
          }, 2500);
        }
        console.error('Tried To Init GameConstants:', err);
        // prevent crash
        return ['', '', '', '', '', '', '', 0, '', '', '', ''];
      });

    this.accounts = {
      gameAccount: gameAccount,
      playerAccount: playerAccount,
      playerBump: playerBump,
      tokenAccounts: {
        [TYPE_RES1]: resource1,
        [TYPE_RES2]: resource2,
        [TYPE_RES3]: resource3,
        lada,
        usdc,
      },
      previousGameAccount,
      previousPlayerAccount: previousPlayerAccount,
    };
    this.game = {
      game,
      gameSigner,
      season,
      previousSeason,
      turnData,
      futureTurnData,
    };
    this.lastTurnNumber = game.turnInfo.turn;
    this.lastCrankTime =
      new Date(game.turnInfo.lastCrankSeconds.toNumber() * 1000).getMinutes() +
      1;
    const difference = this.lastCrankTime - new Date().getMinutes();
    const updateIntervalDuration =
      (ROUND_TIMELIMIT - difference > 0 ? ROUND_TIMELIMIT - difference : 1) *
      60000;
    this.updateGameInterval = setInterval(() => {
      this.handleGameUpdateInterval(updateIntervalDuration);
    }, updateIntervalDuration);
    await this.hydrateAccountBalances();
  }
  /**
   *
   * @param duration duration of the interval in ms
   */
  private async handleGameUpdateInterval(duration: number) {
    await this.hydrateGame();
    /**
     * If new round, timer will be ~18-20 min else,
     * if last duration was greater than 1 i.e turn isnt over but we waited the expected duration;
     * set interval to 1 min until cranked
     */
    if (this.lastTurnNumber < this.game.game.turnInfo.turn) {
      this.lastCrankTime =
        new Date(
          this.game.game.turnInfo.lastCrankSeconds.toNumber() * 1000,
        ).getMinutes() + 1;
      const difference = this.lastCrankTime - new Date().getMinutes();
      const updateIntervalDuration =
        (ROUND_TIMELIMIT - difference > 0 ? ROUND_TIMELIMIT - difference : 1) *
        60000;
      this.lastTurnNumber = this.game.game.turnInfo.turn;
      clearInterval(this.updateGameInterval);
      this.updateGameInterval = setInterval(() => {
        this.handleGameUpdateInterval(updateIntervalDuration);
      }, updateIntervalDuration);
    } else if (duration > 1) {
      clearInterval(this.updateGameInterval);
      this.updateGameInterval = setInterval(() => {
        this.handleGameUpdateInterval(60000);
      }, 60000);
    }
  }

  private getGamePK(env: Environment, season: number): PublicKey {
    switch (env) {
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
  private async checkInstance() {
    //initializes game incase of desync
    if (!this.accounts?.gameAccount) {
      await this.init();
    }
  }
  public async hydrateGame(force?: boolean) {
    await this.checkInstance();
    const timeSince = this.lastCrankTime - new Date().getMinutes();
    // unless force, only hydrate if it's been more than 20 min since last crank or 1 min intervals if net is dying
    if (timeSince <= -20 && !force) {
      return;
    }
    //@ts-ignore
    const game = (await this.client.program.account.game.fetch(
      this.accounts?.gameAccount,
    )) as Game;
    if (game.turnInfo.turn > this.game.game.turnInfo.turn) {
      this.game.game = game;
      await Promise.all([
        PublicKey.findProgramAddress(
          [
            Buffer.from('turn_data'),
            this.accounts.gameAccount.toBuffer(),
            Buffer.from(
              utils.bytes.utf8.encode(String(game.turnInfo.turn - 1)),
            ),
          ],
          this.client.program.programId,
        ),
        PublicKey.findProgramAddress(
          [
            Buffer.from('turn_data'),
            this.accounts.gameAccount.toBuffer(),
            Buffer.from(utils.bytes.utf8.encode(String(game.turnInfo.turn))),
          ],
          this.client.program.programId,
        ),
      ])
        .then((res) => {
          this.game.turnData = res[0][0];
          this.game.futureTurnData = res[1][0];
        })
        .catch((err) => console.error('FAILED TO GET TURN DATA:', err));
    }
  }
  /**
   * Refreshes account token balances
   */
  public async hydrateAccountBalances() {
    await this.checkInstance();
    const asyncDispatch = [
      this.getTokenAccountBalance(this.accounts.tokenAccounts[TYPE_RES1]),
      this.getTokenAccountBalance(this.accounts.tokenAccounts[TYPE_RES2]),
      this.getTokenAccountBalance(this.accounts.tokenAccounts[TYPE_RES3]),
      this.getTokenAccountBalance(this.accounts.tokenAccounts.lada),
      this.getSOLBalance(),
    ];

    const [resource1, resource2, resource3, lada, solana] = await Promise.all(
      asyncDispatch,
    )
      .then((res) => {
        const res1 = res[0]
          ? (res[0] as RpcResponseAndContext<TokenAmount>).value.amount
          : '0';
        const res2 = res[1]
          ? (res[1] as RpcResponseAndContext<TokenAmount>).value.amount
          : '0';
        const res3 = res[2]
          ? (res[2] as RpcResponseAndContext<TokenAmount>).value.amount
          : '0';
        const ladaValue = res[3]
          ? (res[3] as RpcResponseAndContext<TokenAmount>).value.amount
          : '0';
        return [
          res1,
          res2,
          res3,
          ((ladaValue as unknown) as number) / 1e9,
          (res[4] as number) / 1e9,
        ];
      })
      .catch((err) => {
        console.error('Failed To Retrieve Account Balances:', err);
        return Array(5).fill(0);
      });

    this.balances = {
      ...this.balances,
      sol: solana,
      game: {
        [TYPE_RES1]: resource1,
        [TYPE_RES2]: resource2,
        [TYPE_RES3]: resource3,
        lada,
      },
    };
  }

  public async initClient(client: Client) {
    if (client && !this.client) {
      this.client = client;
      await this.init();
    }
  }

  public get futureTurnData(): PublicKey {
    return this.game.futureTurnData;
  }
  public get turnData(): PublicKey {
    return this.game.turnData;
  }
  public get previousSeason(): PublicKey {
    return this.game.previousSeason;
  }
  public get playerAccount(): PublicKey {
    return this.accounts.playerAccount;
  }
  public get playerBump(): number {
    return this.accounts.playerBump;
  }
  public get gameAccount(): PublicKey {
    return this.accounts.gameAccount;
  }
  public get previousGameAccount(): PublicKey {
    return this.accounts.previousGameAccount;
  }
  public get previousPlayerAccount(): PublicKey {
    return this.accounts.previousPlayerAccount;
  }
  public get ladaTokenAccount(): PublicKey {
    return this.accounts.tokenAccounts.lada;
  }
  public get resource1TokenAccount(): PublicKey {
    return this.accounts.tokenAccounts[TYPE_RES1];
  }
  public get resource2TokenAccount(): PublicKey {
    return this.accounts.tokenAccounts[TYPE_RES2];
  }
  public get resource3TokenAccount(): PublicKey {
    return this.accounts.tokenAccounts[TYPE_RES3];
  }
  public get gameSigner(): PublicKey {
    return this.game.gameSigner;
  }
  public get season(): PublicKey {
    return this.game.season;
  }
  public get ladaBalance(): number {
    return this.balances.game.lada;
  }
  public get resource1Balance(): number {
    return this.balances.game[TYPE_RES1];
  }
  public get resource2Balance(): number {
    return this.balances.game[TYPE_RES2];
  }
  public get resource3Balance(): number {
    return this.balances.game[TYPE_RES3];
  }
  public get solBalance(): number {
    return this.balances.sol;
  }
  public get usdcBalance(): number {
    return this.balances.usdc;
  }
  public get gameState(): Game {
    return this.game?.game;
  }
  public clientInitialized(): boolean {
    return !!this.client;
  }
  public get Client(): Client {
    return this.client;
  }
  /**
   *
   * @returns [resource1, resource2, resource3, lada, sol]
   */
  public getTokenBalances(): [number, number, number, number, number] {
    return [
      this.balances.game[TYPE_RES1],
      this.balances.game[TYPE_RES2],
      this.balances.game[TYPE_RES3],
      this.balances.game.lada,
      this.balances.sol,
    ];
  }
}

const gameConstantsContext = new GameConstantsContext();
export default gameConstantsContext;

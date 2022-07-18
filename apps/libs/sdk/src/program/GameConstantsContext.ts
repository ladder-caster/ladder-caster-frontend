import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { web3, utils } from '@project-serum/anchor';

import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { Game, GameState, Client, Accounts, Balances } from '.';
import resources from '../config/resources.json';
import {
  TYPE_RES1,
  TYPE_RES2,
  TYPE_RES3,
  OLD_SEASON,
  ROUND_TIMELIMIT,
} from 'core/remix/state';
import { TRANSACTION_TOO_LARGE } from 'core/utils/parsers';
import config from '../../../../../config';

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
  private transaction: Transaction | null;
  constructor() {}

  async addInstruction(instruction: TransactionInstruction, txn?: Transaction) {
    if (!this.transaction) {
      this.transaction = new Transaction();
    }
    if (txn) {
      txn.add(instruction);
      return;
    }
    this.transaction.add(instruction);
  }
  async removeInstruction(
    instruction: TransactionInstruction,
    txn?: Transaction,
  ) {
    if (!this.transaction) {
      return;
    }
    var index;
    if (txn) {
      index = txn.instructions.indexOf(instruction);
      if (index > -1) txn.instructions.splice(index, 1);
      return;
    }
    index = this.transaction.instructions.indexOf(instruction);
    if (index > -1) this.transaction.instructions.splice(index, 1);
  }
  async setFeePayer(txn?: Transaction) {
    if (!this.transaction) return;
    if (txn) {
      txn.feePayer = this.client.wallet.publicKey;
      return;
    }
    this.transaction.feePayer = this.client.wallet.publicKey;
  }
  async setTransactionBlockHash(txn?: Transaction) {
    if (!this.transaction) return;
    const blockhash = (await this.client.connection.getLatestBlockhash())
      .blockhash;
    if (txn) {
      txn.recentBlockhash = blockhash;
      return;
    }
    this.transaction.recentBlockhash = blockhash;
  }
  async sendTransaction(txn?: Transaction) {
    let toSend = (txn ? txn : this.transaction) as Transaction;
    try {
      await this.client.program.provider.send(toSend);
      if (this.transaction) this.transaction = null;
    } catch (e) {
      if (e.message.includes(TRANSACTION_TOO_LARGE)) {
        console.log(e);
        await this.txnTooLarge(toSend);
      } else {
        throw new Error(e);
      }
    }
  }
  private async txnTooLarge(transaction: Transaction) {
    const half = Math.floor(transaction.instructions.length / 2);
    if (half <= 0) return;
    const firstHalf = transaction.instructions.slice(0, half);
    const secondHalf = transaction.instructions.slice(half);
    const firstHalfTxn = new Transaction();
    firstHalfTxn.instructions = firstHalf;

    const secondHalfTxn = new Transaction();
    secondHalfTxn.instructions = secondHalf;

    this.setFeePayer(firstHalfTxn);
    this.setFeePayer(secondHalfTxn);
    await Promise.all([
      this.setTransactionBlockHash(firstHalfTxn),
      this.setTransactionBlockHash(secondHalfTxn),
    ]);
    await Promise.all([
      this.sendTransaction(firstHalfTxn),
      this.sendTransaction(secondHalfTxn),
    ]);
    //TODO: signatures
  }
  private async getTransactionMemoryUsage() {
    if (!this.transaction) {
      return 0;
    }
    //TODO: need to calculate, potentially using endian uint to do calculation for an approximation on compute units
  }
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
    const gameAccount = new web3.PublicKey(
      localStorage.getItem('gamePK') as string,
    );
    const previousGameAccount = new web3.PublicKey(
      resources.seasons[OLD_SEASON][config.pkString],
    );
    const game = (await this.client.program.account.game.fetch(
      gameAccount,
    )) as Game;
    const publicKey = this.client.wallet.publicKey;
    const programId = this.client.program.programId;
    //MAHOOSIVE get and wait for longest execution
    const asyncDispatch = [
      Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        game.resource1MintAccount,
        publicKey,
      ),
      Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        game.resource2MintAccount,
        publicKey,
      ),
      Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        game.resource3MintAccount,
        publicKey,
      ),
      Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        game.ladaMintAccount,
        publicKey,
      ),
      Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
        publicKey,
      ),
      PublicKey.findProgramAddress([Buffer.from('game_signer')], programId),
      PublicKey.findProgramAddress(
        [Buffer.from('season'), new PublicKey(gameAccount).toBuffer()],
        programId,
      ),
      PublicKey.findProgramAddress(
        [
          gameAccount.toBuffer(),
          this?.client?.program?.provider?.wallet?.publicKey?.toBuffer() as Buffer,
        ],
        this.client.program.programId,
      ),
      PublicKey.findProgramAddress(
        [
          previousGameAccount.toBuffer(),
          this?.client?.program?.provider?.wallet?.publicKey?.toBuffer() as Buffer,
        ],
        this.client.program.programId,
      ),
      PublicKey.findProgramAddress(
        [Buffer.from('season'), new PublicKey(previousGameAccount).toBuffer()],
        this.client.program.programId,
      ),
      PublicKey.findProgramAddress(
        [
          Buffer.from('turn_data'),
          gameAccount.toBuffer(),
          Buffer.from(utils.bytes.utf8.encode(String(game.turnInfo.turn))),
        ],
        this.client.program.programId,
      ),
      PublicKey.findProgramAddress(
        [
          Buffer.from('turn_data'),
          gameAccount.toBuffer(),
          Buffer.from(utils.bytes.utf8.encode(String(game.turnInfo.turn + 1))),
        ],
        this.client.program.programId,
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
  // #region helpers
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
  public get futureTurnData(): PublicKey {
    return this.game.futureTurnData;
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
        // value exists in return: {context:{},value:{}}
        const res1 = res[0] ? res[0].value.amount : '0';
        const res2 = res[1] ? res[1].value.amount : '0';
        const res3 = res[2] ? res[2].value.amount : '0';
        const usdc = res[5] ? res[5].value.amount / 1e6 : '0';
        const ladaValue = res[3] ? res[3].value.amount : 0;
        return [res1, res2, res3, ladaValue / 1e9, res[4] / 1e9, usdc];
      })
      .catch((err) => {
        console.error('Failed To Retrieve Account Balances:', err);
        return Array(5).fill(0);
      });

    let usdc;
    try {
      usdc =
        (await this.getTokenAccountBalance(this.accounts.tokenAccounts.usdc))
          .value.amount / 1e6;
    } catch (e) {
      usdc = 0;
    }

    this.balances = {
      sol: solana,
      usdc,
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
  // #endregion helpers
}

const gameConstantsContext = new GameConstantsContext();
export default gameConstantsContext;

import { PublicKey } from "@solana/web3.js";
import { web3 } from '@project-serum/anchor';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { Game, GameState, Client, Accounts, Balances } from '.';

import {TYPE_RES1, TYPE_RES2, TYPE_RES3} from 'core/remix/state'
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

  constructor() { }
  public clientInitialized(): boolean{
    return !!this.client;
  }
  public async hydrateGame() {
    const game = (await this.client.program.account.game.fetch(
      this.accounts?.game,
    )) as Game;
    this.game.game = game;
    console.log("HYDRATE",this.game.game)
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
      this.balances.sol
    ]
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
    return this.client.connection.getBalance(this.client.wallet.publicKey)
  }
  /**
   * Refreshes account token balances
   */
  public async hydrateAccountBalances() {
    const asyncDispatch = [
      this.getTokenAccountBalance(this.accounts.tokenAccounts[TYPE_RES1]),
      this.getTokenAccountBalance(this.accounts.tokenAccounts[TYPE_RES2]),
      this.getTokenAccountBalance(this.accounts.tokenAccounts[TYPE_RES3]),
      this.getTokenAccountBalance(this.accounts.tokenAccounts.lada),
      this.getSOLBalance(),
    ];

    const [resource1, resource2, resource3, lada, solana] = await Promise.all(asyncDispatch).then(res => {

      // value exists in return: {context:{},value:{}}
      const res1 = res[0] ? res[0].value.amount : '0';
      const res2 = res[1] ? res[1].value.amount : '0';
      const res3 = res[2] ? res[2].value.amount : '0';
      const lada = res[3] ? res[3].value.amount : 0;
      return [res1, res2, res3, lada / 1e9, res[4] / 1e9];
    });
    this.balances = {
      sol: solana,
      game: {
        [TYPE_RES1]:resource1,
        [TYPE_RES2]:resource2,
        [TYPE_RES3]:resource3,
        lada,
      }
    }
  }
  public initClient(client: Client) {
    if (client && !this.client) {
      this.client = client;
      this.init();
    }
    return this;
  }
  /**
   * Initializes all data needed across caster context and player context
   */
  private async init() {
    const gameAccount = new web3.PublicKey(localStorage.getItem('gamePK'));
    const game = (await this.client.program.account.game.fetch(
      gameAccount,
    )) as Game
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
      PublicKey.findProgramAddress([Buffer.from('game_signer')],
        programId),
      PublicKey.findProgramAddress(
        [Buffer.from('season'), new PublicKey(gameAccount).toBuffer()],
        programId,
      ),

    ];
    const [resource1, resource2, resource3, lada, gameSigner, season] = await Promise.all(asyncDispatch).then((res) => {
      return [res[0], res[1], res[2], res[3], res[4][0], res[5][0]];
    })

    this.accounts = {
      game: gameAccount,
      tokenAccounts: { [TYPE_RES1]:resource1, [TYPE_RES2]:resource2, [TYPE_RES3]:resource3, lada },
    }
    this.game = {
      game,
      gameSigner,
      season
    }
    this.hydrateAccountBalances();
  }
}

export const gameConstantsContext = new GameConstantsContext();
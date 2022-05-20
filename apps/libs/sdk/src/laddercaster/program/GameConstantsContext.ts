import { PublicKey } from "@solana/web3.js";
import { web3,utils } from '@project-serum/anchor';

import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { Game, GameState, Client, Accounts, Balances } from '.';
import resources from 'sdk/src/laddercaster/config/resources.json';
import {TYPE_RES1, TYPE_RES2, TYPE_RES3, OLD_SEASON,ROUND_TIMELIMIT} from 'core/remix/state'
import { Environment } from "./Client";
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
  private lastTurnNumber: number;
  constructor() { }
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
   * Initializes all data needed across caster context and player context
   */
  private async init() {
    const gameAccount = new web3.PublicKey(localStorage.getItem('gamePK'));
    const previousGameAccount = new web3.PublicKey(
      this.getGamePK(process.env.REACT_APP_ENV as Environment, OLD_SEASON),
    )
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
      PublicKey.findProgramAddress(
        [gameAccount.toBuffer(), this?.client?.program?.provider?.wallet?.publicKey?.toBuffer()],
        this.client.program.programId,
      ),
      PublicKey.findProgramAddress(
        [previousGameAccount.toBuffer(), this?.client?.program?.provider?.wallet?.publicKey?.toBuffer()],
        this.client.program.programId,
      ),
      PublicKey.findProgramAddress(
        [Buffer.from('season'), new PublicKey(previousGameAccount).toBuffer()],
        gameConstantsContext.Client.program.programId,
      ),
      PublicKey.findProgramAddress(
      [
        Buffer.from('turn_data'),
        gameAccount.toBuffer(),
        Buffer.from(utils.bytes.utf8.encode(String(game.turnInfo.turn))),
      ],
      gameConstantsContext.Client.program.programId,
      )
    ];
    const [resource1, resource2, resource3, lada, gameSigner, season, playerAccount, playerBump, previousPlayerAccount,previousSeason,turnData] = await Promise.all(asyncDispatch).then((res) => {
      if(this.initInterval){
        clearInterval(this.initInterval);
        this.initInterval=null;
      }
      return [res?.[0], res?.[1], res?.[2], res?.[3], res?.[4]?.[0], res?.[5]?.[0], res?.[6]?.[0],res?.[6]?.[1],res?.[7]?.[0],res?.[8]?.[0],res?.[9]?.[0]];
    }).catch(err=>{
      if(!this.initInterval){this.initInterval=setInterval(()=>this.init(),1000)};
      console.error("Tried To Init GameConstants:",err)
      // prevent crash
      return ['', '', '', '', '', '', '',0,'','','']
    });
   
    this.accounts = {
      gameAccount: gameAccount,
      playerAccount: playerAccount,
      playerBump: playerBump,
      tokenAccounts: { [TYPE_RES1]:resource1, [TYPE_RES2]:resource2, [TYPE_RES3]:resource3, lada },
      previousGameAccount,
      previousPlayerAccount: previousPlayerAccount
    }
    this.game = {
      game,
      gameSigner,
      season,
      previousSeason,
      turnData
    }
    this.lastTurnNumber = game.turnInfo.turn;
    const lastCrankTime = new Date(game.turnInfo.lastCrankSeconds.toNumber() * 1000).getMinutes()+1 - new Date().getMinutes();
    const updateIntervalDuration = (ROUND_TIMELIMIT-lastCrankTime)>0?ROUND_TIMELIMIT-lastCrankTime:1;
    this.updateGameInterval = setInterval(this.handleGameUpdateInterval, updateIntervalDuration * 60000,updateIntervalDuration);
    this.hydrateAccountBalances();
  }
  private async handleGameUpdateInterval(duration: number){
    await this.hydrateGame();
    /**
     * If new round, timer will be ~18-20 min else,
     * if last duration was greater than 1 i.e turn isnt over but we waited the expected duration;
     * set interval to 1 min until cranked
     */
    if(this.lastTurnNumber<this.game.game.turnInfo.turn){
      const lastCrankTime = new Date(this.game.game.turnInfo.lastCrankSeconds.toNumber() * 1000).getMinutes()+1 - new Date().getMinutes();
      const updateIntervalDuration = (ROUND_TIMELIMIT-lastCrankTime)>0?ROUND_TIMELIMIT-lastCrankTime:1;
      this.lastTurnNumber=this.game.game.turnInfo.turn;
      clearInterval(this.updateGameInterval);
      this.updateGameInterval=setInterval(this.handleGameUpdateInterval, updateIntervalDuration*60000,1);
    }else if(duration>1){
      clearInterval(this.updateGameInterval);
      this.updateGameInterval=setInterval(this.handleGameUpdateInterval, 60000,1);
    }
  }
  private getGamePK(env: Environment, season: number):PublicKey {
    switch (env) {
      case 'localprod':
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
  // #region helpers
  public get turnData():PublicKey{
    return this.game.turnData;
  }
  public get previousSeason():PublicKey{
    return this.game.previousSeason;
  }
  public get playerTokenAccount():PublicKey{
    return this.accounts.playerAccount;
  }
  public get playerBump():number{
    return this.accounts.playerBump;
  }
  public get gameTokenAccount():PublicKey{
    return this.accounts.gameAccount;
  }
  public get previousGameTokenAccount():PublicKey{
    return this.accounts.previousGameAccount;
  }
  public get previousPlayerTokenAccount():PublicKey{
    return this.accounts.previousPlayerAccount;
  }
  public get ladaTokenAccount():PublicKey{
    return this.accounts.tokenAccounts.lada;
  }
  public get resource1TokenAccount():PublicKey{
    return this.accounts.tokenAccounts[TYPE_RES1];
  }
  public get resource2TokenAccount():PublicKey{
    return this.accounts.tokenAccounts[TYPE_RES2];
  }
  public get resource3TokenAccount():PublicKey{
    return this.accounts.tokenAccounts[TYPE_RES3];
  }
  public get gameSigner():PublicKey{
    return this.game.gameSigner;
  }
  public get season():PublicKey{
    return this.game.season;
  }
  public get ladaBalance():number{
    return this.balances.game.lada;
  }
  public get resource1Balance():number{
    return this.balances.game[TYPE_RES1];
  }
  public get resource2Balance():number{
    return this.balances.game[TYPE_RES2];
  }
  public get resource3Balance():number{
    return this.balances.game[TYPE_RES3];
  }
  public get solBalance(): number{
    return this.balances.sol;
  }
  public get gameState(): Game{
    return this.game.game;
  }
  public clientInitialized(): boolean{
    return !!this.client;
  }
  public get Client(): Client{
    return this.client;
  }
  public get getCasterAccounts():[PublicKey, PublicKey,  Game, PublicKey,PublicKey ]{
    this.hydrateGame()
    return [
      this.accounts.gameAccount,
      this.accounts.playerAccount,
      this.game.game,
      this.game.gameSigner,
      this.game.season
    ]
  }
  public get getPlayerAccounts(): [PublicKey, PublicKey, number, Game, PublicKey, PublicKey]{
    this.hydrateGame()
    return [
      this.accounts.gameAccount,
      this.accounts.playerAccount,
      this.accounts.playerBump,
      this.game.game,
      this.game.gameSigner,
      this.game.season
    ]
  }
  public async hydrateGame() {
    const game = (await this.client.program.account.game.fetch(
      this.accounts?.gameAccount,
    )) as Game;
    if(game.turnInfo.turn>this.game.game.turnInfo.turn){
      this.game.game = game;
      PublicKey.findProgramAddress(
        [
        Buffer.from('turn_data'),
        this.accounts.gameAccount.toBuffer(),
        Buffer.from(utils.bytes.utf8.encode(String(game.turnInfo.turn))),
        ],
        gameConstantsContext.Client.program.programId,
        ).then(res=>this.game.turnData=res[0]).catch(err=>console.error("Failed To Hydrate TurnData:",err))
    }
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
        const ladaValue = res[3] ? res[3].value.amount : 0;
        return [res1, res2, res3, ladaValue / 1e9, res[4] / 1e9];
      }).catch(err=>{
        console.error("Failed To Retrieve Account Balances:",err)
        return Array(5).fill(0);
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
    public async initClient(client: Client) {
      if (client && !this.client) {
        this.client = client;
        this.init();
      }
    }
  // #endregion helpers
}

const gameConstantsContext = new GameConstantsContext();
export default gameConstantsContext;
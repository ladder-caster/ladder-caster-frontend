import { PublicKey } from "@solana/web3.js";
import {web3} from '@project-serum/anchor';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {Game,GameState, Client, Accounts,Balances} from '.';

import {LADA_TOKEN_ACCOUNT,RESOURCE1_TOKEN_ACCOUNT,RESOURCE2_TOKEN_ACCOUNT,RESOURCE3_TOKEN_ACCOUNT}from 'core/remix/state'

class GameConstantsContext {
  private accounts:Accounts;
  private balances: Balances;
  private client: Client;
  private game: GameState;

  constructor(){ }
  public async hydrateGame(){
    const game = (await this.client.program.account.game.fetch(
      this.accounts?.game,
    )) as Game;
      this.game.game=game;
  }
  public getTokenBalances(): [number, number, number, number, number]{
    return [
      this.balances.game.resource1,
      this.balances.game.resource2,
      this.balances.game.resource3,
      this.balances.game.lada,
      this.balances.sol
    ]
  }
  /**
   * 
   * @param account the account to get the balance of
   * @returns the current balance of the token account
   */
  private async getTokenAccountBalance(account:PublicKey){
    return this.client.connection.getTokenAccountBalance(account);
  }
  /**
   * 
   * @returns the current SOL balance of the wallet
   */
  private async getSOLBalance(){
    return this.client.connection.getBalance(this.client.wallet.publicKey)
  }
  /**
   * Refreshes account token balances
   */
  public async hydrateAccountBalances(){
    const asyncDispatch = [
      this.getTokenAccountBalance(this.accounts.tokenAccounts.resource1),
      this.getTokenAccountBalance(this.accounts.tokenAccounts.resource2),
      this.getTokenAccountBalance(this.accounts.tokenAccounts.resource3),
      this.getTokenAccountBalance(this.accounts.tokenAccounts.lada),
      this.getSOLBalance(),
    ];

    const [resource1,resource2,resource3,lada,solana] = await Promise.all(asyncDispatch).then(res=>{
      console.log("RESOURCE HYDRATE",res)
     
      return [res[0],res[1],res[2],res[3],res[4]];
    });
    // this.balances = {
    //   sol:solana/1e9,
    //   game: {
    //     resource1,
    //     resource2,
    //     resource3,
    //     lada:lada/1e9,
    //   }
    // }
  }
  public initClient(client: Client){
    if(client && !this.client){
      this.client = client;
      console.log('CLIENT INIT',this.client)
      //this.init();
    }
  }
  /**
   * Initializes all data needed across caster context and player context
   */
  private async init(){
    const gameAccount = new web3.PublicKey(localStorage.getItem('gamePK'));
    const game = (await this.client.program.account.game.fetch(
      gameAccount,
    )) as Game
    const publicKey= this.client.wallet.publicKey;
    const programId =this.client.program.programId;
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
    const [resource1,resource2,resource3,lada,gameSigner,season]=await Promise.all(asyncDispatch).then((res)=>{
      return [res[0],res[1],res[2],res[3],res[4][0],res[5][0]];
    }).catch(err=>{console.log(err)
    return ['','','','','','']
    });
    
    this.accounts = {
      game:gameAccount,
      tokenAccounts:{resource1,resource2,resource3,lada},
    }
    this.game={
      game,
      gameSigner,
      season
    }
    console.log('init',this.game,this.accounts)
  }
}
export const gameConstantsContext = new GameConstantsContext();
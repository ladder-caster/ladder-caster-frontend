import { Client } from "./Client";
import  GameConstantsGameContext from "./GameConstants/Game.context";
import {  Game } from "./types";
import AccountsContext from "./GameConstants/Accounts.context";
import BalancesContext from "./GameConstants/Balances.context";
import {TYPE_RES1,TYPE_RES2,TYPE_RES3} from "core/remix/state";
import {PublicKey} from '@solana/web3.js';

class GameConstantsContext {
  accounts: AccountsContext;
  game: GameConstantsGameContext;
  client:Client;
  balances: BalancesContext;
  constructor(){
  }
  async init(){
    
    this.accounts = new AccountsContext();
    this.game = new GameConstantsGameContext();
    this.balances = new BalancesContext();
    await this.game.init(this.client);
    await this.accounts.init(this.client,this.game.gameState);
    await this.balances.init(this.client,this.accounts)
    console.log("DATA",this)
  }
  async initClient(client:Client){
    
    if(client && !this.client){
      this.client=client;
      await this.init();
    }
  }
  public disconnect(){
    this.accounts= new AccountsContext();
    this.game= new GameConstantsGameContext();
    this.balances=new BalancesContext()
  }
  public clientInitialized():boolean{
    return this.client!=null;
  }
  public async hydrateGame(){
    if (!this.accounts?.gameAccount) {
      await this.init();
    }
  }
  public async hydrateAccountBalances(){
    if (!this.accounts?.gameAccount) {
      await this.init();
    }
  }
  public get Client(): Client{
    return this.client;
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
}
const gameConstantsContext = new GameConstantsContext();

export default gameConstantsContext
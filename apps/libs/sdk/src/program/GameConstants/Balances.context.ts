import {Balances, GameBalances, Client} from '../'
import {TYPE_RES1,TYPE_RES2,TYPE_RES3} from 'core/remix/state';
import AccountsContext from './Accounts.context';
import { PublicKey } from '@solana/web3.js';
export default class BalancesContext implements Balances {
  game: GameBalances;
  sol:number;
  usdc:number;
  constructor(){
  
  }
  public async updateBalance(publicKey:PublicKey,client:Client,type:number){
    if(!publicKey || !client) return;
    var value;
    if(type==5){
      value = await client.connection.getBalance(client.wallet.publicKey)
    }else{
      value = await client.connection.getTokenAccountBalance(publicKey)
    }
    switch(type){
      case 0:
        this.game[TYPE_RES1] = value.value.amount??'0';
        break;
      case 1:
        this.game[TYPE_RES2] = value.value.amount??'0';
        break;
      case 2:
        this.game[TYPE_RES3] = value.value.amount??'0';
        break;
      case 3:
        this.game.lada = value.value.amount??'0'
        break;
      case 4:
        this.usdc = value.value.amount/1e6??'0';
        break;
      case 5:
        this.sol = value/1e9??0
        break;
    }
  }
  public async init(client:Client,account:AccountsContext){
    if(!account.tokenAccounts)return
    const asyncDispatch = [
      client.connection.getTokenAccountBalance(account.resource1),
      client.connection.getTokenAccountBalance(account.resource2),
      client.connection.getTokenAccountBalance(account.resource3),
      client.connection.getTokenAccountBalance(account.lada),
      client.connection.getBalance(client.wallet.publicKey),
      client.connection.getTokenAccountBalance(account.usdc)
    ]
    const [res1,res2,res3,lada,sol,usdc] = await Promise.all(asyncDispatch).then((res)=>{
      const res1 = res[0] ? res[0].value.amount : '0';
      const res2 = res[1] ? res[1].value.amount : '0';
      const res3 = res[2] ? res[2].value.amount : '0';
      const ladaValue = res[3] ? res[3].value.amount : 0;
      const sol = res[4] ? res[4] : '0';
      const usdc = res[5] ? res[5].value.amount  : '0';
      
      return [res1, res2, res3, ladaValue / 1e9,sol / 1e9, usdc/1e6];
    })
    this.game={
      lada:lada,
      [TYPE_RES1]:res1,
      [TYPE_RES2]:res2,
      [TYPE_RES3]:res3,
    }
    this.sol = sol;
    this.usdc = usdc?.value?.amount/1e6 ?? 0
  }
}
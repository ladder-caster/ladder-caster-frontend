import {clusterApiUrl, Connection, PublicKey} from '@solana/web3.js'
import {RPCAccountFunction} from '../types'
export default class LiveRPCContext {
  connection:Connection;
  
  constructor(){
    
    this.connection=new Connection(clusterApiUrl('mainnet-beta'),'confirmed');
    //when something changes on a specific account
   
  }
  public listenToAccount(publicKey:PublicKey,callback:RPCAccountFunction){
    this.connection.onAccountChange(publicKey,callback,'finalized');
  }
}
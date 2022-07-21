import { Client } from '../Client';
import {Accounts, TokenAccounts, Game} from '../types'
import {PublicKey} from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

import {
  TYPE_RES1,
  TYPE_RES2,
  TYPE_RES3,
} from 'core/remix/state';
import resources from '../../config/resources.json';
import {OLD_SEASON} from 'core/remix/state'
import config from '../../../../../../config';
export default class AccountsContext implements Accounts{
  tokenAccounts: TokenAccounts;
  gameAccount: PublicKey;
  playerAccount: PublicKey;
  playerBump: number;
  previousGameAccount: PublicKey;
  previousPlayerAccount: PublicKey;

  
  constructor(){
    
  }
  

  public async init(client: Client, game: Game){
    if(!client || !game)return;
    const gameAccount = new PublicKey(
      localStorage.getItem('gamePK') as string,
    );
    const previousGameAccount = new PublicKey(
      resources.seasons[OLD_SEASON][config.pkString],
    );
    const publicKey = client.wallet.publicKey;
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
      PublicKey.findProgramAddress(
        [
          gameAccount.toBuffer(),
          client?.program?.provider?.wallet?.publicKey?.toBuffer() as Buffer,
        ],
        client.program.programId,
      ),
      PublicKey.findProgramAddress(
        [
          previousGameAccount.toBuffer(),
          client?.program?.provider?.wallet?.publicKey?.toBuffer() as Buffer,
        ],
        client.program.programId,
      ),
    ]
    const [resource1,resource2,resource3,lada,usdc,playerAccount,previousPlayerAccount] = await Promise.all(asyncDispatch);
    this.gameAccount= gameAccount;
    this.playerAccount= playerAccount[0];
    this.playerBump= playerAccount[1];
    
    this.previousGameAccount= previousGameAccount;
    this.previousPlayerAccount= previousPlayerAccount[0];
    // ignore the error lint is wrong - data retrieved is the token account
    this.tokenAccounts = {
        [TYPE_RES1]: resource1,
        [TYPE_RES2]: resource2,
        [TYPE_RES3]: resource3,
        lada,
        usdc
    }
  }

  public get lada (): PublicKey {
    return this.tokenAccounts.lada;
  }
  public get usdc (): PublicKey {
    return this.tokenAccounts?.usdc;
  }
  public get resource1 (): PublicKey {
    return this.tokenAccounts?.resource1;
  }
  public get resource2 (): PublicKey {
    return this.tokenAccounts?.resource2;
  }
  public get resource3 (): PublicKey {
    return this.tokenAccounts?.resource3;
  }
}

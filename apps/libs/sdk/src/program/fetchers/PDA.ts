import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { Client } from '../Client';

//Includes PDA fetching and token account fetching
class PDA {
  constructor(private client: Client) {}

  private getCachedKey(key: string) {
    const value = localStorage.getItem(key);
    if (value) return new PublicKey(value);
    return null;
  }

  async getTokenUserAccount(
    mintAccount: PublicKey,
    wallet: PublicKey,
  ): Promise<PublicKey> {
    const storageKey = `${mintAccount
      .toString()
      .substring(0, 16)}-${wallet.toString().substring(0, 16)}`;

    let pda = this.getCachedKey(storageKey);

    if (pda) {
      return pda;
    } else {
      const tokenAccount = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        mintAccount,
        wallet,
      );
      localStorage.setItem(storageKey, tokenAccount.toString());

      return tokenAccount;
    }
  }

  // Global

  async getGameSigner() {}

  // Season dependant
}

export default PDA;

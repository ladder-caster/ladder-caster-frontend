import gameConstantsContext from './GameConstantsContext';
import * as anchor from '@project-serum/anchor';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { PublicKey, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';

const STAKING_CONTRACT = '';
const STAKING_CONTRACT_3M = '';
const STAKING_CONTRACT_1Y = '';
export class StakingContext {
  //template to hydrate when and if needed - fully changable 
  stakeData = {
    stakeEndDate: "dateTimeString",
    stakes: [
      {apy: "16",
      duration: "0",
      tier: '1'
    },
    {
      apy: "36",
      duration: "90",
      tier: '2'
    },
    {
      apy: "60",
      duration: "365",
      tier: '3'

    }
    ],
    staked: [
      {amount: '1234', tier: '1',endDate: 'dateTimeString',startDate: 'dateTimeString'}
    ]
  }
  constructor() {}

  async stakeLADANoLock(amount: number, tier: number) {
    const stakeInfo = anchor.web3.Keypair.generate();
    const tierPK = this.getTier(tier);

    return await gameConstantsContext.Client.program.rpc.stakeLada(
      new anchor.BN(amount),
      {
        accounts: {
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
          authority:
            gameConstantsContext.Client.program.provider.wallet.publicKey,
          gameSigner: gameConstantsContext.gameSigner,
          ladaPool: gameConstantsContext.gameState.ladaMintAccount, // Ask jo
          userLadaToken: gameConstantsContext.ladaTokenAccount,
          stakeInfo: stakeInfo.publicKey,
          stakingContract: new PublicKey(tierPK),
        },
        signers: [gameConstantsContext.Client.wallet.payer, stakeInfo],
      },
    );
  }

  async unstakeLADANoLock(amount: number, tier: number) {
    //TODO: fetch stakeInfo
    const stakeInfo = anchor.web3.Keypair.generate();

    const tierPK = this.getTier(tier);

    //TODO: remove amount in the contract
    return await gameConstantsContext.Client.program.rpc.unstakeLada(
      new anchor.BN(amount),
      {
        accounts: {
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          authority:
            gameConstantsContext.Client.program.provider.wallet.publicKey,
          gameSigner: gameConstantsContext.gameSigner,
          ladaTokenAccount: gameConstantsContext.gameState.ladaTokenAccount,
          ladaPool: gameConstantsContext.gameState.ladaMintAccount,
          userLadaToken: gameConstantsContext.ladaTokenAccount,
          stakeInfo: stakeInfo.publicKey,
          stakingContract: new PublicKey(tierPK),
        },
        signers: [gameConstantsContext.Client.wallet.payer],
      },
    );
  }
   getStakeData(){
    return this.stakeData
  }
  private getTier(tier: number) {
    switch (tier) {
      case 1: {
        return STAKING_CONTRACT;
      }
      case 2: {
        return STAKING_CONTRACT_3M;
      }
      case 3: {
        return STAKING_CONTRACT_1Y;
      }
    }
  }
}

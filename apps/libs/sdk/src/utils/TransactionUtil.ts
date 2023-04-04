import { Transaction, TransactionConfirmationStrategy } from '@solana/web3.js';
import { Connection } from '@solana/web3.js';
import { TransactionBuilder } from '../hooks/useMutations';
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet';

export const buildTransaction = () => {};

export const signTransaction = async (
  builder: TransactionBuilder,
  blockhash: string,
  wallet: NodeWallet,
) => {
  builder.transaction.recentBlockhash = blockhash;
  builder.transaction.feePayer = wallet.publicKey;

  for (const sign of builder.signers || []) {
    builder.transaction.partialSign(sign);
  }

  return await wallet.signTransaction(builder.transaction);
};

export const executeTransaction = async (
  connection: Connection,
  signedTx: Transaction,
) => {
  return await connection.sendRawTransaction(signedTx.serialize());
};

export const confirmTransaction = async (
  connection: Connection,
  validatorSignature: TransactionConfirmationStrategy,
) => {
  //TODO: Confirm which state we need ('confirmed' or 'finalized')
  return await connection.confirmTransaction(validatorSignature, 'confirmed');
};

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

export const signAllTransaction = async (
  builders: TransactionBuilder[],
  blockhash: string,
  wallet: NodeWallet,
) => {
  const transactions: Transaction[] = [];
  for (const builder of builders) {
    builder.transaction.recentBlockhash = blockhash;
    builder.transaction.feePayer = wallet.publicKey;
    for (const sign of builder.signers || []) {
      builder.transaction.partialSign(sign);
    }

    transactions.push(builder.transaction);
  }
  return await wallet.signAllTransactions(transactions);
};

export const executeTransaction = async (
  connection: Connection,
  signedTxs: Transaction[],
  atomicTransactions: boolean = false,
) => {
  let validatorSignatures: string[] = [];

  if (atomicTransactions) {
    for (const signedTx of signedTxs) {
      validatorSignatures.push(
        await connection.sendRawTransaction(signedTx.serialize()),
      );
    }

    if (validatorSignatures.length !== signedTxs.length && atomicTransactions)
      throw 'Some transactions failed to execute';
  } else {
    const executionPromise = [];
    for (const signedTx of signedTxs) {
      executionPromise.push(
        connection.sendRawTransaction(signedTx.serialize()),
      );
    }

    const results = await Promise.allSettled(executionPromise);

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        validatorSignatures.push(result.value);
      }
    });
  }

  return validatorSignatures;
};

export const confirmTransaction = async (
  connection: Connection,
  validatorSignature: TransactionConfirmationStrategy,
) => {
  //TODO: Confirm which state we need ('confirmed' or 'finalized')
  return await connection.confirmTransaction(validatorSignature, 'finalized');
};

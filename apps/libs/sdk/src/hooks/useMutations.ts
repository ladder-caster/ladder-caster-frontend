import { useMesh } from 'core/state/mesh/useMesh';
import { CREATE_MUTATION } from 'core/mesh/state';
import { nanoid } from 'nanoid';
import { useCallback } from 'react';
import {
  BlockhashWithExpiryBlockHeight,
  Signer,
  Transaction,
} from '@solana/web3.js';
import { useTranslation } from 'react-i18next';
import { handleCustomErrors } from 'core/utils/parsers';
import { CHAIN_LOCAL_CLIENT } from 'chain/hooks/state';
import {
  confirmTransaction,
  executeTransaction,
  signAllTransaction,
  signTransaction,
} from '../utils/TransactionUtil';

export enum TxStates {
  ERROR = 'error',
  SUCCESS = 'success',
  SIGNING = 'signing',
  EXECUTING = 'executing',
  CONFIRMING = 'confirming',
  RETRYING = 'retrying',
  DONE = 'done',
}

interface Mutation {
  id: string;
  type: string;
  state: TxStates;
  text?: {
    error?: string;
  };
}

export interface TransactionBuilder {
  transaction: Transaction;
  signers?: Signer[];
  meta?: string;
}

export interface Options {
  retryId?: string;
  onExecution?: () => Promise<void>;
  onConfirmation?: () => Promise<void>;
  onError?: () => Promise<any>;
  atomicTransactions?: boolean;
}

type Handler = (
  builder: TransactionBuilder | TransactionBuilder[],
  type: string,
  options?: Options,
) => Promise<void>;

export const useMutation = () => {
  const { t } = useTranslation();
  const [, setMutation] = useMesh(CREATE_MUTATION);
  const [client] = useMesh(CHAIN_LOCAL_CLIENT);

  const handleState: Handler = useCallback(
    async (
      builder: TransactionBuilder | TransactionBuilder[],
      type: string,
      {
        retryId = '',
        onExecution,
        onConfirmation,
        onError,
        atomicTransactions = false,
      }: Options,
    ) => {
      const id = retryId || nanoid();

      const mutation = {
        id,
        type,
        state: TxStates.SIGNING,
      } as Mutation;

      console.log('signing...', builder);
      try {
        setMutation({ ...mutation });
        const {
          blockhash,
          lastValidBlockHeight,
        } = (await client.connection.getLatestBlockhash()) as BlockhashWithExpiryBlockHeight;

        // Sign Transaction
        let signedTxs: Transaction[];
        if (Array.isArray(builder)) {
          signedTxs = await signAllTransaction(
            builder,
            blockhash,
            client.wallet,
          );
        } else {
          signedTxs = [
            await signTransaction(builder, blockhash, client.wallet),
          ];
        }

        setMutation({
          ...mutation,
          state: TxStates.EXECUTING,
        });

        // Execute Transaction
        console.log('executing...', signedTxs, atomicTransactions);
        const validatorSignatures = await executeTransaction(
          client.connection,
          signedTxs,
          atomicTransactions,
        );

        if (onExecution) onExecution();
        setMutation({ ...mutation, state: TxStates.CONFIRMING });

        // Confirming TX
        console.log('confirming...', validatorSignatures);
        const confirmationPromise = [];
        for (const signature of validatorSignatures) {
          confirmationPromise.push(
            confirmTransaction(client.connection, {
              blockhash: blockhash,
              lastValidBlockHeight: lastValidBlockHeight,
              signature: signature,
            }),
          );
        }

        const confirmationResult = await Promise.all(confirmationPromise);
        for (const confirmation of confirmationResult) {
          const e = confirmation?.value?.err;
          if (e) throw e;
        }

        if (onConfirmation) onConfirmation();
        setMutation({ ...mutation, state: TxStates.SUCCESS });
        console.log('confirmed!!!!');
        return confirmationResult;
      } catch (e) {
        console.log('mutation failed', e);
        if (onError) return await onError();

        //TODO: review error handling
        //TODO: change retry logic to connection
        let parsedMessage = handleCustomErrors(e.message);
        if (e.message?.includes('Solana'))
          parsedMessage = t('mutations.timeout');

        setMutation({
          ...mutation,
          state: TxStates.ERROR,
          text: {
            error: parsedMessage,
          },
        });
      }
    },
    [client, t],
  );
  return { handleState };
};

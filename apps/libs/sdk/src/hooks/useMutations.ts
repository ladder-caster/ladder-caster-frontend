import { useRemix } from 'core/hooks/remix/useRemix';
import { CREATE_MUTATION } from 'core/remix/state';
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
  signTransaction,
} from '../utils/TransactionUtil';

let retry_count = {};

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
}

type Handler = (
  builder: TransactionBuilder,
  type: string,
  retryId?: string,
  onExecution?: () => Promise<void>,
  onConfirmation?: () => Promise<void>,
) => Promise<void>;

export const useMutation = () => {
  const { t } = useTranslation();
  const [, setMutation] = useRemix(CREATE_MUTATION);
  const [client] = useRemix(CHAIN_LOCAL_CLIENT);

  const handleState: Handler = useCallback(
    async (
      // rpcCallback,
      // transaction: Transaction | Transaction[],
      builder: TransactionBuilder,
      type: string,
      retryId: string = '',
      onExecution?: () => Promise<void>,
      onConfirmation?: () => Promise<void>,
    ) => {
      const id = retryId || nanoid();

      const mutation = {
        id,
        type,
        state: TxStates.SIGNING,
      } as Mutation;

      try {
        setMutation({ mutation });
        console.log('signing...');

        const {
          blockhash,
          lastValidBlockHeight,
        } = (await client.connection.getLatestBlockhash()) as BlockhashWithExpiryBlockHeight;
        // Sign Transaction
        const signedTx = await signTransaction(
          builder,
          blockhash,
          client.wallet,
        );

        setMutation({
          ...mutation,
          state: TxStates.EXECUTING,
        });

        console.log('executing...');
        // Execute Transaction
        const validatorSignature = await executeTransaction(
          client.connection,
          signedTx,
        );

        if (onExecution) onExecution();
        setMutation({ ...mutation, state: TxStates.CONFIRMING });
        // Confirming TX

        console.log('confirming...');
        let confirmationResult: any = {};
        //TODO: bad validation
        if (typeof validatorSignature === 'string') {
          confirmationResult = await confirmTransaction(client.connection, {
            blockhash: blockhash,
            lastValidBlockHeight: lastValidBlockHeight,
            signature: validatorSignature,
          });
        }
        const e = confirmationResult?.value?.err;
        if (e) throw e;

        if (onConfirmation) onConfirmation();

        setMutation({ ...mutation, state: TxStates.SUCCESS });
        console.log('confirmed!!!!');
        return confirmationResult;
      } catch (e) {
        console.log('mutation failed', e);

        //TODO: review error handling
        //TODO: change retry logic to connection
        if (String(e).includes('Blockhash')) {
          retry_count[id] ? retry_count[id]++ : (retry_count[id] = 0);
          if (retry_count[id] < 2) await handleState(builder, type, id);
        } else {
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
      }
    },
    [client, t],
  );
  return { handleState };
};

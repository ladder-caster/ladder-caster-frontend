import { useRemix } from 'core/hooks/remix/useRemix';
import { CREATE_MUTATION } from 'core/remix/state';
import { nanoid } from 'nanoid';
import { useCallback } from 'react';
import { Transaction } from '@solana/web3.js';
import { useTranslation } from 'react-i18next';
import { handleCustomErrors } from 'core/utils/parsers';
import { CHAIN_LOCAL_CLIENT } from 'chain/hooks/state';

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

interface TransactionBuilder {}

export const useMutation = () => {
  const { t } = useTranslation();
  const [, setMutation] = useRemix(CREATE_MUTATION);
  const [client] = useRemix(CHAIN_LOCAL_CLIENT);

  const handleState = useCallback(
    async (
      rpcCallback,
      // transaction: Transaction | Transaction[],
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
        // Sign Transaction

        setMutation({ ...mutation, state: TxStates.EXECUTING });
        // Execute Transaction

        const validatorSignature = await rpcCallback();

        if (onExecution) onExecution();
        setMutation({ ...mutation, state: TxStates.CONFIRMING });
        // Confirming TX

        let confirmationResult: any = {};
        if (typeof validatorSignature === 'string') {
          confirmationResult = await client.connection.confirmTransaction(
            validatorSignature,
          );
        }
        const e = confirmationResult?.value?.err;
        if (e) throw e;

        if (onConfirmation) onConfirmation();

        setMutation({ ...mutation, state: TxStates.SUCCESS });
        return confirmationResult;
      } catch (e) {
        console.log('mutation failed', e);

        //TODO: review error handling
        if (String(e).includes('Blockhash')) {
          retry_count[id] ? retry_count[id]++ : (retry_count[id] = 0);
          if (retry_count[id] < 2) await handleState(rpcCallback, type, id);
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

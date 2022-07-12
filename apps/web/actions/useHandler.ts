import { CHAIN_LOCAL_CLIENT } from 'chain/hooks/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import { CREATE_MUTATION } from 'core/remix/state';
import { handleCustomErrors } from 'core/utils/parsers';
import { nanoid } from 'nanoid';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { CasterContext } from 'sdk/src/program';

let retry_count = {};
export const useHandler = () => {
  const { t } = useTranslation();
  const [, setMutation] = useRemix(CREATE_MUTATION);
  const [client] = useRemix(CHAIN_LOCAL_CLIENT);

  const stateHandler = useCallback(
    async (
      instruction,
      fetcher,
      type,
      retry_id = '',
      casterInstance: CasterContext | null = null,
    ) => {
      const id = retry_id || nanoid();

      try {
        setMutation({
          id,
          rpc: true,
          validator: false,
          success: false,
          retry_id,
          error: false,
          type,
        });

        const validatorSignature = await instruction();

        setMutation({
          id,
          rpc: false,
          validator: true,
          success: false,
          retry_id,
          error: false,
          type,
        });
        let confirmationResult: any = {};
        if (typeof validatorSignature === 'string') {
          confirmationResult = await client.connection.confirmTransaction(
            validatorSignature,
          );
        }
        const e = confirmationResult?.value?.err;

        if (String(e).includes('Blockhash')) {
          retry_count[id] ? retry_count[id]++ : (retry_count[id] = 0);
          if (retry_count[id] < 2) await stateHandler(instruction, type, id);
        } else {
          let parsedMessage = handleCustomErrors(e);
          if (e?.includes('Solana')) parsedMessage = t('mutations.timeout');
          setMutation({
            id,
            rpc: false,
            validator: false,
            success: !e,
            retry_id,
            error: !!e,
            type,
            text: {
              error: parsedMessage,
            },
          });
        }

        fetcher(confirmationResult, casterInstance);
      } catch (e) {
        console.log(e);
        if (String(e).includes('Blockhash')) {
          retry_count[id] ? retry_count[id]++ : (retry_count[id] = 0);
          if (retry_count[id] < 2) await stateHandler(instruction, type, id);
        } else {
          let parsedMessage = handleCustomErrors(e.message);
          if (e.message?.includes('Solana'))
            parsedMessage = t('mutations.timeout');
          setMutation({
            id,
            rpc: false,
            validator: false,
            success: false,
            error: true,
            text: {
              error: parsedMessage,
            },
            type,
          });
        }
        fetcher(null);
      }
    },
  );

  return {
    stateHandler,
  };
};

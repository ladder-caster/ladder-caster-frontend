import { useState, useCallback } from 'react';
import { useRemix } from 'core/hooks/remix/useRemix';
import { CHAIN_LOCAL_CLIENT } from './state';
import { Client, Environment } from 'sdk/src/program';
import NodeWallet from 'sdk/src/utils/NodeWallet';
import { environment } from '../../../../config';

export const useClient = () => {
  const [, setClient] = useRemix(CHAIN_LOCAL_CLIENT);
  const [error, setError] = useState();
  const [waiting, setWaiting] = useState(false);

  const request = async (wallet: NodeWallet) => {
    try {
      setWaiting(true);

      const client = await Client.connect(wallet);
      setWaiting(false);
      setError(null);
      setClient(client);
    } catch (e) {
      setWaiting(false);
      setError(error);
      setClient(null);
    }
  };

  // Create a local wallet or use the existing one
  const createClient = useCallback(
    (keypair: NodeWallet) => {
      setWaiting(true);
      return request(keypair);
    },
    [request],
  );

  return {
    waiting,
    error,
    createClient,
  };
};

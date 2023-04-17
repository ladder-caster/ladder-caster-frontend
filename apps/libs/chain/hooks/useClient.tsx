import { useState, useCallback } from 'react';
import { useMesh } from 'core/state/mesh/useMesh';
import { CHAIN_LOCAL_CLIENT } from './state';
import { Client } from 'sdk/src/program';
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet';

export const useClient = () => {
  const [, setClient] = useMesh(CHAIN_LOCAL_CLIENT);
  const [error, setError] = useState();
  const [waiting, setWaiting] = useState(false);

  const request = async (wallet: NodeWallet) => {
    try {
      setWaiting(true);

      const client = await Client.connect(wallet);
      setWaiting(false);
      //@ts-ignore
      setError(null);
      setClient(client);
    } catch (e) {
      console.log('e', e);
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

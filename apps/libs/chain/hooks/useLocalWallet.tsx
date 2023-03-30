import { useState, useCallback, useMemo } from 'react';
import { useRemix } from 'core/hooks/remix/useRemix';
import { CHAIN_LOCAL_CLIENT } from './state';
import { CREATE_MUTATION, WALLET_DISCONNECT } from 'core/remix/state';
import { nanoid } from 'nanoid';

//TODO: Replace with package once app is ready to ship
import { Client, Environment } from '../../sdk/src/laddercaster/program/Client';
import NodeWallet from 'sdk/src/laddercaster/utils/NodeWallet';
import { TxStates } from 'web/actions/useMutations';

export const useLocalWallet = () => {
  const [client, setClient] = useRemix(CHAIN_LOCAL_CLIENT);
  const [error, setError] = useState();
  const [waiting, setWaiting] = useState(false);
  const [, setMutation] = useRemix(CREATE_MUTATION);

  const id = useMemo(() => nanoid(), []);

  const request = useCallback(async () => {
    try {
      let localWallet = Client.getLocalKeypair();
      if (!localWallet) {
        localWallet = Client.generateKeypair();
      }
      setWaiting(true);
      const client = await Client.connect(new NodeWallet(localWallet));
      //TODO: Fix this function, it never works
      // await client.connection?.requestAirdrop(client.wallet.publicKey, 2*1e9);
      setWaiting(false);
      setError(null);
      setClient(client);
    } catch (error) {
      setWaiting(false);
      setError(error);
      setClient(null);
    }
  }, [setClient]);

  // Create a local wallet or use the existing one
  const createLocalWallet = useCallback(() => {
    setWaiting(true);
    return request();
  }, [request]);

  const removeLocalWallet = () => {
    localStorage.removeItem('LOCAL_SECRET');
    setClient(null);
    setMutation({
      id,
      state: TxStates.SUCCESS,
      type: WALLET_DISCONNECT,
    });
  };

  return {
    client,
    waiting,
    error,
    createLocalWallet,
    removeLocalWallet,
  };
};

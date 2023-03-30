import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRemix } from 'core/hooks/remix/useRemix';
import { CHAIN_LOCAL_CLIENT } from './state';
import { CREATE_MUTATION, W3A_TYPE, WALLET_TYPE } from 'core/remix/state';
import { nanoid } from 'nanoid';
import { SafeEventEmitterProvider } from '@web3auth/base';
import { Keypair } from '@solana/web3.js';

//TODO: Replace with package once app is ready to ship
import { Client } from 'sdk/src/program/Client';
import NodeWallet from 'sdk/src/utils/NodeWallet';

export const useW3A = () => {
  const [client, setClient, isSetClientReady] = useRemix(CHAIN_LOCAL_CLIENT);
  const [error, setError] = useState();
  const [providerState, setProviderState] = useState();
  const [waiting, setWaiting] = useState(false);
  const [, setWalletType] = useRemix(WALLET_TYPE);

  const request = useCallback(
    async (provider: SafeEventEmitterProvider) => {
      try {
        // const wallet = new SolanaWallet(provider);
        const privateKey = await provider.request<string>({
          method: 'solanaPrivateKey',
        });
        const keyPair = Keypair.fromSecretKey(Buffer.from(privateKey, 'hex'));
        console.log(keyPair.publicKey.toString());

        const client = await Client.connect(new NodeWallet(keyPair));

        setWalletType(W3A_TYPE);
        setWaiting(false);
        setError(null);
        setClient(client);
      } catch (error) {
        console.log(error);
        setWaiting(false);
        setError(error);
        setClient(null);
      }
    },
    [setClient, isSetClientReady],
  );

  // Create a local wallet or use the existing one
  const createWallet = useCallback(
    (provider: SafeEventEmitterProvider) => {
      setWaiting(true);
      setProviderState(provider);
      //   return request(provider);
    },
    [request],
  );

  useEffect(() => {
    if (waiting && isSetClientReady && providerState) {
      request(providerState);
    }
    // if (waiting && isSetClientReady) {
    //   request(providerState);
    // }
  }, [waiting, isSetClientReady, providerState]);

  return {
    client,
    waiting,
    error,
    createWallet,
  };
};

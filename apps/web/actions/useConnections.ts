import { useRemix } from 'core/hooks/remix/useRemix';
import { useWalletAdapter } from 'chain/hooks/connections/useWalletAdapter';
import { useEffect, useState } from 'react';
import { INIT_CHAIN_LOAD } from 'chain/hooks/state';
import { useW3A } from 'chain/hooks/connections/useW3A';

export const useConnections = () => {
  const { handleDisconnect: w3aDisconnect, handleConnect } = useW3A();
  const { connected: walletConnected, handleDisconnect } = useWalletAdapter();
  const [initLoading, setInitLoading, isSetInitLoading] = useRemix(
    INIT_CHAIN_LOAD,
  );
  const [stopLoad, setStopLoad] = useState(false);

  useEffect(() => {
    if (stopLoad && isSetInitLoading && initLoading) {
      setInitLoading(false);
      setStopLoad(false);
    }
  }, [isSetInitLoading]);

  useEffect(() => {
    if (
      !localStorage.getItem('adapter-connected') &&
      !localStorage.getItem('w3a-connected')
    ) {
      setStopLoad(true);
    }
  }, []);

  return {
    async web3AuthConnect(loginProvider: string) {
      handleConnect(loginProvider);
    },
    async disconnect() {
      if (walletConnected) handleDisconnect();
      else w3aDisconnect();
    },
  };
};

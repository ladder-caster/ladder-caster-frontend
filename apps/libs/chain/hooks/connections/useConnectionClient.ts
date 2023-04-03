import { useEffect, useState } from 'react';
import { useW3A } from './useW3A';
import { useClient } from '../useClient';
import { INIT_CHAIN_LOAD } from '../state';
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { useRemix } from 'core/hooks/remix/useRemix';
import NodeWallet from 'sdk/src/utils/NodeWallet';

export const useConnectionClient = (client) => {
  const { handleConnectInitial: handleConnectInitialW3A } = useW3A();
  const { createClient } = useClient();
  const anchorWallet = useAnchorWallet();
  const [stopLoad, setStopLoad] = useState(false);
  const { connected, connecting, disconnecting } = useWallet();
  const [initLoading, setInitLoading, isSetInitLoading] = useRemix(
    INIT_CHAIN_LOAD,
  );

  // Connection Handling
  useEffect(() => {
    if (connecting && !initLoading) {
      setInitLoading(true);
    }
  }, [connecting, initLoading]);

  useEffect(() => {
    if (connected && !client) {
      console.log('only once');
      localStorage.setItem('adapter-connected', 'true');
      createClient(anchorWallet as NodeWallet);
    }
  }, [connected, client]);

  //TODO: Simplify logic.
  useEffect(() => {
    if (stopLoad && isSetInitLoading && initLoading) {
      setInitLoading(false);
      setStopLoad(false);
    }
  }, [isSetInitLoading]);

  useEffect(() => {
    if (disconnecting) {
      localStorage.removeItem('adapter-connected');
    }
  }, [disconnecting]);

  useEffect(() => {
    if (localStorage.getItem('w3a-connected')) handleConnectInitialW3A();
    if (
      !localStorage.getItem('adapter-connected') &&
      !localStorage.getItem('w3a-connected')
    ) {
      setStopLoad(true);
    }
  }, []);
};

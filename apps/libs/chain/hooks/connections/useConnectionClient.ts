import { useEffect } from 'react';
import { useW3A } from './useW3A';
import { useClient } from '../useClient';
import { INIT_CHAIN_LOAD } from '../state';
import { useWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { useMesh } from 'core/state/mesh/useMesh';
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet';

export const useConnectionClient = (client) => {
  const { handleConnectInitial: handleConnectInitialW3A } = useW3A();
  const { createClient } = useClient();
  const anchorWallet = useAnchorWallet();
  const {
    connected,
    connecting,
    disconnecting,
    signAllTransactions,
    signTransaction,
    publicKey,
  } = useWallet();
  const [initLoading, setInitLoading] = useMesh(INIT_CHAIN_LOAD);

  // Connection Handling
  useEffect(() => {
    if (connecting && !initLoading) {
      setInitLoading(true);
    }
  }, [connecting, initLoading]);

  useEffect(() => {
    if (connected && !client) {
      localStorage.setItem('adapter-connected', 'true');
      // createClient(anchorWallet as NodeWallet);

      createClient({
        signAllTransactions,
        signTransaction,
        publicKey,
      } as NodeWallet);
    }
  }, [connected, client]);

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
      setInitLoading(false);
    }
  }, []);
};

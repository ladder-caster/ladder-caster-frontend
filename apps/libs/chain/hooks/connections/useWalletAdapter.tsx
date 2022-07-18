import { useWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { useRemix } from 'core/hooks/remix/useRemix';
import usePrevious from 'core/hooks/usePrevious';
import { useEffect, useCallback, useState } from 'react';
import NodeWallet from 'sdk/src/utils/NodeWallet';
import { CHAIN_LOCAL_CLIENT, INIT_CHAIN_LOAD } from '../state';
import { useClient } from '../useClient';

//TODO: split up hook into initer and callbacks?
export const useWalletAdapter = (handleInit = false) => {
  const {
    connecting,
    connected,
    disconnecting,
    publicKey,
    disconnect,
  } = useWallet();

  const wallet = useAnchorWallet();
  const { createClient } = useClient();
  const prevConnecting = usePrevious(connecting);
  const [client] = useRemix(CHAIN_LOCAL_CLIENT);
  const [initLoading, setInitLoading] = useRemix(INIT_CHAIN_LOAD);

  useEffect(() => {
    if (connecting && !initLoading && handleInit) {
      setInitLoading(true);
    }
  }, [connecting, initLoading]);

  useEffect(() => {
    if (prevConnecting && connected && handleInit) {
      localStorage.setItem('adapter-connected', 'true');
      createClient(wallet as NodeWallet);
    }
  }, [prevConnecting, connected]);

  useEffect(() => {
    if (disconnecting && handleInit) {
      localStorage.removeItem('adapter-connected');
    }
  }, [disconnecting]);

  const handleDisconnect = async () => {
    if (publicKey) {
      try {
        await disconnect();
        localStorage.removeItem('adapter-connected');
      } catch (e) {
        // TODO: handle failed
        console.log(e);
        // if (error) error();
      }
    }
  };

  return { connected, handleDisconnect };
};

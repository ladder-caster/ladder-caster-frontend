import { CHAIN_LOCAL_CLIENT } from 'chain/hooks/state';
import { useLocalWallet } from 'chain/hooks/useLocalWallet';
import { useState, useEffect, useMemo } from 'react';
import { Client } from '../../sdk/src/laddercaster/program';
import { useRemix } from './remix/useRemix';
import usePrevious from './usePrevious';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { WalletReadyState } from '@solana/wallet-adapter-base';
import { useAdapterWallet } from 'chain/hooks/useAdapterWallet';
import { nanoid } from 'nanoid';
import {
  BURNER_TYPE,
  CREATE_MUTATION,
  STANDARD_TYPE,
  VIEW_NAVIGATION,
  WALLET_AUTO_CONNECT,
  WALLET_DISCONNECT,
  WALLET_TYPE,
} from '../remix/state';
import { VIEW_HOME } from '../routes/routes';

export const useAutoSignIn = () => {
  const [client, setClient, isSetClientReady] = useRemix(CHAIN_LOCAL_CLIENT);
  const [, setMutation] = useRemix(CREATE_MUTATION);
  const [view, setView] = useRemix(VIEW_NAVIGATION);
  const [, setWalletType] = useRemix(WALLET_TYPE);
  const [tryCall, setTryCall] = useState(false);
  const { visible } = useWalletModal();
  const prevVisible = usePrevious(visible);
  const { createLocalWallet } = useLocalWallet();
  const { createClient } = useAdapterWallet();
  const adapterWallet = useWallet();
  const wallet = useAnchorWallet();

  const request = () => {
    setTryCall(true);
  };

  const handleWalletConnect = async (adapterWallet, error) => {
    if (!adapterWallet.publicKey) {
      try {
        await adapterWallet.connect();
      } catch (e) {
        // TODO: handle failed
        // if (error) error();
        console.log(e);
      }
    }
  };

  const handleDisconnect = async () => {
    if (adapterWallet.publicKey) {
      try {
        await adapterWallet.disconnect();
      } catch (e) {
        // TODO: handle failed
        console.log(e);
        // if (error) error();
      }
    }
  };

  const id = useMemo(() => nanoid(), []);

  useEffect(() => {
    if (
      adapterWallet.wallet &&
      adapterWallet.wallet.readyState === WalletReadyState.Installed &&
      !adapterWallet.publicKey
    ) {
      setMutation({
        id,
        rpc: true,
        validator: false,
        success: false,
        error: false,
        type: WALLET_AUTO_CONNECT,
      });

      handleWalletConnect(adapterWallet, () => {
        setMutation({
          id,
          rpc: true,
          validator: false,
          done: true,
          success: false,
          error: true,
          type: WALLET_AUTO_CONNECT,
        });
        setView(VIEW_HOME);
      });
    } else if (adapterWallet.wallet && adapterWallet.publicKey && wallet) {
      if (adapterWallet.disconnecting) {
        setMutation({
          id,
          rpc: true,
          validator: false,
          done: true,
          success: true,
          error: false,
          type: WALLET_DISCONNECT,
        });
        setClient(null);
      } else {
        createClient(wallet);
        setWalletType(STANDARD_TYPE);
        setMutation({
          id,
          rpc: true,
          validator: false,
          done: true,
          success: true,
          error: false,
          type: WALLET_AUTO_CONNECT,
        });
      }
    }
  }, [adapterWallet]);

  useEffect(() => {
    if (!visible && prevVisible) {
      if (adapterWallet.wallet) {
        handleWalletConnect(adapterWallet);
      }
    }
  }, [visible]);

  useEffect(() => {
    if (tryCall && Client.getLocalKeypair() && !client && isSetClientReady) {
      setWalletType(BURNER_TYPE);
      createLocalWallet();
    }
  }, [tryCall, createLocalWallet, isSetClientReady, client]);

  return { request, handleDisconnect };
};

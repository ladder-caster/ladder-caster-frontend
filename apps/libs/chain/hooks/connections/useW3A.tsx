import { useState, useCallback, useEffect } from 'react';
import { useRemix } from 'core/hooks/remix/useRemix';
import { CHAIN_LOCAL_CLIENT, INIT_CHAIN_LOAD } from '../state';
import {
  W3A_TYPE,
  WALLET_TYPE,
  WEB3AUTH_CLIENT,
  WEB3AUTH_PLUGIN_STORE,
  WEB3AUTH_PROVIDER,
} from 'core/remix/state';
import { Keypair } from '@solana/web3.js';
import { Client } from 'sdk/src/program/Client';
import { Web3AuthCore } from '@web3auth/core';
import {
  WALLET_ADAPTERS,
  ADAPTER_NAMESPACES,
  CHAIN_NAMESPACES,
  SafeEventEmitterProvider,
} from '@web3auth/base';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { SolanaWalletConnectorPlugin } from '@web3auth/solana-wallet-connector-plugin';
import config from 'web/src/utils/config';
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet';

export const solanaChainConfig = {
  chainNamespace: CHAIN_NAMESPACES.SOLANA,
  rpcTarget: 'https://api.mainnet-beta.solana.com',
  blockExplorer: 'https://explorer.solana.com',
  chainId: '0x3',
  displayName: 'mainnet-beta',
  ticker: 'SOL',
  tickerName: 'solana',
};

export const useW3A = () => {
  const [error, setError] = useState<any | null>();
  const [waiting, setWaiting] = useState(false);
  const [tryConnect, setTryConnect] = useState(false);
  const [, setInitLoading, isSetInitLoadingReady] = useRemix(INIT_CHAIN_LOAD);
  const [, setWalletType] = useRemix(WALLET_TYPE);
  const [, setProvider] = useRemix(WEB3AUTH_PROVIDER);
  const [, setClient, isSetClientReady] = useRemix(CHAIN_LOCAL_CLIENT);
  const [, setPluginStore, isSetPluginStoreReady] = useRemix(
    WEB3AUTH_PLUGIN_STORE,
  );
  const [web3Auth, setWeb3AuthInstance, isSetWeb3AuthInstance] = useRemix(
    WEB3AUTH_CLIENT,
  );

  const createWallet = useCallback(
    async (provider: SafeEventEmitterProvider) => {
      setWaiting(true);
      try {
        const privateKey = (await provider.request<string>({
          method: 'solanaPrivateKey',
        })) as string;
        const keyPair = Keypair.fromSecretKey(Buffer.from(privateKey, 'hex'));

        const client = await Client.connect(new NodeWallet(keyPair));
        setWalletType(W3A_TYPE);
        setError(null);
        setClient(client);
      } catch (error) {
        console.log(error);
        setError(error);
      } finally {
        setWaiting(false);
      }
    },
    [setClient, isSetClientReady],
  );

  const handleConnect = useCallback(
    async (loginProvider: string) => {
      try {
        const web3AuthInstance = new Web3AuthCore({
          chainConfig: {
            chainNamespace: ADAPTER_NAMESPACES.SOLANA,
            rpcTarget: config.rpc,
          },
        }).configureAdapter(
          new OpenloginAdapter({
            adapterSettings: {
              clientId: config.w3aKey,
              network: config.w3aEnv,
              uxMode: 'popup',
            },
          }),
        );
        const torusPlugin = new SolanaWalletConnectorPlugin({
          torusWalletOpts: {
            modalZIndex: -1,
          },
          walletInitOptions: {
            enableLogging: false,
            showTorusButton: false,
          },
        });
        await web3AuthInstance.addPlugin(torusPlugin);
        setPluginStore(torusPlugin);
        setWeb3AuthInstance(web3AuthInstance);

        await web3AuthInstance.init();
        setInitLoading(true);

        let provider;
        if (web3AuthInstance.status === 'connected') {
          provider = web3AuthInstance.provider;
        } else {
          provider = await web3AuthInstance.connectTo(
            WALLET_ADAPTERS.OPENLOGIN,
            {
              loginProvider,
              login_hint: '',
            },
          );
        }
        await createWallet(
          web3AuthInstance.provider as SafeEventEmitterProvider,
        );
        localStorage.setItem('w3a-connected', 'true');
        setInitLoading(false);
        setProvider(provider);
      } catch (error) {
        setInitLoading(false);
        console.error(error);
      }
    },
    [
      web3Auth,
      isSetPluginStoreReady,
      isSetInitLoadingReady,
      isSetWeb3AuthInstance,
    ],
  );

  useEffect(() => {
    if (
      tryConnect &&
      isSetInitLoadingReady &&
      isSetPluginStoreReady &&
      isSetWeb3AuthInstance
    ) {
      handleConnect('google');
    }
  }, [
    isSetInitLoadingReady,
    isSetPluginStoreReady,
    isSetWeb3AuthInstance,
    tryConnect,
  ]);

  const handleConnectInitial = useCallback(() => {
    console.log('try connect');
    setTryConnect(true);
  }, []);

  const handleDisconnect = useCallback(async () => {
    await web3Auth.logout();
    setProvider(null);
    setWeb3AuthInstance(null);
    localStorage.removeItem('w3a-connected');
  }, [web3Auth]);

  //TODO: takes quite a bit of time to init web3auth, would need a loading animation on google button
  return {
    handleConnectInitial,
    handleDisconnect,
    handleConnect,
    waiting,
    error,
    inited: !!web3Auth,
  };
};

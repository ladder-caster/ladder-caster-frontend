import { Web3AuthCore } from '@web3auth/core';
import {
  ADAPTER_EVENTS,
  ADAPTER_NAMESPACES,
  CHAIN_NAMESPACES,
} from '@web3auth/base';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { SolanaWalletConnectorPlugin } from '@web3auth/solana-wallet-connector-plugin';
import { useEffect } from 'react';
import config from 'web/src/utils/config';
import { useRemixOrigin } from 'core/hooks/remix/useRemixOrigin';
import {
  WALLET_TYPE,
  WEB3AUTH_CLIENT,
  WEB3AUTH_PLUGIN_STORE,
  WEB3AUTH_PROVIDER,
} from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import { useW3A } from 'chain/hooks/useW3A';

export const solanaChainConfig = {
  chainNamespace: CHAIN_NAMESPACES.SOLANA,
  rpcTarget: 'https://api.mainnet-beta.solana.com',
  blockExplorer: 'https://explorer.solana.com',
  chainId: '0x3',
  displayName: 'mainnet-beta',
  ticker: 'SOL',
  tickerName: 'solana',
};

const Web3AuthInjecter = () => {
  const [web3AuthInstance, setWeb3AuthInstance] = useRemixOrigin(
    WEB3AUTH_CLIENT,
    null,
  );
  const [provider, setProvider] = useRemixOrigin(WEB3AUTH_PROVIDER, null);
  const [pluginStore, setPluginStore] = useRemixOrigin(WEB3AUTH_PLUGIN_STORE, {
    plugins: {},
    addPlugin(name: string, instance: unknown): void {
      this.plugins[name] = instance;
    },
    getPlugin(name: string) {
      return this.plugins[name];
    },
  });
  const [, setWalletType] = useRemix(WALLET_TYPE);
  const { createWallet } = useW3A();

  useEffect(() => {
    const init = async () => {
      try {
        const web3AuthInstance = new Web3AuthCore({
          chainConfig: {
            chainNamespace: ADAPTER_NAMESPACES.SOLANA,
            rpcTarget: config.rpc,
          },
        });

        subscribeAuthEvents(web3AuthInstance);

        const openloginAdapter = new OpenloginAdapter({
          adapterSettings: {
            clientId: config.w3aKey,
            network: config.w3aEnv,
            uxMode: 'redirect',
          },
        });
        web3AuthInstance.configureAdapter(openloginAdapter);
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
        pluginStore.addPlugin('torusWallet', torusPlugin);
        setWeb3AuthInstance(web3AuthInstance);
        await web3AuthInstance.init();
      } catch (error) {
        console.error(error);
      }
    };

    const subscribeAuthEvents = (web3AuthInstance: Web3AuthCore) => {
      // Can subscribe to all ADAPTER_EVENTS and LOGIN_MODAL_EVENTS
      web3AuthInstance.on(ADAPTER_EVENTS.CONNECTED, async (data: unknown) => {
        console.log('Yeah!, you are successfully logged in', data);
        setProvider(web3AuthInstance.provider);

        createWallet(web3AuthInstance.provider);
        setWalletType();
      });

      web3AuthInstance.on(ADAPTER_EVENTS.CONNECTING, () => {
        console.log('connecting');
      });

      web3AuthInstance.on(ADAPTER_EVENTS.DISCONNECTED, () => {
        console.log('disconnected');
      });

      web3AuthInstance.on(ADAPTER_EVENTS.ERRORED, (error) => {
        console.error('some error or user has cancelled login request', error);
      });
    };

    init();
  }, []);

  return null;
};

export default Web3AuthInjecter;

import React, { useMemo, useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles, _app, _view } from 'design/styles/global';
import { styles, theme, zindex } from 'design';
import { Route, Switch } from 'react-router-dom';
import {
  VIEW_SIZE,
  USER_LANGUAGE,
  USER_THEME,
  USER_AUTO_CONNECT,
} from 'core/remix/state';
import { useRemixOrigin } from 'core/hooks/remix/useRemixOrigin';
import { PUBLIC_GAME } from 'core/routes/routes';
import Game from './src/views/game/Game';
import Header from './src/shared/header/Header';
import { useMobileHeight } from 'core/hooks/useMobileHeight';
import Remix from './src/remix/Remix';
import { nanoid } from 'nanoid';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { useOffline } from 'core/hooks/useOffline';
import { Helmet } from 'react-helmet-async';
import { Redirect } from 'react-router';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

const withThemes = ({ palette = 'dark' }) => ({
  ...theme[palette],
  styles,
  zindex,
});

const ticks_key = nanoid();

const App = () => {
  const [autoConnect, setAutoConnect] = useState(false);

  useOffline();
  const { vh } = useMobileHeight();
  useRemixOrigin(VIEW_SIZE, {});
  useRemixOrigin(USER_LANGUAGE, 'en');
  const [theme] = useRemixOrigin(USER_THEME, 'gold');

  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
    ],
    [network],
  );

  // Auto connect from local storage settings
  useEffect(() => {
    const local_connect = localStorage.getItem(USER_AUTO_CONNECT);
    if (local_connect) setAutoConnect(true);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>
          <ThemeProvider theme={withThemes({ palette: theme })}>
            <Helmet>
              <link
                href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@700&display=swap"
                rel="stylesheet"
              />
            </Helmet>
            <_app>
              {/*<Demo />*/}
              <Remix />
              <GlobalStyles />
              <Header />
              <_view $vh={vh}>
                <Switch>
                  <Route exact path={`${PUBLIC_GAME}`}>
                    <Game />
                  </Route>
                  <Redirect to={PUBLIC_GAME} />
                </Switch>
              </_view>
            </_app>
          </ThemeProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;

import React, { useEffect, useMemo, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles, _app, _view } from 'design/styles/global';
import { styles, theme, zindex } from 'design';
import { Route, Switch, useLocation } from 'react-router-dom';
import { USER_THEME } from 'core/mesh/state';
import { PUBLIC_GAME } from 'core/routes/routes';
import Game from './src/views/game/Game';
import { useMobileHeight } from 'core/hooks/useMobileHeight';
import Remix from './src/remix/Remix';
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
import ReactGA from 'react-ga';
import { clusterApiUrl } from '@solana/web3.js';
import { useOffline } from 'core/hooks/useOffline';
import { Helmet } from 'react-helmet-async';
import { Redirect } from 'react-router';
import { useMesh } from 'core/state/mesh/useMesh';

ReactGA.initialize('G-K6HWGS2MKQ', { debug: true });

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

const withThemes = ({ palette = 'dark' }) => ({
  ...theme[palette],
  styles,
  zindex,
});

const App = () => {
  const location = useLocation();

  useEffect(() => {
    console.log('sending page view');
    ReactGA.pageview(location?.pathname);
  }, [location?.pathname]);

  useOffline();
  const { vh } = useMobileHeight();

  const [theme] = useMesh(USER_THEME);

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
              <Remix />
              <GlobalStyles />
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

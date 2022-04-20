import React from 'react';
import {
  _market,
  _header,
  _title,
  _divider,
  _body,
  _fractal,
  _holaplex,
  _section,
  _greyscale,
} from './Market.styled';
import { _feed } from '../home/Dashboard.styled';
import { useTranslation } from 'react-i18next';
import { _controls, _speed } from '../header/Header.styled';
import { _wallet } from '../inventory/Inventory.styled';
import { IconFractal } from '../../../../../libs/design/icons/fractal.icon';
import Heading from '../../../shared/heading/Heading';
import {
  GAME_INIT,
  W3A_TYPE,
  WALLET_TYPE,
  WEB3AUTH_CLIENT,
  WEB3AUTH_PLUGIN_STORE,
} from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import { CHAIN_CASTERS } from 'chain/hooks/state';
import { Onboarding } from '../home/onboarding/Onboarding';
import { magicEdenLogo } from 'design/icons/magic.eden.icon';
import { IconOpensea, IconOpenseaLogo } from 'design/icons/opensea.icon';

const Market = () => {
  const { t } = useTranslation();
  const [casters] = useRemix(CHAIN_CASTERS);
  const [initialized] = useRemix(GAME_INIT);
  const [walletType] = useRemix(WALLET_TYPE);
  const [pluginStore] = useRemix(WEB3AUTH_PLUGIN_STORE);
  const [web3AuthInstance, setWeb3AuthInstance] = useRemix(WEB3AUTH_CLIENT);

  return (
    <_market $init={initialized && casters?.length !== 0}>
      <Heading title={t('title.market')} marketplace />
      {(!initialized || casters?.length === 0) && (
        <_feed>
          <Onboarding />
        </_feed>
      )}
      {initialized && casters?.length !== 0 && (
        <_body>
          <_section>
            <_title>{t('market.available')}:</_title>
            {walletType === W3A_TYPE ? (
              <_fractal
                onClick={() => {
                  console.log('its working');
                  pluginStore.plugins[
                    'torusWallet'
                  ].torusWalletInstance.showWallet('discover', {
                    url: 'https://www.fractal.is',
                  });
                }}
              >
                <IconFractal />
              </_fractal>
            ) : (
              <_fractal
                href="https://www.fractal.is/laddercaster"
                target="_blank"
                rel="noreferrer"
              >
                <IconFractal />
              </_fractal>
            )}
          </_section>
          <_section>
            <_title>{t('market.coming.soon')}:</_title>
            <_greyscale>{magicEdenLogo()}</_greyscale>
            <_greyscale $double>
              <IconOpenseaLogo />
              <IconOpensea />
            </_greyscale>
          </_section>
        </_body>
      )}
    </_market>
  );
};

export default Market;

import React, { useRef, useEffect } from 'react';
import {
  _game,
  _container,
  _mobile,
  _screen,
  _view,
  _download,
  _dots,
  _refresh,
  _settings,
  _fetching,
} from './Game.styled';
import Nav from './nav/Nav';
import { useSize } from 'core/hooks/useSize';
import Header from './header/Header';
import { useMobileHeight } from 'core/hooks/useMobileHeight';
import { AnimateMobile } from './animations/AnimateMobile';
import { IconMore } from 'design/icons/more.icon';
import Modal from '../../shared/modal/Modal';
import { CHAIN_LOCAL_CLIENT } from 'chain/hooks/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import { useGame } from 'chain/hooks/useGame';
import { VIEW_NAVIGATION } from 'core/remix/state';
import usePrevious from 'core/hooks/usePrevious';
import { AnimateDots } from './animations/AnimateSettings';
import { useActions } from '../../../actions';
import { useTranslation } from 'react-i18next';
import Mutations from '../../shared/mutations/Mutations';
import Connect from '../../shared/connect/Connect';
import { useKeys } from 'core/hooks/useKeys';
import { View } from './view/View';

const Game = () => {
  const { t } = useTranslation();
  const [client] = useRemix(CHAIN_LOCAL_CLIENT);
  const { getGame } = useGame(client);
  const prevClient = usePrevious(client);
  const screen_ref = useRef();
  const { height } = useSize(screen_ref);
  const { vh } = useMobileHeight();
  const [view, setView, isSetViewReady] = useRemix(VIEW_NAVIGATION);
  const { drawerSettings } = useActions();
  const [k0, k1, k2] = useKeys(5);

  useEffect(() => {
    if (view) {
      localStorage.setItem('lc-tab', view);
    }
  }, [view]);

  useEffect(() => {
    const cachedTab = localStorage.getItem('lc-tab');

    if (cachedTab && isSetViewReady) {
      setView(cachedTab);
    }
  }, [isSetViewReady]);

  useEffect(() => {
    if (!prevClient && client) {
      getGame(client);
    }
  }, [client]);

  return (
    <_game $vh={vh} {...k0}>
      <AnimateMobile $vh={vh}>
        <_mobile $vh={vh} {...k1}>
          <_download>
            <div
              onClick={() => {
                window.location.reload();
              }}
            >
              <span>{t('laddercaster.title')}</span>
              <b>
                <span>{t('laddercaster.alpha')}</span>
              </b>
            </div>
            <_dots>
              <Connect />
              {process.env.REACT_APP_ENV !== 'mainnet' && (
                <AnimateDots>
                  <_settings onClick={() => drawerSettings()}>
                    <IconMore />
                  </_settings>
                </AnimateDots>
              )}
            </_dots>
          </_download>
          <_fetching>
            <Mutations />
          </_fetching>
          <_screen ref={screen_ref} {...k2}>
            <Modal screen_height={height} />
            <Header />
            <View />
            <Nav />
          </_screen>
        </_mobile>
      </AnimateMobile>
    </_game>
  );
};

export default Game;

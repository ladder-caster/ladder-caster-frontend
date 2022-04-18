import React from 'react';
import { _appstore } from './AppStore.styled';
import { AnimateButton } from '../button/animations/AnimateButton';
import { _app_store, _store } from '../../views/game/Game.styled';
import { IconApple } from 'design/icons/apple.icon';
import { IconAndroid } from 'design/icons/android.icon';

const AppStore = () => {
  return (
    <_appstore>
      <AnimateButton high>
        <_store>
          <IconApple />
        </_store>
      </AnimateButton>
      <AnimateButton high>
        <_store>
          <IconAndroid />
        </_store>
      </AnimateButton>
    </_appstore>
  );
};

export default AppStore;

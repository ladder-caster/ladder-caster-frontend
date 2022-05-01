import React, { useMemo } from 'react';
import {
  _header,
  _container,
  _left,
  _right,
  _coin,
  _icon,
  _crank,
  _square,
  _button,
  _speed,
  _controls,
  _padding,
  _before,
  _content,
  _after,
} from './Header.styled';
import { withTheme } from 'styled-components';
import { IconWaterIMG } from 'design/icons/water.icon';
import { IconEarthIMG } from 'design/icons/earth.icon';
import { IconFireeIMG } from 'design/icons/firee.icon';
import { IconMoneyIMG } from 'design/icons/money.icon';
import { useRemix } from 'core/hooks/remix/useRemix';
import {
  DEMO_MODE,
  GAME_INIT,
  GAME_RESOURCES,
  TYPE_EARTH,
  TYPE_FIRE,
  TYPE_WATER,
} from 'core/remix/state';
import { useActions } from 'web/actions';
import Counter from '../../../shared/counter/Counter';
import usePrevious from 'core/hooks/usePrevious';
import { CHAIN_CASTERS, CHAIN_GAME } from 'chain/hooks/state';
import { useTranslation } from 'react-i18next';
import Timer from './timer/Timer';

const Header = withTheme(({ theme }) => {
  const { t } = useTranslation();
  const { openDrawerTokens } = useActions();
  const [casters] = useRemix(CHAIN_CASTERS);
  const [demo] = useRemix(DEMO_MODE);
  const [resources] = useRemix(GAME_RESOURCES);
  const [game] = useRemix(CHAIN_GAME);
  const [initialized] = useRemix(GAME_INIT);
  
  console.log('Game', game);
  

  const prevGold = usePrevious(+resources?.lada || 0);
  const prevFire = usePrevious(+resources?.fire || 0);
  const prevWater = usePrevious(+resources?.water || 0);
  const prevEarth = usePrevious(+resources?.earth || 0);

  const TurnTitle = useMemo(() => {
    return () =>
      initialized && casters?.length !== 0 ? (
        <_controls>
          <_speed>
            {t('header.day')}{' '}
            {!isNaN(game?.turnInfo?.turn)
              ? game?.turnInfo?.turn
              : demo?.num_ticks}
          </_speed>
        </_controls>
      ) : null;
  }, [game?.turnInfo?.turn, demo?.num_ticks, casters?.length, initialized]);

  return (
    <_header>
      <_container>
        <_left onClick={() => demo && openDrawerTokens()}>
          <_coin>
            <_icon $background={theme.element['legendary']}>
              <IconMoneyIMG />
            </_icon>
            <Counter from={prevGold} to={+resources?.lada} />
          </_coin>
          <_coin>
            <_icon $background={theme.element[TYPE_WATER]}>
              <IconWaterIMG />
            </_icon>
            <Counter from={prevWater} to={+resources?.water} />
          </_coin>
          <_coin>
            <_icon $background={theme.element[TYPE_FIRE]}>
              <IconFireeIMG />
            </_icon>
            <Counter from={prevFire} to={+resources?.fire} />
          </_coin>
          <_coin>
            <_icon $background={theme.element[TYPE_EARTH]}>
              <IconEarthIMG />
            </_icon>
            <Counter from={prevEarth} to={+resources?.earth} />
          </_coin>
        </_left>
        <_right>
          <TurnTitle />
          <Timer />
        </_right>
      </_container>
    </_header>
  );
});

export default Header;

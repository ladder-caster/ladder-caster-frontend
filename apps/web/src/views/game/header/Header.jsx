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
import { IconResource2IMG } from 'design/icons/resource2.icon';
import { IconResource3IMG } from 'design/icons/resource3.icon';
import { IconResourcee1IMG } from 'design/icons/resourcee1.icon';
import { IconMoneyIMG } from 'design/icons/money.icon';
import { useMesh } from 'core/state/mesh/useMesh';
import {
  GAME_INIT,
  GAME_RESOURCES,
  TYPE_RES3,
  TYPE_RES1,
  TYPE_RES2,
  GAME_CONSTANTS,
} from 'core/mesh/state';
import { useActions } from 'web/actions';
import Counter from '../../../shared/counter/Counter';
import usePrevious from 'core/hooks/usePrevious';
import { CHAIN_CASTERS } from 'chain/hooks/state';
import { useTranslation } from 'react-i18next';
import Timer from './timer/Timer';

const Header = withTheme(({ theme }) => {
  const { t } = useTranslation();
  const { drawerTokens } = useActions();
  const [casters] = useMesh(CHAIN_CASTERS);
  const [resources] = useMesh(GAME_RESOURCES);
  const [gameConstants] = useMesh(GAME_CONSTANTS);
  const [initialized] = useMesh(GAME_INIT);

  const prevGold = usePrevious(+resources?.lada || 0);
  const prevFire = usePrevious(+resources?.[TYPE_RES1] || 0);
  const prevWater = usePrevious(+resources?.[TYPE_RES2] || 0);
  const prevEarth = usePrevious(+resources?.[TYPE_RES3] || 0);

  const TurnTitle = useMemo(() => {
    return gameConstants?.gameState?.turnInfo?.turn ? (
      <_controls>
        <_speed>
          {t('header.day')}{' '}
          {!isNaN(gameConstants?.gameState?.turnInfo?.turn)
            ? gameConstants?.gameState?.turnInfo?.turn
            : ''}
        </_speed>
      </_controls>
    ) : null;
  }, [gameConstants?.gameState?.turnInfo?.turn, casters?.length, initialized]);

  return (
    <_header>
      <_container>
        <_left onClick={() => false && drawerTokens()}>
          <_coin>
            <_icon $background={theme.element['legendary']}>
              <IconMoneyIMG />
            </_icon>
            <Counter from={prevGold} to={+resources?.lada} />
          </_coin>
          <_coin>
            <_icon $background={theme.element[TYPE_RES2]}>
              <IconResource2IMG />
            </_icon>
            <Counter from={prevWater} to={+resources?.[TYPE_RES2]} />
          </_coin>
          <_coin>
            <_icon $background={theme.element[TYPE_RES1]}>
              <IconResourcee1IMG />
            </_icon>
            <Counter from={prevFire} to={+resources?.[TYPE_RES1]} />
          </_coin>
          <_coin>
            <_icon $background={theme.element[TYPE_RES3]}>
              <IconResource3IMG />
            </_icon>
            <Counter from={prevEarth} to={+resources?.[TYPE_RES3]} />
          </_coin>
        </_left>
        <_right>
          {TurnTitle}
          <Timer />
        </_right>
      </_container>
    </_header>
  );
});

export default Header;

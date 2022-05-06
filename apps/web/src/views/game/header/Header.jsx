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
import { useRemix } from 'core/hooks/remix/useRemix';
import {
  DEMO_MODE,
  GAME_INIT,
  GAME_RESOURCES,
  TYPE_RES3,
  TYPE_RES1,
  TYPE_RES2,
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

  const prevGold = usePrevious(+resources?.lada || 0);
  const prevResource1 = usePrevious(+resources?.resource1 || 0);
  const prevResource2 = usePrevious(+resources?.resource2 || 0);
  const prevResource3 = usePrevious(+resources?.resource3 || 0);

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
            <_icon $background={theme.element[TYPE_RES2]}>
              <IconResource2IMG />
            </_icon>
            <Counter from={prevResource2} to={+resources?.resource2} />
          </_coin>
          <_coin>
            <_icon $background={theme.element[TYPE_RES1]}>
              <IconResourcee1IMG />
            </_icon>
            <Counter from={prevResource1} to={+resources?.resource1} />
          </_coin>
          <_coin>
            <_icon $background={theme.element[TYPE_RES3]}>
              <IconResource3IMG />
            </_icon>
            <Counter from={prevResource3} to={+resources?.resource3} />
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

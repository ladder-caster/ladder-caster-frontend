import React, { useMemo } from 'react';
import {
  _staking,
  _close,
  _float,
  _icon,
  _title,
  _breakpoint,
  _card_container,
  _card,
  _card_icon,
  _card_text,
  _card_group,
} from './StakingDrawer.styled.js';
import { AnimateButton } from '../button/animations/AnimateButton';
import { IconClose } from 'design/icons/close.icon';
import { _header } from '../settings/SettingsDrawer.styled';
import { useRemix } from 'core/hooks/remix/useRemix';
import { VIEW_SIZE } from 'core/remix/state';
import { useTranslation } from 'react-i18next';
import { useActions } from '../../../actions';
import { IconLock } from 'design/icons/lock.icon.js';
const StakingDrawer = () => {
  const { t } = useTranslation();
  const [view_height] = useRemix(VIEW_SIZE);
  const { closeDrawer } = useActions();
  const stakeClick = () => {};
  //TODO: get staking% from solana-stake-monitor
  const stakingCards = useMemo(() => {
    return [...Array(3).keys()].map((card) => {
      return (
        <_card key={card} onClick={stakeClick}>
          <_card_text>
            {t('drawer.staking.earn', {
              percentage: Math.floor(Math.random() * 100),
            })}
          </_card_text>
          <_card_text>
            {t('drawer.staking.earn.type', { type: 'LADA' })}
          </_card_text>
          <_card_group>
            <_card_icon>
              <IconLock />
            </_card_icon>
            <_card_text>
              {t('drawer.staking.earn.duration', {
                duration: Math.floor(Math.random() * 365),
              })}
            </_card_text>
          </_card_group>
        </_card>
      );
    });
  }, []);
  return (
    <_staking $height={view_height}>
      <_header>
        <_title>{t('drawer.staking.title')}</_title>
        <_float>
          <_close>
            <AnimateButton high>
              <_icon onClick={() => closeDrawer()}>
                <IconClose />
              </_icon>
            </AnimateButton>
          </_close>
        </_float>
      </_header>
      <_breakpoint />
      <_card_container>{stakingCards}</_card_container>
      <_breakpoint />
      <_title>{t('drawer.staking.pfp.title')}</_title>
      <_card_container></_card_container>
    </_staking>
  );
};

export default StakingDrawer;

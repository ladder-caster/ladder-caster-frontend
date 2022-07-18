import React, { useMemo, useState } from 'react';
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
  _description,
  _sub_title,
  _column,
  _header,
  _clear_selection_icon,
  _staking_container,
  _stake_section_title,
  _faded_breakpoint,
  _input,
  _input_container,
  _error,
  _row,
  _percentage_cube,
  _stake_lada_button,
  _stake_section_input_icon,
  _current_stake_text,
  _warning_text,
} from './StakingDrawer.styled.js';
import { AnimateButton } from '../button/animations/AnimateButton';
import { IconClose } from 'design/icons/close.icon';

import { useRemix } from 'core/hooks/remix/useRemix';
import { GAME_CONSTANTS, STAKING, VIEW_SIZE } from 'core/remix/state';
import { useTranslation } from 'react-i18next';
import { useActions } from '../../../actions';
import { IconLock } from 'design/icons/lock.icon.js';
import { IconChevronLeft } from 'design/icons/chevron-left.icon';

import { clamp } from 'lodash';
import { gameConstantsContext } from '../../../../libs/sdk/src/program';
import { IconMoneyIMG } from 'design/icons/money.icon.js';

// eslint-disable-next-line react/prop-types
const StakingCard = ({
  apy,
  type,
  duration,
  onClick,
  hideLock,
  tierSelected,
}) => {
  return (
    <_card onClick={onClick} $selected={tierSelected}>
      <_card_text>{apy}</_card_text>
      <_card_text $fontSize={'16px'}>{type}</_card_text>
      <_card_group>
        {!hideLock && (
          <_card_icon>
            <IconLock />
          </_card_icon>
        )}
        <_card_text>{duration}</_card_text>
      </_card_group>
    </_card>
  );
};
const ENUM = {
  BASE: 0,
  STAKE: 1,
  WARNING: 2,
};
const StakingDrawer = () => {
  const { t } = useTranslation();
  const [view_height] = useRemix(VIEW_SIZE);
  const [stakingContext] = useRemix(STAKING);
  const [gameConstants] = useRemix(GAME_CONSTANTS);
  const [currentTier, setCurrentTier] = useState(0);
  const [stakeType, setStakeType] = useState('lada'); // potential cross app staking or sponsor for season staking?
  const [currentStakedAmount, setCurrentStakedAmount] = useState(0);
  const [stakeAmount, setStakeAmount] = useState('');
  const [renderStateMachine, setRenderStateMachine] = useState({
    state: ENUM.BASE,
    type: null,
  });
  const stakeData = useMemo(() => {
    return stakingContext?.getStakeData();
  }, [stakingContext]);
  const error = useMemo(() => {
    const value = parseFloat(stakeAmount);
    if ((isNaN(value) && stakeAmount !== '') || value <= 0) {
      return (
        <_error>
          {t('drawer.staking.earn.error.small', { amount: value.toFixed(2) })}
        </_error>
      );
    } else if (value > gameConstants?.ladaBalance) {
      return (
        <_error>
          {t('drawer.staking.earn.error.balance', {
            amount: value.toFixed(2),
            balance: gameConstants?.ladaBalance.toFixed(2) ?? 0,
          })}
        </_error>
      );
    }
  }, [stakeAmount]);
  const { closeDrawer } = useActions();
  const stakeClick = (tier) => {
    if (currentTier === tier) {
      setCurrentTier(0);
      return;
    }
    //if (!stakingContext) return;
    //stakingContext.stakeLADANoLock(amount, tier);
    setCurrentTier(tier);
    const item = stakeData?.staked?.find((item) => item.tier === tier);
    const amount = parseInt(item?.amount);
    setCurrentStakedAmount(isNaN(amount) ? -1 : amount);
  };
  /**
   * Stakes tokens for a certain period of time
   * @param {number} amount amount of the token to stake
   * @param {number} tier number signifying tier 1-x
   * @param {string} type string type - not currently in use
   */
  const performStakeUnstake = (callback) => {
    //TYPE added incase future addition of staking cross app tokens :)

    const amount = parseFloat(stakeAmount);
    const tier = parseInt(currentTier);
    if (!stakingContext || isNaN(amount) || amount <= 0 || isNaN(tier)) return;

    callback(amount, tier);
  };
  const stake = (amount, tier) => {
    stakingContext.stakeLADANoLock(amount, tier);
    setStakeAmount('');
    setCurrentTier(0);
    setRenderStateMachine({ state: ENUM.base, type: null });
  };
  const unstake = (amount, tier) => {
    stakingContext.unstakeLADANoLock(amount, tier);
    setStakeAmount('');
    setCurrentTier(0);
    setRenderStateMachine({ state: ENUM.base, type: null });
  };
  const buyTwinPack = () => {
    window.open('https://magiceden.io/marketplace/ladder_caster_season_1');
  };
  const stakingCards = useMemo(() => {
    return stakeData?.stakes?.map((card) => {
      const extra =
        card?.duration == '0'
          ? {
              hideLock: true,
              duration: t('drawer.staking.earn.duration.flexible'),
            }
          : {
              duration: t('drawer.staking.earn.duration', {
                duration: card?.duration ?? 'TBD',
              }),
            };
      return (
        <StakingCard
          key={card.apy + card.duration + card.type}
          apy={t('drawer.staking.earn', {
            percentage: card?.apy ?? '0',
          })}
          type={t('drawer.staking.earn.type', { type: 'LADA' })}
          onClick={() => {
            stakeClick(card?.tier ?? 0);
            setRenderStateMachine({ state: ENUM.STAKE, type: null });
          }}
          tierSelected={currentTier == card?.tier}
          {...extra}
        />
      );
    });
  }, [currentTier, stakeData?.stakes]);
  const handleStakeValueChange = (e) => {
    setStakeAmount(e.target.value);
  };
  const renderSegment = useMemo(() => {
    let segment = '';
    switch (renderStateMachine.state) {
      case ENUM.BASE:
        segment = (
          <_staking>
            <_header $padding={'8px 0 0 0'}>
              <_column>
                <_title>{t('drawer.staking.pfp.title')}</_title>
                <_sub_title>{t('drawer.staking.pfp.description')}</_sub_title>
              </_column>
            </_header>

            <_card_container
              $justify={'start'}
              $align={'start'}
              $margin={'12px 0 0 16px'}
            >
              <StakingCard
                type={t('drawer.staking.pfp.getTwinPack')}
                hideLock
                onClick={buyTwinPack}
              />
            </_card_container>
          </_staking>
        );
        break;
      case ENUM.STAKE:
        segment = (
          <_staking>
            <_header $padding={'0 0 12px 0'}>
              <_clear_selection_icon
                onClick={() => {
                  setCurrentTier(0);
                  setRenderStateMachine({ state: ENUM.BASE, type: null });
                }}
              >
                <IconChevronLeft />
              </_clear_selection_icon>
              <_stake_section_title>
                {t('drawer.staking.earn.title', {
                  type: stakeType.toUpperCase(),
                })}
              </_stake_section_title>
            </_header>

            <_input_container>
              <_stake_section_input_icon>
                <IconMoneyIMG />
              </_stake_section_input_icon>
              <_input
                placeholder={'1'}
                value={stakeAmount}
                onChange={handleStakeValueChange}
              />
            </_input_container>
            <_row $margin={'8px 0 8px 0'} $justifyContent={'flex-start'}>
              <_current_stake_text>
                {t('drawer.staking.earn.staked', {
                  amount:
                    currentStakedAmount > 0 ? currentStakedAmount : 'Nothing',
                })}
              </_current_stake_text>
            </_row>

            <_row $gap={'12px'}>
              <_percentage_cube
                onClick={() =>
                  setStakeAmount(gameConstants?.ladaBalance * 0.25 ?? 0)
                }
              >
                {t('drawer.staking.earn.quickactions.25%')}
              </_percentage_cube>
              <_percentage_cube
                onClick={() =>
                  setStakeAmount(gameConstants?.ladaBalance * 0.5 ?? 0)
                }
              >
                {t('drawer.staking.earn.quickactions.50%')}
              </_percentage_cube>
              <_percentage_cube
                onClick={() =>
                  setStakeAmount(gameConstants?.ladaBalance * 0.75 ?? 0)
                }
              >
                {t('drawer.staking.earn.quickactions.75%')}
              </_percentage_cube>
              <_percentage_cube
                onClick={() => setStakeAmount(gameConstants?.ladaBalance ?? 0)}
              >
                {t('drawer.staking.earn.quickactions.max')}
              </_percentage_cube>
            </_row>

            <_row $margin={'24px 0 0 0 '} $justifyContent="space-around">
              <_stake_lada_button
                $isStake
                onClick={() =>
                  setRenderStateMachine({ state: ENUM.WARNING, type: 'stake' })
                }
                $disabled={
                  stakeAmount <= 0 ||
                  parseFloat(stakeAmount) > gameConstants?.ladaBalance
                }
              >
                {t(`drawer.staking.stake`)}
              </_stake_lada_button>
              <_stake_lada_button
                onClick={() =>
                  setRenderStateMachine({
                    state: ENUM.WARNING,
                    type: 'unstake',
                  })
                }
                $disabled={
                  stakeAmount <= 0 ||
                  parseFloat(stakeAmount) > currentStakedAmount
                }
              >
                {t(`drawer.staking.unstake`)}
              </_stake_lada_button>
            </_row>
            <_row>{error}</_row>
          </_staking>
        );
        break;
      case ENUM.WARNING:
        {
          const isStake = renderStateMachine.type == 'stake';
          const obj = {
            amount: parseFloat(stakeAmount).toFixed(2),
            date: stakeData?.stakeEndDate ?? 'TBD',
          };
          const warningText = isStake
            ? t('drawer.staking.earn.warning.stake', obj)
            : t('drawer.staking.earn.warning.unstake', obj);
          const tierString =
            currentTier == 1
              ? 'Flexible Stake'
              : (currentTier == 2 && '3 Month Stake') ?? '12 Month Stake';
          segment = (
            <_staking>
              <_header $padding={'0 0 12px 0'}>
                <_clear_selection_icon
                  onClick={() =>
                    setRenderStateMachine({ state: ENUM.STAKE, type: null })
                  }
                >
                  <IconChevronLeft />
                </_clear_selection_icon>
                <_stake_section_title>
                  {t(`drawer.staking.warning.title`, {
                    type: tierString,
                  })}
                </_stake_section_title>
              </_header>
              <_row $margin={'8px 0 8px 0'}>
                <_warning_text $isUpper>
                  {t('drawer.staking.earn.warning.confirmation', {
                    type: isStake ? 'stake' : 'unstake',
                    amount: obj.amount,
                  })}
                </_warning_text>
              </_row>
              <_row $margin={'8px 0 8px 0'}>
                <_warning_text>{warningText}</_warning_text>
              </_row>

              <_row $margin={'8px 0 0 0'}>
                <_stake_lada_button
                  $isStake={isStake}
                  onClick={() => performStakeUnstake(isStake ? stake : unstake)}
                >
                  {t(`drawer.staking.${renderStateMachine.type}`)}
                </_stake_lada_button>
              </_row>
            </_staking>
          );
        }
        break;
    }
    return (
      <_staking $padding="8px 0 0 0">
        <_card_container>{stakingCards}</_card_container>
        <_description>
          {t('drawer.staking.earn.rate.description', {
            date: stakeData?.stakeEndDate ?? 'TBD',
          })}
        </_description>
        <_faded_breakpoint />
        {segment}
      </_staking>
    );
  }, [currentTier, stakeAmount, stakingCards, renderStateMachine]);
  return (
    <_staking_container $height={view_height}>
      <_header $padding={'16px 0 0 0'}>
        <_column>
          <_title>{t('drawer.staking.title')}</_title>
          <_sub_title>{t('drawer.staking.description')}</_sub_title>
          <_breakpoint />
        </_column>
        <_float>
          <_close $marginBottom={'56px'}>
            <AnimateButton high>
              <_icon onClick={() => closeDrawer()}>
                <IconClose />
              </_icon>
            </AnimateButton>
          </_close>
        </_float>
      </_header>

      {renderSegment}
    </_staking_container>
  );
};

export default StakingDrawer;

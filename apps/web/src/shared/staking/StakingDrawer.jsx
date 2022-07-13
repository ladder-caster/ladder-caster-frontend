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
} from './StakingDrawer.styled.js';
import { AnimateButton } from '../button/animations/AnimateButton';
import { IconClose } from 'design/icons/close.icon';
import { _header } from '../settings/SettingsDrawer.styled';
import { useRemix } from 'core/hooks/remix/useRemix';
import { STAKING, VIEW_SIZE } from 'core/remix/state';
import { useTranslation } from 'react-i18next';
import { useActions } from '../../../actions';
import { IconLock } from 'design/icons/lock.icon.js';
import {
  _form,
  _row,
  _section,
  _input,
  _float as _stake_float,
  _dropdown,
} from '../trade/tabs/swap/SwapTab.styled.js';
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
const StakingDrawer = () => {
  const { t } = useTranslation();
  const [view_height] = useRemix(VIEW_SIZE);
  const [stakingContext] = useRemix(STAKING);
  const [currentTier, setCurrentTier] = useState(0);
  const [stakeType, setStakeType] = useState('lada');
  const { closeDrawer } = useActions();
  const stakeClick = (tier) => {
    if (currentTier === tier) {
      setCurrentTier(0);
      return;
    }
    //if (!stakingContext) return;
    //stakingContext.stakeLADANoLock(amount, tier);
    setCurrentTier(tier);
  };
  /**
   * Stakes tokens for a certain period of time
   * @param {number} amount amount of the token to stake
   * @param {number} tier number signifying tier 1-x
   * @param {string} type string type - not currently in use
   */
  const stake = (amount, tier, type) => {
    //TYPE added incase future addition of staking cross app tokens :)
    if (!stakingContext) return;
    stakingContext.stakeLADANoLock(amount, tier, type);
  };
  const buyTwinPack = () => {
    window.open('https://magiceden.io/marketplace/ladder_caster_season_1');
  };
  const stakingCards = useMemo(() => {
    const cards = [...Array(2).keys()].map((card) => {
      return (
        <StakingCard
          key={card}
          apy={t('drawer.staking.earn', {
            percentage: Math.floor(Math.random() * 100),
          })}
          type={t('drawer.staking.earn.type', { type: 'LADA' })}
          duration={t('drawer.staking.earn.duration', {
            duration: Math.floor(Math.random() * 365),
          })}
          onClick={() => stakeClick(card + 2)}
          tierSelected={currentTier == card + 2}
        />
      );
    });
    cards.unshift(
      <StakingCard
        key={3}
        apy={t('drawer.staking.earn', {
          percentage: Math.floor(Math.random() * 100),
        })}
        type={t('drawer.staking.earn.type', { type: 'LADA' })}
        duration={t('drawer.staking.earn.duration.flexible')}
        onClick={() => stakeClick(1)}
        hideLock
        tierSelected={currentTier == 1}
      />,
    );
    return cards;
  }, [currentTier]);
  const renderSegment = useMemo(() => {
    return (
      <>
        <_card_container>{stakingCards}</_card_container>
        <_description>
          {t('drawer.staking.earn.rate.description', {
            date: 'October 31st, 2022',
          })}
        </_description>
        <_breakpoint />
        {currentTier == 0 ? (
          <>
            <_title>{t('drawer.staking.pfp.title')}</_title>
            <_card_container
              $justify={'start'}
              $align={'start'}
              $margin={'12px 0 0 0'}
            >
              <StakingCard type={t('coming.soon')} hideLock />
              <StakingCard
                type={t('drawer.staking.pfp.getTwinPack')}
                hideLock
                onClick={buyTwinPack}
              />
            </_card_container>
          </>
        ) : (
          <_staking>
            <_title>
              {t('drawer.staking.earn.title', {
                type: stakeType.toUpperCase(),
              })}
            </_title>
            <_form>
              <_row>
                <_section>
                  <_input>
                    <_stake_float>
                      <_dropdown></_dropdown>
                    </_stake_float>
                  </_input>
                </_section>
              </_row>
            </_form>
          </_staking>
        )}
      </>
    );
  }, [currentTier]);
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
      {renderSegment}
    </_staking>
  );
};

export default StakingDrawer;

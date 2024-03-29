import React, { useMemo, useState, useEffect } from 'react';
import {
  _queue,
  _action,
  _icon,
  _float,
  _lock,
  _title,
  _actions,
  _claim,
} from './Queue.styled';
import { useTranslation } from 'react-i18next';
import { useActions } from '../../../../../../actions';
import {
  GAME_MAP,
  GAME_SPELLCASTERS,
  TYPE_CRAFT,
  TYPE_LEGENDARY,
  TYPE_RES3,
  TYPE_RES1,
  TYPE_RES2,
  GAME_INVENTORY,
} from 'core/mesh/state';
import { useMesh } from 'core/state/mesh/useMesh';
import { find } from 'lodash';
import { AnimateButton } from '../../../../../shared/button/animations/AnimateButton';
import { IconBook } from 'design/icons/book.icon';
import { IconMove } from 'design/icons/move.icon';
import { IconAnvil } from 'design/icons/anvil.icon';
import { IconTreasure } from 'design/icons/treasure.icon';
import { IconResourcee1 } from 'design/icons/resourcee1.icon';
import { IconResource2 } from 'design/icons/resource2.icon';
import { IconResource3 } from 'design/icons/resource3.icon';
import { IconLock } from 'design/icons/lock.icon';
import { AnimatePresence } from 'framer-motion';
import { AnimateLock } from '../animations/AnimateLock';
import { CHAIN_GAME } from 'chain/hooks/state';
import { AnimateRewards } from '../../../animations/AnimateRewards';
import Attributes from '../../../../../shared/attributes/Attributes';

const Queue = ({ spell_id }) => {
  const [clicked, setClicked] = useState('');
  const {
    modalMove,
    modalSpell,
    lootResources,
    drawerCraft,
    redeemReward,
  } = useActions();
  const [spellcasters] = useMesh(GAME_SPELLCASTERS);
  const [game] = useMesh(CHAIN_GAME);
  const [inventory] = useMesh(GAME_INVENTORY);
  const { t } = useTranslation();
  const caster = useMemo(
    () => find(spellcasters, (caster) => caster?.id === spell_id && caster),
    [spellcasters, spellcasters?.length],
  );
  const currentTurn = game?.turnInfo?.turn;
  const position = caster?.position;
  const searchPosition =
    caster?.casterActionPosition && !caster?.isLootActionBefore
      ? caster?.casterActionPosition
      : position;
  const [tile] = useMesh(
    GAME_MAP,
    (rows) =>
      find(rows, (row) => row?.level + 1 === +searchPosition?.slice(1))?.[
        searchPosition?.[0]
      ],
  );
  const next_level = caster?.casterActionPosition
    ? +caster?.casterActionPosition?.slice(
        1,
        caster?.casterActionPosition?.length,
      )
    : +caster?.position?.slice(1, caster?.position?.length);
  const caster_tile = +caster?.level === next_level;

  const unlocked_loot = caster?.last_loot < currentTurn;
  const unlocked_craft = caster?.last_craft < currentTurn;
  const unlocked_spell =
    (caster?.last_spell ||
      inventory?.items?.find((item) => item.type === 'spellBook')) &&
    caster?.last_spell < currentTurn &&
    !(
      caster?.last_move >= currentTurn ||
      caster?.last_loot >= currentTurn ||
      caster?.last_craft >= currentTurn
    );
  const unlocked_move = caster?.last_move < currentTurn;

  const element = tile?.type;

  const IconElement = {
    [TYPE_RES1]: IconResourcee1,
    [TYPE_RES2]: IconResource2,
    [TYPE_RES3]: IconResource3,
    [TYPE_CRAFT]: IconAnvil,
    [TYPE_LEGENDARY]: IconTreasure,
  }[element];

  const PositionMemo = useMemo(() => {
    if (position) {
      return caster?.casterActionPosition
        ? () => <b>{` ${caster?.casterActionPosition?.toUpperCase()}`}</b>
        : () => <b>{` ${position.toUpperCase()}`}</b>;
    }
    return () => null;
  }, [position, caster?.casterActionPosition, caster_tile]);

  useEffect(() => {
    let timeout;
    if (clicked) {
      timeout = setTimeout(() => {
        setClicked('');
      }, 250);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [clicked]);

  const needsToRedeem = useMemo(() => {
    const turnCommitTurn = caster?.turnCommit;

    return turnCommitTurn < currentTurn;
  }, [caster?.turnCommit, currentTurn]);
  /**
   * Functions to reduce rerenders
   */
  const redeem = () => {
    redeemReward(caster);
  };
  const craft = () => {
    !unlocked_craft ? setClicked('craft') : drawerCraft(caster);
  };
  const loot = () => {
    !unlocked_loot ? setClicked('loot') : lootResources(caster);
  };
  const move = () => {
    !unlocked_move ? setClicked('move') : modalMove(caster);
  };
  const spell = () => {
    !unlocked_spell ? setClicked('spell') : modalSpell(caster);
  };

  const render = useMemo(() => {
    if (needsToRedeem) {
      return (
        <_claim $element={TYPE_LEGENDARY} onClick={redeem}>
          {t('spellcasters.claim')}
        </_claim>
      );
    } else if (element === TYPE_CRAFT || element === TYPE_LEGENDARY) {
      return (
        <_action onClick={craft} $element={element} $low>
          <_icon $element={element}>
            {!!IconElement ? <IconElement /> : undefined}
            <span>{t('spellcaster.action.craft')}</span>
          </_icon>
          <_float>
            {!unlocked_craft && (
              <_lock $element={element}>
                <IconLock />
              </_lock>
            )}
          </_float>
        </_action>
      );
    } else {
      return (
        <_action onClick={loot} $element={element} $low>
          <_icon $element={element}>
            {!!IconElement ? <IconElement /> : undefined}
            <span>{t('spellcaster.action.loot')}</span>
          </_icon>
          <_float>
            {!unlocked_loot && (
              <_lock $element={element}>
                <IconLock />
              </_lock>
            )}
          </_float>
        </_action>
      );
    }
  }, [
    needsToRedeem,
    unlocked_loot,
    unlocked_craft,
    IconElement,
    element,
    clicked,
  ]);
  const renderSecondary = useMemo(() => {
    if (!needsToRedeem) {
      return (
        <>
          {' '}
          <_action onClick={move}>
            <_icon $basic>
              <IconMove />
              <span>{t('spellcaster.action.move')}</span>
            </_icon>
            <_float>
              {!unlocked_move && (
                <_lock $basic>
                  <IconLock />
                </_lock>
              )}
            </_float>
          </_action>
          <_action onClick={spell}>
            <_icon $basic>
              <IconBook />
              <span>{t('spellcaster.action.spell')}</span>
            </_icon>
            <_float>
              {!unlocked_spell && (
                <_lock $basic>
                  <IconLock />
                </_lock>
              )}
            </_float>
          </_action>
        </>
      );
    }
  }, [needsToRedeem, unlocked_move, unlocked_spell, clicked]);
  return (
    <_queue>
      <_title $optimal={caster_tile}>
        {t('spellcasters.actions')}
        <Attributes caster={caster} />
        <PositionMemo />
      </_title>
      <_actions>
        {render}
        {renderSecondary}
      </_actions>
    </_queue>
  );
};

export default Queue;

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
  DEMO_MODE,
  DRAWER_ACTIVE,
  GAME_MAP,
  GAME_SPELLCASTERS,
  TYPE_CRAFT,
  TYPE_LEGENDARY,
  TYPE_RES3,
  TYPE_RES1,
  TYPE_RES2,
  PHASE_ACTIONS,
  USER_PHASE,
  GAME_INVENTORY,
} from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';
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
    actionLoot,
    modalCraft,
    actionRedeem,
  } = useActions();
  const [spellcasters] = useRemix(GAME_SPELLCASTERS);
  const [game] = useRemix(CHAIN_GAME);
  const [inventory] = useRemix(GAME_INVENTORY);
  const { t } = useTranslation();
  const caster = useMemo(
    () => find(spellcasters, (caster) => caster?.id === spell_id && caster),
    [spellcasters, spellcasters?.length],
  );
  const currentTurn = game?.turnInfo?.turn;
  const [num_ticks] = useRemix(DEMO_MODE, (demo) => demo.num_ticks);
  const position = caster?.position;
  const searchPosition =
    caster?.casterActionPosition && !caster?.isLootActionBefore
      ? caster?.casterActionPosition
      : position;
  const [tile] = useRemix(
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

  const unlocked_loot = caster?.last_loot < (num_ticks || currentTurn);
  const unlocked_craft = caster?.last_craft < (num_ticks || currentTurn);
  const unlocked_spell =
    (caster?.last_spell ||
      inventory?.items?.find((item) => item.type === 'spellBook')) &&
    caster?.last_spell < (num_ticks || currentTurn) &&
    !(
      caster?.last_move >= (num_ticks || currentTurn) ||
      caster?.last_loot >= (num_ticks || currentTurn) ||
      caster?.last_craft >= (num_ticks || currentTurn)
    );
  const unlocked_move = caster?.last_move < (num_ticks || currentTurn);

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
  }, [caster?.turnCommit?.turn, game?.turnInfo?.turn]);
  /**
   * Functions to reduce rerenders
   */
  const redeem = () => {
    actionRedeem(caster);
  };
  const craft = () => {
    !unlocked_craft ? setClicked('craft') : modalCraft(caster);
  };
  const loot = () => {
    !unlocked_loot ? setClicked('loot') : actionLoot(caster);
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
        <AnimateRewards element={TYPE_LEGENDARY}>
          <_claim onClick={redeem}>{t('spellcasters.claim')}</_claim>
        </AnimateRewards>
      );
    } else if (element === TYPE_CRAFT || element === TYPE_LEGENDARY) {
      return (
        <AnimateButton
          low
          shake={clicked === 'craft' && !unlocked_craft}
          element={element}
        >
          <_action onClick={craft}>
            <_icon $element={element}>
              {!!IconElement ? <IconElement /> : undefined}
              <span>{t('spellcaster.action.craft')}</span>
            </_icon>
            <_float>
              <AnimatePresence>
                {!unlocked_craft && (
                  <AnimateLock key={'animate-lock-craft'}>
                    <_lock $element={element}>
                      <IconLock />
                    </_lock>
                  </AnimateLock>
                )}
              </AnimatePresence>
            </_float>
          </_action>
        </AnimateButton>
      );
    } else {
      return (
        <AnimateButton
          low
          shake={clicked === 'loot' && !unlocked_loot}
          element={element}
        >
          <_action onClick={loot}>
            <_icon $element={element}>
              {!!IconElement ? <IconElement /> : undefined}
              <span>{t('spellcaster.action.loot')}</span>
            </_icon>
            <_float>
              <AnimatePresence>
                {!unlocked_loot && (
                  <AnimateLock key={'animate-lock-loot'}>
                    <_lock $element={element}>
                      <IconLock />
                    </_lock>
                  </AnimateLock>
                )}
              </AnimatePresence>
            </_float>
          </_action>
        </AnimateButton>
      );
    }
  }, [needsToRedeem]);
  const renderSecondary = useMemo(() => {
    if (!needsToRedeem) {
      return (
        <>
          {' '}
          <AnimateButton shake={clicked === 'move' && !unlocked_move}>
            <_action onClick={move}>
              <_icon $basic>
                <IconMove />
                <span>{t('spellcaster.action.move')}</span>
              </_icon>
              <_float>
                <AnimatePresence>
                  {!unlocked_move && (
                    <AnimateLock key={'animate-lock-move'}>
                      <_lock $basic>
                        <IconLock />
                      </_lock>
                    </AnimateLock>
                  )}
                </AnimatePresence>
              </_float>
            </_action>
          </AnimateButton>
          <AnimateButton shake={clicked === 'spell' && !unlocked_spell}>
            <_action onClick={spell}>
              <_icon $basic>
                <IconBook />
                <span>{t('spellcaster.action.spell')}</span>
              </_icon>
              <_float>
                <AnimatePresence>
                  {!unlocked_spell && (
                    <AnimateLock key={'animate-lock-spell'}>
                      <_lock $basic>
                        <IconLock />
                      </_lock>
                    </AnimateLock>
                  )}
                </AnimatePresence>
              </_float>
            </_action>
          </AnimateButton>
        </>
      );
    }
  }, [needsToRedeem]);
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

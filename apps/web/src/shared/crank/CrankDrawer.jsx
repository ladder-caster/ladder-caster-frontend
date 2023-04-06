import React, { useState, useEffect, useMemo } from 'react';
import {
  _crank,
  _close,
  _float,
  _header,
  _icon,
  _title,
  _breakpoint,
  _description,
  _countdown,
  _button,
  _timer,
  _bar,
  _fill,
} from './CrankDrawer.styled';
import { AnimateButton } from '../button/animations/AnimateButton';
import { IconClose } from 'design/icons/close.icon';
import { useActions } from '../../../actions';
import { useTranslation } from 'react-i18next';
import { CHAIN_GAME } from 'chain/hooks/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import { useMesh } from 'core/state/mesh/useMesh';
import dayjs from 'dayjs';
import { AnimateFill } from './animations/AnimateFill';
import { AnimateBar } from './animations/AnimateBar';
import {
  GAME_MAP,
  GAME_SPELLCASTERS,
  TYPE_RES3,
  TYPE_RES1,
  TYPE_RES2,
} from 'core/remix/state';
import { map } from 'lodash';

let start = Math.floor(+dayjs() / 1000);
let delay = 0;
let elapsed = 0;
let ended = false;
let remaining = 0;
let position = 0;
let minutes = 0;
let seconds = 0;
let end = '';

const CrankDrawer = () => {
  const { t } = useTranslation();
  const { closeDrawer, nextTurn } = useActions();
  const [game] = useMesh(CHAIN_GAME);
  const [time, setTime] = useState({});
  const [spellcasters] = useRemix(GAME_SPELLCASTERS);
  const [claim, setClaim] = useState(false);
  const [loot, setLoot] = useState(false);
  const [board] = useMesh(GAME_MAP);

  useEffect(() => {
    if (spellcasters) {
      for (let i = 0; i < spellcasters?.length; i++) {
        const caster = spellcasters?.[i];
        const turnCommitTurn = caster?.turnCommit;
        const currentTurn = game?.turnInfo?.turn;
        if (turnCommitTurn < currentTurn) {
          if (!claim) setClaim(true);
        } else if (caster?.last_loot < game?.turnInfo?.turn) {
          const col = caster?.position?.[0];
          const level = +caster?.position?.slice(1);
          map(board, (row) => {
            if (row?.level === level) {
              const tile = row?.[col];
              if (
                caster?.last_loot < game?.turnInfo?.turn &&
                (tile?.type === TYPE_RES2 ||
                  tile?.type === TYPE_RES3 ||
                  tile?.type === TYPE_RES1)
              ) {
                if (!loot) setLoot(true);
              }
            }
          });
        }
        if (claim && loot) break;
      }
    }
  }, [spellcasters, board]);

  useEffect(() => {
    start = game?.turnInfo?.lastCrankSeconds?.toNumber();
    delay = game?.turnInfo?.turnDelay;

    elapsed = Math.floor((+dayjs() - start * 1000) / 1000);
    ended = elapsed >= delay;
    remaining = !ended ? delay - elapsed : 0;
    position = 1 - remaining / delay;

    minutes = Math.floor(remaining / 60);
    seconds = remaining % 60;
    end = t('drawer.turn.ending', { minutes, seconds });
  }, [game, time?.elapsed]);

  useEffect(() => {
    const update = setInterval(() => {
      const next_time = {
        ...time,
        start,
        delay,
        elapsed,
        ended,
        remaining,
        position,
        minutes,
        seconds,
        end,
      };
      setTime(next_time);
    }, 1000);
    return () => clearInterval(update);
  }, []);

  const timer = useMemo(() => {
    return time?.remaining ? (
      <AnimateBar>
        <_bar>
          <AnimateFill
            start={time?.start}
            remaining={time?.remaining}
            position={time?.position}
            delay={time?.delay}
          >
            <_fill />
          </AnimateFill>
        </_bar>
      </AnimateBar>
    ) : null;
  }, [+time?.start, !!time?.remaining]);

  return (
    <_crank>
      <_header>
        <_title>{t('drawer.crank.title')}</_title>
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
      <_description>{t('drawer.turn.description')}</_description>
      <_timer>{timer}</_timer>
      <_countdown>{!ended ? time?.end : t('drawer.turn.ended')}</_countdown>
      <_button disabled={!ended} $disabled={!ended} onClick={() => nextTurn()}>
        {t('drawer.turn.action')}
      </_button>
    </_crank>
  );
};

export default CrankDrawer;

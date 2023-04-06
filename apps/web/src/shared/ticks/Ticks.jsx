import React, { useMemo, useState, useEffect } from 'react';
import { _ticks, _bar, _fill, _loading } from './Ticks.styled';
import { AnimateLoading } from './animations/AnimateLoading';
import {
  GAME_MAP,
  GAME_OPTIONS,
  GAME_SPELLCASTERS,
  PHASE_ACTIONS,
  PHASE_EQUIP,
  PHASE_REWARDS,
  TYPE_RES3,
  TYPE_RES1,
  TYPE_RES2,
  USER_PHASE,
  VIEW_NAVIGATION,
} from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import { useMesh } from 'core/state/mesh/useMesh';
import { nanoid } from 'nanoid';
import usePrevious from 'core/hooks/usePrevious';
import { map } from 'lodash';
import { CHAIN_GAME } from 'chain/hooks/state';

const Ticks = () => {
  const [phase] = useRemix(USER_PHASE);
  const [game] = useMesh(CHAIN_GAME);
  const [options] = useRemix(GAME_OPTIONS);
  const [spellcasters] = useRemix(GAME_SPELLCASTERS);
  const [board] = useMesh(GAME_MAP);
  const [inc, setInc] = useState(0);
  const [lootAll, setLootAll] = useState(false);
  const [view] = useRemix(VIEW_NAVIGATION);
  const loading_bars = options?.bars || 0;

  // TODO: figure out what variable is
  const positions = null;
  const prev_ticks = usePrevious(0);
  const regen_keys = prev_ticks % loading_bars === 2;
  const currentTurn = game?.turnInfo?.turn;

  useEffect(() => {
    if (spellcasters) {
      let looted = 0;
      let max = 0;

      map(spellcasters, (caster) => {
        const col = caster?.position?.[0];
        const row = +caster?.position?.slice(1);
        const tile = board?.[row - 1]?.[col];
        const turnCommitTurn = caster?.turnCommit;
        const isLoot =
          tile?.type === TYPE_RES3 ||
          tile?.type === TYPE_RES1 ||
          tile?.type === TYPE_RES2;
        if (isLoot) {
          max++;
          if (
            caster?.last_loot === currentTurn &&
            turnCommitTurn >= currentTurn
          )
            looted++;
        }
      });

      if (!lootAll && looted && looted === max) setLootAll(true);
      else if (lootAll && looted && looted !== max) setLootAll(false);
    }
  }, [spellcasters, lootAll, view, currentTurn]);

  useEffect(() => {
    if (regen_keys) setInc(inc + 1);
  }, [regen_keys]);

  const instance_key = useMemo(() => nanoid(), []);

  let fill_keys = useMemo(() => {
    let keys = [];
    for (let k = 0; k < loading_bars; k++) {
      keys[k] = nanoid();
    }
    return keys;
  }, [inc]);

  const phase_index = {
    [PHASE_REWARDS]: 0,
    [PHASE_EQUIP]: 1,
    [PHASE_ACTIONS]: 2,
  }[phase];

  const render_bars = useMemo(() => {
    let bars = [];
    for (let k = 0; k < loading_bars; k++) {
      const active = phase_index === k;
      bars[k] = (
        <_loading key={nanoid()}>
          <_bar key={nanoid()}>
            <AnimateLoading position={positions?.[k]}>
              <_fill $lootAll={lootAll} $active={active} key={nanoid()} />
            </AnimateLoading>
          </_bar>
        </_loading>
      );
    }
    return bars;
  }, [loading_bars, positions, fill_keys, phase_index, lootAll, currentTurn]);

  return <_ticks key={instance_key}>{render_bars}</_ticks>;
};

export default Ticks;

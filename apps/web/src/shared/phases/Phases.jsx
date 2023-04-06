import React, { useEffect } from 'react';
import { _phases, _phase } from './Phases.styled';
import { useTranslation } from 'react-i18next';
import { useRemix } from 'core/hooks/remix/useRemix';
import { useMesh } from 'core/state/mesh/useMesh';
import {
  GAME_SPELLCASTERS,
  PHASE_ACTIONS,
  PHASE_EQUIP,
  PHASE_REWARDS,
  USER_PHASE,
} from 'core/remix/state';
import { CHAIN_GAME } from 'chain/hooks/state';

const Phases = () => {
  const { t } = useTranslation();
  const [phase, setPhase] = useRemix(USER_PHASE);
  const [spellcasters] = useRemix(GAME_SPELLCASTERS);
  const [game] = useMesh(CHAIN_GAME);
  const turn = game?.turnInfo?.turn;

  useEffect(() => {
    if (spellcasters && turn) {
      let changed = false;
      for (let i = 0; i < spellcasters.length; i++) {
        const caster = spellcasters[i];
        if (caster?.turnCommit < turn) {
          if (phase !== PHASE_REWARDS) setPhase(PHASE_REWARDS);
          changed = true;
          break;
        }
        if (
          caster?.last_craft === turn ||
          caster?.last_loot === turn ||
          caster?.last_move === turn ||
          caster?.last_spell === turn
        ) {
          changed = true;
          if (phase !== PHASE_ACTIONS) setPhase(PHASE_ACTIONS);
          break;
        }
      }
      if (!changed) {
        if (phase !== PHASE_EQUIP) setPhase(PHASE_EQUIP);
      }
    }
  }, [spellcasters]);

  return (
    <_phases>
      <_phase>
        {phase === PHASE_REWARDS && t('heading.phase.rewards')?.toUpperCase()}
      </_phase>
      <_phase>
        {phase === PHASE_EQUIP && t('heading.phase.equip')?.toUpperCase()}
      </_phase>
      <_phase>
        {phase === PHASE_ACTIONS && t('heading.phase.actions')?.toUpperCase()}
      </_phase>
    </_phases>
  );
};

export default Phases;

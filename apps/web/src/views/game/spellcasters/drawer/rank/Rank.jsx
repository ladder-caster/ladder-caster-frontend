import React, { useState, useEffect } from 'react';
import {
  _rank,
  _tier,
  _name,
  _burn,
  _level,
  _progress,
  _wrapper,
  _loading,
  _icon,
  _close,
  _current,
  _upcoming,
  _remaining,
} from './Rank.styled';
import { useTranslation } from 'react-i18next';
import { useRemix } from 'core/hooks/remix/useRemix';
import { useMesh } from 'core/state/mesh/useMesh';
import { DRAWER_ACTIVE } from 'core/remix/state';
import Progress from './progress/Progress';
import { AnimateButton } from '../../../../../shared/button/animations/AnimateButton';
import { IconClose } from 'design/icons/close.icon';
import { useActions } from '../../../../../../actions';
import { LEVEL_BOUNDS } from 'core/utils/numbers';

const Rank = ({ caster }) => {
  const { t } = useTranslation();
  const [, setDrawer] = useRemix(DRAWER_ACTIVE);
  const { boostXP } = useActions();
  const [rank, setRank] = useState();

  useEffect(() => {
    if (caster) {
      const level = caster?.level || 1;
      const xp = caster?.xp || 0;
      const remaining = LEVEL_BOUNDS[level - 1] - xp;

      setRank({ ...rank, remaining, level });
    }
  }, [caster, caster?.level, caster?.xp]);

  return (
    <_rank>
      <_wrapper $end>
        <_tier>
          <_name>{t('drawer.rank.name')}</_name>
          <_burn>
            <button onClick={() => boostXP(caster)}>
              {t('drawer.rank.burn')}
            </button>
          </_burn>
        </_tier>
      </_wrapper>
      <_wrapper $full>
        <_level>
          <_remaining>
            <span>
              {rank?.remaining &&
                `${rank?.remaining} ${t('drawer.rank.next.level')}`}
            </span>
          </_remaining>
          <_loading>
            <Progress caster={caster} />
          </_loading>
          <_progress>
            <_current>{`${t('drawer.rank.level')} ${rank?.level}`}</_current>
            <_upcoming>{`${t('drawer.rank.level')} ${
              rank?.level + 1
            }`}</_upcoming>
          </_progress>
        </_level>
        <_close>
          <AnimateButton high>
            <_icon onClick={() => setDrawer('')}>
              <IconClose />
            </_icon>
          </AnimateButton>
        </_close>
      </_wrapper>
    </_rank>
  );
};

export default Rank;

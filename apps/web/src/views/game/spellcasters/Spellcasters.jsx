import React, { useMemo, useState, useEffect } from 'react';
import { _spellcasters, _list, _button } from './Spellcasters.styled';
import Item from './item/Item';
import { useTranslation } from 'react-i18next';
import {
  GAME_INIT,
  GAME_OLD_SPELLCASTERS,
  GAME_SPELLCASTERS,
  SPELLCASTER_BUY,
  USER_PHASE,
  PRESTIGE_HIDE,
  GAME_CONSTANTS,
} from 'core/remix/state';
import { _feed } from '../home/Dashboard.styled';
import { useRemix } from 'core/hooks/remix/useRemix';
import { nanoid } from 'nanoid';
import Heading from '../../../shared/heading/Heading';
import { sortBy } from 'lodash';
import { Onboarding } from '../home/onboarding/Onboarding';
import { CHAIN_CASTERS } from 'chain/hooks/state';
import { useActions } from '../../../../actions';

const Spellcasters = () => {
  const { t } = useTranslation();
  const [casters] = useRemix(CHAIN_CASTERS);
  const [spellcasters] = useRemix(GAME_SPELLCASTERS);
  const [oldSpellcasters] = useRemix(GAME_OLD_SPELLCASTERS);
  const [gameConstants] = useRemix(GAME_CONSTANTS);
  const [phase] = useRemix(USER_PHASE);
  const { lootAllResources } = useActions();
  const [hidePrestige, setPrestige] = useState(
    localStorage.getItem('hide_prestige') === 'true',
  );
  useEffect(() => {
    setPrestige(localStorage.getItem('hide_prestige') === 'true');
  }, [localStorage.getItem('hide_prestige')]);
  const render_spellcasters = useMemo(() => {
    if (spellcasters && spellcasters.length >= 1) {
      return sortBy(spellcasters, (sort) => sort?.hue).map((caster) => (
        <Item key={caster?.publicKey} spell_id={caster.id} />
      ));
    }
  }, [spellcasters]);

  const render_old_spellcasters = useMemo(() => {
    if (oldSpellcasters && oldSpellcasters.length >= 1) {
      return sortBy(oldSpellcasters, (sort) => sort?.hue).map((caster) => (
        <Item key={caster?.publicKey} spell_id={caster.id} isOld />
      ));
    }
  }, [oldSpellcasters]);
  const render = useMemo(() => {
    if (
      gameConstants?.gameState &&
      (phase || casters?.length > 0 || oldSpellcasters?.length > 0)
    ) {
      return (
        <_list>
          {render_spellcasters}
          <Item key={SPELLCASTER_BUY} spell_id={SPELLCASTER_BUY} />
          <Item key={PRESTIGE_HIDE} spell_id={PRESTIGE_HIDE} isPrestigeHide />
          {!hidePrestige && render_old_spellcasters}
        </_list>
      );
    }
    return (
      <_feed>
        <Onboarding />
      </_feed>
    );
  }, [gameConstants?.gameState, spellcasters, oldSpellcasters]);
  return (
    <_spellcasters>
      <Heading title={t('title.casters')} />
      {render}
    </_spellcasters>
  );
};

export default Spellcasters;

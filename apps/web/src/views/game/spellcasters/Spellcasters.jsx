import React, { useMemo, useState } from 'react';
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
  const [initialized] = useRemix(GAME_INIT);
  const [phase] = useRemix(USER_PHASE);
  const { lootAllResources } = useActions();
  const render_spellcasters = useMemo(() => {
    if (spellcasters && spellcasters.length >= 1) {
      return sortBy(spellcasters, (sort) => sort?.hue).map((caster) => (
        <Item key={nanoid()} spell_id={caster.id} />
      ));
    }
  }, [spellcasters]);

  const render_old_spellcasters = useMemo(() => {
    const prestige = localStorage.getItem('hide_prestige');
    const show = prestige == undefined ? true : !!prestige;
    if (oldSpellcasters && oldSpellcasters.length >= 1 && show) {
      return sortBy(oldSpellcasters, (sort) => sort?.hue).map((caster) => (
        <Item key={nanoid()} spell_id={caster.id} isOld />
      ));
    }
  }, [oldSpellcasters, localStorage.getItem('hide_prestige')]);
  const render = useMemo(() => {
    if (
      (!initialized || render_spellcasters?.length == 0) &&
      render_old_spellcasters?.length == 0
    ) {
      return (
        <_feed>
          <Onboarding />
        </_feed>
      );
    }
    return (
      <_list>
        {render_spellcasters}
        <Item key={SPELLCASTER_BUY} spell_id={SPELLCASTER_BUY} />
        <Item key={PRESTIGE_HIDE} spell_id={PRESTIGE_HIDE} isPrestigeHide />
        {render_old_spellcasters}
      </_list>
    );
  }, [initialized, render_spellcasters, render_old_spellcasters]);
  return (
    <_spellcasters>
      <Heading title={t('title.casters')} />
      {render}
    </_spellcasters>
  );
};

export default Spellcasters;

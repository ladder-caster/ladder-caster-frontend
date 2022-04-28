import React, { useMemo } from 'react';
import { _spellcasters, _list, _button } from './Spellcasters.styled';
import Item from './item/Item';
import { useTranslation } from 'react-i18next';
import {
  GAME_INIT,
  GAME_SPELLCASTERS,
  SPELLCASTER_BUY,
  USER_PHASE,
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

  return (
    <_spellcasters>
      <Heading title={t('title.casters')} />
      {!initialized || (!phase && casters?.length) ? (
        <_feed>
          <Onboarding />
        </_feed>
      ) : null}
      {initialized && phase && casters?.length ? (
        <_list>
          {/*{casters?.length > 1 && (*/}
          {/*  <_button onClick={() => lootAllResources()}>*/}
          {/*    {t('drawer.crank.loot.all')}*/}
          {/*  </_button>*/}
          {/*)}*/}
          {render_spellcasters}
          <Item key={SPELLCASTER_BUY} spell_id={SPELLCASTER_BUY} />
        </_list>
      ) : null}
    </_spellcasters>
  );
};

export default Spellcasters;

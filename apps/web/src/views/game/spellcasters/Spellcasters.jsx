import React, { useEffect, useMemo, useRef } from 'react';
import {
  _spellcasters,
  _list,
  _button,
  _claim_all,
  _purchase,
} from './Spellcasters.styled';
import Item from './item/Item';
import { useTranslation } from 'react-i18next';
import {
  GAME_OLD_SPELLCASTERS,
  GAME_SPELLCASTERS,
  SPELLCASTER_BUY,
  USER_PHASE,
  PRESTIGE_HIDE,
  GAME_CONSTANTS,
  PRESTIGE_TOGGLE,
} from 'core/mesh/state';
import { _feed } from '../home/Dashboard.styled';
import { useMesh } from 'core/state/mesh/useMesh';
import Heading from '../../../shared/heading/Heading';
import { sortBy } from 'lodash';
import { Onboarding } from '../home/onboarding/Onboarding';
import { CHAIN_CASTERS } from 'chain/hooks/state';
import { useActions } from '../../../../actions';
import RecycledList from '../../../shared/list/RecycledList';
import { useSize } from 'core/hooks/useSize';
import Buy from './buy/Buy';

const Spellcasters = () => {
  const { t } = useTranslation();
  const [casters] = useMesh(CHAIN_CASTERS);
  const [spellcasters] = useMesh(GAME_SPELLCASTERS);
  const [gameConstants] = useMesh(GAME_CONSTANTS);
  const list_ref = useRef();
  const { height, width } = useSize(list_ref, 'spellcaster');
  const { claimAllRewards } = useActions();

  const render_spellcasters = useMemo(() => {
    if (spellcasters && spellcasters.length >= 1) {
      return sortBy(spellcasters, (sort) => sort?.hue).map((caster) => (
        <Item key={caster?.publicKey} spell_id={caster.id} />
      ));
    }
  }, [spellcasters]);

  const render = useMemo(() => {
    if (gameConstants?.gameState && casters?.length > 0) {
      return (
        <>
          <_claim_all onClick={() => claimAllRewards()}>
            {t('spellcasters.claim.all')}
          </_claim_all>
          <_list ref={list_ref}>
            <RecycledList
              items={render_spellcasters}
              height={height}
              width={width}
              itemSize={134}
            />
          </_list>
          <_purchase>
            <Buy />
          </_purchase>
          {/*<Item key={SPELLCASTER_BUY} spell_id={SPELLCASTER_BUY} />*/}
          {/*<Item key={PRESTIGE_HIDE} spell_id={PRESTIGE_HIDE} isPrestigeHide />*/}
        </>
      );
    }
    return (
      <_feed>
        <Onboarding />
      </_feed>
    );
  }, [gameConstants?.gameState, height, width, spellcasters, list_ref.current]);

  return (
    <_spellcasters>
      <Heading title={t('title.casters')} />
      {render}
    </_spellcasters>
  );
};

export default Spellcasters;

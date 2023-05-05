import React, { useEffect, useMemo, useRef } from 'react';
import {
  _spellcasters,
  _list,
  _container,
  _button,
  _claim_all,
  _purchase,
  _header,
  _buy,
  _divider,
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

const Spellcasters = () => {
  const { t } = useTranslation();
  const [casters] = useMesh(CHAIN_CASTERS);
  const [spellcasters] = useMesh(GAME_SPELLCASTERS);
  const [oldSpecasters] = useMesh(GAME_OLD_SPELLCASTERS);
  const [showPrestige] = useMesh(PRESTIGE_TOGGLE);
  const [gameConstants] = useMesh(GAME_CONSTANTS);
  const list_ref = useRef();
  const { height, width } = useSize(list_ref, 'spellcaster');
  const { claimAllRewards, modalBuyLADA } = useActions();

  const render_spellcasters = useMemo(() => {
    let list = [];
    if (spellcasters && spellcasters.length >= 1) {
      list = [
        ...sortBy(spellcasters, (sort) => sort?.hue).map((caster) => (
          <Item key={caster?.publicKey} spell_id={caster.id} />
        )),
      ];
    }

    if (oldSpecasters.length) {
      list = [
        ...list,
        <Item key={PRESTIGE_HIDE} spell_id={PRESTIGE_HIDE} isPrestigeHide />,
      ];
    }

    if (oldSpecasters.length && showPrestige) {
      list = [
        ...list,
        ...sortBy(oldSpecasters, (sort) => sort?.hue).map((caster) => (
          <Item key={caster?.publicKey} spell_id={caster.id} isOld={true} />
        )),
      ];
    }
    return list;
  }, [spellcasters, oldSpecasters, showPrestige]);

  const render_header = useMemo(() => {
    return (
      <_header>
        <_container>
          <_claim_all onClick={() => claimAllRewards()}>
            <span>{t('spellcasters.claim.all')}</span>
          </_claim_all>
        </_container>
        <_divider />
      </_header>
    );
  }, [claimAllRewards]);

  const render = useMemo(() => {
    if (gameConstants?.gameState && casters?.length > 0) {
      return (
        <>
          <_list ref={list_ref}>
            <RecycledList
              items={render_spellcasters}
              height={height}
              width={width}
              itemSize={129.08}
              header={render_header}
              headerHeight={60}
            />
          </_list>
        </>
      );
    }
    return (
      <_feed>
        <Onboarding />
      </_feed>
    );
  }, [
    gameConstants?.gameState,
    height,
    width,
    spellcasters,
    oldSpecasters,
    showPrestige,
    list_ref.current,
  ]);

  return (
    <_spellcasters>
      <Heading title={t('title.casters')} />
      {render}
    </_spellcasters>
  );
};

export default Spellcasters;

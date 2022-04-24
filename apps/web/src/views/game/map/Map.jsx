import React, { useRef, useMemo, useEffect } from 'react';
import {
  _ladder,
  _header,
  _title,
  _map,
  _row,
  _level,
  _portals,
  _indent,
  _pace,
  _filters,
  _shadow,
  _gradient,
  _list,
} from './Map.styled';
import { _feed } from '../home/Dashboard.styled';
import { useSize } from 'core/hooks/useSize';
import { useTranslation } from 'react-i18next';
import { useRemix } from 'core/hooks/remix/useRemix';
import { GAME_INIT, GAME_MAP } from 'core/remix/state';
import { reverse } from 'lodash';
import Tile from './tile/Tile';
import { _wallet } from '../inventory/Inventory.styled';
import Wallet from '../../../shared/wallet/WalletHeader';
import Heading from '../../../shared/heading/Heading';
import { Onboarding } from '../home/onboarding/Onboarding';
import { CHAIN_CASTERS } from 'chain/hooks/state';

const Map = () => {
  const { t } = useTranslation();
  const [map] = useRemix(GAME_MAP);
  const map_ref = useRef();
  const list_ref = useRef();
  const bottom_ref = useRef();
  const { height } = useSize(list_ref);
  const [initialized] = useRemix(GAME_INIT);
  const [casters] = useRemix(CHAIN_CASTERS);

  useEffect(() => {
    if (list_ref?.current && initialized) {
      list_ref?.current?.addEventListener('DOMNodeInserted', (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight });
      });
    }
  }, [list_ref?.current, initialized]);

  const render_map = useMemo(() => {
    if (map)
      return reverse(
        map?.map((data) => {
          const level = data.level + 1;

          return (
            <_row key={data.id}>
              <_level>
                <_indent />
                <span>{level}</span>
              </_level>
              <_portals>
                <Tile level={level} col={'a'} />
                <Tile level={level} col={'b'} />
                <Tile level={level} col={'c'} />
              </_portals>
              <_pace>
                <span>{level}</span>
                <_indent $disabled $right />
              </_pace>
            </_row>
          );
        }),
      );
  }, [map?.length]);

  return (
    <_ladder>
      <Heading flat title={t('title.map')} />
      {(!initialized || casters?.length === 0) && (
        <_feed>
          <Onboarding />
        </_feed>
      )}
      {initialized && casters?.length !== 0 && (
        <>
          <_filters></_filters>
          <_map ref={map_ref}>
            <_shadow>
              <_gradient $height={height} />
            </_shadow>
            <_list ref={list_ref}>{render_map}</_list>
          </_map>
        </>
      )}
    </_ladder>
  );
};

export default Map;

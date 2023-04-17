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
import { useMesh } from 'core/state/mesh/useMesh';
import { GAME_INIT, GAME_MAP } from 'core/mesh/state';
import { reverse } from 'lodash';
import Tile from './tile/Tile';
import Heading from '../../../shared/heading/Heading';
import { Onboarding } from '../home/onboarding/Onboarding';
import { CHAIN_CASTERS } from 'chain/hooks/state';
import TestRecycledList from '../../../shared/list/TestRecycledList';
import RecycledList from '../../../shared/list/RecycledList';

const Map = () => {
  const { t } = useTranslation();
  const [map] = useMesh(GAME_MAP);
  const map_ref = useRef();
  const list_ref = useRef();
  const { height, width } = useSize(list_ref);
  const [initialized] = useMesh(GAME_INIT);
  const [casters] = useMesh(CHAIN_CASTERS);

  useEffect(() => {
    if (list_ref?.current && initialized) {
      list_ref?.current?.addEventListener('DOMNodeInserted', (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight });
      });
    }
  }, [list_ref?.current, initialized]);

  const render_map = useMemo(() => {
    return reverse(
      map?.map((data) => {
        const level = data.level + 1;

        return (
          <_row key={data.id}>
            <_level key={`level-${data.id}`}>
              <_indent key={`indent-${data.id}`} />
              <span key={`level-span-${data.id}`}>{level}</span>
            </_level>
            <_portals key={`portals-${data.id}`}>
              <Tile key={`tile-a-${data.id}`} level={level} col={'a'} />
              <Tile key={`tile-b-${data.id}`} level={level} col={'b'} />
              <Tile key={`tile-c-${data.id}`} level={level} col={'c'} />
            </_portals>
            <_pace key={`pace-${data.id}`}>
              <span key={`pace-span-${data.id}`}>{level}</span>
              <_indent key={`indent-${data.id}`} $disabled $right />
            </_pace>
          </_row>
        );
      }),
    );
  }, [map?.length]);

  return (
    <_ladder>
      <Heading flat title={t('title.map')} />
      {!initialized || casters?.length === 0 ? (
        <_feed>
          <Onboarding />
        </_feed>
      ) : null}
      {initialized && casters?.length !== 0 ? (
        <>
          <_filters></_filters>
          <_map ref={map_ref}>
            <_shadow>
              <_gradient $height={height} />
            </_shadow>
            <_list ref={list_ref}>
              <RecycledList
                items={render_map}
                itemSize={88}
                height={height}
                width={width}
              />
            </_list>
          </_map>
        </>
      ) : null}
    </_ladder>
  );
};

export default Map;

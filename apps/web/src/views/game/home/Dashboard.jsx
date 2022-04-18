import React, { useState, useEffect, useMemo } from 'react';
import {
  _home,
  _header,
  _title,
  _feed,
  _section,
  _description,
  _button,
  _actions,
  _item,
  _step,
  _order,
  _task,
  _divider,
  _button_override,
  _link,
} from './Dashboard.styled';
import { useTranslation } from 'react-i18next';
import {
  DEMO_MODE,
  GAME_INIT,
  GAME_MAP,
  GAME_RESOURCES,
  TIER_I,
} from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import { IconHat } from 'design/icons/hat.icon';
import { AnimateButton } from '../../../shared/button/animations/AnimateButton';
import { map as _map } from 'lodash';
import { nanoid } from 'nanoid';
import { _controls, _speed } from '../header/Header.styled';
import { _wallet } from '../inventory/Inventory.styled';
import Heading from '../../../shared/heading/Heading';
import { CHAIN_CASTERS } from 'chain/hooks/state';
import { IconBag } from 'design/icons/bag.icon';
import { Onboarding } from './onboarding/Onboarding';
import { useActions } from '../../../../actions';

const Dashboard = () => {
  const { t } = useTranslation();
  const [map, setMap] = useRemix(GAME_MAP);
  const [next_map] = useState();

  let new_map = map ? [...map] : [];

  useEffect(() => {
    if (next_map) {
      const show_map = _map(next_map?.map, (tile) => {
        const col = {
          ['1']: 'a',
          ['2']: 'b',
          ['3']: 'c',
        }[`${tile.column}`];

        return {
          level: tile.level,
          remaining: tile.life,
          tier: TIER_I,
          type: Object.keys(tile.feature)[0],
          id: nanoid(),
          col,
        };
      });

      new_map[0] = {
        a: show_map[0],
        b: show_map[1],
        c: show_map[2],
        level: show_map[0].level,
      };

      setMap(new_map);
    }
  }, [next_map]);

  return (
    <_home>
      <Heading title={t('title.home')} />
      <_feed>
        <Onboarding home />
      </_feed>
    </_home>
  );
};

export default Dashboard;

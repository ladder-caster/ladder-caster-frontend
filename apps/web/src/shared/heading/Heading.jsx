import React, { useEffect, useState } from 'react';
import { _heading, _divider, _title, _container } from './Heading.styled';
import Redeem from '../redeem/Redeem';
import Phases from '../phases/Phases';
import { CHAIN_CASTERS, CHAIN_GAME } from 'chain/hooks/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import {
  GAME_INIT,
  GAME_MAP,
  GAME_SPELLCASTERS,
  TYPE_RES3,
  TYPE_RES1,
  TYPE_RES2,
} from 'core/remix/state';
import { map } from 'lodash';
import Ticks from '../ticks/Ticks';
import Trade from './trade/Trade';
import ResourceTrade from '../resourceTrade/ResourceTrade';

const Heading = ({ title, flat, marketplace }) => {
  const [initialized] = useRemix(GAME_INIT);
  const [game] = useRemix(CHAIN_GAME);
  const [casters] = useRemix(CHAIN_CASTERS);
  const [spellcasters] = useRemix(GAME_SPELLCASTERS);
  const [board] = useRemix(GAME_MAP);
  const [lootAll, setLootAll] = useState(false);
  const currentTurn = game?.turnInfo?.turn;

  useEffect(() => {
    if (spellcasters) {
      let looted = 0;
      let max = 0;

      map(spellcasters, (caster) => {
        const col = caster?.position?.[0];
        const row = +caster?.position?.slice(1);
        const tile = board?.[row - 1]?.[col];
        const isLoot =
          tile?.type === TYPE_RES3 ||
          tile?.type === TYPE_RES1 ||
          tile?.type === TYPE_RES2;
        if (isLoot) {
          max++;
          if (caster?.last_loot === currentTurn) looted++;
        }
      });

      if (!lootAll && looted && looted === max) setLootAll(true);
      else if (lootAll && looted && looted !== max) setLootAll(false);
    }
  }, [spellcasters, lootAll]);

  return (
    <_heading key={'heading-component'}>
      <_title>
        <span>{title}</span>
        <_container>
          <ResourceTrade />
          {marketplace ? <Redeem /> : <Trade />}
        </_container>
      </_title>
      <Ticks />
      {!lootAll && <Phases />}
      {!flat || (flat && !initialized) || (flat && casters?.length === 0) ? (
        <_divider />
      ) : null}
    </_heading>
  );
};

export default Heading;

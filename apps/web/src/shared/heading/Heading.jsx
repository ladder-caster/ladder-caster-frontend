import React, { useEffect, useState } from 'react';
import { _heading, _divider, _title } from './Heading.styled';
import Redeem from '../redeem/Redeem';
import Phases from '../phases/Phases';
import { CHAIN_CASTERS, CHAIN_GAME } from 'chain/hooks/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import { GAME_INIT, GAME_MAP, GAME_SPELLCASTERS, TYPE_EARTH, TYPE_FIRE, TYPE_WATER } from 'core/remix/state';
import { map } from 'lodash';
import Ticks from '../ticks/Ticks';
import Trade from './trade/Trade';

const Heading = ({ title, flat, marketplace, trade }) => {
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
  
      map(spellcasters, caster => {
        const col = caster?.position?.[0];
        const row = +caster?.position?.slice(1);
        const tile = board?.[row -1]?.[col];
        const isLoot = tile?.type === TYPE_EARTH ||
          tile?.type === TYPE_FIRE ||
          tile?.type === TYPE_WATER;
        if (isLoot) {
          max++;
          if (caster?.last_loot === currentTurn) looted++;
        }
      })
      
      if (!lootAll && looted && looted === max) setLootAll(true);
      else if (lootAll && looted && looted !== max) setLootAll(false);
    }
  }, [spellcasters, lootAll]);

  return (
    <_heading key={'heading-component'}>
      <_title>
        <span>{title}</span>
        {marketplace ? (
          <Redeem />
        ) : null}
        {trade ? (
          <Trade />
        ) : null}
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

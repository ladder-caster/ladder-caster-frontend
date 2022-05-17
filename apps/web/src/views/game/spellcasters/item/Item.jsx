import React, { useMemo } from 'react';
import { _item, _inventory, _queue, _buy } from './Item.styled';
import Card from './card/Card';
import Queue from './queue/Queue';
import { useRemix } from 'core/hooks/remix/useRemix';
import {
  DRAWER_ACTIVE,
  SPELLCASTER_BUY,
  TABS_CHARACTER_ACTIONS,
} from 'core/remix/state';
import Buy from './buy/Buy';
import { useActions } from 'web/actions';
import Prestige from './prestige/Prestige';
import PrestigeToggle from './prestige/toggle/PrestigeToggle';

const Item = ({ spell_id, isOld, isPrestigeHide }) => {
  const { tabCharacter } = useActions();
  const isBuy = spell_id === SPELLCASTER_BUY;
  const render = useMemo(() => {
    console.log('Item', isOld, isBuy, isPrestigeHide);
    if (isOld) {
      return (
        <_buy>
          <Prestige spell_id={spell_id} />
        </_buy>
      );
    } else if (isBuy) {
      return (
        <_buy>
          <Buy />
        </_buy>
      );
    } else if (isPrestigeHide) {
      return (
        <_buy>
          <PrestigeToggle />
        </_buy>
      );
    } else {
      return (
        <_queue>
          <Queue spell_id={spell_id} />
        </_queue>
      );
    }
  }, [isBuy, isOld, isPrestigeHide]);
  return (
    <_item>
      <_inventory onClick={() => tabCharacter(spell_id)}>
        <Card spell_id={spell_id} mint={isBuy} isOld={isOld} />
      </_inventory>
      {render}
    </_item>
  );
};

export default Item;

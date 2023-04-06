import React, { useMemo } from 'react';
import { _item, _inventory, _queue, _buy } from './Item.styled';
import Card from './card/Card';
import Queue from './queue/Queue';
import { useRemix } from 'core/hooks/remix/useRemix';
import { useMesh } from 'core/state/mesh/useMesh';
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
  const { drawerCaster } = useActions();
  const isBuy = spell_id === SPELLCASTER_BUY;
  const render = useMemo(() => {
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
  }, [isBuy, isOld, isPrestigeHide, spell_id]);
  // prevents rerenders - anon funcs rerender :/
  const onClick = () => {
    drawerCaster(spell_id);
  };
  return (
    <_item>
      {!isPrestigeHide && (
        <_inventory onClick={onClick}>
          <Card spell_id={spell_id} mint={isBuy} isOld={isOld} />
        </_inventory>
      )}
      {render}
    </_item>
  );
};

export default Item;

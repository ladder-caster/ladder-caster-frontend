import React, { useMemo } from 'react';
import {
  CRAFT_CHARACTER,
  CRAFT_ITEM,
  CRAFT_MATERIALS,
  DRAWER_ACTIVE,
  DRAWER_CONTEXT,
} from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import Materials from './materials/Materials';
import Item from './item/Item';
import Character from './character/Character';

const CraftDrawer = () => {
  const [context] = useRemix(DRAWER_CONTEXT);

  const craft_types = {
    [CRAFT_MATERIALS]: <Materials />,
    [CRAFT_ITEM]: <Item />,
    [CRAFT_CHARACTER]: <Character />,
  }[context?.type];

  return craft_types || null;

  // const show_materials = context?.item || context?.materials?.length;
  // const materials = useMemo(() => <Materials />, [show_materials]);
  //
  // const show_items = context?.caster;
  // const items = useMemo(() => <Item />, [show_items]);
  //
  // return show_materials ? materials : show_items ? items : <Character />;
};

export default CraftDrawer;

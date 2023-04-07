import React from 'react';
import {
  CRAFT_CHARACTER,
  CRAFT_ITEM,
  CRAFT_MATERIALS,
  DRAWER_CONTEXT,
} from 'core/mesh/state';
import { useMesh } from 'core/state/mesh/useMesh';
import Materials from './materials/Materials';
import Item from './item/Item';
import Character from './character/Character';

const CraftDrawer = () => {
  const [context] = useMesh(DRAWER_CONTEXT);

  const craft_types = {
    [CRAFT_MATERIALS]: <Materials />,
    [CRAFT_ITEM]: <Item />,
    [CRAFT_CHARACTER]: <Character />,
  }[context?.type];

  return craft_types || null;
};

export default CraftDrawer;

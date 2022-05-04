import React from 'react';
import {
  ATTRIBUTE_CRAFT,
  ATTRIBUTE_CRIT,
  ATTRIBUTE_RESOURCE3,
  ATTRIBUTE_RESOURCE1,
  ATTRIBUTE_ITEM,
  ATTRIBUTE_MAGIC,
  ATTRIBUTE_RESOURCE2,
  ATTRIBUTE_XP,
} from 'core/remix/state';
import { IconResourcee1 } from 'design/icons/resourcee1.icon';
import { IconResource2 } from 'design/icons/resource2.icon';
import { IconResource3 } from 'design/icons/resource3.icon';
import { IconCrsytal } from 'design/icons/crystal.icon';
import { IconTreasure } from 'design/icons/treasure.icon';
import { IconGather } from 'design/icons/gather.icon';
import { IconTag } from 'design/icons/tag.icon';
import { IconSparkle } from 'design/icons/sparkles.icon';
import { IconAnvil } from 'design/icons/anvil.icon';

const IconSkill = ({ attribute }) => {
  const Icon = {
    [ATTRIBUTE_RESOURCE1]: IconResourcee1,
    [ATTRIBUTE_RESOURCE2]: IconResource2,
    [ATTRIBUTE_RESOURCE3]: IconResource3,
    [ATTRIBUTE_MAGIC]: IconTreasure,
    [ATTRIBUTE_CRIT]: IconGather,
    [ATTRIBUTE_XP]: IconSparkle,
    [ATTRIBUTE_ITEM]: IconTag,
    [ATTRIBUTE_CRAFT]: IconAnvil,
  }[attribute];

  return (!!Icon && <Icon />) || null;
};

export default IconSkill;

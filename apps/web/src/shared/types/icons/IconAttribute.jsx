import React from 'react';
import {
  ATTRIBUTE_XP,
  ATTRIBUTE_CRIT,
  ATTRIBUTE_RES3,
  ATTRIBUTE_RES1,
  ATTRIBUTE_ITEM,
  ATTRIBUTE_MAGIC,
  ATTRIBUTE_RES2,
  ATTRIBUTE_CRAFT,
} from 'core/mesh/state';
import { IconResourcee1 } from 'design/icons/resourcee1.icon';
import { IconResource2 } from 'design/icons/resource2.icon';
import { IconResource3 } from 'design/icons/resource3.icon';
import { IconSwirl } from 'design/icons/swirl.icon';
import { IconPower } from 'design/icons/power.icon';
import { IconTag } from 'design/icons/tag.icon';
import { IconSparkle } from 'design/icons/sparkles.icon';
import { IconAnvil } from 'design/icons/anvil.icon';

const IconAttribute = ({ attribute }) => {
  const Icon = {
    [ATTRIBUTE_RES2]: IconResource2,
    [ATTRIBUTE_RES1]: IconResourcee1,
    [ATTRIBUTE_RES3]: IconResource3,
    [ATTRIBUTE_MAGIC]: IconSwirl,
    [ATTRIBUTE_CRIT]: IconPower,
    [ATTRIBUTE_XP]: IconSparkle,
    [ATTRIBUTE_ITEM]: IconTag,
    [ATTRIBUTE_CRAFT]: IconAnvil,
  }[attribute];

  return (!!Icon && <Icon />) || null;
};

export default IconAttribute;

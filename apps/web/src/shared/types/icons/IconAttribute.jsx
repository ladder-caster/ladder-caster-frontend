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
} from 'core/remix/state';
import { IconFiree } from 'design/icons/firee.icon';
import { IconWater } from 'design/icons/water.icon';
import { IconEarth } from 'design/icons/earth.icon';
import { IconSwirl } from 'design/icons/swirl.icon';
import { IconPower } from 'design/icons/power.icon';
import { IconTag } from 'design/icons/tag.icon';
import { IconSparkle } from 'design/icons/sparkles.icon';
import { IconAnvil } from 'design/icons/anvil.icon';

const IconAttribute = ({ attribute }) => {
  const Icon = {
    [ATTRIBUTE_RES2]: IconWater,
    [ATTRIBUTE_RES1]: IconFiree,
    [ATTRIBUTE_RES3]: IconEarth,
    [ATTRIBUTE_MAGIC]: IconSwirl,
    [ATTRIBUTE_CRIT]: IconPower,
    [ATTRIBUTE_XP]: IconSparkle,
    [ATTRIBUTE_ITEM]: IconTag,
    [ATTRIBUTE_CRAFT]: IconAnvil,
  }[attribute];

  return (!!Icon && <Icon />) || null;
};

export default IconAttribute;

import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ATTRIBUTE_CRIT,
  ATTRIBUTE_RES3,
  ATTRIBUTE_RES1,
  ATTRIBUTE_MAGIC,
  ATTRIBUTE_RES2,
} from 'core/remix/state';
import { IconTreasure } from 'design/icons/treasure.icon';
import { IconExp } from 'design/icons/xp.icon';
import { IconResource3 } from 'design/icons/resource3.icon';
import { IconResource2 } from 'design/icons/resource2.icon';
import { IconResourcee1 } from 'design/icons/resourcee1.icon';

const AttributeIcon = ({ attribute }) => {
  const Attribute = {
    [ATTRIBUTE_RES1]: IconFiree,
    [ATTRIBUTE_RES2]: IconWater,
    [ATTRIBUTE_RES3]: IconEarth,
    [ATTRIBUTE_MAGIC]: IconTreasure,
    [ATTRIBUTE_CRIT]: IconExp,
  }[attribute];

  return !!Attribute ? Attribute : null;
};

export default AttributeIcon;

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
import { IconEarth } from 'design/icons/earth.icon';
import { IconWater } from 'design/icons/water.icon';
import { IconFiree } from 'design/icons/firee.icon';

const AttributeIcon = ({ attribute }) => {
  const Attribute = {
    [ATTRIBUTE_RES1]: IconResourcee1,
    [ATTRIBUTE_RES2]: IconResource2,
    [ATTRIBUTE_RES3]: IconResource3,
    [ATTRIBUTE_MAGIC]: IconTreasure,
    [ATTRIBUTE_CRIT]: IconExp,
  }[attribute];

  return !!Attribute ? Attribute : null;
};

export default AttributeIcon;

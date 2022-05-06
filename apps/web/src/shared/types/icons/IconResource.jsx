import React from 'react';
import { TYPE_RES3, TYPE_RES1, TYPE_GOLD, TYPE_RES2 } from 'core/remix/state';
import { IconMoneyBag } from 'design/icons/money-bag.icon';
import { IconFiree, IconFireeIMG } from 'design/icons/firee.icon';
import { IconWater, IconWaterIMG } from 'design/icons/water.icon';
import { IconEarth, IconEarthIMG } from 'design/icons/earth.icon';

const IconResource = ({ type, isIMG }) => {
  const Icon = {
    [TYPE_GOLD]: IconMoneyBag,
    [TYPE_RES1]: isIMG ? IconFireeIMG : IconFiree,
    [TYPE_RES2]: isIMG ? IconWaterIMG : IconWater,
    [TYPE_RES3]: isIMG ? IconEarthIMG : IconEarth,
  }[type];

  return (!!Icon && <Icon />) || null;
};

export default IconResource;

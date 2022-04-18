import React from 'react';
import { TYPE_EARTH, TYPE_FIRE, TYPE_GOLD, TYPE_WATER } from 'core/remix/state';
import { IconMoneyBag } from 'design/icons/money-bag.icon';
import { IconFiree, IconFireeIMG } from 'design/icons/firee.icon';
import { IconWater, IconWaterIMG } from 'design/icons/water.icon';
import { IconEarth, IconEarthIMG } from 'design/icons/earth.icon';

const IconResource = ({ type, isIMG }) => {
  const Icon = {
    [TYPE_GOLD]: IconMoneyBag,
    [TYPE_FIRE]: isIMG ? IconFireeIMG : IconFiree,
    [TYPE_WATER]: isIMG ? IconWaterIMG : IconWater,
    [TYPE_EARTH]: isIMG ? IconEarthIMG : IconEarth,
  }[type];

  return (!!Icon && <Icon />) || null;
};

export default IconResource;

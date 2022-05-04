import React from 'react';
import { TYPE_RES3, TYPE_RES1, TYPE_GOLD, TYPE_RES2 } from 'core/remix/state';
import { IconMoneyBag } from 'design/icons/money-bag.icon';
import {
  IconResourcee1,
  IconResourcee1IMG,
} from 'design/icons/resourcee1.icon';
import { IconResource2, IconResource2IMG } from 'design/icons/resource2.icon';
import { IconResource3, IconResource3IMG } from 'design/icons/resource3.icon';

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

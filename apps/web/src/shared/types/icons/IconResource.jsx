import React from 'react';
import {
  TYPE_RESOURCE3,
  TYPE_RESOURCE1,
  TYPE_GOLD,
  TYPE_RESOURCE2,
} from 'core/remix/state';
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
    [TYPE_RESOURCE1]: isIMG ? IconResourcee1IMG : IconResourcee1,
    [TYPE_RESOURCE2]: isIMG ? IconResource2IMG : IconResource2,
    [TYPE_RESOURCE3]: isIMG ? IconResource3IMG : IconResource3,
  }[type];

  return (!!Icon && <Icon />) || null;
};

export default IconResource;

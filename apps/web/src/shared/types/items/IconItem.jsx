import React from 'react';
import { ITEM_BOOK, ITEM_HAT, ITEM_ROBE, ITEM_STAFF } from 'core/mesh/state';
import { IconHat } from 'design/icons/hat.icon';
import { IconCloak } from 'design/icons/cloak.icon';
import { IconStaff } from 'design/icons/staff.icon';
import { IconBook } from 'design/icons/book.icon';

const IconItem = ({ type }) => {
  const Icon = {
    [ITEM_HAT]: IconHat,
    [ITEM_ROBE]: IconCloak,
    [ITEM_STAFF]: IconStaff,
    [ITEM_BOOK]: IconBook,
  }[type];

  return (!!Icon && <Icon />) || null;
};

export default IconItem;

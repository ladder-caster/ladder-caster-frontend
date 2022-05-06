import { IconBook } from 'design/icons/book.icon';
import { IconCloak } from 'design/icons/cloak.icon';
import { IconGem } from 'design/icons/gem.icon';
import { IconHat } from 'design/icons/hat.icon';
import { IconStaff } from 'design/icons/staff.icon';
import {
  ITEM_BOOK,
  ITEM_CHEST,
  ITEM_GEM,
  ITEM_HAT,
  ITEM_ROBE,
  ITEM_STAFF,
  TIER_I,
  TIER_II,
  TIER_III,
  TIER_IV,
} from '../remix/state';

export const COLUMNS_ALPHA = ['a', 'b', 'c'];

export const getTier = (level) => {
  let tier;
  if (level <= 5) tier = TIER_I;
  else if (level >= 6 && level <= 10) tier = TIER_II;
  else if (level >= 11 && level <= 15) tier = TIER_III;
  else if (level >= 16 && level <= 30) tier = TIER_IV;
  return tier;
};

export const getTierNumber = (level) => {
  if (level <= 5) return 1;
  else if (level > 5 && level <= 10) return 2;
  else if (level > 10 && level <= 15) return 3;
  else if (level > 16) return 4;
  else return 0;
};

export const ICON_EQUIP_MAP = {
  [ITEM_HAT]: IconHat,
  [ITEM_ROBE]: IconCloak,
  [ITEM_STAFF]: IconStaff,
  [ITEM_GEM]: IconGem,
  [ITEM_BOOK]: IconBook,
};

export const EQUIP_MAP = {
  [ITEM_HAT]: 'head',
  [ITEM_ROBE]: 'robe',
  [ITEM_STAFF]: 'staff',
  [ITEM_BOOK]: 'spellBook',
};

export const INVERSE_EQUIP_MAP = {
  head: ITEM_HAT,
  robe: ITEM_ROBE,
  staff: ITEM_STAFF,
  spellBook: ITEM_BOOK,
  chest: ITEM_CHEST,
};

export const INVERSE_TIER_MAP = {
  1: TIER_I,
  2: TIER_II,
  3: TIER_III,
  4: TIER_IV,
};

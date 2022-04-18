import {
  ATTRIBUTE_XP,
  ATTRIBUTE_CRIT,
  ATTRIBUTE_EARTH,
  ATTRIBUTE_FIRE,
  ATTRIBUTE_ITEM,
  ATTRIBUTE_MAGIC,
  ATTRIBUTE_WATER,
  ITEM_BOOK,
  ITEM_HAT,
  ITEM_ROBE,
  ITEM_STAFF,
  RARITY_COMMON,
  RARITY_EPIC,
  RARITY_LEGENDARY,
  RARITY_RARE,
  ATTRIBUTE_CRAFT,
} from '../remix/state';

export const randomIntBetween = (start, end) => {
  return Math.floor(Math.random() * (end - start + 0.99) + start);
};

export const LEVEL_BOUNDS = [
  502,
  2000,
  4985,
  9950,
  17387,
  27789,
  41648,
  59457,
  81707,
  108891,
  141502,
  180032,
  224973,
  276818,
  336059,
  403189,
  478700,
  563084,
  656833,
  760441,
  874399,
  999200,
  1135336,
  1283300,
  1443584,
  1616681,
  1803082,
  2003280,
  2217768,
  2447038,
];

export const itemPowerLevel = (item, combined) => {
  const type = item?.type;
  const attribute = item?.attribute;
  const level = item?.level;
  const rarity = combined ? RARITY_LEGENDARY : item?.rarity;
  const value = item?.value;

  if (type === ITEM_HAT || type === ITEM_STAFF || type === ITEM_ROBE) {
    const rarity_multiplier = {
      [RARITY_COMMON]: 10,
      [RARITY_RARE]: 20,
      [RARITY_EPIC]: 30,
      [RARITY_LEGENDARY]: 40,
    }[rarity];

    const element_max = level * rarity_multiplier;
    const magic_counter = (level * 100) / 3 + rarity_multiplier + 10;
    const magic_min =
      magic_counter > 10 * rarity_multiplier
        ? magic_counter
        : 10 * rarity_multiplier;
    const magic_max = Math.floor(magic_min * 100) / 100;

    const max = {
      [ATTRIBUTE_FIRE]: element_max,
      [ATTRIBUTE_WATER]: element_max,
      [ATTRIBUTE_EARTH]: element_max,
      [ATTRIBUTE_MAGIC]: magic_max,
      [ATTRIBUTE_CRIT]: magic_max,
    }[attribute];

    const power = value / max;
    const max_power = power > 1 ? 1 : power;

    return max_power;
  } else if (type === ITEM_BOOK) {
    const max_cost = 10 * level;

    const rarity_odds = {
      [RARITY_COMMON]: 8,
      [RARITY_RARE]: 6,
      [RARITY_EPIC]: 4,
      [RARITY_LEGENDARY]: 2,
    }[rarity];

    const rarity_max = {
      [RARITY_COMMON]: 40,
      [RARITY_RARE]: 80,
      [RARITY_EPIC]: 120,
      [RARITY_LEGENDARY]: 160,
    }[rarity];

    const element_max = max_cost * (rarity_odds - 1) + rarity_max;

    const power = {
      [ATTRIBUTE_XP]: 1,
      [ATTRIBUTE_ITEM]: 1,
      [ATTRIBUTE_CRAFT]: 1,
      [ATTRIBUTE_FIRE]: value / element_max,
      [ATTRIBUTE_WATER]: value / element_max,
      [ATTRIBUTE_EARTH]: value / element_max,
    }[attribute];

    const max_power = power > 1 ? 1 : power;

    return max_power;
  }
};

export const casterPowerLevel = () => {};

export const convertStrToRandom = (str, max) => {
  const data = atob(str);
  const array = Uint8Array.from(data, (b) => b.charCodeAt(0));
  const length = array.length;
  let buffer = Buffer.from(array);
  const result = buffer.readUIntBE(0, length);
  return (+`${result.toString().split('.')?.[1]}`.substr(0, 8) / 10e7) * max;
};

export const truncateDecimals = (number, offset) => {
  const regex = new RegExp('^-?\\d+(?:.\\d{0,' + (offset || -1) + '})?');
  return number ? number.toString().match(regex)[0] : 0;
};

import {
  ATTRIBUTE_XP,
  ATTRIBUTE_CRIT,
  ATTRIBUTE_RES3,
  ATTRIBUTE_RES1,
  ATTRIBUTE_ITEM,
  ATTRIBUTE_MAGIC,
  ATTRIBUTE_RES2,
  ITEM_BOOK,
  ITEM_HAT,
  ITEM_ROBE,
  ITEM_STAFF,
  RARITY_COMMON,
  RARITY_EPIC,
  RARITY_LEGENDARY,
  RARITY_RARE,
  ATTRIBUTE_CRAFT,
} from '../mesh/state';

export const randomIntBetween = (start, end) => {
  return Math.floor(Math.random() * (end - start + 0.99) + start);
};

export const LEVEL_BOUNDS = [
  251,
  1000,
  2492,
  4975,
  8693,
  13894,
  20824,
  29728,
  40853,
  54445,
  70751,
  90016,
  112486,
  138409,
  168029,
  201594,
  239350,
  281542,
  328416,
  380220,
  437199,
  499600,
  567668,
  641650,
  721792,
  808340,
  901541,
  1001640,
  1108884,
  1223519,
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
      [ATTRIBUTE_RES1]: element_max,
      [ATTRIBUTE_RES2]: element_max,
      [ATTRIBUTE_RES3]: element_max,
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
      [ATTRIBUTE_RES1]: value / element_max,
      [ATTRIBUTE_RES2]: value / element_max,
      [ATTRIBUTE_RES3]: value / element_max,
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

export const largest = (number1, number2) => {
  if (number1 > number2) return number1;
  else return number2;
};

export const floorPrice = (number, decimals) => {
  const multiple = Math.pow(10, decimals);
  return Math.floor(number * multiple) / multiple;
};

export const decimalsToFloat = (decimals) => {
  return Math.pow(1, -decimals);
};

export const orderbookFill = (quote_amount, orderbook) => {
  let avg_price = 0;
  let max_price = 0;
  let filled_amount = 0;
  let filled_price = 0;

  for (let i = 0; i < orderbook?.length; i++) {
    const order = orderbook?.[i];
    const price = +order?.[0];
    const amount = +order?.[1];
    const next_fill = price * amount;

    if (filled_price + next_fill < quote_amount) {
      filled_amount += amount;
      filled_price += price * amount;
    } else {
      const remaining_price = quote_amount - filled_price;
      const remaining_amount = remaining_price / price;
      filled_amount += remaining_amount;
      filled_price += remaining_price;
      avg_price += filled_price / filled_amount;
      max_price = largest(max_price, price);
      break;
    }
  }

  return {
    amount: filled_amount,
    price: Math.floor(avg_price * 10000) / 10000,
    max_price,
  };
};

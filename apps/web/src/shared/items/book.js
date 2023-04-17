import {
  ATTRIBUTE_XP,
  ATTRIBUTE_CRIT,
  ATTRIBUTE_RES3,
  ATTRIBUTE_RES1,
  ATTRIBUTE_ITEM,
  ATTRIBUTE_MAGIC,
  ATTRIBUTE_RES2,
  ITEM_BOOK,
  RARITY_COMMON,
  RARITY_EPIC,
  RARITY_LEGENDARY,
  RARITY_RARE,
} from 'core/mesh/state';
import { randomIntBetween } from 'core';
import { IconHat } from 'design/icons/hat.icon';
import { nanoid } from 'nanoid';
import { IconBook } from 'design/icons/book.icon';
import { EQUIP_MAP } from 'core/utils/switch';

export const spell = (level, rarity, tier) => {
  const attribute_types = [
    ATTRIBUTE_RES1,
    ATTRIBUTE_RES2,
    ATTRIBUTE_RES3,
    ATTRIBUTE_XP,
    ATTRIBUTE_ITEM,
  ];

  const cost = randomIntBetween(level, 10 * level);

  const chosen_attribute =
    attribute_types[randomIntBetween(0, attribute_types.length - 1)];

  if (
    chosen_attribute === ATTRIBUTE_XP ||
    chosen_attribute === ATTRIBUTE_ITEM
  ) {
    return {
      id: nanoid(),
      type: EQUIP_MAP[ITEM_BOOK],
      attribute: chosen_attribute,
      rarity,
      level,
      cost,
      equip: '',
      icon: IconBook,
      tier,
    };
  } else {
    // element spellbook
    const rarity_odds = {
      [RARITY_COMMON]: 8,
      [RARITY_RARE]: 6,
      [RARITY_EPIC]: 4,
      [RARITY_LEGENDARY]: 2,
    }[rarity];

    const rarity_range = {
      [RARITY_COMMON]: { min: 1, max: 10 },
      [RARITY_RARE]: { min: 11, max: 20 },
      [RARITY_EPIC]: { min: 21, max: 30 },
      [RARITY_LEGENDARY]: { min: 31, max: 40 },
    }[rarity];

    const spell_multiple = 4;

    const rarity_min = rarity_range.min;
    const rarity_max = rarity_range.max;

    const avg_resources = Math.floor(rarity_min + rarity_max / 2);

    const value = cost * (rarity_odds - 1) + spell_multiple * avg_resources;

    return {
      id: nanoid(),
      type: EQUIP_MAP[ITEM_BOOK],
      attribute: chosen_attribute,
      rarity,
      level,
      value,
      icon: IconBook,
      tier,
      equip: '',
      cost,
    };
  }
};

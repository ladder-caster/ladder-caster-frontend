import {
  ATTRIBUTE_CRIT,
  ATTRIBUTE_RES3,
  ATTRIBUTE_RES1,
  ATTRIBUTE_MAGIC,
  ATTRIBUTE_RES2,
  ITEM_BOOK,
  ITEM_GEM,
  ITEM_HAT,
  ITEM_ROBE,
  ITEM_STAFF,
  RARITY_COMMON,
  RARITY_EPIC,
  RARITY_LEGENDARY,
  RARITY_RARE,
  SPELL_CRAFT,
  SPELL_CRIT,
  SPELL_RES3,
  SPELL_RES1,
  SPELL_ITEM,
  SPELL_LOOT,
  SPELL_MAGIC,
  SPELL_MOVE,
  SPELL_UNLOCK,
  SPELL_RES2,
  SPELL_XP,
  TIER_I,
  TIER_II,
  TIER_III,
  TIER_IV,
} from 'core/remix/state';
import { randomIntBetween } from 'core';
import { hat } from '../src/shared/items/hat';
import { robe } from '../src/shared/items/robe';
import { staff } from '../src/shared/items/staff';
import { forEach } from 'lodash';
import { spell } from '../src/shared/items/book';
import { INVERSE_TIER_MAP } from 'core/utils/switch';

export const useChest = (chest) => {
  // generate items from opening chest
  const tier = INVERSE_TIER_MAP[chest.tier];
  const max_level = chest.max_level;
  const num_items = 30;

  // item attributes
  const mintHat = () => {};

  const mintBook = () => {
    const spells = [
      SPELL_MOVE,
      SPELL_UNLOCK,
      SPELL_LOOT,
      SPELL_CRIT,
      SPELL_ITEM,
      SPELL_MAGIC,
      SPELL_RES1,
      SPELL_RES2,
      SPELL_RES3,
      SPELL_XP,
      SPELL_CRAFT,
    ];
    const cooldown = 3;
    const chance = 5;
  };

  const mintRobe = () => {};

  const mintStaff = () => {};

  const mintGem = () => {};

  const item_value = {
    [ITEM_HAT]: (level, rarity) => hat(level, rarity, tier),
    [ITEM_ROBE]: (level, rarity) => robe(level, rarity, tier),
    [ITEM_STAFF]: (level, rarity) => staff(level, rarity, tier),
    [ITEM_BOOK]: (level, rarity) => spell(level, rarity, tier),
  };

  // determine level
  const levels = {
    [TIER_I]: {
      min: 1,
      max: 10,
    },
    [TIER_II]: {
      min: 11,
      max: 15,
    },
    [TIER_III]: {
      min: 16,
      max: 20,
    },
    [TIER_IV]: {
      min: 21,
      max: 30,
    },
  };

  // determine rarity
  const rarities = {
    [RARITY_COMMON]: {
      min: 1,
      max: 80,
    },
    [RARITY_RARE]: {
      min: 81,
      max: 95,
    },
    [RARITY_EPIC]: {
      min: 96,
      max: 99,
    },
    [RARITY_LEGENDARY]: {
      min: 100,
      max: 100,
    },
  };

  // determine types of items
  const item_types = [ITEM_HAT, ITEM_ROBE, ITEM_STAFF, ITEM_BOOK];
  const items = [];
  for (let i = 0; i < num_items; i++) {
    const type = item_types[randomIntBetween(0, item_types.length - 1)];
    const level = randomIntBetween(levels[tier]?.min, max_level);
    const rarity_value = randomIntBetween(1, 100);
    let rarity = '';
    forEach(rarities, (value, key) => {
      if (rarity_value >= value.min && rarity_value <= value.max) rarity = key;
    });
    items.push(item_value[type]?.(level, rarity));
  }

  return items;
};

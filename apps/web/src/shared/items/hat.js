import {
  ATTRIBUTE_CRIT,
  ATTRIBUTE_RES3,
  ATTRIBUTE_RES1,
  ATTRIBUTE_MAGIC,
  ATTRIBUTE_RES2,
  ITEM_HAT,
  RARITY_COMMON,
  RARITY_EPIC,
  RARITY_LEGENDARY,
  RARITY_RARE,
} from 'core/mesh/state';
import { randomIntBetween } from 'core';
import { IconHat } from 'design/icons/hat.icon';
import { nanoid } from 'nanoid';
import { EQUIP_MAP } from 'core/utils/switch';

export const hat = (level, rarity, tier) => {
  const attribute_types = [
    ATTRIBUTE_RES1,
    ATTRIBUTE_RES2,
    ATTRIBUTE_RES3,
    ATTRIBUTE_MAGIC,
    ATTRIBUTE_CRIT,
  ];

  const chosen_attribute =
    attribute_types[randomIntBetween(0, attribute_types.length - 1)];

  const element_ranges = () => ({
    min: level * (rarity_multiplier - 10) + 1,
    max: level * rarity_multiplier,
  });

  const element_attribute = () => {
    const ranges = element_ranges();
    return randomIntBetween(ranges.min, ranges.max);
  };

  const rarity_multiplier = {
    [RARITY_COMMON]: 10,
    [RARITY_RARE]: 20,
    [RARITY_EPIC]: 30,
    [RARITY_LEGENDARY]: 40,
  }[rarity];

  const magic_attribute = () => {
    const min = 100;
    const max = Math.floor((level * 100) / 3) + (rarity_multiplier + 10);
    return randomIntBetween(min, max);
  };

  const crit_attribute = () => {
    const min = 100;
    const max = Math.floor((level * 100) / 3) + (rarity_multiplier + 10);
    return randomIntBetween(min, max);
  };

  const value = {
    [ATTRIBUTE_RES1]: () => element_attribute(),
    [ATTRIBUTE_RES2]: () => element_attribute(),
    [ATTRIBUTE_RES3]: () => element_attribute(),
    [ATTRIBUTE_MAGIC]: () => magic_attribute(),
    [ATTRIBUTE_CRIT]: () => crit_attribute(),
  }[chosen_attribute]?.();

  return {
    id: nanoid(),
    type: EQUIP_MAP[ITEM_HAT],
    attribute: chosen_attribute,
    rarity,
    level,
    value,
    icon: IconHat,
    tier,
    equip: '',
  };
};

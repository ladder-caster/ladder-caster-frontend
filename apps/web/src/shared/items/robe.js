import {
  ATTRIBUTE_CRIT,
  ATTRIBUTE_RESOURCE3,
  ATTRIBUTE_RESOURCE1,
  ATTRIBUTE_MAGIC,
  ATTRIBUTE_RESOURCE2,
  ITEM_ROBE,
  RARITY_COMMON,
  RARITY_EPIC,
  RARITY_LEGENDARY,
  RARITY_RARE,
} from 'core/remix/state';
import { randomIntBetween } from 'core';
import { IconCloak } from 'design/icons/cloak.icon';
import { nanoid } from 'nanoid';
import { EQUIP_MAP } from 'core/utils/switch';

export const robe = (level, rarity, tier) => {
  const attribute_types = [
    ATTRIBUTE_RESOURCE1,
    ATTRIBUTE_RESOURCE2,
    ATTRIBUTE_RESOURCE3,
    ATTRIBUTE_MAGIC,
    ATTRIBUTE_CRIT,
  ];

  const chosen_attribute =
    attribute_types[randomIntBetween(0, attribute_types.length - 1)];

  const rarity_multiplier = {
    [RARITY_COMMON]: 10,
    [RARITY_RARE]: 20,
    [RARITY_EPIC]: 30,
    [RARITY_LEGENDARY]: 40,
  }[rarity];

  const element_ranges = () => ({
    min: level * (rarity_multiplier - 10) + 1,
    max: level * rarity_multiplier,
  });

  const element_attribute = () => {
    const ranges = element_ranges();
    return randomIntBetween(ranges.min, ranges.max);
  };

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
    [ATTRIBUTE_RESOURCE1]: () => element_attribute(),
    [ATTRIBUTE_RESOURCE2]: () => element_attribute(),
    [ATTRIBUTE_RESOURCE3]: () => element_attribute(),
    [ATTRIBUTE_MAGIC]: () => magic_attribute(),
    [ATTRIBUTE_CRIT]: () => crit_attribute(),
  }[chosen_attribute]?.();

  return {
    id: nanoid(),
    type: EQUIP_MAP[ITEM_ROBE],
    attribute: chosen_attribute,
    rarity,
    level,
    value,
    icon: IconCloak,
    tier,
    equip: '',
  };
};

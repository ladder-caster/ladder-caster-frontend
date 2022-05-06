import React, { useMemo } from 'react';
import { _details, _text, _end, _risk, _odds, _cost } from './Details.styled';
import { useTranslation } from 'react-i18next';
import { IconFiree } from 'design/icons/firee.icon';
import { IconWater } from 'design/icons/water.icon';
import { IconEarth } from 'design/icons/earth.icon';
import { IconDice } from 'design/icons/dice.icon';
import {
  ATTRIBUTE_XP,
  ATTRIBUTE_RES3,
  ATTRIBUTE_RES1,
  ATTRIBUTE_ITEM,
  ATTRIBUTE_RES2,
  RARITY_COMMON,
  RARITY_EPIC,
  RARITY_LEGENDARY,
  RARITY_RARE,
  ATTRIBUTE_CRAFT,
} from 'core/remix/state';
import Craft from './craft/Craft';
import Item from './item/Item';
import Resource from './resource/Resource';
import Xp from './xp/Xp';

const Details = ({ item }) => {
  const { t } = useTranslation();

  const text = {
    [ATTRIBUTE_RES1]: <Resource type={item?.attribute} value={item?.value} />,
    [ATTRIBUTE_RES2]: <Resource type={item?.attribute} value={item?.value} />,
    [ATTRIBUTE_RES3]: <Resource type={item?.attribute} value={item?.value} />,
    [ATTRIBUTE_CRAFT]: <Craft level={item?.level} />,
    [ATTRIBUTE_ITEM]: <Item level={item?.level} />,
    [ATTRIBUTE_XP]: <Xp value={item?.value} />,
  }[item?.attribute];

  const odds = {
    [RARITY_COMMON]: t('modal.spell.odds.common'),
    [RARITY_RARE]: t('modal.spell.odds.rare'),
    [RARITY_EPIC]: t('modal.spell.odds.epic'),
    [RARITY_LEGENDARY]: t('modal.spell.odds.legendary'),
  }[item?.rarity];

  const elementIcon = useMemo(() => {
    switch (item?.costFeature) {
      case [ATTRIBUTE_RES1]: {
        return <IconResourcee1 />;
      }
      case [ATTRIBUTE_RES2]: {
        return <IconResource2 />;
      }
      case [ATTRIBUTE_RES3]: {
        return <IconResource3 />;
      }
      default: {
        return <IconEarth />;
      }
    }
  }, [item?.costFeature]);

  return (
    <_details>
      <_text>{text}</_text>
      <_end>
        <_risk>
          <_odds>
            <IconDice />
            <span>{odds}</span>
          </_odds>
          <_cost $costFeature={item?.costFeature}>
            {elementIcon}
            <span>{item?.cost}</span>
          </_cost>
        </_risk>
      </_end>
    </_details>
  );
};

export default Details;

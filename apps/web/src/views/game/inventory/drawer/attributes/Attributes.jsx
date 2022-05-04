import React from 'react';
import {
  _attributes,
  _value,
  _skill,
  _icon,
  _type,
  _description,
} from './Attributes.styled';
import { useTranslation } from 'react-i18next';
import {
  ATTRIBUTE_CRIT,
  ATTRIBUTE_RES3,
  ATTRIBUTE_RES1,
  ATTRIBUTE_MAGIC,
  ATTRIBUTE_RES2,
  ITEM_HAT,
  TIER_I,
  TIER_II,
  TIER_III,
  TIER_IV,
} from 'core/remix/state';
import IconSkill from '../../../../../shared/types/skill/IconSkill';
import DescriptionSkill from '../../../../../shared/types/skill/DescriptionSkill';

const Attributes = ({ info, spell }) => {
  const { t } = useTranslation();
  const type = info?.type;
  const rarity = info?.rarity;
  const value = info?.value;
  const tier = info?.tier;
  const attribute = info?.attribute;
  const level = info?.level;

  return (
    <_attributes>
      {attribute && (
        <_skill>
          <_icon $attribute={attribute}>
            <IconSkill spell={spell} attribute={attribute} />
          </_icon>
          <_description>
            <DescriptionSkill
              level={level}
              spell={spell}
              attribute={attribute}
              value={value}
            />
          </_description>
        </_skill>
      )}
    </_attributes>
  );
};

export default Attributes;

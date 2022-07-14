import React from 'react';
import {
  _attributes,
  _value,
  _skill,
  _icon,
  _type,
  _description,
} from './Attributes.styled';
import IconSkill from '../../../../shared/types/skill/IconSkill';
import DescriptionSkill from '../../../../shared/types/skill/DescriptionSkill';

const Attributes = ({ info, spell }) => {
  const value = info?.value;
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

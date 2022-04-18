import React from 'react';
import { _attributes, _attribute } from './Attributes.styled';
import IconAttribute from '../types/icons/IconAttribute';
import { IconHat } from '../../../../libs/design/icons/hat.icon';
import { IconCloak } from '../../../../libs/design/icons/cloak.icon';
import { IconStaff } from '../../../../libs/design/icons/staff.icon';

const Attributes = ({ caster }) => {
  const hat_attribute = caster?.hat?.attribute;
  const robe_attribute = caster?.robe?.attribute;
  const staff_attribute = caster?.staff?.attribute;

  return (
    <_attributes>
      <_attribute $attribute={hat_attribute}>
        {hat_attribute ? (
          <IconAttribute attribute={hat_attribute} />
        ) : (
          <IconHat />
        )}
      </_attribute>
      <_attribute $attribute={staff_attribute}>
        {staff_attribute ? (
          <IconAttribute attribute={staff_attribute} />
        ) : (
          <IconStaff />
        )}
      </_attribute>
      <_attribute $attribute={robe_attribute}>
        {robe_attribute ? (
          <IconAttribute attribute={robe_attribute} />
        ) : (
          <IconCloak />
        )}
      </_attribute>
    </_attributes>
  );
};

export default Attributes;

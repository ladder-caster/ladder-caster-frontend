import React, { useRef } from 'react';
import {
  _equipment,
  _body,
  _hat,
  _cloak,
  _staff,
  _spell,
  _inner,
  _empty,
  _shaft,
} from './Equipment.styled';
import { useSize } from 'core/hooks/useSize';
import { IconHat } from 'design/icons/hat.icon';
import { IconBook } from 'design/icons/book.icon';
import { IconStaff } from 'design/icons/staff.icon';
import { IconCloak } from 'design/icons/cloak.icon';
import { useActions } from '../../../../../../../actions';
import Item from '../../../../../../shared/item/Item';

const Equipment = ({ caster }) => {
  const equip_ref = useRef();
  const { chooseUnequip } = useActions();
  const { width } = useSize(equip_ref);
  const hat = caster?.hat;
  const robe = caster?.robe;
  const staff = caster?.staff;
  const spell = caster?.spell;

  const height = width - 32;

  return (
    <_equipment ref={equip_ref} $height={height}>
      <_body>
        <_hat onClick={() => chooseUnequip(hat, caster)}>
          <_inner $scale={0.95}>
            {hat ? <Item item={hat} /> : <IconHat />}
          </_inner>
        </_hat>
        <_cloak onClick={() => chooseUnequip(robe, caster)}>
          <_inner $scale={1.1}>
            {robe ? <Item item={robe} /> : <IconCloak />}
          </_inner>
        </_cloak>
      </_body>
      <_staff>
        <_spell onClick={() => chooseUnequip(spell, caster)}>
          <_inner>{spell ? <Item item={spell} /> : <IconBook />}</_inner>
        </_spell>
        <_shaft $scale={1.2} onClick={() => chooseUnequip(staff, caster)}>
          <_inner $scale={1.4} $staff={'45deg'}>
            {staff ? <Item item={staff} /> : <IconStaff />}
          </_inner>
        </_shaft>
      </_staff>
      <_empty></_empty>
    </_equipment>
  );
};

export default Equipment;

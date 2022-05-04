import React from 'react';
import { _pairs, _row } from './Pairs.styled';
import { TYPE_RES3, TYPE_RES1, TYPE_GOLD, TYPE_RES2 } from 'core/remix/state';
import Button from './button/Button';

const Pairs = () => {
  const gold_fire = `${TYPE_GOLD}/${TYPE_RES1}`;
  const gold_water = `${TYPE_GOLD}/${TYPE_RES2}`;
  const gold_earth = `${TYPE_GOLD}/${TYPE_RES3}`;
  const fire_water = `${TYPE_RES1}/${TYPE_RES2}`;
  const water_earth = `${TYPE_RES2}/${TYPE_RES3}`;
  const earth_fire = `${TYPE_RES3}/${TYPE_RES1}`;

  return (
    <_pairs>
      <_row>
        <Button pair={gold_fire} />
        <Button pair={fire_water} />
      </_row>
      <_row>
        <Button pair={gold_water} />
        <Button pair={water_earth} />
      </_row>
      <_row>
        <Button pair={gold_earth} />
        <Button pair={earth_fire} />
      </_row>
    </_pairs>
  );
};

export default Pairs;

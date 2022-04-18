import React from 'react';
import { _pairs, _row } from './Pairs.styled';
import { TYPE_EARTH, TYPE_FIRE, TYPE_GOLD, TYPE_WATER } from 'core/remix/state';
import Button from './button/Button';

const Pairs = () => {
  const gold_fire = `${TYPE_GOLD}/${TYPE_FIRE}`;
  const gold_water = `${TYPE_GOLD}/${TYPE_WATER}`;
  const gold_earth = `${TYPE_GOLD}/${TYPE_EARTH}`;
  const fire_water = `${TYPE_FIRE}/${TYPE_WATER}`;
  const water_earth = `${TYPE_WATER}/${TYPE_EARTH}`;
  const earth_fire = `${TYPE_EARTH}/${TYPE_FIRE}`;

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

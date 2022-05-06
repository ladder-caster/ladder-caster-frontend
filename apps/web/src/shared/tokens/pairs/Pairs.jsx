import React from 'react';
import { _pairs, _row } from './Pairs.styled';
import { TYPE_RES3, TYPE_RES1, TYPE_GOLD, TYPE_RES2 } from 'core/remix/state';
import Button from './button/Button';

const Pairs = () => {
  const gold_resource1 = `${TYPE_GOLD}/${TYPE_RES1}`;
  const gold_resource2 = `${TYPE_GOLD}/${TYPE_RES2}`;
  const gold_resource3 = `${TYPE_GOLD}/${TYPE_RES3}`;
  const resource1_resource2 = `${TYPE_RES1}/${TYPE_RES2}`;
  const resource2_resource3 = `${TYPE_RES2}/${TYPE_RES3}`;
  const resource3_resource1 = `${TYPE_RES3}/${TYPE_RES1}`;

  return (
    <_pairs>
      <_row>
        <Button pair={gold_resource1} />
        <Button pair={resource1_resource2} />
      </_row>
      <_row>
        <Button pair={gold_resource2} />
        <Button pair={resource2_resource3} />
      </_row>
      <_row>
        <Button pair={gold_resource3} />
        <Button pair={resource3_resource1} />
      </_row>
    </_pairs>
  );
};

export default Pairs;

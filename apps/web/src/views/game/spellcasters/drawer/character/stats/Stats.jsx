import React, { useState, useEffect, useCallback } from 'react';
import { _stats, _rows, _row, _bonus } from './Stats.styled';
import {
  ATTRIBUTE_CRIT,
  ATTRIBUTE_RESOURCE3,
  ATTRIBUTE_RESOURCE1,
  ATTRIBUTE_MAGIC,
  ATTRIBUTE_RESOURCE2,
} from 'core/remix/state';
import IconAttribute from '../../../../../../shared/types/icons/IconAttribute';

const Stats = ({ caster }) => {
  const [bonus, setBonus] = useState();

  useEffect(() => {
    let next_bonus = {};

    const addBonus = (item) => {
      const attribute = item?.attribute;
      const value = item?.value;

      next_bonus = {
        ...next_bonus,
        [attribute]: value + (next_bonus[attribute] || 0),
      };
    };

    if (caster?.hat) addBonus(caster?.hat);
    if (caster?.robe) addBonus(caster?.robe);
    if (caster?.staff) addBonus(caster?.staff);

    setBonus(next_bonus);
  }, [caster]);

  const row = useCallback(
    (attribute) => (
      <_row $attribute={attribute}>
        <IconAttribute attribute={attribute} />
        <_bonus $attribute={attribute}>{`+${bonus?.[attribute]} max`}</_bonus>
      </_row>
    ),
    [bonus],
  );

  return (
    <_stats>
      <_rows>
        {bonus?.[ATTRIBUTE_RESOURCE2] && row(ATTRIBUTE_RESOURCE2)}
        {bonus?.[ATTRIBUTE_RESOURCE1] && row(ATTRIBUTE_RESOURCE1)}
        {bonus?.[ATTRIBUTE_RESOURCE3] && row(ATTRIBUTE_RESOURCE3)}
        {bonus?.[ATTRIBUTE_CRIT] && row(ATTRIBUTE_CRIT)}
        {bonus?.[ATTRIBUTE_MAGIC] && row(ATTRIBUTE_MAGIC)}
      </_rows>
    </_stats>
  );
};

export default Stats;

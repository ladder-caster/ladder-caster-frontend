import React, { useEffect, useState } from 'react';
import { _power, _progress, _strength, _padding, _fill } from './Power.styled';
import { AnimateFill } from './animations/AnimateFill';
import { itemPowerLevel } from 'core/utils/numbers';
import usePrevious from 'core/hooks/usePrevious';

const Power = ({ progress, item, height, caster }) => {
  const [power, setPower] = useState();
  const prev_id = usePrevious(item?.id);
  const rarity = item?.rarity;

  useEffect(() => {
    if (caster) {
      const hat = (caster?.hat && itemPowerLevel(caster?.hat, true)) || 0;
      const robe = (caster?.robe && itemPowerLevel(caster?.robe, true)) || 0;
      const staff = (caster?.staff && itemPowerLevel(caster?.staff, true)) || 0;

      const next_power = Math.floor(((hat + robe + staff) / 3) * 100) / 100;

      if (next_power) setPower(next_power);
    } else if (item && prev_id !== item?.id) {
      setPower(itemPowerLevel(item));
    }
  }, [caster, item]);

  return (
    <_power $height={height}>
      {caster && (
        <_progress>
          <_padding>
            <AnimateFill power={power} height={height}>
              <_fill power />
            </AnimateFill>
          </_padding>
        </_progress>
      )}
      {!progress && (
        <_strength $rarity={rarity}>
          <_padding>
            <AnimateFill power={power} height={height}>
              <_fill $rarity={rarity} />
            </AnimateFill>
          </_padding>
        </_strength>
      )}
    </_power>
  );
};

export default Power;

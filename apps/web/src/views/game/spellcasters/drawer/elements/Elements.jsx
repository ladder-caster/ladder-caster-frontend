import React, { useMemo } from 'react';
import { _elements, _orb } from './Elements.styled';
import { IconFiree } from 'design/icons/firee.icon';
import { IconEarth } from 'design/icons/earth.icon';
import { IconWater } from 'design/icons/water.icon';
import { nanoid } from 'nanoid';
import { TYPE_RES3, TYPE_RES1, TYPE_RES2 } from 'core/remix/state';

const Elements = () => {
  const dummy_order = [TYPE_RES1, TYPE_RES2, TYPE_RES3];

  const orbs = () =>
    useMemo(
      () =>
        dummy_order.map((orb) => {
          const element = {
            [TYPE_RES1]: () => <IconFiree />,
            [TYPE_RES2]: () => <IconWater />,
            [TYPE_RES3]: () => <IconEarth />,
          };
          return (
            <_orb key={nanoid()} $color={orb}>
              {element?.[orb]?.()}
            </_orb>
          );
        }),
      [],
    );

  return <_elements>{orbs()}</_elements>;
};

export default Elements;

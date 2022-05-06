import React, { useMemo } from 'react';
import { _elements, _orb } from './Elements.styled';
import { IconResourcee1 } from 'design/icons/resourcee1.icon';
import { IconResource2 } from 'design/icons/resource2.icon';
import { IconResource3 } from 'design/icons/resource3.icon';
import { nanoid } from 'nanoid';
import { TYPE_RES3, TYPE_RES1, TYPE_RES2 } from 'core/remix/state';

const Elements = () => {
  const dummy_order = [TYPE_RES1, TYPE_RES2, TYPE_RES3];

  const orbs = () =>
    useMemo(
      () =>
        dummy_order.map((orb) => {
          const element = {
            [TYPE_RES1]: () => <IconResourcee1 />,
            [TYPE_RES2]: () => <IconResource2 />,
            [TYPE_RES3]: () => <IconResource3 />,
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

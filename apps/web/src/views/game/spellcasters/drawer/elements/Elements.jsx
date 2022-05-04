import React, { useMemo } from 'react';
import { _elements, _orb } from './Elements.styled';
import { IconResourcee1 } from 'design/icons/resourcee1.icon';
import { IconResource2 } from 'design/icons/resource2.icon';
import { IconResource3 } from 'design/icons/resource3.icon';
import { nanoid } from 'nanoid';
import {
  TYPE_RESOURCE3,
  TYPE_RESOURCE1,
  TYPE_RESOURCE2,
} from 'core/remix/state';

const Elements = () => {
  const dummy_order = [TYPE_RESOURCE1, TYPE_RESOURCE2, TYPE_RESOURCE3];

  const orbs = () =>
    useMemo(
      () =>
        dummy_order.map((orb) => {
          const element = {
            [TYPE_RESOURCE1]: () => <IconResourcee1 />,
            [TYPE_RESOURCE2]: () => <IconResource2 />,
            [TYPE_RESOURCE3]: () => <IconResource3 />,
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

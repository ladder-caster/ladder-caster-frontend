import React from 'react';
import { _heading, _divider, _title } from './Heading.styled';
import { TicksInstance } from '../../../App';
import Redeem from '../redeem/Redeem';
import Phases from '../phases/Phases';
import { CHAIN_CASTERS } from 'chain/hooks/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import { GAME_INIT } from 'core/remix/state';

const Heading = ({ title, flat, marketplace }) => {
  const [initialized] = useRemix(GAME_INIT);
  const [casters] = useRemix(CHAIN_CASTERS);

  return (
    <_heading key={'heading-component'}>
      <_title>
        <span>{title}</span>
        {initialized && casters?.length !== 0 && marketplace ? (
          <Redeem />
        ) : null}
      </_title>
      {TicksInstance}
      <Phases />
      {!flat || (flat && !initialized) || (flat && casters?.length === 0) ? (
        <_divider />
      ) : null}
    </_heading>
  );
};

export default Heading;

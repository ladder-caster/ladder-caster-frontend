import React from 'react';
import { _counter, _decrement, _increment, _amount } from './Counter.styled';
import { useRemix } from 'core/hooks/remix/useRemix';
import { TOKENS_ACTIVE } from 'core/remix/state';
import { IconDice } from 'design/icons/dice.icon';
import { useActions } from '../../../../../../../actions';
import { IconMinus } from 'design/icons/minus.icon';
import { IconPlus } from 'design/icons/plus.icon';

const Counter = () => {
  const [tokens] = useRemix(TOKENS_ACTIVE);
  const { decrementResource, incrementResource } = useActions();

  return (
    <_counter>
      <_decrement onClick={() => decrementResource()}>
        <IconMinus />
      </_decrement>
      <_amount>{tokens?.amount}</_amount>
      <_increment onClick={() => incrementResource()}>
        <IconPlus />
      </_increment>
    </_counter>
  );
};

export default Counter;

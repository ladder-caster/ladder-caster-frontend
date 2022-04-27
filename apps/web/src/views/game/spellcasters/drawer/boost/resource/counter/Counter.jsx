import React from 'react';
import {
  _counter,
  _amount,
  _decrement,
  _increment,
  _icon,
  _big,
} from './Counter.styled';
import { useActions } from '../../../../../../../../actions';
import { DRAWER_ACTIVE, DRAWER_CONTEXT, GAME_BOOST } from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import { IconMinus } from 'design/icons/minus.icon';
import { IconPlus } from 'design/icons/plus.icon';
import IconResource from '../../../../../../../shared/types/icons/IconResource';

const Counter = ({ element }) => {
  const [context] = useRemix(DRAWER_CONTEXT);
  const { decrementXP, incrementXP } = useActions();

  const amount = context?.[element];

  return (
    <_counter>
      <_big onClick={() => decrementXP(element, 1000)}>{'-1000'}</_big>
      <_big onClick={() => decrementXP(element, 100)}>{'-100'}</_big>
      <_decrement onClick={() => decrementXP(element)}>
        <IconMinus />
      </_decrement>
      <_amount>
        <_icon $element={element}>
          <IconResource isIMG type={element} />
        </_icon>
        <span>{amount}</span>
      </_amount>
      <_increment onClick={() => incrementXP(element)}>
        <IconPlus />
      </_increment>
      <_big onClick={() => incrementXP(element, 100)}>{'+100'}</_big>
      <_big onClick={() => incrementXP(element, 1000)}>{'+1000'}</_big>
    </_counter>
  );
};

export default Counter;

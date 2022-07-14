import React from 'react';
import { _button, _element } from './Button.styled';
import IconResource from '../../../../../../shared/types/icons/IconResource';
import { IconArrow } from 'design/icons/arrow.icon';
import { useActions } from '../../../../../../../actions';

const Button = ({ pair }) => {
  const { chooseTokenPair } = useActions();
  const input = pair?.split('/')?.[0];
  const output = pair?.split('/')?.[1];

  return (
    <_button onClick={() => chooseTokenPair(pair)}>
      <_element $element={input}>
        <IconResource type={input} />
      </_element>
      <IconArrow />
      <_element $element={output}>
        <IconResource type={output} />
      </_element>
    </_button>
  );
};

export default Button;

import React from 'react';
import { _input } from './Input.styled';
import { DRAWER_CONTEXT } from 'core/mesh/state';
import { useMesh } from 'core/state/mesh/useMesh';
import { useActions } from '../../../../actions';

const Input = ({ isBase }) => {
  const [context] = useMesh(DRAWER_CONTEXT);
  const { inputSwap } = useActions();

  const input = context?.input;
  const bind = {
    value: isBase ? input?.base : input?.quote,
    onChange: (event) => {
      inputSwap(isBase, event.target.value);
    },
  };

  return <_input placeholder={'1'} {...bind}></_input>;
};

export default Input;

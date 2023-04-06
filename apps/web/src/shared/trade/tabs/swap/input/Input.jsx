import React from 'react';
import { _input } from './Input.styled';
import { DRAWER_CONTEXT, GAME_RESOURCES } from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import { useMesh } from 'core/state/mesh/useMesh';
import { useActions } from '../../../../../../actions';

const Input = ({ isBase }) => {
  const [resources] = useRemix(GAME_RESOURCES);
  const [context] = useRemix(DRAWER_CONTEXT);
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

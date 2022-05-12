import React, { useEffect } from 'react';
import { _input } from './Input.styled';
import { useInput } from 'core/hooks/useInput';
import {
  DRAWER_CONTEXT,
  GAME_RESOURCES,
  TRADE_ORDERBOOK,
} from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import { useActions } from '../../../../../../actions';
import usePrevious from 'core/hooks/usePrevious';

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

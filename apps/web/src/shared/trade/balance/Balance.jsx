import React from 'react';
import { _balance } from './Balance.styled';
import { DRAWER_CONTEXT, GAME_RESOURCES } from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';

const Balance = ({ isBase, isQuote }) => {
  const [resources] = useRemix(GAME_RESOURCES);
  const [context] = useRemix(DRAWER_CONTEXT);
  const base = context?.base;
  const quote = context?.quote;
  const symbol = isBase ? base : isQuote ? quote : '';
  const amount =
    Math.floor(resources?.[symbol?.toLowerCase()] * 100) / 100 || 0;

  return (
    <_balance>
      {amount} {symbol}
    </_balance>
  );
};

export default Balance;

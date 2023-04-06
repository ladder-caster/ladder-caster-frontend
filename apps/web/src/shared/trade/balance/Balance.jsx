import React from 'react';
import { _balance } from './Balance.styled';
import { DRAWER_CONTEXT, GAME_RESOURCES } from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import { useMesh } from 'core/state/mesh/useMesh';

const Balance = ({ isBase, isQuote }) => {
  const [resources] = useRemix(GAME_RESOURCES);
  const [context] = useRemix(DRAWER_CONTEXT);
  const base = context?.base;
  const quote = context?.quote;
  const symbol = isBase ? base : isQuote ? quote : '';
  const amount =
    Math.floor(resources?.[symbol?.toLowerCase()] * 1e2) / 1e2 || 0;

  return (
    <_balance>
      <span>{symbol}</span>
      <span>{amount}</span>
    </_balance>
  );
};

export default Balance;

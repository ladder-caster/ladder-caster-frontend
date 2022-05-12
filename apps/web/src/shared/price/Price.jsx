import React from 'react';
import { _price, _rate, _progress, _container, _fill } from './Price.styled.js';
import { useOrderbook } from 'core/hooks/useOrderbook';
import { orderbookFill } from 'core/utils/numbers';
import { useActions } from '../../../actions';

const Price = () => {
  const { openDrawerTrade } = useActions();
  const orderbook = useOrderbook('LADA', 'USDC');
  const asks = orderbook?.['LADA/USDC']?.asks;
  const filled = orderbookFill(1, asks);
  const fill_percent = (1 / filled?.amount) * 100;
  const min_percent = fill_percent > 5 ? fill_percent : 5;
  const fill = filled?.amount ? `${min_percent}%` : '5%';

  return (
    <_price onClick={() => openDrawerTrade()}>
      <_rate>1 USDC = {filled?.amount} LADA</_rate>
      <_progress>
        <_container>
          <_fill style={{ transform: `translateX(${fill})` }} />
        </_container>
      </_progress>
    </_price>
  );
};

export default Price;

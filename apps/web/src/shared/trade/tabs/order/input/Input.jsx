import React, { useEffect } from 'react';
import { _input } from './Input.styled';
import {
  DRAWER_CONTEXT,
  GAME_RESOURCES,
  TRADE_ORDERBOOK,
} from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import { useActions } from '../../../../../../actions';
import usePrevious from 'core/hooks/usePrevious';
import { findMarket } from 'core/utils/markets';

const Input = ({ isBase }) => {
  const [resources] = useRemix(GAME_RESOURCES);
  const [orderbook] = useRemix(TRADE_ORDERBOOK);
  const [context] = useRemix(DRAWER_CONTEXT);
  const { inputOrder } = useActions();

  const input = context?.input;

  const base = context?.base;
  const quote = context?.quote;

  const pair = findMarket(base, quote);

  const orders = orderbook?.[pair?.market];
  const prev_orders = usePrevious(orders);

  const symbol = isBase ? base : quote;
  const max = Math.floor(resources?.[symbol?.toLowerCase()]) || 0;

  const decimals = pair?.decimals;

  useEffect(() => {
    if (orders?.pair !== prev_orders?.pair || !prev_orders) {
      if (isBase) {
        if (orders?.asks?.length > 0) {
          const highest_bid =
            orders?.bids?.length > 0 ? orders?.bids?.[0]?.[0] : 0;
          const min_price_step = 1 / Math.pow(10, decimals);

          let next_value = 0;

          if (highest_bid) next_value = highest_bid;
          else next_value = +orders?.asks?.[0]?.[0];
          //  - min_price_step;
          inputOrder(isBase, next_value);
        } else {
          inputOrder(isBase, '');
        }
      }
    }
  }, [pair, orders?.pair]);

  const bind = {
    value: isBase ? input?.base : input?.quote,
    onChange: (event) => {
      inputOrder(isBase, event.target.value);
    },
  };

  return <_input placeholder={max} {...bind}></_input>;
};

export default Input;

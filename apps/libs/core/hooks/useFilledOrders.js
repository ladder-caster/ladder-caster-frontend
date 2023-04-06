import { useEffect } from 'react';
import { DRAWER_CONTEXT, TRADE_FILLED_ORDERS } from '../remix/state';
import { useRemix } from './remix/useRemix';
import { useMesh } from 'core/state/mesh/useMesh';
import { CHAIN_LOCAL_CLIENT } from 'chain/hooks/state';
import { findMarket } from '../utils/markets';
import usePrevious from './usePrevious';
import { useActions } from 'web/actions';

export const useFilledOrders = () => {
  const [context] = useRemix(DRAWER_CONTEXT);
  const [client] = useRemix(CHAIN_LOCAL_CLIENT);
  const [orders, setOrders] = useRemix(TRADE_FILLED_ORDERS);
  const { getFilledOrders } = useActions();

  const base = context?.base;
  const quote = context?.quote;
  const pair = findMarket(base, quote);
  const market = `${pair?.base}/${pair?.quote}`;
  const prev_pair = usePrevious(pair);

  useEffect(async () => {
    if (pair !== prev_pair) {
      try {
        const next_orders = await getFilledOrders(pair);
        // setOrders({ ...orders, [market]: { ...next_orders, pair } });
      } catch (e) {
        setOrders({});
      }
    }
  }, [pair]);

  return orders;
};

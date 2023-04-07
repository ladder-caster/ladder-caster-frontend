import { useEffect } from 'react';
import { DRAWER_CONTEXT, TRADE_FILLED_ORDERS } from '../mesh/state';
import { useMesh } from './mesh/useMesh';
import { useMesh } from 'core/state/mesh/useMesh';
import { CHAIN_LOCAL_CLIENT } from 'chain/hooks/state';
import { findMarket } from '../utils/markets';
import usePrevious from './usePrevious';
import { useActions } from 'web/actions';

export const useFilledOrders = () => {
  const [context] = useMesh(DRAWER_CONTEXT);
  const [client] = useMesh(CHAIN_LOCAL_CLIENT);
  const [orders, setOrders] = useMesh(TRADE_FILLED_ORDERS);
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

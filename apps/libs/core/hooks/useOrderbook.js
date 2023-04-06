import { useEffect } from 'react';
import { DRAWER_CONTEXT, TRADE_ORDERBOOK } from '../remix/state';
import { useRemix } from './remix/useRemix';
import { useMesh } from 'core/state/mesh/useMesh';
import { findMarket } from '../utils/markets';
import { useActions } from 'web/actions';
import { CHAIN_LOCAL_CLIENT } from 'chain/hooks/state';
import usePrevious from './usePrevious';

export const useOrderbook = (base, quote) => {
  const [context] = useRemix(DRAWER_CONTEXT);
  const [client] = useRemix(CHAIN_LOCAL_CLIENT);
  const [orders, setOrders] = useRemix(TRADE_ORDERBOOK);
  const { getBidsAsks } = useActions();

  const next_base = base ? base : context?.base;
  const next_quote = quote ? quote : context?.quote;
  const pair = findMarket(next_base, next_quote);
  const market = `${pair?.base}/${pair?.quote}`;
  const prev_pair = usePrevious(pair);

  useEffect(async () => {
    if (pair && client?.connection && pair !== prev_pair) {
      try {
        const next_orders = await getBidsAsks(pair);
        setOrders({ ...orders, [market]: { ...next_orders, pair } });
        // subscribe to orderbook updates
      } catch (e) {
        setOrders({});
      }
    } else {
    }
  }, [pair, client]);

  return orders;
};

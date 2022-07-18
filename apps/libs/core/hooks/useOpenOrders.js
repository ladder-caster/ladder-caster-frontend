import { useEffect, useState, useCallback } from 'react';
import { DRAWER_CONTEXT } from '../remix/state';
import { useRemix } from './remix/useRemix';
import { findMarket } from '../utils/markets';
import { useActions } from 'web/actions';
import usePrevious from './usePrevious';

export const useOpenOrders = (isPersonal = false) => {
  const [context] = useRemix(DRAWER_CONTEXT);
  const [openOrders, setOrders] = useState([]);
  const [unsettledOrders, setUnsettledOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getOpenOrders, getUnsettledFunds } = useActions();

  const base = context?.base;
  const quote = context?.quote;
  const pair = findMarket(base, quote);
  const prev_pair = usePrevious(pair);

  const setStates = useCallback(async () => {
    try {
      setLoading(true);
      const orders = await getOpenOrders(pair, isPersonal);
      setLoading(false);
      setOrders(orders);
      setUnsettledOrders(await getUnsettledFunds(pair, orders));
    } catch (e) {
      console.log('orders error', e);
      setOrders([]);
      setUnsettledOrders([]);
      setLoading(false);
    }
  }, [pair]);

  useEffect(() => {
    if (pair !== prev_pair) {
      setStates();
    }
  }, [pair]);

  return {
    openOrders,
    unsettledOrders,
    pair,
    loading,
  };
};

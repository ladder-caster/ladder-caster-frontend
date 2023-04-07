import { useEffect, useState } from 'react';
import { DRAWER_CONTEXT } from '../mesh/state';
import { useMesh } from 'core/state/mesh/useMesh';
import { findMarket } from '../utils/markets';
import { useActions } from 'web/actions';
import usePrevious from './usePrevious';

export const useOpenOrders = (isPersonal = false) => {
  const [context] = useMesh(DRAWER_CONTEXT);
  const [openOrders, setOrders] = useState([]);
  const [unsettledOrders, setUnsettledOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getOpenOrders, getUnsettledFunds } = useActions();

  const base = context?.base;
  const quote = context?.quote;
  const pair = findMarket(base, quote);
  const prev_pair = usePrevious(pair);

  useEffect(async () => {
    if (pair !== prev_pair) {
      let newOrders = [];
      try {
        setLoading(true);
        newOrders = await getOpenOrders(pair, isPersonal);
        setOrders(newOrders);
        setLoading(false);
      } catch (e) {
        console.log('orders error 1', e);
        setOrders([]);
        setLoading(false);
      }

      try {
        setUnsettledOrders(await getUnsettledFunds(pair, newOrders));
      } catch (e) {
        setUnsettledOrders([]);
        console.log('orders error 2', e);
      }
    }
  }, [pair]);

  return {
    openOrders,
    unsettledOrders,
    pair,
    loading,
  };
};

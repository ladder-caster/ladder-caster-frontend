import React, { useMemo } from 'react';
import { _rate, _base, _equals, _quote, _empty } from './Rate.styled';
import { useMesh } from 'core/state/mesh/useMesh';
import { DRAWER_CONTEXT, SIDE_BUY, SIDE_SELL } from 'core/mesh/state';
import { useOrderbook } from 'core/hooks/useOrderbook';
import { findMarket } from 'core/utils/markets';
import { useTranslation } from 'react-i18next';

const Rate = () => {
  const { t } = useTranslation();
  const [context] = useMesh(DRAWER_CONTEXT);
  const orderbook = useOrderbook();
  const base = context?.base;
  const quote = context?.quote;
  const pair = findMarket(base, quote);
  const side = context?.side;

  const orders = {
    market: pair?.market,
    bids: orderbook?.[pair?.market]?.bids,
    asks: orderbook?.[pair?.market]?.asks,
  };

  const bid = +orders?.bids?.[0]?.[0] || 0;
  const ask = +orders?.asks?.[0]?.[0] || 0;

  const from = useMemo(() => {
    let symbol = '';
    let amount = 1;
    if (side === SIDE_BUY) {
      symbol = base;
      amount = 1;
    } else {
      symbol = quote;
      amount = bid ? Math.floor(1 / bid) : 0;
    }
    return (
      <_base>
        {amount} {symbol}
      </_base>
    );
  }, [side, base, quote, bid, ask]);

  const to = useMemo(() => {
    let symbol = '';
    let amount = 1;
    if (side === SIDE_BUY) {
      symbol = quote;
      amount = ask ? Math.floor(1 / ask) : 0;
    } else {
      symbol = base;
      amount = 1;
    }
    return (
      <_quote>
        {amount} {symbol}
      </_quote>
    );
  }, [side, base, quote, bid, ask]);

  return (
    <_rate>
      {(side === SIDE_BUY && ask) || (side === SIDE_SELL && bid) ? (
        <>
          {from}
          <_equals>≈</_equals>
          {to}
        </>
      ) : (
        <_empty>
          {t(
            `trade.swap.empty.${side === SIDE_BUY ? 'asks' : 'bids'}`,
          )?.toUpperCase()}
        </_empty>
      )}
    </_rate>
  );
};

export default Rate;

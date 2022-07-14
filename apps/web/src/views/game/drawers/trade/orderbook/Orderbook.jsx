import React, { useMemo, useRef } from 'react';
import {
  _orderbook,
  _header,
  _label,
  _orders,
  _asks,
  _center,
  _bids,
  _bid,
  _ask,
  _float,
  _bar,
  _fill,
  _size,
  _price,
  _click,
} from './Orderbook.styled';
import { nanoid } from 'nanoid';
import { useSize } from 'core/hooks/useSize';
import { useTranslation } from 'react-i18next';
import { AnimatePulse } from '../../../animations/AnimatePulse';
import { useOrderbook } from 'core/hooks/useOrderbook';
import { findMarket } from 'core/utils/markets';
import { DRAWER_CONTEXT } from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import { useActions } from '../../../../../../actions';

const Orderbook = () => {
  const [context] = useRemix(DRAWER_CONTEXT);
  const { inputOrder } = useActions();
  const orderbook = useOrderbook();
  const { t } = useTranslation();
  const book_ref = useRef();
  const { width } = useSize(book_ref);

  const keys = useMemo(
    () => ({
      asks: Array(20).fill(nanoid()),
      bids: Array(20).fill(nanoid()),
    }),
    [],
  );

  const base = context?.base;
  const quote = context?.quote;

  const pair = findMarket(base, quote);

  const orders = {
    market: pair?.market,
    bids: orderbook?.[pair?.market]?.bids,
    asks: orderbook?.[pair?.market]?.asks,
  };

  const total_orders = useMemo(() => {
    if (orders?.market) {
      let total = 0;
      let total_bids = 0;
      let total_asks = 0;
      let bids = [];
      let asks = [];
      for (let i = 0; i < 10; i++) {
        const bid = orders?.bids?.[i];
        const ask = orders?.asks?.[i];
        const amount_bid = bid?.[1] || 0;
        const amount_ask = ask?.[1] || 0;
        total_bids += amount_bid;
        total_asks += amount_ask;
        total += total_bids + total_asks;
        if (bid) {
          const next_bid = {
            key: keys?.bids?.[i],
            price: bid[0],
            size: bid[1],
            total: total_bids,
          };
          bids.push(next_bid);
        }
        if (ask) {
          const next_ask = {
            key: keys?.asks?.[i],
            price: ask[0],
            size: ask[1],
            total: total_asks,
          };
          asks.push(next_ask);
        }
      }
      return {
        ...orders,
        bids,
        asks,
        total,
        total_bids,
        total_asks,
      };
    }
  }, [orders]);

  const bids = useMemo(() => {
    if (total_orders?.bids) {
      const list = [];
      for (let i = 0; i < 3; i++) {
        const bid = total_orders?.bids?.[i];
        const key = `${bid?.key}${i}`;
        if (bid) {
          list.push(
            <_bid key={key}>
              <_size key={`${key}-size`}>{bid?.size}</_size>
              <_center>
                <_price key={`${key}-price`} $isBid>
                  {bid?.price}
                </_price>
                <_float key={`${key}-float`} $end>
                  <_bar key={`${key}-bar`} $width={width / 2} $end>
                    <_fill
                      $isBid
                      key={`${key}-fill`}
                      style={{
                        transform: `translateX(${
                          100 - (bid?.total / (total_orders?.total / 2)) * 100
                        }%)`,
                      }}
                    />
                  </_bar>
                </_float>
                <_float key={`${key}-float2`} $end>
                  <AnimatePulse>
                    <_click
                      key={`${key}-click`}
                      $width={width / 2 - 8}
                      onClick={() => inputOrder(true, bid?.price)}
                    />
                  </AnimatePulse>
                </_float>
              </_center>
            </_bid>,
          );
        } else break;
      }
      return list;
    }
  }, [total_orders, width]);

  const asks = useMemo(() => {
    if (total_orders?.asks) {
      const list = [];
      for (let i = 0; i < 3; i++) {
        const ask = total_orders?.asks?.[i];
        const key = `${ask?.key}${i}`;
        if (ask) {
          list.push(
            <_ask key={key}>
              <_center>
                <_float key={`${key}-float`}>
                  <_bar key={`${key}-bar`} $width={width / 2}>
                    <_fill
                      key={`${key}-fill`}
                      style={{
                        transform: `translateX(-${
                          100 - (ask?.total / (total_orders?.total / 2)) * 100
                        }%)`,
                      }}
                    />
                  </_bar>
                </_float>
                <_float key={`${key}-float2`}>
                  <AnimatePulse>
                    <_click
                      key={`${key}-click`}
                      $width={width / 2 - 8}
                      onClick={() => inputOrder(true, ask?.price)}
                    />
                  </AnimatePulse>
                </_float>
                <_price key={`${key}-price`}>{ask?.price}</_price>
              </_center>
              <_size key={`${key}-size`}>{ask?.size}</_size>
            </_ask>,
          );
        } else break;
      }
      return list;
    }
  }, [total_orders, width]);

  //TODO: change hardcoded
  return (
    <_orderbook ref={book_ref}>
      <_header>
        <_label>{t('orderbook.label.size')} (LADA)</_label>
        <_label>{t('orderbook.label.price')} (USDC)</_label>
        <_label>{t('orderbook.label.size')} (LADA)</_label>
      </_header>
      <_orders>
        <_bids>{bids}</_bids>
        <_asks>{asks}</_asks>
      </_orders>
    </_orderbook>
  );
};

export default Orderbook;

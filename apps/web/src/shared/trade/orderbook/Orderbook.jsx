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
} from './Orderbook.styled';
import { nanoid } from 'nanoid';
import { useSize } from 'core/hooks/useSize';
import { useTranslation } from 'react-i18next';

const Orderbook = () => {
  const { t } = useTranslation();
  const book_ref = useRef();
  const { width } = useSize(book_ref);

  const keys = useMemo(
    () => ({
      asks: Array(10).fill(nanoid()),
      bids: Array(10).fill(nanoid()),
    }),
    [],
  );

  const orders = {
    market: 'LADA/USDC',
    bids: [
      { price: 0.03, size: 7449 },
      { price: 0.02, size: 10902 },
      { price: 0.01, size: 13074 },
    ],
    asks: [
      { price: 0.04, size: 18011 },
      { price: 0.05, size: 7329 },
      { price: 0.06, size: 15548 },
    ],
  };

  const total_orders = useMemo(() => {
    let total = 0;
    let total_bids = 0;
    let total_asks = 0;
    let bids = [];
    let asks = [];
    for (let i = 0; i < 10; i++) {
      const bid = orders?.bids[i];
      const ask = orders?.asks[i];
      total_bids = bid ? total_bids + bid.size * bid.price : 0;
      total_asks = ask ? total_asks * (ask.size * ask.price) : 0;
      total += total_bids + total_asks;
      if (bid) {
        bids.push({
          key: keys?.bids?.[i],
          price: bid.price,
          size: bid.size,
          total: total_bids,
        });
      }
      if (ask) {
        asks.push({
          key: keys?.asks?.[i],
          price: ask.price,
          size: ask.size,
          total: total_asks,
        });
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
  }, [orders]);

  const bids = useMemo(() => {
    if (orders?.bids) {
      const list = [];
      let total = 0;
      for (let i = 0; i < 3; i++) {
        const bid = total_orders?.bids?.[i];
        if (bid) {
          list.push(
            <_bid key={bid?.key}>
              <_size key={`${bid?.key}-size`}>{bid?.size}</_size>
              <_center>
                <_price key={`${bid?.key}-price`} $isBid>
                  {bid?.price}
                </_price>
                <_float key={`${bid?.key}-float`} $end>
                  <_bar key={`${bid?.key}-bar`} $width={width / 2} $end>
                    <_fill
                      $isBid
                      key={`${bid?.key}-fill`}
                      style={{
                        transform: `translateX(${
                          ((bid?.total / total_orders?.total) * width) / 2
                        }px)`,
                      }}
                    />
                  </_bar>
                </_float>
              </_center>
            </_bid>,
          );
        } else break;
      }
      return list;
    }
  }, [orders, width]);

  const asks = useMemo(() => {
    if (orders?.asks) {
      const list = [];
      let total = 0;
      for (let i = 0; i < 3; i++) {
        const ask = total_orders?.asks?.[i];
        if (ask) {
          list.push(
            <_ask key={ask?.key}>
              <_center>
                <_float key={`${ask?.key}-float`}>
                  <_bar key={`${ask?.key}-bar`} $width={width / 2}>
                    <_fill
                      key={`${ask?.key}-fill`}
                      style={{
                        transform: `translateX(-${
                          ((ask?.total / total_orders?.total) * width) / 2
                        }px)`,
                      }}
                    />
                  </_bar>
                </_float>
                <_price key={`${ask?.key}-price`}>{ask?.price}</_price>
              </_center>
              <_size key={`${ask?.key}-size`}>{ask?.size}</_size>
            </_ask>,
          );
        } else break;
      }
      return list;
    }
  }, [orders, width]);

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

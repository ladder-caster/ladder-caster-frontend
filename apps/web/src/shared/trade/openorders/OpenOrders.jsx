import React, { useMemo } from 'react';
import {
  _orders,
  _header,
  _list,
  _order,
  _position,
  _icon,
  _numbers,
  _price,
  _size,
  _cancel,
  _button,
  _empty,
} from './OpenOrders.styled';
import { useOpenOrders } from 'core/hooks/useOpenOrders';
import LogoCoins from '../../types/icons/LogoCoins';
import { map } from 'lodash';
import { useActions } from '../../../../actions';
import { nanoid } from 'nanoid';
import { useTranslation } from 'react-i18next';

const OpenOrders = () => {
  const { t } = useTranslation();
  const { orders, pair, loading } = useOpenOrders();
  const { cancelOrder } = useActions();

  const symbol = pair?.quote;

  const open = useMemo(() => {
    if (orders?.length >= 1) {
      return map(orders, (order) => {
        return (
          <_order key={nanoid()}>
            <_position>
              <_icon>
                <LogoCoins ticker={symbol} />
              </_icon>
              <_numbers>
                <_price>{order?.price}</_price>
                <_size>{order?.size}</_size>
              </_numbers>
            </_position>
            <_cancel>
              <_button onClick={() => cancelOrder(pair, order)}>
                {t('drawer.trade.order.cancel')}
              </_button>
            </_cancel>
          </_order>
        );
      });
    } else {
      return <_empty>{t('drawer.trade.no_orders')}</_empty>;
    }
  }, [JSON.stringify(orders)]);

  const fetching = useMemo(() => {
    if (loading) {
      return <_empty>{t('drawer.trade.fetching')}</_empty>;
    }
  }, [loading]);

  return (
    <_orders>
      <_header>{t('drawer.trade.order.open')}</_header>
      <_list>{loading ? fetching : open}</_list>
    </_orders>
  );
};

export default OpenOrders;

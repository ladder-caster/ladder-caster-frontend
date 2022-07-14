import React from 'react';
import { _open, _orders, _settle } from './OpenOrders.styled.js';
import Settle from '../order/settle/Settle';
import OpenOrders from '../../openorders/OpenOrders';

const Orders = () => {
  return (
    <_open>
      <_orders>
        <OpenOrders />
      </_orders>
      <_settle>
        <Settle />
      </_settle>
    </_open>
  );
};

export default Orders;

import React, { useEffect } from 'react';
import {
  _order,
  _form,
  _row,
  _section,
  _input,
  _dropdown,
  _float,
  _balances,
  _orderbook,
  _settle,
} from './OrderTab.styled';
import Balance from '../../balance/Balance';
import { useTranslation } from 'react-i18next';
import Dropdown from '../../dropdown/Dropdown';
import { useActions } from '../../../../../actions';
import Orderbook from '../../orderbook/Orderbook';
import Input from './input/Input';
import Submit from './submit/Submit';
import Percent from './percent/Percent';
import OpenOrders from '../../openorders/OpenOrders';
import { _orders } from '../open/OpenOrders.styled';
import Settle from './settle/Settle';

const OrderTab = () => {
  const { t } = useTranslation();
  const { drawerTrade } = useActions();

  // useEffect(() => {
  //   // Get Price on mount and on symbol change create usePrice hooks
  //   drawerTrade();
  // }, []);

  return (
    <_order>
      <_form>
        <_row $zindex={3}>
          <_section>
            <_input>
              <_float>
                <_dropdown>
                  <Dropdown isBase label={t('dropdown.label.price')} />
                </_dropdown>
              </_float>
              <Input isBase />
            </_input>
          </_section>
          <Percent weight={0.25} isOrder />
        </_row>
        <_row $zindex={2}>
          <_section>
            <_input>
              <_float>
                <_dropdown>
                  <Dropdown isQuote label={t('dropdown.label.amount')} />
                </_dropdown>
              </_float>
              <Input />
            </_input>
          </_section>
          <Percent weight={0.5} isOrder />
        </_row>
        <_row>
          <_section $center>
            {/*<Profit />*/}
            <Submit isBuy />
            <Submit />
          </_section>
          <Percent weight={0.75} isOrder />
        </_row>
        <_row>
          <_section>
            <_balances>
              <Balance isBase />
              <Balance isQuote />
            </_balances>
          </_section>
          <Percent weight={1} isOrder />
        </_row>
      </_form>
      <_settle>
        <Settle />
      </_settle>
      <_orderbook>
        <Orderbook />
      </_orderbook>
      <_orders>
        <OpenOrders />
      </_orders>
    </_order>
  );
};

export default OrderTab;

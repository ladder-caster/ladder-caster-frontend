import React from 'react';
import {
  _order,
  _form,
  _row,
  _section,
  _input,
  _dropdown,
  _float,
  _percent,
  _balances,
  _submit,
  _switch,
  _orderbook,
} from './OrderTab.styled';
import { AnimatePercent } from '../../animations/AnimatePercent';
import Balance from '../../balance/Balance';
import { useTranslation } from 'react-i18next';
import Dropdown from '../../dropdown/Dropdown';
import { IconResource3IMG } from 'design/icons/resource3.icon';
import { AnimateSwitch } from '../../animations/AnimateSwitch';
import { IconSwap } from 'design/icons/swap.icon';
import { useActions } from '../../../../../actions';
import { COIN_USDC } from 'core/remix/coins';
import Orderbook from '../../orderbook/Orderbook';
import Input from '../../input/Input';

const OrderTab = () => {
  const { t } = useTranslation();
  const { switchTradeSymbols } = useActions();

  return (
    <_order>
      <_form>
        <_row $zindex={3}>
          <_section>
            <_input>
              <_float>
                <_dropdown $label>
                  <Dropdown
                    isBase
                    list={[COIN_USDC]}
                    label={t('dropdown.label.price')}
                  />
                </_dropdown>
              </_float>
              <Input />
            </_input>
          </_section>
          <AnimatePercent>
            <_percent>25%</_percent>
          </AnimatePercent>
        </_row>
        <_row $zindex={2}>
          <_section>
            <_input>
              <_float>
                <_dropdown>
                  <Dropdown isQuote />
                </_dropdown>
              </_float>
              <Input />
            </_input>
          </_section>
          <AnimatePercent>
            <_percent>50%</_percent>
          </AnimatePercent>
        </_row>
        <_row>
          <_section>
            <AnimateSwitch>
              <_switch onClick={() => switchTradeSymbols()}>
                <IconSwap />
              </_switch>
            </AnimateSwitch>
          </_section>
          <AnimatePercent>
            <_percent>75%</_percent>
          </AnimatePercent>
        </_row>
        <_row>
          <_section>
            <_balances>
              <Balance isBase />
              <Balance isQuote />
            </_balances>
            <_submit>{t('drawer.trade.order')}</_submit>
          </_section>
          <AnimatePercent>
            <_percent>100%</_percent>
          </AnimatePercent>
        </_row>
      </_form>
      <_orderbook>
        <Orderbook />
      </_orderbook>
    </_order>
  );
};

export default OrderTab;

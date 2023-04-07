import React, { useEffect } from 'react';
import {
  _swap,
  _form,
  _row,
  _section,
  _input,
  _float,
  _dropdown,
  _percent,
  _balances,
  _submit,
  _switch,
  _rate,
  _routing,
  _settle,
} from './SwapTab.styled';
import Input from './input/Input';
import Dropdown from '../../dropdown/Dropdown';
import { useTranslation } from 'react-i18next';
import { IconSwap } from 'design/icons/swap.icon';
import Balance from '../../balance/Balance';
import Rate from '../../rate/Rate';
import { useActions } from '../../../../../actions';
import { AnimateSwitch } from '../../animations/AnimateSwitch';
import Submit from './submit/Submit';
import Percent from './percent/Percent';
import Settle from '../order/settle/Settle';

const SwapTab = () => {
  const { t } = useTranslation();
  const { switchTradeSymbols, drawerTrade } = useActions();

  // useEffect(() => {
  //   drawerTrade();
  // }, []);

  return (
    <_swap>
      <_form>
        <_row $zindex={3}>
          <_section>
            <_input>
              <_float>
                <_dropdown>
                  <Dropdown isBase isSwap />
                </_dropdown>
              </_float>
              <Input isBase />
            </_input>
          </_section>
          <Percent weight={0.25} />
        </_row>
        <_row $zindex={2}>
          <_section>
            <_input>
              <_float>
                <_dropdown>
                  <Dropdown isQuote isSwap />
                </_dropdown>
              </_float>
              <Input />
            </_input>
          </_section>
          <Percent weight={0.5} />
        </_row>
        <_row>
          <_section>
            <AnimateSwitch>
              <_switch onClick={() => switchTradeSymbols()}>
                <IconSwap />
              </_switch>
            </AnimateSwitch>
            <_rate>
              <_routing>{t('drawer.trade.routing')}</_routing>
              <Rate />
            </_rate>
          </_section>
          <Percent weight={0.75} />
        </_row>
        <_row>
          <_section>
            <_balances>
              <Balance isBase />
              <Balance isQuote />
            </_balances>
            <Submit />
          </_section>
          <Percent weight={1} />
        </_row>
      </_form>
      <_settle>
        <Settle />
      </_settle>
    </_swap>
  );
};

export default SwapTab;

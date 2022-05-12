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
} from './SwapTab.styled';
import Input from '../../input/Input';
import Dropdown from '../../dropdown/Dropdown';
import { IconResource2IMG } from 'design/icons/resource2.icon';
import { IconResource3IMG } from 'design/icons/resource3.icon';
import { useTranslation } from 'react-i18next';
import { IconSwap } from 'design/icons/swap.icon';
import Balance from '../../balance/Balance';
import Rate from '../../rate/Rate';
import { useActions } from '../../../../../actions';
import { AnimateSwitch } from '../../animations/AnimateSwitch';
import { AnimatePercent } from '../../animations/AnimatePercent';

const SwapTab = () => {
  const { t } = useTranslation();
  const { switchTradeSymbols } = useActions();

  useEffect(() => {
    // Get Price on mount and on symbol change create usePrice hooks
  }, []);

  return (
    <_swap>
      <_form>
        <_row $zindex={3}>
          <_section>
            <_input>
              <_float>
                <_dropdown>
                  <Dropdown isBase />
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
                  <Dropdown isQuote Logo={IconResource3IMG} />
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
            <_rate>
              <_routing>{t('drawer.trade.routing')}</_routing>
              <Rate base={'FRO'} quote={'ROOT'} />
            </_rate>
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
            <_submit>{t('drawer.trade.swap')}</_submit>
          </_section>
          <AnimatePercent>
            <_percent>100%</_percent>
          </AnimatePercent>
        </_row>
      </_form>
    </_swap>
  );
};

export default SwapTab;

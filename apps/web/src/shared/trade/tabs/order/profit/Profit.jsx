import React, { useEffect, useState } from 'react';
import {
  _profit,
  _bid,
  _ask,
  _bar,
  _point,
  _slider,
  _float,
  _indicator,
} from './Profit.styled';
import { AnimateBar } from '../../../animations/AnimateBar';
import { DRAWER_CONTEXT, SIDE_BUY, SIDE_SELL } from 'core/remix/state';
import { useActions } from '../../../../../../actions';
import { useRemix } from 'core/hooks/remix/useRemix';

const Profit = () => {
  const [context] = useRemix(DRAWER_CONTEXT);
  const { chooseOrderSide } = useActions();
  const buy = context?.side === SIDE_BUY;

  console.log('context', context);

  return (
    <_profit>
      <_bid $active={buy} onClick={() => chooseOrderSide(SIDE_BUY)}>
        <AnimateBar bid active={buy}>
          <_bar $isBid>
            {buy && (
              <_point>
                <_slider $isBid />
              </_point>
            )}
          </_bar>
        </AnimateBar>
        <_float $isBid>
          {/*<_indicator $active={buy} $isBid>50% profit</_indicator>*/}
        </_float>
      </_bid>
      <_ask $active={!buy} onClick={() => chooseOrderSide(SIDE_SELL)}>
        <AnimateBar active={!buy}>
          <_bar>
            {!buy && (
              <_point>
                <_slider />
              </_point>
            )}
          </_bar>
        </AnimateBar>
        <_float>
          {/*<_indicator $active={!buy}>50% profit</_indicator>*/}
        </_float>
      </_ask>
    </_profit>
  );
};

export default Profit;

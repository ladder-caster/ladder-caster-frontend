import React from 'react';
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
import { DRAWER_CONTEXT, SIDE_BUY, SIDE_SELL } from 'core/mesh/state';
import { useActions } from '../../../../../../actions';
import { useMesh } from 'core/state/mesh/useMesh';

const Profit = () => {
  const [context] = useMesh(DRAWER_CONTEXT);
  const { chooseOrderSide } = useActions();
  const buy = context?.side === SIDE_BUY;

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

import React from 'react';
import { _option } from './Option.styled';
import LogoCoins from '../../../../../../../shared/types/icons/LogoCoins';
import { AnimateOption } from '../../../animations/AnimateOption';

const Option = ({ symbol, click }) => {
  return (
    <AnimateOption>
      <_option onClick={() => click && click()}>
        {symbol ? <LogoCoins ticker={symbol} /> : null}
        <span>{symbol}</span>
      </_option>
    </AnimateOption>
  );
};

export default Option;

import React, { useMemo } from 'react';
import { _options } from './Options.styled';
import LogoCoins from '../../../types/icons/LogoCoins';
import { DRAWER_CONTEXT } from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import Option from './option/Option';
import { forEach } from 'lodash';

const Options = ({ isBase, selected, other, click }) => {
  const [context] = useRemix(DRAWER_CONTEXT);
  const coins = context?.coins;

  console.log('selected', selected);
  console.log('other', other);

  const options = useMemo(() => {
    let list = [];
    forEach(coins, (coin) => {
      if (selected !== coin?.symbol && other !== coin.symbol)
        list.push(
          <Option
            isBase={isBase}
            symbol={coin?.symbol}
            selected={selected === coin?.symbol}
            click={() => click(isBase, coin?.symbol)}
          />,
        );
    });
    return list;
  }, [coins, selected]);

  return <_options>{options}</_options>;
};

export default Options;

import React, { useMemo } from 'react';
import { _options } from './Options.styled';
import { DRAWER_CONTEXT, SIDE_BUY, SIDE_SELL } from 'core/mesh/state';
import { useMesh } from 'core/state/mesh/useMesh';
import Option from './option/Option';
import { forEach } from 'lodash';

const Options = ({ isSwap, isBase, selected, other, click }) => {
  const [context] = useMesh(DRAWER_CONTEXT);
  const fiat = context?.fiat;
  const coins = context?.coins;
  const side = context?.side;

  const options = useMemo(() => {
    let list = [];

    const listFiat = () => {
      forEach(fiat, (coin) => {
        list.push(
          <Option
            isBase={isBase}
            symbol={coin?.symbol}
            selected={selected === coin?.symbol}
            click={() => click(isBase, coin?.symbol)}
          />,
        );
      });
    };

    const listCoins = () => {
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
    };

    if (isSwap) {
      if ((isBase && side === SIDE_BUY) || (!isBase && side === SIDE_SELL))
        listFiat();
      else if ((isBase && side === SIDE_SELL) || (!isBase && side === SIDE_BUY))
        listCoins();
    } else {
      if (isBase) listFiat();
      else listCoins();
    }

    return list;
  }, [coins, selected]);

  return <_options>{options}</_options>;
};

export default Options;

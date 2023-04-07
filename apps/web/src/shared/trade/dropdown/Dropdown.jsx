import React, { useRef, useState, useEffect } from 'react';
import {
  _dropdown,
  _select,
  _resource,
  _logo,
  _symbol,
  _chevron,
  _float,
  _options,
  _label,
} from './Dropdown.styled';
import { IconChevronDown } from 'design/icons/chevron-down.icon';
import { useMesh } from 'core/state/mesh/useMesh';
import { DRAWER_CONTEXT, SIDE_BUY } from 'core/mesh/state';
import LogoCoins from '../../types/icons/LogoCoins';
import Options from './options/Options';
import { useActions } from '../../../../actions';
import { useClickOutside } from 'core/hooks/useClickOutside';

const Dropdown = ({ isSwap, isBase, isQuote, list, label }) => {
  const [context] = useMesh(DRAWER_CONTEXT);
  const { tradeDropdownClick } = useActions();
  const [active, setActive] = useState(false);
  const base = context?.base;
  const quote = context?.quote;
  const side = context?.side;
  const isBuy = side === SIDE_BUY;
  const base_coin = isSwap
    ? isBase
      ? isBuy
        ? base
        : quote
      : isBuy
      ? quote
      : base
    : isBase
    ? base
    : quote;
  const quote_coin = base_coin === base ? base : quote;

  const symbol = isBase ? base_coin : isQuote ? quote_coin : '';
  const options_ref = useRef();

  useClickOutside(options_ref, () => setActive(false));

  const selectOption = (isBase, symbol) => {
    setActive(false);
    tradeDropdownClick(isBase, symbol);
  };

  return (
    <>
      <_dropdown
        ref={options_ref}
        $label={label}
        zindex={active ? 'drawer_high' : 'drawer_base'}
      >
        <_select onClick={() => setActive(!active)}>
          <_resource>
            <_logo>{symbol ? <LogoCoins ticker={symbol} /> : null}</_logo>
            {!label && <_symbol>{symbol}</_symbol>}
          </_resource>
          <_chevron>
            <IconChevronDown />
          </_chevron>
        </_select>
        <_float>
          {active && (
            <Options
              isSwap={isSwap}
              selected={symbol}
              other={isBase ? quote : base}
              isBase={isBase}
              click={(isBase, symbol) => selectOption(isBase, symbol)}
              list={list}
            />
          )}
        </_float>
      </_dropdown>
      {label && (
        <_label>
          <span>{label}</span>
        </_label>
      )}
    </>
  );
};

export default Dropdown;

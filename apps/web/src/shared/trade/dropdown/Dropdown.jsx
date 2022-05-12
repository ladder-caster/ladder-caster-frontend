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
import { useRemix } from 'core/hooks/remix/useRemix';
import { DRAWER_CONTEXT } from 'core/remix/state';
import LogoCoins from '../../types/icons/LogoCoins';
import Options from './options/Options';
import { useActions } from '../../../../actions';
import { useClickOutside } from 'core/hooks/useClickOutside';

const Dropdown = ({ isBase, isQuote, list, label }) => {
  const [context] = useRemix(DRAWER_CONTEXT);
  const { tradeDropdownClick } = useActions();
  const [active, setActive] = useState(false);
  const base = context?.base;
  const quote = context?.quote;
  const symbol = list ? list[0] : isBase ? base : isQuote ? quote : '';
  const options_ref = useRef();

  useEffect(() => {
    if (isBase && list && !list.includes(context?.base))
      tradeDropdownClick(true, list[0]);
    else if (!isBase && list && !list.includes(context?.quote))
      tradeDropdownClick(false, list[0]);
  }, [list, context]);

  useClickOutside(options_ref, () => setActive(false));

  const selectOption = (isBase, symbol) => {
    setActive(false);
    tradeDropdownClick(isBase, symbol);
  };

  return (
    <_dropdown
      ref={options_ref}
      $label={label}
      zindex={active ? 'drawer_high' : 'drawer_base'}
    >
      {!list && (
        <_select onClick={() => setActive(!active)}>
          <_resource>
            <_logo>{symbol ? <LogoCoins ticker={symbol} /> : null}</_logo>
            <_symbol>{symbol}</_symbol>
          </_resource>
          <_chevron>
            <IconChevronDown />
          </_chevron>
        </_select>
      )}
      {list && (
        <_label>
          <_logo>{symbol ? <LogoCoins ticker={symbol} /> : null}</_logo>
          <span>{label}</span>
        </_label>
      )}
      <_float>
        {((list && list.length > 1) || !list) && active && (
          <Options
            selected={symbol}
            other={isBase ? quote : base}
            isBase={isBase}
            click={(isBase, symbol) => selectOption(isBase, symbol)}
            list={list}
          />
        )}
      </_float>
    </_dropdown>
  );
};

export default Dropdown;

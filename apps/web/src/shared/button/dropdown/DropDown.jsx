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

import Options from './options/Options';
import { useClickOutside } from 'core/hooks/useClickOutside';

const DropDown = ({ options, callback, selected }) => {
  const [active, setActive] = useState(false);
  const toggleActive = () => setActive(!active);
  const options_ref = useRef();
  useClickOutside(options_ref, () => setActive(false));
  return (
    <>
      <_dropdown
        ref={options_ref}
        $label={selected.label}
        zindex={active ? 'drawer_high' : 'drawer_base'}
      >
        <_select onClick={toggleActive}>
          <_resource>
            <_logo>{selected && selected.icon}</_logo>
            {!selected.label && <_symbol>{selected.symbol}</_symbol>}
          </_resource>
          <_chevron>
            <IconChevronDown />
          </_chevron>
        </_select>
        <_float>
          {active && (
            <Options selected={selected} click={callback} options={options} />
          )}
        </_float>
        {selected.label && <_label>{selected.label}</_label>}
      </_dropdown>
    </>
  );
};
export default DropDown;

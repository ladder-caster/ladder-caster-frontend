import React from 'react';
import {
  _header_container,
  _header_title,
  _header_subtitle,
  _float,
  _column,
} from './Header.styled';

import { IconClose } from 'design/icons/close.icon';
import { useActions } from 'hooks/useActions';
const Header = ({ title, subtitle }) => {
  const { closeDrawer } = useActions();
  return (
    <_header_container>
      <_column>
        <_header_title>{title}</_header_title>
        <_header_subtitle>{subtitle}</_header_subtitle>
      </_column>
      <_float>
        <_header_close>
          <_header_close_icon onClick={closeDrawer}>
            <IconClose />
          </_header_close_icon>
        </_header_close>
      </_float>
    </_header_container>
  );
};
export default Header;

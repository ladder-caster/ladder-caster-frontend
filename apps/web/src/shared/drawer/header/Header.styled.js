import styled from 'styled-components';
import { m } from 'framer-motion';
import { _float as _f } from 'design/styles/containers/_float';
import { _column as _c } from 'design/styles/containers/_containers';
import {
  _header_container as _container,
  _header_title as _title,
  _header_subtitle as _subtitle,
  _header_close_icon as _close_icon,
  _header_close as _close,
} from 'design/styles/drawer/header/_header';
export const _header_container = styled(m.div)`
  ${_container}
`;
export const _header_title = styled(m.div)`
  ${_title}
`;
export const _subtitle = styled(m.div)`
  ${_subtitle}
`;
export const _header_close = styled(m.div)`
  ${_close}
`;
export const _header_close_icon = styled(m.div).attrs(({ theme, pulse }) => {
  return {
    whileHover: {
      color: pulse && theme.text['active'],
    },
  };
})`
  ${_close_icon}
`;
export const _float = styled(m.div)`
  ${_f}
`;
export const _column = styled(m.div)`
  ${_c}
`;

import styled from 'styled-components';
import { m } from 'framer-motion';
import {
  _toggle_container,
  _toggle_background as _background,
  _toggle_orb as _orb,
} from 'design/styles/buttons/_toggle.css';

export const _container = styled(m.div)`
  ${_toggle_container}
`;

export const _toggle_background = styled(m.div)`
  ${_background}
`;
export const _toggle_orb = styled(m.div)`
  ${_orb}
`;

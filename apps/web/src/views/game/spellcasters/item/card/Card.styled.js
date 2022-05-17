import styled from 'styled-components';
import { m } from 'framer-motion';

export const _card = styled(m.div)`
  min-width: ${({ $caster }) => ($caster ? '88px' : '80px')};
  width: ${({ $caster }) => ($caster ? '88px' : '80px')};
  min-height: ${({ $caster }) => ($caster ? '88px' : '80px')};
  height: ${({ $caster }) => ($caster ? '88px' : '80px')};
  left: ${({ $caster }) => ($caster ? '0' : '4px')};
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid
    ${({ theme, $caster }) => ($caster ? `transparent` : theme.border['high'])};
  cursor: pointer;
  opacity: ${({ $disabled, theme }) =>
    $disabled ? theme.opacity['disabled'] : theme.opacity['enabled']};
`;

export const _icon = styled(m.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  > svg {
    min-width: 36px;
    width: 36px;
    min-height: 36px;
    height: 36px;
    color: ${({ theme }) => theme.text['base']};
  }
  > img {
    /* min-width: 36px; */
    width: 80px;
    /* min-height: 36px; */
    height: 80px;
    bottom: 2px;
    color: ${({ theme }) => theme.text['base']};
  }
`;

export const _caster = styled(m.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

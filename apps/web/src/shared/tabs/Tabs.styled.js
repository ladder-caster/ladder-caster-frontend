import { m } from 'framer-motion';
import styled, { css } from 'styled-components';

export const _tabs = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

export const _header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px 0 20px 0;
  ${({ $padding }) =>
    $padding &&
    css`
      padding-left: 16px;
      padding-right: 16px;
    `};
`;

export const _view = styled.div`
  width: 100%;
  min-height: 85%;
  display: flex;
  flex-direction: row;
`;

export const _tab = styled(m.div)`
  backface-visibility: hidden;
  margin-right: 16px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  &:last-child {
    margin-right: 0;
  }
`;
export const _tab_span = styled(m.span).attrs(
  ({ theme, $active, $pulse }) => {
    const pulse = $pulse && !$active;
    return {
      animate: {
        scale: pulse ? 1.05 : 1,
        color: pulse
          ? theme.text['input']
          : theme.text[$active ? 'active' : 'base'],
      },
      transition: {
        duration: 1,
        ease: 'easeOut',
        repeat: pulse ? Infinity : 0,
        repeatDelay: 0.5,
        repeatType: 'mirror',
      },
      whileHover: {
        color: $active ? theme.text['active'] : theme.text['faded'],
        transition: {
          duration: 0.3,
          ease: 'easeInOut',
        },
      },
    };
  },
)`
  backface-visibility: hidden;
  transform: translateZ(0);
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme, $active }) =>
    $active ? theme.text['active'] : theme.text['base']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  padding: 0 4px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`;
export const _back = styled.div`
  min-width: 16px;
  width: 16px;
  min-height: 16px;
  height: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 16px;
  cursor: pointer;
  bottom: 2px;
  > svg {
    min-width: 16px;
    width: 16px;
    min-height: 16px;
    height: 16px;
    color: ${({ theme }) => theme.text['faded']};
  }
`;

export const _line = styled.div`
  width: 100%;
  min-height: 3px;
  height: 3px;
  border-radius: 50px;
  display: flex;
  overflow: hidden;
  > div {
    width: 100%;
    height: 100%;
    background: ${({ $active, theme }) =>
      $active ? theme.text['active'] : 'none'};
    border-radius: 50px;
  }
`;

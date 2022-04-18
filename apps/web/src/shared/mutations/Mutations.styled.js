import styled from 'styled-components';
import { m } from 'framer-motion';

export const _mutations = styled.div`
  width: 100%;
  min-height: 64px;
  padding: 8px 0;
  pointer-events: ${({ $active }) => ($active ? 'all' : 'none')};
`;

export const _wrapper = styled(m.div)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 16px;
  border: 2px solid
    ${({ theme, $success, $error }) =>
      theme.border[$success ? 'success' : $error ? 'error' : 'high']};
  background: ${({ theme, $success, $error }) =>
    theme.background[$success ? 'success' : $error ? 'error' : 'base']};
  box-shadow: ${({ theme, $success, $error }) =>
    theme.shadow[$success ? 'success' : $error ? 'error' : 'frost']};
  overflow: hidden;
`;

export const _overlay = styled(m.div)`
  position: relative;
  z-index: ${({ theme }) => theme.zindex['fetch_low']};
  width: 100%;
  height: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const _shimmer = styled(m.div)`
  min-width: 48px;
  height: ${({ $height }) => ($height ? `${$height}px` : '44px')};
  min-height: ${({ $height }) => ($height ? `${$height}px` : '44px')};
  background: linear-gradient(
    90deg,
    transparent 0%,
    transparent 20%,
    ${({ theme, $success, $error }) =>
        theme.border[$success ? 'success' : $error ? 'error' : 'high']}
      50%,
    transparent 80%,
    transparent 100%
  );
`;

export const _container = styled(m.div)`
  position: relative;
  z-index: ${({ theme }) => theme.zindex['fetch_base']};
  width: 100%;
  min-height: 100%;
  height: 100%;
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const _body = styled(m.div)`
  width: calc(100% - 36px);
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const _icon = styled(m.div)`
  min-width: 44px;
  width: 44px;
  min-height: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  > svg {
    min-width: 20px;
    width: 20px;
    min-height: 20px;
    height: 20px;
    color: ${({ theme, $color }) => ($color ? $color : theme.text['base'])};
  }
`;

export const _text = styled(m.div)`
  width: 100%;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 0;
  line-height: 1.1;
  color: ${({ theme, $color }) => ($color ? $color : theme.text['base'])};
`;

export const _queue = styled(m.div)`
  min-width: 40px;
  width: 40px;
  padding-right: 2px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  > span {
    min-width: 36px;
    width: 36px;
    min-height: 36px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    font-weight: 700;
    color: ${({ theme }) => theme.text['base']};
  }
`;

export const _float = styled(m.div)`
  width: 100%;
  height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
`;

export const _spinner = styled(m.div)`
  min-width: 36px;
  width: 36px;
  min-height: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  > svg {
    min-width: 36px;
    width: 36px;
    min-height: 36px;
    height: 36px;
  }
`;

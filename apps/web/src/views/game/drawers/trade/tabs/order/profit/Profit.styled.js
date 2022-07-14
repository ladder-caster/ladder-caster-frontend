import styled, { css } from 'styled-components';
import { m } from 'framer-motion';

export const _profit = styled.div`
  width: 100%;
  min-height: 40px;
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  top: 2px;
`;

export const _bid = styled.div`
  min-width: 50%;
  width: 50%;
  height: 100%;
  padding: 0 8px 0 8px;
  display: flex;
  flex-direction: column;
  align-items: center;

  cursor: pointer;
`;

export const _ask = styled.div`
  min-width: 50%;
  width: 50%;
  height: 100%;
  padding: 0 8px 0 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

export const _bar = styled(m.div)`
  min-height: 12px;
  height: 12px;
  width: 100%;
  border-radius: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${({ $isBid }) => ($isBid ? 'flex-end' : 'flex-start')};
`;

export const _point = styled(m.div)`
  width: 0;
  height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const _slider = styled(m.div)`
  min-width: 20px;
  width: 20px;
  min-height: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${({ theme, $isBid }) =>
    $isBid ? theme.border['success'] : theme.border['error']};
  box-shadow: ${({ theme }) => theme.shadow['sphere']};
`;

export const _float = styled(m.div)`
  width: 0;
  height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const _indicator = styled(m.div)`
  top: 8px;
  height: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.5px;
  color: ${({ theme, $isBid }) => theme.text[$isBid ? 'success' : 'error']};
  white-space: nowrap;
  pointer-events: none;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
`;

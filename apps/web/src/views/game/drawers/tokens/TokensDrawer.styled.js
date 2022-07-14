import styled from 'styled-components';
import { m } from 'framer-motion';

export const _tokens = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 16px;
`;

export const _header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px 0;
`;

export const _title = styled.div`
  width: 100%;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['base']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
`;

export const _float = styled.div`
  width: 0;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
`;

export const _close = styled.div`
  min-width: 36px;
  width: 36px;
  min-height: 36px;
  height: 36px;
  cursor: pointer;
`;

export const _icon = styled(m.div)`
  min-width: 100%;
  width: 100%;
  min-height: 100%;
  height: 100%;
  border-radius: 10px;
  background: ${({ theme }) => theme.background['highest']};
  box-shadow: ${({ theme }) => theme.shadow['glass']};
  display: flex;
  justify-content: center;
  align-items: center;
  > svg {
    min-width: 16px;
    width: 16px;
    min-height: 16px;
    height: 16px;
    color: ${({ theme }) => theme.text['base']};
  }
`;

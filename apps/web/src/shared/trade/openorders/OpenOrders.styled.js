import styled from 'styled-components';
import { m } from 'framer-motion';

export const _orders = styled.div`
  width: 100%;
  display: flex;
  min-height: 102px;
  flex-direction: column;
  margin-top: 32px;
  margin-bottom: 40px;
`;

export const _header = styled.div`
  width: 100%;
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['base']};
  padding-bottom: 8px;
  border-bottom: 2px solid ${({ theme }) => theme.border['high']};
`;

export const _list = styled.div`
  width: 100%;
  padding: 0 8px;
`;

export const _order = styled.div`
  width: 100%;
  min-height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 8px;
  border-bottom: 2px solid ${({ theme }) => theme.border['high']};
  &:last-child {
    border-bottom: none;
  }
`;

export const _position = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const _icon = styled.div`
  min-width: 28px;
  width: 28px;
  min-height: 28px;
  height: 28px;
  > img {
    min-width: 28px;
    width: 28px;
    min-height: 28px;
    height: 28px;
  }
`;

export const _numbers = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 20px;
`;

export const _price = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme, $isBuy }) =>
    $isBuy ? theme.text['success'] : theme.text['error']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
`;

export const _size = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text['base']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
`;

export const _cancel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const _button = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text['error']};
  cursor: pointer;
`;

export const _empty = styled.div`
  width: 100%;
  min-height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text['base']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
`;

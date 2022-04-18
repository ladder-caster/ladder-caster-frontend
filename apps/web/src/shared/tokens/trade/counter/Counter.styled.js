import styled from 'styled-components';

export const _counter = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 16px 0;
`;

export const _decrement = styled.div`
  min-width: 48px;
  width: 48px;
  min-height: 48px;
  height: 48px;
  border-radius: 50%;
  box-shadow: ${({ theme }) => theme.shadow['frost']};
  display: flex;
  justify-content: center;
  align-items: center;
  > svg {
    min-width: 24px;
    width: 24px;
    min-height: 24px;
    height: 24px;
    color: ${({ theme }) => theme.text['base']};
  }
`;

export const _increment = styled.div`
  min-width: 48px;
  width: 48px;
  min-height: 48px;
  height: 48px;
  border-radius: 50%;
  box-shadow: ${({ theme }) => theme.shadow['frost']};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  > svg {
    min-width: 24px;
    width: 24px;
    min-height: 24px;
    height: 24px;
    color: ${({ theme }) => theme.text['base']};
  }
`;

export const _amount = styled.div`
  font-size: 18px;
  font-weight: 700;
  text-shadow: ${({ theme }) => theme.shadow['text']};
  color: ${({ theme }) => theme.text['base']};
  margin-left: 8px;
  margin-right: 8px;
  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }
`;

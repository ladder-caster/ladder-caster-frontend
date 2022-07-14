import styled from 'styled-components';

export const _counter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const _decrement = styled.div`
  min-width: 36px;
  width: 36px;
  min-height: 36px;
  height: 36px;
  border-radius: 50%;
  box-shadow: ${({ theme }) => theme.shadow['frost']};
  background: ${({ theme }) => theme.background['highest']};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  > svg {
    min-width: 16px;
    width: 16px;
    min-height: 16px;
    height: 16px;
    color: ${({ theme }) => theme.text['base']};
  }
`;

export const _increment = styled.div`
  min-width: 36px;
  width: 36px;
  min-height: 36px;
  height: 36px;
  border-radius: 50%;
  box-shadow: ${({ theme }) => theme.shadow['frost']};
  background: ${({ theme }) => theme.background['highest']};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  > svg {
    min-width: 16px;
    width: 16px;
    min-height: 16px;
    height: 16px;
    color: ${({ theme }) => theme.text['base']};
  }
`;

export const _amount = styled.div`
  width: 100%;
  min-width: 88px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }
  > span {
    font-size: 18px;
    font-weight: 700;
    text-shadow: ${({ theme }) => theme.shadow['text']};
    color: ${({ theme }) => theme.text['base']};
  }
`;

export const _icon = styled.div`
  min-height: 32px;
  height: 32px;
  margin-right: 8px;
  > svg,
  > img {
    min-height: 32px;
    height: 32px;
    color: ${({ theme, $element }) => theme[$element]?.resource};
  }
`;

export const _big = styled.div`
  min-width: 36px;
  width: 36px;
  min-height: 36px;
  height: 36px;
  border-radius: 50%;
  box-shadow: ${({ theme }) => theme.shadow['frost']};
  background: ${({ theme }) => theme.background['highest']};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 9px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['base']};
  margin: 0 8px;
  &:first-child {
    margin-right: 0;
  }
  &:last-child {
    margin-left: 0;
  }
`;

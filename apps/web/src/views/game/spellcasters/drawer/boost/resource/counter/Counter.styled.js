import styled from 'styled-components';

export const _counter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const _decrement = styled.div`
  min-width: 48px;
  width: 48px;
  min-height: 48px;
  height: 48px;
  border-radius: 50%;
  box-shadow: ${({ theme }) => theme.shadow['frost']};
  background: ${({ theme }) => theme.background['highest']};
  display: flex;
  flex-direction: row;
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

export const _increment = styled.div`
  min-width: 48px;
  width: 48px;
  min-height: 48px;
  height: 48px;
  border-radius: 50%;
  box-shadow: ${({ theme }) => theme.shadow['frost']};
  background: ${({ theme }) => theme.background['highest']};
  display: flex;
  flex-direction: row;
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
  width: 100%;
  min-width: 88px;
  margin-left: 8px;
  margin-right: 8px;
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
  min-width: 48px;
  width: 48px;
  min-height: 48px;
  height: 48px;
  border-radius: 50%;
  box-shadow: ${({ theme }) => theme.shadow['frost']};
  background: ${({ theme }) => theme.background['highest']};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 10px;
  font-weight: 500;
  color: ${({ theme }) => theme.text['base']};
  margin: 0 8px;
`;

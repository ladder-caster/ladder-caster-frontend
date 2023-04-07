import { ATTRIBUTE_RES1 } from 'core/mesh/state';
import styled from 'styled-components';

export const _details = styled.div`
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 32px;
`;

export const _text = styled.div`
  width: 100%;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text['base']};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0 16px 0;
  > b {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 8px;
    border-radius: 8px;
    font-size: 16px;
    background: ${({ theme }) => theme.background['base']};
    border: 2px solid ${({ theme }) => theme.border['base']};
    padding: 8px 16px;
    font-weight: 700;
    color: ${({ theme }) => theme[ATTRIBUTE_RES1]['resource']};
    > svg {
      min-width: 18px;
      width: 18px;
      min-height: 18px;
      height: 18px;
      color: ${({ theme }) => theme[ATTRIBUTE_RES1]['resource']};
      margin-right: 4px;
    }
  }
`;

export const _end = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: flex-end;
`;

export const _risk = styled.div`
  width: 100%;
  min-height: 48px;
  height: 48px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px;
  background: ${({ theme }) => theme.background['bottom']};
  box-shadow: ${({ theme }) => theme.shadow['cutout']};
  padding: 8px 20px;
  margin-bottom: 8px;
`;

export const _odds = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  > svg {
    min-width: 18px;
    width: 18px;
    min-height: 18px;
    height: 18px;
    color: ${({ theme }) => theme.text['base']};
  }
  > span {
    top: 1px;
    font-size: 16px;
    font-weight: 700;
    color: ${({ theme }) => theme.text['base']};
    padding-left: 12px;
  }
`;

export const _cost = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  > svg {
    min-width: 18px;
    width: 18px;
    min-height: 18px;
    height: 18px;
    color: ${({ theme, $costFeature }) => theme[$costFeature]['resource']};
  }
  > span {
    top: 1px;
    font-size: 16px;
    font-weight: 700;
    color: ${({ theme, $costFeature }) => theme[$costFeature]['resource']};
    padding-left: 4px;
  }
`;

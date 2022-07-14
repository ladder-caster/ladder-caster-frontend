import styled from 'styled-components';

export const _resources = styled.div`
  width: 100%;
  min-height: 64px;
  padding: 8px 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadow['cutout']};
  background: ${({ theme }) => theme.background['base']};
  margin-right: 8px;
  margin-left: 8px;
  cursor: pointer;
  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }
  > svg {
    min-width: 24px;
    width: 24px;
    min-height: 24px;
    height: 24px;
    color: ${({ theme }) => theme.text['faded']};
    margin-left: 8px;
    margin-right: 8px;
  }
`;

export const _element = styled.div`
  min-width: 24px;
  width: 24px;
  min-height: 24px;
  height: 24px;
  > svg {
    min-width: 24px;
    width: 24px;
    min-height: 24px;
    height: 24px;
    color: ${({ theme, $element }) => theme[$element]?.resource};
  }
`;

import styled from 'styled-components';

export const _trade = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
`;

export const _swap = styled.div`
  width: 100%;
  min-height: 64px;
  padding: 8px 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadow['frost']};
  background: ${({ theme }) => theme.background['highest']};
  margin-right: 8px;
  margin-left: 8px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['base']};
`;

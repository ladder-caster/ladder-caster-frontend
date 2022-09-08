import styled from 'styled-components';

export const _trade = styled.div``;

export const _link = styled.a`
  padding: 8px 16px;
  border-radius: 50px;
  box-shadow: ${({ theme }) => theme.shadow['glass']};
  background: ${({ theme }) => theme.background['special']};
  font-size: 10px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['special']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  bottom: 6px;
  cursor: pointer;
`;

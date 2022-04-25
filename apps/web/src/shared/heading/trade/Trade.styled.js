import styled from 'styled-components';

export const _trade = styled.div`

`;

export const _button = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['ghost']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  letter-spacing: 0.5px;
  background: transparent;
  box-shadow: ${({ theme }) => theme.shadow['ghost']};
  padding: 8px 14px;
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  bottom: 4px;
`;

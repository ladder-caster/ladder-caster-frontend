import styled from 'styled-components';

export const _redeem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

export const _button = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['ghost']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  letter-spacing: 0.5px;
  line-height: 1;
  background: transparent;
  box-shadow: ${({ theme }) => theme.shadow['ghost']};
  padding: 8px 14px;
  border-radius: 12px;
  position: relative;
  bottom: 4px;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.background['highest']};
    transform: scale(1.02);
    color: ${({ theme }) => theme.text['active']};
  }
`;

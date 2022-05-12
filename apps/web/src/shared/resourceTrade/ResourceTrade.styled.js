import styled from 'styled-components';

export const _redeem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  &:first-child {
    margin-right: 8px;
  }
  &:last-child {
    margin-right: 0;
  }
`;

export const _button = styled.div`
  min-height: 29px;
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['ghost']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  letter-spacing: 0.5px;
  line-height: 1;
  background: ${({ theme }) => theme.background['bottom']};
  box-shadow: ${({ theme }) => theme.shadow['cutout']};
  padding: 8px 14px;
  border-radius: 50px;
  position: relative;
  bottom: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: ${({ theme }) => theme.background['highest']};
    transform: scale(1.02);
    color: ${({ theme }) => theme.text['active']};
  }
`;

import styled from 'styled-components';

export const _balance = styled.div`
  width: 100%;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text['base']};
  letter-spacing: 0.5px;
  margin-bottom: 4px;
  line-height: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding-right: 20px;
  > span {
    &:first-child {
      min-width: 48px;
      margin-right: 12px;
    }
  }
  &:last-child {
    margin-bottom: 0;
  }
`;

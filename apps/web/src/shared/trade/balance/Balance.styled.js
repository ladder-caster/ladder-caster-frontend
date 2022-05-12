import styled from 'styled-components';

export const _balance = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text['base']};
  letter-spacing: 0.5px;
  margin-bottom: 4px;
  line-height: 1;
  &:last-child {
    margin-bottom: 0;
  }
`;

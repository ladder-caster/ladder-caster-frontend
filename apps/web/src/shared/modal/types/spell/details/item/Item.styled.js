import styled from 'styled-components';

export const _item = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text['base']};
  > span {
    font-size: 16px;
    font-weight: 500;
    color: ${({ theme }) => theme.legendary['resource']};
    white-space: nowrap;
  }
`;

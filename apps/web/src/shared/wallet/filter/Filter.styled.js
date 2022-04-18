import styled from 'styled-components';

export const _filter = styled.div`
  min-width: 32px;
  width: 32px;
  min-height: 32px;
  height: 32px;
  border-radius: 50px;
  background: ${({ theme }) => theme.background['highest']};
  box-shadow: ${({ theme }) => theme.shadow['frost']};
  display: flex;
  justify-content: center;
  align-items: center;
  > svg {
    min-width: 20px;
    width: 20px;
    min-height: 20px;
    height: 20px;
    color: ${({ theme }) => theme.text['base']};
  }
`;

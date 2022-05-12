import styled from 'styled-components';

export const _breakpoint = styled.div`
  min-width: 100%;
  width: 100%;
  padding: 0 16px;
  > div {
    display: flex;
    width: 100%;
    height: 3px;
    min-height: 3px;
    max-height: 3px;
    border-radius: 50px;
    background: ${({ theme }) => theme.background['base']};
    box-shadow: ${({ theme }) => theme.shadow['divider']};
  }
`;

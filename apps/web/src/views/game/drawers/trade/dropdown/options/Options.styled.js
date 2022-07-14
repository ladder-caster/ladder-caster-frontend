import styled from 'styled-components';

export const _options = styled.div`
  min-width: 120px;
  max-height: 240px;
  display: flex;
  flex-direction: column;
  overflow: scroll;
  background: ${({ theme }) => theme.background['button_active']};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadow['frost']};
  top: 6px;
  right: 6px;
  padding: 2px;
`;

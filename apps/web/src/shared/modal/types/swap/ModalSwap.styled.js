import styled from 'styled-components';
import { m } from 'framer-motion';

export const _swap = styled.div`
  min-width: 100%;
  width: 100%;
  min-height: ${({ $height }) => `${$height}px`};
  height: ${({ $height }) => `${$height}px`};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  overflow-y: scroll;
`;

export const _actions = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const _board = styled(m.div)`
  width: 100%;
  max-width: 320px;
  background: ${({ theme }) => theme.background['lowest']};
  box-shadow: ${({ theme }) => theme.shadow['frost']};
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 16px 8px 16px;
  margin-bottom: 24px;
`;

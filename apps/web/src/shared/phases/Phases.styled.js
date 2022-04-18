import styled from 'styled-components';
import { m } from 'framer-motion';

export const _phases = styled.div`
  width: 100%;
  height: 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const _phase = styled(m.div)`
  min-width: 33.33%;
  width: 33.33%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 10px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['base']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  letter-spacing: 1px;
`;

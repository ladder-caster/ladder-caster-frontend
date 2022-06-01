import styled from 'styled-components';
import { m } from 'framer-motion';
export const _mint = styled.div``;
export const _count = styled(m.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  width: 100%;
  padding: 8px;
`;
export const _count_counter = styled(m.div)`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.text['base']};
`;
export const _count_button = styled(m.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  background: ${({ theme }) => theme.background['base']};
  box-shadow: ${({ theme }) => theme.shadow['frost']};
  cursor: pointer;
`;
export const _count_button_text = styled(m.div)`
  color: ${({ theme }) => theme.text['base']};
`;

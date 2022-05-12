import styled from 'styled-components';
import { m } from 'framer-motion';

export const _percent = styled(m.div)`
  min-width: 56px;
  width: 56px;
  min-height: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow['ghost']};
  margin-left: 16px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.text['base']};
  cursor: pointer;
`;

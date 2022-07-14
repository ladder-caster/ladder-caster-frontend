import styled from 'styled-components';
import { m } from 'framer-motion';

export const _submit = styled.div`
  min-width: 120px;
  width: 120px;
  height: 100%;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['special']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  background: ${({ theme }) => theme.background['special']};
  box-shadow: ${({ theme }) => theme.shadow['frost']};
  letter-spacing: 0.5px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

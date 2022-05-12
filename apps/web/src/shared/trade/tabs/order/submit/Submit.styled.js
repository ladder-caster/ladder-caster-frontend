import styled from 'styled-components';
import { m } from 'framer-motion';

export const _submit = styled.button`
  width: 100%;
  height: 100%;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme, $isBid }) =>
    $isBid ? theme.text['success'] : theme.text['error']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  background: ${({ theme, $isBid }) =>
    $isBid ? theme.background['success'] : theme.background['error']};
  border: 2px solid
    ${({ theme, $isBid }) =>
      $isBid ? theme.border['success'] : theme.border['error']};
  letter-spacing: 0.5px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  &:first-child {
    margin-right: 1px;
    border-radius: 50px 8px 8px 50px;
  }
  &:last-child {
    margin-left: 1px;
    border-radius: 8px 50px 50px 8px;
  }
`;

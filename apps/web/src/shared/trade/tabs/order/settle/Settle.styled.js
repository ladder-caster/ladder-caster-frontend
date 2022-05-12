import styled from 'styled-components';

export const _settle = styled.div`
  min-width: 100%;
  width: 100%;
  min-height: 40px;
  height: 40px;
`;

export const _button = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 8px;
  background: ${({ theme }) => theme.background['active']};
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['base']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  opacity: ${({ $active }) => ($active ? 1 : 0.5)};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ $active }) => ($active ? 'pointer' : 'default')};
`;

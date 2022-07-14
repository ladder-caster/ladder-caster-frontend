import styled, { css } from 'styled-components';
import { m } from 'framer-motion';

export const _tab = styled.div`
  width: 100%;
  height: 100%;
  /* max-height: ${({ $height }) => $height && `${$height - 80}px`}; */
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding-top: 16px;
`;

export const buttonStyle = css`
  padding: 10px 12px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.text['base']};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadow['frost']};
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: ${({ theme }) => theme.background['button_active']};
  }
`;

export const _button = styled.div`
  ${buttonStyle}
`;

export const _disconnect = styled(m.div)`
  width: 100%;
  min-height: 48px;
  height: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  margin-top: auto;
  color: ${({ theme }) => theme.text['logout']};
  cursor: pointer;
`;

export const _link = styled.a`
  ${buttonStyle}
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;

  > svg {
    height: 14px;
    width: 14px;
  }
`;

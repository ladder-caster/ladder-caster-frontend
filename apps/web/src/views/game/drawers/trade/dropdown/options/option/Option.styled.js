import styled from 'styled-components';
import { m } from 'framer-motion';

export const _option = styled(m.div)`
  min-width: 108px;
  min-height: 44px;
  height: 44px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid ${({ theme }) => theme.highlight['border']};
  &:first-child {
    border-top: none;
    border-top-left-radius: 14px;
    border-top-right-radius: 14px;
  }
  &:last-child {
    border-bottom: none;
    border-bottom-left-radius: 14px;
    border-bottom-right-radius: 14px;
  }
  > img {
    max-width: 100%;
    height: auto;
    max-height: 24px;
    color: ${({ $background }) => $background};
  }
  > svg {
    min-width: 24px;
    width: 24px;
    min-height: 24px;
    height: 24px;
    max-width: 100%;
    max-height: 28px;
    color: ${({ $background }) => $background};
  }
  > span {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: ${({ theme }) => theme.text['input']};
    text-shadow: ${({ theme }) => theme.shadow['text']};
    padding: 0 8px;
    top: 1px;
  }
`;

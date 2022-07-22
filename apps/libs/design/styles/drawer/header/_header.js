import { css } from 'styled-components';

export const _header_container = css`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${({ $padding }) => $padding ?? '0'};
`;

export const _header_title = css`
  width: 100%;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['base']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
`;

export const _header_subtitle = css`
  margin-top: 8px;
  width: 100%;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  color: ${({ theme }) => theme.text['base']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  font-style: italic;
`;

export const _header_close = css`
  min-width: 36px;
  width: 36px;
  min-height: 36px;
  height: 36px;
  cursor: pointer;
  margin-bottom: ${({ $marginBottom }) => $marginBottom && `${$marginBottom}`};
`;
export const _header_close_icon = css`
  min-width: 100%;
  width: 100%;
  min-height: 100%;
  height: 100%;
  border-radius: 10px;
  background: ${({ theme }) => theme.background['highest']};
  box-shadow: ${({ theme }) => theme.shadow['glass']};
  display: flex;
  justify-content: center;
  align-items: center;
  > svg {
    min-width: 16px;
    width: 16px;
    min-height: 16px;
    height: 16px;
    color: ${({ theme }) => theme.text['base']};
  }
`;

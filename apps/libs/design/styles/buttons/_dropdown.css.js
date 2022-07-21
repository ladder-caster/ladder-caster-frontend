import { css } from 'styled-components';
import { _empty_float } from 'design/styles/containers';
export const _dropdown_container = css`
  min-width: ${({ $label }) => ($label ? '60px' : '108px')};
  width: ${({ $label }) => ($label ? '60px' : '108px')};
  min-height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: ${({ $right }) => ($right ? 'flex-end' : 'flex-start')};
  cursor: pointer;
`;
export const _dropdown_select = css`
  width: 100%;
  min-height: 100%;
  height: 100%;
  border-radius: 50px;
  background: ${({ theme }) => theme.background['highest']};
  box-shadow: ${({ theme }) => theme.shadow['frost']};
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 8px;
`;

export const _dropdown_resource = css`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
export const _dropdown_logo = css`
  min-width: 20px;
  width: 20px;
  min-height: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  > img {
    max-width: 100%;
    height: auto;
    max-height: 32px;
    color: ${({ $background }) => $background};
  }
  > svg {
    min-width: 20px;
    min-height: 20px;
    max-width: 100%;
    height: auto;
    max-height: 20px;
    color: ${({ $background }) => $background};
  }
`;
export const _dropdown_symbol = css`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.text['base']};
  padding: 0 6px;
  top: 1px;
`;
export const _dropdown_chevron = css`
  min-width: 12px;
  width: 12px;
  min-height: 12px;
  height: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  > svg {
    max-width: 100%;
    height: auto;
    max-height: 28px;
    color: ${({ theme }) => theme.text['faded']};
  }
`;
export const _dropdown_float = _empty_float;

export const _dropdown_options = _empty_float;

export const _dropdown_label = css`
  width: 0;
  min-height: 0;
  height: 100%;
  pointer-events: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 4px;
  > span {
    font-size: 14px;
    font-weight: 700;
    color: ${({ theme }) => theme.text['faded']};
    text-shadow: ${({ theme }) => theme.shadow['text']};
    padding-left: 8px;
    top: 1px;
  }
`;

export const _dropdown_options_container = css`
  min-width: 120px;
  max-height: 240px;
  display: flex;
  flex-direction: column;
  overflow: scroll;
  background: ${({ theme }) => theme.background['button_active']};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadow['frost']};
  top: 6px;
  right: 6px;
  padding: 2px;
`;
export const _dropdown_option = css`
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

import styled from 'styled-components';
import { m } from 'framer-motion';
import { TextureFur } from 'design/textures/fur.texture';
import { bgTexture } from 'design/textures';

export const _queue = styled.div`
  width: 100%;
  min-height: 96px;
  height: 96px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 16px 0 12px;
`;

export const _action = styled(m.div)`
  min-width: 52px;
  width: 52px;
  min-height: 52px;
  height: 52px;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow['frost']};
  cursor: pointer;
  margin-right: 16px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  &:last-child {
    margin-right: 0;
  }
`;

export const _button = styled(m.div)`
  min-width: 52px;
  width: 52px;
  min-height: 52px;
  height: 52px;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow['frost']};
  cursor: pointer;
  margin-right: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8px 4px 4px 4px;
  &:last-child {
    margin-right: 0;
  }
  > svg {
    min-width: 24px;
    width: 24px;
    min-height: 24px;
    height: 24px;
    color: ${({ theme }) => theme.text['faded']};
  }
  > span {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.5px;
    color: ${({ theme }) => theme.text['base']};
    padding-top: 2px;
  }
`;

export const _icon = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8px 4px 4px 4px;
  > svg {
    min-width: 24px;
    width: 24px;
    min-height: 24px;
    height: 24px;
    color: ${({ theme, $element, $basic }) =>
      $basic ? theme.text?.['base'] : theme[$element]?.['text']};
    opacity: 0.65;
  }
  > span {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.5px;
    opacity: 0.85;
    color: ${({ theme, $element, $basic }) =>
      $basic ? theme.text?.['base'] : theme[$element]?.['text']};
    padding-top: 2px;
  }
`;

export const _float = styled.div`
  width: 0;
  min-height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
`;

export const _lock = styled(m.div)`
  min-width: 28px;
  width: 28px;
  min-height: 28px;
  height: 28px;
  border-radius: 50px;
  background: ${({ theme, $element, $basic }) =>
    $basic ? theme.background['base'] : theme[$element]?.['button']};
  box-shadow: ${({ theme }) => theme.shadow['frost']};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme, $element, $basic }) =>
    $basic ? theme.text['base'] : theme[$element]?.['text']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  cursor: pointer;
  pointer-events: none;
  top: 7px;
  left: -7px;
  margin-right: 12px;
  &:last-child {
    margin-right: 0;
  }
  > svg {
    min-width: 12px;
    width: 12px;
    min-height: 12px;
    height: 12px;
    color: ${({ theme, $element, $basic }) =>
      $basic ? theme.text['base'] : theme[$element]?.['text']};
    opacity: 0.65;
  }
`;

export const _actions = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 6px 16px 10px 4px;
  > svg {
    min-width: 16px;
    width: 16px;
    min-height: 16px;
    height: 16px;
    margin: 0 8px;
    color: ${({ theme }) => theme.border['highest']};
    filter: drop-shadow(${({ theme }) => theme.shadow['text']});
  }
`;

export const _title = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['base']};
  margin-bottom: 8px;
  white-space: nowrap;
  padding-left: 4px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  > b {
    color: ${({ theme, $optimal }) => theme.text[$optimal ? 'faded' : 'base']};
    font-size: 12px;
    font-weight: 700;
    text-shadow: ${({ theme }) => theme.shadow['text']};
    border-radius: 10px;
    border: 2px solid
      ${({ theme, $optimal }) => theme.border[$optimal ? 'high' : 'highest']};
    margin-left: 12px;
    bottom: 2px;
    letter-spacing: 1px;
    padding: 2px 6px 2px 7px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const _claim = styled(m.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme['legendary']?.['tile']};
  background-image: ${({ theme }) =>
    bgTexture(TextureFur(theme['legendary']?.['texture'], 0.16))};
  background-size: 8px;
  background-repeat: repeat;
  box-shadow: ${({ theme }) => theme.shadow['glass']};
  border: 2px solid ${({ theme }) => theme['legendary']?.['dark_tile']};
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme['legendary']?.['text']};
  text-shadow: 2px 2px 3px ${({ theme }) => theme['legendary']?.['dark_tile']};
  letter-spacing: 0.5px;
  white-space: nowrap;
  cursor: pointer;
`;

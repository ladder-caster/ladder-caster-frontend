import { css } from 'styled-components';

export const _toggle_container = css`
  display: flex;
  flex-direction: row;
  height: 40px;
  width: 60px;
  padding: 8px;
  cursor: pointer;
  transform: scale(${({ $scale }) => $scale ?? 1}) translateZ(0);
  backface-visibility: hidden;
`;
export const _toggle_background = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: 16px;
  background: ${({ theme, $checked }) =>
    $checked
      ? theme.toggle['background']['checked']
      : theme.toggle['background']['unchecked']};

  border: ${({ theme, $checked }) =>
    $checked
      ? theme.toggle['border']['checked']
      : theme.toggle['border']['unchecked']};
  padding: 4px;
`;
export const _toggle_orb = css`
  border-radius: 50%;
  background: ${({ theme, $checked }) =>
    $checked
      ? theme.toggle['orb']['checked']
      : theme.toggle['orb']['unchecked']};
  width: 16px;
  aspect-ratio: 1/1;
  right: 8px;
`;

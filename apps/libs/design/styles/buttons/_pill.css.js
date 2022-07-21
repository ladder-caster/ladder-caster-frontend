import { css } from 'styled-components';

export const _pill_container = css`
  width: 96px;
  height: 32px;
  transform: ${({ $scale, $disabled }) =>
      $scale || $disabled
        ? `scale(${$disabled ? '0.75' : $scale})`
        : `scale(1)`},
    translateZ(0);
  backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  pointer-events: ${({ $disabled }) => ($disabled ? 'none' : 'auto')};
  opacity: ${({ $disabled }) => ($disabled ? 0.75 : 1)};
  filter: ${({ $disabled }) => ($disabled ? 'grayscale(0.3)' : 'none')};
`;

export const _pill_inner = css`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  height: 100%;
  border-radius: 50px;
  background: ${({ theme, $background }) =>
    theme.background[$background ?? 'high']};
  border: 2px solid ${({ theme, $border }) => theme.border[$border ?? 'high']};
  box-shadow: ${({ theme }) => theme.shadow['button']};
  padding: 1.5%;
`;
export const _pill_text = css`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  width: 100%;
  height: 100%;
  font-size: 10px;
  font-weight: 700;
  color: ${({ theme, $color }) => theme.text[$color ?? 'base']};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
`;

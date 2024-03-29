import styled, { keyframes } from 'styled-components';
import { m } from 'framer-motion';

const rotate = keyframes`
  0%{
    transform: rotate(0deg);
  }
  100%{
    transform: rotate(360deg);
  }
`;

export const _spotlight = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const _container = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const _rotate = styled(m.div)`
  min-width: ${({ $width }) => `${$width}px`};
  width: ${({ $width }) => `${$width}px`};
  min-height: ${({ $height }) => `${$height}px`};
  height: ${({ $height }) => `${$height}px`};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const _lights = styled.div`
  border-top: 0 solid transparent;
  border-bottom: 450px solid
    ${({ $hue, theme }) =>
      $hue ? `hsl(${$hue},32%,14%)` : theme.background['high']};
  border-left: 100px solid transparent;
  border-right: 100px solid transparent;
  height: 0;
  width: 0;
  transform-origin: 50% 0 0;
  transform: rotate(${({ $position }) => $position * 45 || 45}deg);
  position: relative;
`;

export const _float = styled.div`
  width: 0;
  height: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

export const _background = styled.div`
  width: 0;
  height: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const _gradient = styled.div`
  min-width: ${({ $width }) => `${$width * 2}px`};
  width: ${({ $width }) => `${$width * 2}px`};
  min-height: ${({ $height }) => `${$height * 2}px`};
  height: ${({ $height }) => `${$height * 2}px`};
  background: ${({ theme, $hue }) =>
    $hue ? `hsl(${$hue},32%,14%)` : theme.background['lowest']};
`;

export const _content = styled.div`
  min-width: ${({ $width }) => `${$width}px`};
  width: ${({ $width }) => `${$width}px`};
  min-height: ${({ $height }) => `${$height}px`};
  height: ${({ $height }) => `${$height}px`};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

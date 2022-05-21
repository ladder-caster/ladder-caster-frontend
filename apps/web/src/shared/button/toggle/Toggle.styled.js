import styled from 'styled-components';
import { m } from 'framer-motion';

export const _container = styled(m.div)`
  display: flex;
  flex-direction: row;
  height: 40px;
  width: 60px;
  padding: 8px;
  cursor: pointer;
  transform: scale(${({$scale})=>$scale??1}) translateZ(0);
  backface-visibility: hidden;
`;
export const _toggle_background = styled(m.div)`
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
export const _toggle_orb = styled(m.div)`
  border-radius: 50%;
  background: ${({ theme, $checked }) =>
    $checked
      ? theme.toggle['orb']['checked']
      : theme.toggle['orb']['unchecked']};
  width: 16px;
  aspect-ratio: 1/1;
  right: 8px;
`;

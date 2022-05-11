import styled from 'styled-components';
import { m } from 'framer-motion';

export const _container = styled(m.div)``;
export const _root_container = styled(m.div)`
  backdrop-filter: ${({ filter }) => filter};
  transform: scale(0.95);
  -webkit-font-smoothing: subpixel-antialiased;
  margin-top: 56px;
  backface-visibility: hidden;
`;
export const _container_center = styled(m.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ $gap }) => $gap ?? '8px'};
  margin-top: ${({ $marginTop }) => $marginTop ?? '0'};
`;
export const _nft_container = styled(m.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ $gap }) => $gap ?? '8px'};
  margin-top: ${({ $marginTop }) => $marginTop ?? '0'};
  > div > div {
    margin: 0;
  }
  transform: scale(0.9);
  backface-visibility: hidden;
`;

export const _resource_gain = styled(m.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ $gap }) => $gap ?? '8px'};
  margin-top: ${({ $marginTop }) => $marginTop};
  margin-top: 8px;
  margin-bottom: 8px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 1em;
`;
export const _resource = styled(m.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ $gap }) => $gap ?? '8px'};
  margin-top: ${({ $marginTop }) => $marginTop ?? '0'};
  flex-direction: row;
  gap: 8px;
  > span {
    color: ${({ theme }) => theme.text['base']};
  }
  > svg {
    width: 32px;
    height: 32px;
  }
`;
export const _button = styled(m.div)`
  width: 90px;
  aspect-ratio: 2/1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  color: ${({ theme }) => theme.text['base']};
  background: ${({ theme }) => theme.background['base']};
  box-shadow: ${({ theme }) => theme.shadow['glass']};
  cursor: pointer;
  font-size: 16px;
  transition: all 0.1s ease-in-out;
  &:hover {
    box-shadow: ${({ theme, $burn }) =>
      $burn ? theme.shadow['error'] : theme.shadow['frost']};
    background: ${({ theme, $burn }) =>
      $burn ? theme.background['error'] : theme.background['lowest']};
    color: ${({ theme, $burn }) =>
      $burn ? theme.text['error'] : theme.text['active']};
    transform: scale(1.02);
    backface-visibility: hidden;
  }
  &:active,
  &:focus {
    transform: scale(0.98);
    filter: brightness(0.8);
    backface-visibility: hidden;
  }
`;

export const _title = styled(m.div)`
  font-size: 32px;
  font-weight: bold;
  font-style: normal;
  color: ${({ theme }) => theme.text['base']};
  letter-spacing: 4px;
`;

export const _subtitle_container = styled(m.div)`
  margin-top: 8px;
  margin-bottom: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  padding: 0 16px 0 16px;
`;
export const _subtitle = styled(_title)`
  font-size: ${({ $size }) => $size ?? '14px'};
  font-weight: ${({ $fontWeight }) => $fontWeight ?? 'normal'};
  font-style: ${({ $fontStyle }) => $fontStyle ?? 'normal'};
  color: ${({ theme }) => theme.text['faded']};
  text-align: center;
  letter-spacing: 2px;
`;
export const _header = styled(m.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
`;
export const _checkbox_container = styled(m.div)`
  display: inline-block;
  vertical-align: center;
`;
export const _checkbox_hidden = styled(m.input).attrs({ type: 'checkbox' })`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;
export const _float = styled(m.div)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${({ $gap }) => $gap ?? '8px'};
`;

export const _icon = styled(m.svg)`
    fill:none;
    stroke: ${({ theme, $checked }) =>
      $checked
        ? theme.checkbox['stroke']['color']['checked']
        : theme.checkbox['stroke']['color']['unchecked']};
    stroke-width: ${({ theme }) => theme.checkbox['stroke']['width']};
    transition: all 0.2s ease-in-out;
    transform: ${({ $checked }) => ($checked ? 'scale(1.25)' : 'scale(0)')};
    visibility: ${({ $checked }) => ($checked ? 'visible' : 'hidden')}
    backface-visibility: hidden;
  `;
export const _checkbox = styled(m.div)`
  display: flex;
  justify-content: center;
  width: 16px;
  height: 16px;
  aspect-ratio: 1;
  border-radius: 4px;
  border: ${({ theme, $checked }) =>
    $checked
      ? theme.checkbox['border']['checked']
      : theme.checkbox['border']['unchecked']};
  background: ${({ theme, $checked }) =>
    $checked ? theme.checkbox['checked'] : theme.checkbox['unchecked']};
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  &:hover {
    border: ${({ theme }) => theme.checkbox['border']['hover']};
    background: ${({ theme }) => theme.checkbox['hover']};
  }
  &:active {
    border: ${({ theme }) => theme.checkbox['border']['active']};
    background: ${({ theme }) => theme.checkbox['active']};
  }
`;

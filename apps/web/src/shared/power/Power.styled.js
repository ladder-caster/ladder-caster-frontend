import styled from 'styled-components';
import { m } from 'framer-motion';

export const _power = styled.div`
  min-width: ${({ $width }) => ($width ? `${$width}px` : '20px')};
  width: ${({ $width }) => ($width ? `${$width}px` : '20px')};
  min-height: ${({ $height }) => ($height ? `${$height}px` : '100%')};
  height: ${({ $height }) => ($height ? `${$height}px` : '100%')};
  display: flex;
`;

export const _progress = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50px;
  background: ${({ theme }) => theme.background['base']};
  box-shadow: ${({ theme }) => theme.shadow['cutout']};
  overflow: hidden;
  padding: 2px;
`;

export const _strength = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50px;
  border: 2px solid
    ${({ theme, $rarity }) => theme.item[$rarity || 'meter_border']};
  background: ${({ theme, $rarity }) => theme.power[$rarity || 'meter']};
  opacity: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2px;
  overflow: hidden;
`;

export const _position = styled(m.div)`
  width: 100%;
  height: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  > svg {
    min-width: 14px;
    width: 14px;
    min-height: 14px;
    height: 14px;
    color: black;
    &:first-child {
      transform: rotate(-30deg);
    }
    &:last-child {
      transform: rotate(30deg);
    }
  }
`;

export const _padding = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50px;
  overflow: hidden;
`;

export const _fill = styled(m.div)`
  width: 100%;
  height: 100%;
  border-radius: 50px;
  background: ${({ theme, $rarity }) =>
    $rarity ? theme.item[$rarity] : theme.highlight['background']};
`;

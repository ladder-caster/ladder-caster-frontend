import styled from 'styled-components';
import { m } from 'framer-motion';

export const _item = styled(m.div)`
  min-width: ${({ $width }) => ($width ? `${$width}px` : '0')};
  width: ${({ $width }) => ($width ? `${$width}px` : '0')};
  height: 100%;
  border-radius: 16px;
  margin-right: 8px;
  background: ${({ theme }) => theme.background['highest']};
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
`;

export const _float = styled.div`
  width: 100%;
  height: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
`;

export const _background = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zindex['item_background']};
  width: 100%;
  min-height: ${({ $height }) => `${$height}px`};
  height: ${({ $height }) => `${$height}px`};
  border-radius: ${({ $equipped }) => ($equipped ? '12px' : '12px')};
  overflow: hidden;
  border: 2px solid ${({ theme, $rarity }) => theme.item[$rarity]};
  opacity: 0.8;
`;

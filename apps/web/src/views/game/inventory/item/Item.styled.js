import styled from 'styled-components';

export const _item = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  cursor: pointer;
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
  width: 100%;
  min-height: ${({ $height }) => `${$height}px`};
  height: ${({ $height }) => `${$height}px`};
  border-radius: ${({ $equipped }) => ($equipped ? '12px' : '12px')};
  border: 2px solid ${({ theme, $rarity }) => theme.item[$rarity]};
  opacity: 1;
  overflow: hidden;
`;

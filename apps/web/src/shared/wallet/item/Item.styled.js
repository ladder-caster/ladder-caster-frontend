import styled from 'styled-components';

export const _item = styled.div`
  min-width: ${({ $grid }) => ($grid ? `calc(50% - 8px)` : '100%')};
  width: ${({ $grid }) => ($grid ? `calc(50% - 8px)` : '100%')};
  min-height: ${({ $height }) => ($height ? `${$height}px` : '100px')};
  height: ${({ $height }) => ($height ? `${$height}px` : '100px')};
  border-radius: 16px;
  margin: 0 8px;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.05);
  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }
`;

export const _float = styled.div`
  width: 100%;
  height: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const _background = styled.div`
  width: 100%;
  min-height: ${({ $height }) => `${$height}px`};
  height: ${({ $height }) => `${$height}px`};
  border-radius: ${({ $equipped }) => ($equipped ? '12px' : '12px')};
  background: ${({ theme, $rarity, $isChest }) =>
    $isChest
      ? `radial-gradient(${theme.rarity['caster']}, ${theme.background['lowest']})`
      : `radial-gradient(${theme.rarity[$rarity]}, ${theme.background['lowest']})`};
  border: 2px solid
    ${({ theme, $rarity, $isChest }) =>
      $isChest ? theme.border['highest'] : theme.item[$rarity]};
  opacity: 1;
  overflow: hidden;
`;

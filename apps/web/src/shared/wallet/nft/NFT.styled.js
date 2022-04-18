import styled from 'styled-components';

export const _NFT = styled.div`
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

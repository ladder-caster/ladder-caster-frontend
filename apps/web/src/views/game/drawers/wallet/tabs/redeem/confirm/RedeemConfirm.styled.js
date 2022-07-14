import styled from 'styled-components';
import { TextureFur } from 'design/textures/fur.texture';
import { bgTexture } from 'design/textures';

export const _confirm = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 32px;
`;

export const _display = styled.div`
  width: 100%;
  min-height: ${({ $height }) => ($height ? `${$height}px` : '100px')};
  height: ${({ $height }) => ($height ? `${$height}px` : '100px')};
  border-radius: 16px;
  margin: 0 8px;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  height: 200px;

  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }
`;

export const _button = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme['legendary']?.['tile']};
  background-image: ${({ theme }) =>
    bgTexture(TextureFur(theme['legendary']?.['texture'], 0.16))};
  background-size: 8px;
  background-repeat: repeat;
  box-shadow: ${({ theme }) => theme.shadow['glass']};
  border: 2px solid ${({ theme }) => theme['legendary']?.['dark_tile']};
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme['legendary']?.['text']};
  text-shadow: 2px 2px 3px ${({ theme }) => theme['legendary']?.['dark_tile']};
  letter-spacing: 0.5px;
  cursor: pointer;
  margin-top: 16px;
`;

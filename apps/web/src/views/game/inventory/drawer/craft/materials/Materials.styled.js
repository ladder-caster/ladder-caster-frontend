import styled from 'styled-components';
import { TextureFur } from 'design/textures/fur.texture';
import { bgTexture } from 'design/textures';

export const _materials = styled.div`
  width: 100%;
  height: 100%;
  max-height: ${({ $height }) => $height && `${$height - 80}px`};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 16px 0 16px;
`;

export const _breakpoint = styled.div`
  display: flex;
  width: 100%;
  height: 3px;
  min-height: 3px;
  max-height: 3px;
  border-radius: 50px;
  background: ${({ theme }) => theme.background['base']};
  box-shadow: ${({ theme }) => theme.shadow['divider']};
`;

export const _grid = styled.div`
  width: 100%;
  overflow: scroll;
`;

export const _container = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;
  padding: 0 16px 16px 16px;
`;

export const _selected = styled.div`
  width: 100%;
  max-width: 280px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
  margin-top: 12px;
`;

export const _material = styled.div`
  width: 64px;
  min-width: 64px;
  min-height: 64px;
  height: 64px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
  margin-left: 4px;
  border-radius: 12px;
  background: ${({ theme }) => theme.background['base']};
  box-shadow: ${({ theme }) => theme.shadow['divider']};
  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }
`;

export const _title = styled.div`
  width: 100%;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['base']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  margin-bottom: 8px;
  margin-top: 8px;
`;

export const _confirm = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

export const _text = styled.div`
  width: 100%;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.text['base']};
  margin-bottom: 40px;
  text-align: center;
`;

export const _button = styled.div`
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  text-shadow: ${({ theme }) => theme.shadow['text']};
  color: ${({ theme }) => theme.highlight['background']};
  background: ${({ theme }) => theme.background['button_active']};
  box-shadow: ${({ theme }) => theme.shadow['glass']};
  border: 2px solid ${({ theme }) => theme.border['highest']};
  letter-spacing: 0.5px;
  margin-top: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  pointer-events: ${({ $disabled }) => ($disabled ? 'none' : 'all')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  text-align: center;
`;

export const _odds = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const _lowest = styled.div`
  min-width: 120px;
  width: 120px;
  min-height: 120px;
  height: 120px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
`;

export const _highest = styled.div`
  min-width: 120px;
  width: 120px;
  min-height: 120px;
  height: 120px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
`;

export const _percent = styled.div`
  width: 100%;
  height: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 12px;
`;

export const _chance = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['base']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  background: ${({ theme }) => theme.background['base']};
  box-shadow: ${({ theme }) => theme.shadow['cutout']};
  border-radius: 8px;
  padding: 6px 12px;
`;

export const _amount = styled.div`
  position: relative;
  top: 1px;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['active']};
  letter-spacing: -0.5px;
  text-shadow: ${({ theme }) => theme.shadow['text']};
  display: flex;
  align-items: center;
  padding-left: 4px;
`;

export const _icon = styled.div`
  min-width: 22px;
  width: 22px;
  min-height: 22px;
  height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 4px;
  > img {
    max-width: 100%;
    height: auto;
    max-height: 22px;
  }
  > svg {
    min-width: 22px;
    width: 22px;
    min-height: 22px;
    height: 22px;
    color: ${({ theme, $element }) => theme[$element]?.['resource']};
  }
`;

export const _cost = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-top: 8px;
  margin-top: 12px;
`;

export const _cost_text = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['active']};
  letter-spacing: -0.5px;
  text-shadow: ${({ theme }) => theme.shadow['text']};
  padding: 2px 2px 0 0;
`;

export const _warning = styled.div`
  font-size: 10px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['alert']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  letter-spacing: 0.5px;
  padding: 16px;
  text-align: center;
`;

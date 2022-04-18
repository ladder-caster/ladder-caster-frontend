import styled from 'styled-components';
import { m } from 'framer-motion';
import { theme } from 'design';

export const _item = styled(m.div)`
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
  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }
`;

export const _overlay = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zindex['item_overlay']};
  width: 100%;
  height: 0;
  display: flex;
  flex-direction: column;
  justify-content: ${({ $end }) => ($end ? 'flex-end' : 'flex-start')};
  padding: 0 3px;
`;

export const _float = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zindex['item_background']};
  width: 100%;
  height: 0;
  display: flex;
  flex-direction: column;
`;

export const _img = styled.img`
  position: relative;
  z-index: ${({ theme }) => theme.zindex['drawer_base']};
  min-height: ${({ $height }) => ($height ? `${$height}px` : '100px')};
  height: ${({ $height }) => ($height ? `${$height}px` : '100px')};
  border-radius: 8px;
`;

export const _level = styled.div`
  min-width: 18px;
  width: 18px;
  min-height: 18px;
  height: 18px;
  border-radius: 12px 0 8px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme, $rarity }) => theme.item[$rarity]};
  box-shadow: ${({ theme }) => theme.shadow['button']};
  right: 3px;
  padding: 0 4px;
  > span {
    font-size: 10px;
    font-weight: 700;
    line-height: 1;
    color: ${({ theme }) => theme.text['active']};
    text-shadow: ${({ theme }) => theme.shadow['text']};
    text-align: center;
  }
`;

export const _background = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zindex['item_background']};
  width: 100%;
  min-height: ${({ $height }) => `${$height}px`};
  height: ${({ $height }) => `${$height}px`};
  border-radius: ${({ $equipped }) => ($equipped ? '12px' : '12px')};
  border: 2px solid ${({ theme, $rarity }) => theme.item[$rarity]};
  overflow: hidden;
`;

export const _selected = styled.div`
  width: 100%;
  min-height: ${({ $height }) => `${$height}px`};
  height: ${({ $height }) => `${$height}px`};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const _checkmark = styled.div`
  min-width: 40px;
  width: 40px;
  min-height: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.background['button_active']};
  border: 3px solid ${({ theme }) => theme.border['highest']};
  box-shadow: ${({ theme }) => theme.shadow['glow_sphere']};
  display: flex;
  justify-content: center;
  align-items: center;
  > svg {
    min-width: 18px;
    width: 18px;
    min-height: 18px;
    height: 18px;
    color: ${({ theme }) => theme.text['base']};
  }
`;

export const _overview = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zindex['item_overview']};
  min-width: 100%;
  width: 100%;
  min-height: 18px;
  height: 18px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background: ${({ theme, $rarity }) => theme.item[$rarity]};
  bottom: 3px;
  border-radius: 2px 2px 9px 9px;
  justify-content: center;
`;

export const _attribute = styled.div`
  padding: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  > svg {
    min-width: ${({ $small }) => ($small ? '10px' : '14px')};
    width: ${({ $small }) => ($small ? '10px' : '14px')};
    min-height: ${({ $small }) => ($small ? '10px' : '14px')};
    height: ${({ $small }) => ($small ? '10px' : '14px')};
    color: ${({ theme, $attribute }) => theme.attribute[$attribute]};
    filter: drop-shadow(${({ theme }) => theme.shadow['text']});
  }
  > span {
    margin-left: 2px;
    font-size: ${({ $small }) => ($small ? '10px' : '14px')};
    font-weight: 700;
    text-shadow: ${({ theme }) => theme.shadow['text']};
    color: ${({ theme, $attribute }) => theme.attribute[$attribute]};
  }
`;

export const _row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export const _image = styled.div`
  position: relative;
  z-index: ${({ theme, $zindex }) => ($zindex ? theme.zindex[$zindex] : '')};
  min-width: 100%;
  width: 100%;
  min-height: ${({ $height }) => ($height ? `${$height}px` : '100%')};
  height: ${({ $height }) => ($height ? `${$height}px` : '100%')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

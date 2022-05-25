import styled from 'styled-components';
import { m } from 'framer-motion';
import {
  ATTRIBUTE_RES3,
  ATTRIBUTE_RES2,
  RARITY_COMMON,
  RARITY_RARE,
} from 'core/remix/state';
export const _upgrade = styled(m.div).attrs(({ theme, $hue }) => {
  return {
    initial: {
      backgroundColor:
        $hue !== undefined
          ? `hsla(${$hue},60%,34%,100%)`
          : `hsla(360,60%,100%,100%)`,
    },
    animate: {
      backgroundColor:
        $hue !== undefined
          ? `hsla(${Math.min(Math.max($hue + 10, 0), 360)},30%,60%,100%)`
          : `hsla(360,60%,100%,100%)`,
      scale: 0.75,
    },
    transition: {
      ease: [0.56, -0.28, 0, 1.53],
      duration: 3,
      repeat: Infinity,
      repeatType: 'mirror',
      repeatDelay: 0.1,
    },
  };
})`
  position: absolute;
  width: 16px;
  height: 16px;
  top: 8px;
  right: 56px;
  background-color: ${({ theme, $hue }) =>
    $hue !== undefined
      ? `hsla(${$hue},60%,34%,100%)`
      : `hsla(360,60%,100%,100%)`};
  border-radius: 50%;
  border: 2px solid
    ${({ theme, $hue }) =>
      $hue !== undefined
        ? `hsla(${Math.min(Math.max($hue + 10, 0), 360)},30%,70%,100%)`
        : `hsla(360,60%,100%,100%)`};
  box-shadow: ${({ theme }) => theme.shadow['frost']};
  z-index: 183;
`;
export const _caster = styled.div`
  min-width: ${({ $grid }) => ($grid ? `calc(50% - 8px)` : '100%')};
  width: ${({ $grid }) => ($grid ? `calc(50% - 8px)` : '100%')};
  min-height: ${({ $height }) => ($height ? `${$height}px` : '100px')};
  height: ${({ $height }) => ($height ? `${$height}px` : '100px')};
  border-radius: 16px;
  margin: 0 8px;
  display: inline-flex;
  box-shadow: ${({ theme }) => theme.shadow['cutout_button']};
  background: ${({ $hue, theme }) =>
    $hue ? `hsl(${$hue},35%,15%)` : theme.background['high']};
  border: 3px solid
    ${({ theme, $hue }) =>
      $hue ? `hsl(${$hue},56%,28%)` : theme.border['high']};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
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
  z-index: ${({ theme }) => theme.zindex['drawer_high']};
  width: 100%;
  height: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 2px;
`;

export const _overview = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zindex['drawer_low']};
  width: 100%;
  min-height: ${({ $small }) => ($small ? '24px' : '32px')};
  box-shadow: ${({ theme }) => theme.shadow['glass']};
  border-radius: 8px 8px 11px 11px;
  background: ${({ theme, $hue }) =>
    $hue ? `hsl(${$hue},56%,28%)` : theme.border['high']};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  bottom: 3px;
  padding: 0 ${({ $small }) => ($small ? '6px' : '12px')} 0 2px;
  overflow: hidden;
`;

export const _img = styled.img`
  position: relative;
  z-index: ${({ theme }) => theme.zindex['drawer_base']};
  min-height: ${({ $height }) => ($height ? `${$height}px` : '100px')};
  height: ${({ $height }) => ($height ? `${$height}px` : '100px')};
  border-radius: 8px;
  transform: translateY(${({ $isOld }) => ($isOld ? '-20px' : '0px')})
    scale(${({ $isOld }) => ($isOld ? 1 : 1.5)});
  top: 16px;
`;

export const _level = styled.div`
  min-width: ${({ $small }) => ($small ? '24px' : '34px')};
  min-height: ${({ $small }) => ($small ? '20px' : '28px')};
  height: ${({ $small }) => ($small ? '20px' : '28px')};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 6px;
  border-radius: 6px 8px 8px 10px;
  background: ${({ theme, $hue }) =>
    $hue ? `hsl(${$hue},52%,24%)` : theme.border['high']};
  box-shadow: ${({ theme }) => theme.shadow['cutout']};
  > span {
    font-size: ${({ $small }) => ($small ? '10px' : '14px')};
    font-weight: 700;
    color: ${({ theme }) => theme.text['active']};
    text-shadow: ${({ theme }) => theme.shadow['text']};
  }
`;

export const _cover = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zindex['drawer_base']};
  width: 100%;
  min-height: 2px;
  height: 2px;
  padding: 0 2px 2px 2px;
  bottom: 3px;
  background: ${({ $hue, theme }) =>
    $hue ? `hsl(${$hue},35%,15%)` : theme.background['high']};
`;

export const _name = styled.div`
  font-size: ${({ $small }) => ($small ? '10px' : '14px')};
  font-weight: 700;
  color: ${({ $hue, theme }) =>
    $hue ? `hsl(${$hue},40%,12%)` : theme.background['high']};
  text-shadow: ${({ theme }) => theme.shadow['text_glow']};
`;

import styled from 'styled-components';
import { m } from 'framer-motion';
import { theme } from 'design';
export const _equipment = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  min-width: 100%;
  width: 100%;
  min-height: 100%;
  height: 100%;
`;

export const _body = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 50%;
  width: 50%;
  max-width: 50%;
`;

export const _hat = styled.div`
  display: flex;
  width: 100%;
  height: 50%;
  padding: 0 4px 4px 0;
  cursor: pointer;
`;

export const _cloak = styled.div`
  display: flex;
  width: 100%;
  height: 50%;
  padding: 4px 4px 0 0;
  cursor: pointer;
`;

export const _staff = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  min-width: 50%;
  width: 50%;
  max-width: 50%;
  padding: 0 0 0 4px;
  cursor: pointer;
`;

export const _gem = styled.div`
  display: flex;
  width: 100%;
  height: 50%;
  padding: 0 0 4px 0;
  cursor: pointer;
`;

export const _shaft = styled.div`
  display: flex;
  width: 100%;
  height: 50%;
  padding: 4px 0 0 0;
`;

export const _empty = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 7%;
  width: 7%;
  max-width: 7%;
  height: 100%;
  padding: 4px;
`;

export const _spells = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 31%;
  width: 31%;
  max-width: 31%;
  height: 100%;
  padding: 0;
`;

export const _spell = styled.div`
  display: flex;
  width: 100%;
  min-height: 50%;
  height: 50%;
  padding: 4px 0;
  cursor: pointer;
  &:first-child {
    padding-top: 0;
  }
  &:last-child {
    padding-bottom: 0;
  }
`;

export const _inner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  background: ${({ theme }) => theme.background['base']};
  box-shadow: ${({ theme }) => theme.shadow['cutout']};
  > svg {
    min-width: 60%;
    width: 60%;
    min-height: 60%;
    height: 60%;
    color: ${({ theme }) => theme.text['base']};
    filter: drop-shadow(${({ theme }) => theme.shadow['text']});
    opacity: 0.45;
    transform: ${({ $scale, $staff }) =>
      $scale
        ? `scale(${$scale})${$staff ? `rotate(${$staff})` : ''}`
        : 'scale(1)'};
  }
`;
// elastic out bezier curve
export const _upgrade = styled(m.div).attrs(({ theme }) => {
  return {
    initial: {
      scale: 0.5,
      borderWidth: '3px',
    },
    animate: {
      scale: 1.1,
      borderWidth: '0px',
    },
    transition: {
      duration: 2.9,
      repeat: Infinity,
      repeatType: 'mirror',
      repeatDelay: 0.05,
      ease: [0.64, 0.57, 0.67, 1.53],
    },
  };
})`
  display: relative;
  width: 16px;
  height: 16px;
  top: 8px;
  right: 56px;
  background-color: ${({ theme }) => theme.text['logout']};
  border-radius: 50%;
  border: 3px solid ${({ theme }) => theme.border['error']};
  box-shadow: ${({ theme }) => theme.shadow['error']};
`;

import styled, { keyframes } from 'styled-components';
import { m } from 'framer-motion';

export const _staking_container = styled.div`
  width: 100%;
  height: 100%;
  max-height: ${({ $height }) => $height && `${$height - 65}px`};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px;
  padding-bottom: 4px;
  @media (max-width: 768px) {
    max-height: ${({ $height }) => $height && `${$height - 15}px`};
  }
`;
export const _staking = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  padding: ${({ $padding }) => $padding ?? '0'};
  position: relative;
`;
export const _close = styled.div`
  min-width: 36px;
  width: 36px;
  min-height: 36px;
  height: 36px;
  cursor: pointer;
  margin-bottom: ${({ $marginBottom }) => $marginBottom && `${$marginBottom}`};
`;

export const _float = styled.div`
  width: 0;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: ${({ $justify }) => $justify ?? 'flex-end'};
`;

export const _icon = styled(m.div).attrs(({ theme, pulse }) => {
  return {
    whileHover: {
      color: pulse && theme.text['active'],
    },
  };
})`
  min-width: 100%;
  width: 100%;
  min-height: 100%;
  height: 100%;
  border-radius: 10px;
  background: ${({ theme }) => theme.background['highest']};
  box-shadow: ${({ theme }) => theme.shadow['glass']};
  display: flex;
  justify-content: center;
  align-items: center;
  > svg {
    min-width: 16px;
    width: 16px;
    min-height: 16px;
    height: 16px;
    color: ${({ theme }) => theme.text['base']};
  }
`;

export const _title = styled.div`
  width: 100%;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['base']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
`;
export const _sub_title = styled.div`
  margin-top: 8px;
  width: 100%;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  color: ${({ theme }) => theme.text['base']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  font-style: italic;
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
  margin-top: 16px;
`;
export const _faded_breakpoint = styled(_breakpoint)`
  filter: opacity(${({ $opacity }) => $opacity ?? 0.8});
`;
export const _card_container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: ${({ $align }) => $align ?? 'center'};
  justify-content: ${({ $justify }) => $justify ?? 'space-around'};
  gap: 16px;
  margin: ${({ $margin }) => $margin ?? '0'};
`;
export const _card = styled(m.div).attrs(({ theme, $selected }) => {
  //animations for card
  const initial = {
    scale: 1,
    background: theme.background['high'],
    borderColor: theme.border['base'],
  };
  return $selected
    ? {
        initial,
        animate: {
          background: theme.background['higher'],
          transition: {
            delay: 0.5,
            ease: [0.38, -0.72, 0.56, 1.6],
            duration: 2,
            repeat: Infinity,
            repeatType: 'mirror',
          },
        },
        whileHover: {
          background: theme.background['highest'],
        },
      }
    : {
        initial,
        whileHover: {
          scale: 1.05,
          background: theme.background['highest'],
          borderColor: theme.border['higher'],
        },
        whileTap: {
          scale: 0.95,
          filter: 'brightness(0.9)',
        },
      };
})`
  backface-visibility: hidden;
  -webkit-font-smoothing: subpixel-antialiased;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  text-align: center;
  aspect-ratio: 1;
  border-radius: 16px;
  width: 88px;
  height: 88px;
  background: ${({ theme }) => theme.background['high']};
  box-shadow: ${({ theme }) => theme.shadow['glass']};
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.border['base']};
  padding: 4px;
`;
export const _card_text = styled(m.div).attrs(({ theme }) => {
  return {
    whileHover: {
      color: theme.text['active'],
    },
    initial: {
      color: theme.text['base'],
    },
  };
})`
  width: 100%;
  text-align: center;
  font-size: ${({ $fontSize }) => $fontSize ?? '12px'};
  font-weight: 700;
  color: ${({ theme }) => theme.text['base']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
`;
export const _card_group = styled(m.div)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;
export const _card_icon = styled(m.div)`
  width: 12px;
  height: 12px;
  color: ${({ theme }) => theme.text['placeholder']};
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: 0 auto;
  margin-bottom: 2px;
`;
export const _description = styled.div`
  width: 100%;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text['base']};
  text-shadow: ${({ theme }) => theme.shadow['text']};

  margin-top: 32px;
`;
export const _column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;
export const _header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${({ $padding }) => $padding ?? '0'};
`;
export const _stake_fake_dropdown = styled.div``;
export const _input_container = styled.div`
  width: 90%;
  min-height: 40px;
  height: 40px;
  border-radius: 50px;
  background: ${({ theme }) => theme.background['base']};
  box-shadow: ${({ theme }) => theme.shadow['cutout']};
  display: flex;
  flex-direction: row;
  align-items: center;
`;
export const _input = styled.input.attrs(({ theme }) => {
  return {
    type: 'number',
  };
})`
  position: relative;
  z-index: ${({ theme }) => theme.zindex['drawer_low']};
  width: 100%;
  height: 100%;
  background: none;
  border: none;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 0 16px;
  margin-bottom: 4px;
  margin-right: 8px;
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['input']};
  text-align: right;
  &::placeholder {
    color: ${({ theme }) => theme.text['faded']};
  }
`;

export const _clear_selection_icon = styled(m.div).attrs(({ theme }) => {
  return {
    whileHover: {
      filter: `brightness(1.5)`,
      scale: 1.11,
      transition: {
        duration: 0.33,
        ease: 'easeInOut',
      },
    },
    initial: {
      filter: '',
      scale: 1,
    },
  };
})`
  cursor: pointer;
  min-width: 32px;
  width: 32px;
  min-height: 32px;
  height: 32px;
  border-radius: 10px;
  aspect-ratio: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 4px;
  > svg {
    min-width: 16px;
    width: 16px;
    min-height: 16px;
    height: 16px;
    color: ${({ theme }) => theme.text['base']};
    cursor: pointer;
  }
`;
const shine = keyframes`
  10% {
    opacity: 1;
    top: -30%;
    left: -30%;
    transition-property: left, top, opacity;
    transition-duration: 0.7s, 0.7s, 0.15s;
    transition-timing-function: ease;
  }
  100% {
    opacity: 0;
    top: -30%;
    left: -30%;
    transition-property: left, top, opacity;
  }
  `;
export const _stake_section_input_icon = styled.div`
  width: 32px;
  height: 32px;

  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  margin-left: 8px;
`;

export const _stake_section_title = styled.div`
  width: 100%;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  padding-right: 32px;
  color: ${({ theme }) => theme.text['base']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
`;
export const _error = styled(_sub_title)`
  font-size: 14px;
  color: ${({ theme }) => theme.text['error']};
  text-transform: capitalize;
`;
export const _row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${({ $justifyContent }) => $justifyContent ?? 'center'};
  margin: ${({ $margin }) => $margin ?? '0'};
  gap: ${({ $gap }) => $gap ?? '16px'};
`;
export const _percentage_cube = styled(m.div).attrs(({ theme }) => {
  return {
    whileHover: {
      backgroundColor: theme.background['active'],
      color: theme.text['active'],
      transition: {
        duration: 0.33,
        ease: 'easeInOut',
      },
    },
    intial: {
      backgroundColor: theme.background['highest'],
      color: theme.text['base'],
    },
  };
})`
  cursor: pointer;
  width: 56px;
  height: 40px;
  justify-content: center;
  align-items: center;
  display: flex;
  text-align: center;
  color: ${({ theme }) => theme.text['base']};
  background-color: ${({ theme }) => theme.background['highest']};
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme.border['highest']};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
`;
export const _stake_lada_button = styled(m.div).attrs(
  ({ theme, $disabled }) => {
    return (
      !$disabled && {
        whileHover: {
          filter: `brightness(1.4)`,
          transition: {
            duration: 1.5,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'mirror',
            delay: 0.5,
          },
        },
      }
    );
  },
)`
  filter: none;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  width: 96px;
  height: 48px;
  border-radius: 8px;
  background-color: ${({ theme, $isStake }) =>
    $isStake ? theme.background['success'] : theme.background['error']};
  opacity: ${({ $disabled }) => ($disabled ? 0.75 : 1)};
  border: 2px solid
    ${({ theme, $isStake }) =>
      $isStake ? theme.border['success'] : theme.border['error']};
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.5px;
  color: ${({ theme, $isStake }) =>
    $isStake ? theme.text['success'] : theme.text['error']};
  box-shadow: ${({ theme, $isStake }) =>
    $isStake ? theme.shadow['success'] : theme.shadow['error']};
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;
export const _current_stake_text = styled.div`
  color: ${({ theme }) => theme.text['base']};
  font-size: 12px;
  font-weight: 700;
  font-style: italic;
  margin-left: 42px;
`;

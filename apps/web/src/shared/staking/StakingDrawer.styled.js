import styled from 'styled-components';
import { m } from 'framer-motion';

export const _staking = styled.div`
  width: 100%;
  height: 100%;
  max-height: ${({ $height }) => $height && `${$height - 80}px`};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px;
  overflow-y: scroll;
`;

export const _close = styled.div`
  min-width: 36px;
  width: 36px;
  min-height: 36px;
  height: 36px;
  cursor: pointer;
`;

export const _float = styled.div`
  width: 0;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
`;

export const _icon = styled(m.div)`
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

export const _breakpoint = styled.div`
  display: flex;
  width: 100%;
  height: 3px;
  min-height: 3px;
  max-height: 3px;
  border-radius: 50px;
  background: ${({ theme }) => theme.background['base']};
  box-shadow: ${({ theme }) => theme.shadow['divider']};
  margin-bottom: 16px;
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
export const _card = styled(m.div).attrs(({ theme }) => {
  //animations for card
  return {
    whileHover: {
      scale: 1.05,
      background: theme.background['highest'],
      borderColor: theme.border['higher'],
    },
    whileTap: {
      scale: 0.95,
      filter: 'brightness(0.9)',
    },
    initial: {
      scale: 1,
      background: theme.background['high'],
      borderColor: theme.border['base'],
    },
  };
})`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  text-align: center;
  aspect-ratio: 1;
  border-radius: 16px;
  width: 96px;
  height: 96px;
  background: ${({ theme }) => theme.background['high']};
  box-shadow: ${({ theme }) => theme.shadow['glass']};
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.border['base']};
  padding: 4px;
`;
export const _card_text = styled.div.attrs(({ theme }) => {
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
export const _card_group = styled.div`
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
  margin-bottom: 16px;
  margin-top: 32px;
`;

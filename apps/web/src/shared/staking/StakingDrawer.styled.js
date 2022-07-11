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
  height: 100%;
  width: 100%;
  flex-direction: row;
  gap: 4px;
`;
export const _card = styled(m.div).attrs(({ theme }) => {
  //animations for card
  return {
    whileHover: {
      scale: 1.05,
      background: theme.background['high'],
      borderColor: theme.border['higher'],
    },
    whileTap: {
      scale: 0.95,
    },
  };
})`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 32px;
  aspect-ratio: 1;
  border-radius: 16px;
  background: ${({ theme }) => theme.background['base']};
  box-shadow: ${({ theme }) => theme.shadow['glass']};
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.border['base']};
`;
export const _card_text = styled.div.attrs(({ theme }) => {
  return {
    whileHover: {
      color: theme.text['higher'],
    },
  };
})`
  width: 100%;
  text-align: center;
  font-size: 8px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['high']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
`;
export const _card_group = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 2px;
`;
export const _card_icon = styled(m.div)`
  width: 8px;
  height: 8px;
`;

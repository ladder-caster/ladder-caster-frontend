import styled from 'styled-components';
import { m } from 'framer-motion';

export const _move = styled(m.div)`
  min-width: 100%;
  width: 100%;
  min-height: ${({ $height }) => `${$height - 32}px`};
  height: ${({ $height }) => `${$height - 32}px`};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  overflow-y: scroll;
`;

export const _board = styled(m.div)`
  max-width: 320px;
  background: ${({ theme }) => theme.background['lowest']};
  box-shadow: ${({ theme }) => theme.shadow['frost']};
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 16px 110px 16px;
  margin-bottom: 24px;
`;

export const _row = styled.div`
  min-height: 56px;
  height: 56px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  margin-top: 32px;
`;

export const _float = styled.div`
  width: 100%;
  height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const _actions = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const _header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 16px 0 16px;
`;

export const _title = styled.div`
  font-size: 22px;
  font-weight: 700;
  text-shadow: ${({ theme }) => theme.shadow['text']};
  color: ${({ theme }) => theme.highlight['background']};
  padding-bottom: 12px;
`;

export const _description = styled.div`
  font-size: 14px;
  font-weight: 500;
  text-shadow: ${({ theme }) => theme.shadow['text']};
  color: ${({ theme }) => theme.highlight['background']};
  text-align: center;
  padding: 12px;
`;

export const _limit = styled(m.div)`
  width: 100%;
  height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  top: 8px;
  pointer-events: none;
  > span {
    font-size: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.text['base']};
    text-shadow: ${({ theme }) => theme.shadow['text']};
    letter-spacing: 0.5px;
  }
`;

export const _confirm = styled(m.div)`
  min-height: 48px;
  height: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  padding: 24px 8px 0 0;
`;

export const _cost_text = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['active']};
  letter-spacing: -0.5px;
  text-shadow: ${({ theme }) => theme.shadow['text']};
  padding: 2px 2px 0 0;
`;

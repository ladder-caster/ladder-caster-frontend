import styled from 'styled-components';
import { m } from 'framer-motion';

export const _prestige = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 16px 0 24px;
`;

export const _title = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['base']};
  margin-bottom: 8px;
  white-space: nowrap;
`;

export const _options = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-top: 6px;
`;

export const _button = styled(m.div)`
  /* font-size: 12px;
  font-weight: 700;
  color: ${({ theme, $disabled }) => theme.text[$disabled ? 'faded' : 'base']};
  background: ${({ theme, $disabled }) =>
    theme.background[$disabled ? 'lowest' : 'base']};
  box-shadow: ${({ theme }) => theme.shadow['card']};
  padding: 16px 20px;
  white-space: nowrap;
  border-radius: 8px;
  line-height: 1;
  cursor: pointer; */

  padding: 12px 18px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  box-shadow: ${({ theme, $disabled }) =>
    $disabled ? 'none' : theme.shadow['glass']};
  background: ${({ theme, $disabled }) =>
    $disabled ? theme.background['button'] : theme.background['button']};
  border: none;
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
  margin-bottom: 16px;
  width: ${({ $long }) => ($long ? 'calc(100% - 32px)' : 'initial')};

  &:hover {
    background: ${({ theme, $disabled }) =>
      $disabled ? theme.background['button'] : theme.background['button_high']};
  }

  > svg {
    min-height: 14px;
    height: 14px;
    min-width: 14px;
    width: 14px;
    color: ${({ theme, $disabled }) =>
      theme.text[$disabled ? 'faded' : 'base']};
  }
  > span {
    font-size: ${({ $big }) => ($big ? '14px' : '12px')};
    font-weight: 700;
    color: ${({ theme, $disabled }) =>
      theme.text[$disabled ? 'faded' : 'base']};
    padding-left: ${({ $noIcon }) => ($noIcon ? '0' : '6px')};
    white-space: nowrap;
  }
`;

export const _or = styled.span`
  padding: 0 8px;
  font-size: 10px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['base']};
  white-space: nowrap;
  line-height: 10px;
`;

export const _option = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

export const _estimate = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-left: 12px;
  > span {
    font-size: 12px;
    font-style: italic;
    font-weight: 500;
    color: ${({ theme }) => theme.text['base']};
    white-space: nowrap;
    line-height: 10px;
  }
`;

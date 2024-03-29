import styled from 'styled-components';
import { m } from 'framer-motion';

export const _home = styled(m.div)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const _header = styled.div`
  ${({ theme }) => theme.styles?.view?.['_header']};
`;

export const _title = styled.h3`
  ${({ theme }) => theme.styles?.view?.['_title']};
`;

export const _loading = styled.div`
  ${({ theme }) => theme.styles?.view?.['_loading']};
`;

export const _bar = styled.div`
  ${({ theme }) => theme.styles?.view?.['_bar']};
`;

export const _fill = styled.div`
  ${({ theme }) => theme.styles?.view?.['_fill']};
`;

export const _divider = styled.div`
  ${({ theme }) => theme.styles?.view?.['_divider']};
`;

export const _feed = styled.div`
  padding: 0 16px;
  overflow-y: scroll;
`;

export const _section = styled.div`
  padding: 18px 0;
`;

export const _actions = styled.div`
  width: 100%;
  display: flex;
  flex-direction: ${({ $long }) => ($long ? 'column' : 'row')};
  align-items: center;
  margin-top: 8px;
  padding: 4px 0;
  > button {
    margin-right: 12px;
    &:last-child {
      margin-right: 0;
    }
  }

  > span {
    color: #58627e;
    margin-bottom: 14px;
    font-weight: 700;
  }
`;

export const _description = styled.p`
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.text['base']};
  margin-bottom: 16px;
`;

export const _linkActual = styled(m.a)`
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
  color: ${({ theme, $disabled }) => theme.text['base']};

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

export const _link = styled(m.div)`
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
  color: ${({ theme, $disabled }) => theme.text['base']};

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

export const _button = styled(m.div)`
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
  color: ${({ theme }) => theme.text['base']};
  font-weight: 700;

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

export const _google = styled(m.div)`
  padding: 10px 18px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  box-shadow: ${({ theme, $disabled }) =>
    $disabled ? 'none' : theme.shadow['card']};
  background: ${({ theme, $disabled }) =>
    $disabled ? theme.background['button'] : theme.socials['google']};
  border: none;
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
  margin-bottom: 16px;
  width: ${({ $long }) => ($long ? 'calc(100% - 32px)' : 'initial')};

  &:hover {
    background: ${({ theme, $disabled }) =>
      $disabled ? theme.background['button'] : theme.socials['google_hover']};
  }

  > span {
    font-size: ${({ $big }) => ($big ? '14px' : '12px')};
    font-weight: 700;
    color: rgba(255, 255, 255, 0.8);
    text-shadow: ${({ theme }) => theme.shadow['text']};
    padding-left: ${({ $noIcon }) => ($noIcon ? '0' : '6px')};
    letter-spacing: 0.5px;
    white-space: nowrap;
  }
`;

export const _circle = styled.div`
  min-width: 24px;
  width: 24px;
  min-height: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  > svg {
    min-height: 18px;
    height: 18px;
    min-width: 18px;
    width: 18px;
    color: ${({ theme, $disabled }) =>
      theme.text[$disabled ? 'faded' : 'base']};
    filter: drop-shadow(${({ theme }) => theme.shadow['text']});
  }
`;

export const _button_override = styled.div`
  > button {
    padding: 12px 18px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    box-shadow: ${({ theme }) => theme.shadow['glass']};
    background: ${({ theme, $disabled }) =>
      theme.background[$disabled ? 'lowest' : 'low']};
    border: none;
    cursor: pointer;
    margin-right: 12px;
    line-height: normal;
    height: auto;
    > svg {
      min-height: 14px;
      height: 14px;
      min-width: 14px;
      width: 14px;
      color: ${({ theme, $disabled }) =>
        theme.text[$disabled ? 'faded' : 'base']};
    }
    > span {
      font-size: 12px;
      font-weight: 700;
      color: ${({ theme, $disabled }) =>
        theme.text[$disabled ? 'faded' : 'base']};
      padding-left: 6px;
      white-space: nowrap;
    }

    &:hover {
      background: ${({ theme, $disabled }) =>
        theme.background[$disabled ? 'lowest' : 'low']} !important;
    }
  }
`;

export const _item = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 16px 0 24px;
`;

export const _task = styled.p`
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: ${({ theme, $disabled }) =>
    theme.text[$disabled ? 'faded' : 'active']};

  > div {
    font-size: 14px;
    line-height: 20px;
    font-weight: 700;
    padding-left: 16px;
    letter-spacing: 0.5px;
    color: ${({ theme, $disabled }) =>
      theme.text[$disabled ? 'faded' : 'active']};
  }
  > span {
    color: ${({ theme }) => theme.text['faded']};
  }
`;

export const _step = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 18px 0 18px 0;
  border-bottom: 2px solid ${({ theme }) => theme.border['base']};
`;

export const _order = styled.div`
  min-width: 20px;
  width: 20px;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.text['faded']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  border-radius: 50px;
  margin-right: 16px;
  &:after {
    content: '';
    min-width: 3px;
    width: 3px;
    min-height: 18px;
    height: 18px;
    background: ${({ theme }) => theme.text['faded']};
    margin-left: 6px;
    border-radius: 8px;
  }
`;

export const _icon = styled(m.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  > svg {
    min-width: 36px;
    width: 36px;
    min-height: 36px;
    height: 36px;
    color: ${({ theme, $active, $step }) => {
      if ($active) {
        if ($step === 1 || $step === 3) return theme.gold.text;
        if ($step === 2) return '#b364d1';
      } else {
        return theme.text['base'];
      }
    }};
  }
  > img {
    width: 80px;
    height: 80px;
    bottom: 2px;
    color: ${({ theme }) => theme.text['base']};
  }
`;

export const _card = styled(m.div)`
  min-width: 80px;
  width: 80px;
  min-height: 80px;
  height: 80px;
  left: 4px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid ${({ theme }) => theme.border['high']};
  cursor: pointer;
  opacity: ${({ $active }) => ($active ? 1 : 0.52)};
`;

export const _beta = styled.div`
  width: 100%;
  margin-top: 16px;
  border-radius: 16px;
  border: 2px solid ${({ theme }) => theme.border['high']};
  padding: 0 16px 16px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const _text = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  > span {
    max-width: 52px;
    text-align: center;
    background: ${({ theme }) => theme.background['lowest']};
    padding: 2px 8px;
    font-size: 12px;
    font-weight: 700;
    color: ${({ theme }) => theme.text['base']};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    bottom: 10px;
  }
`;

export const _warning = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['base']};
  letter-spacing: 0.5px;
`;

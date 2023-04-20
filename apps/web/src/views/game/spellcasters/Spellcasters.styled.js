import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { _button as __button } from '../../../shared/redeem/Redeem.styled';

export const _spellcasters = styled(m.div)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const _location = styled.h3`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const _title = styled.h3`
  ${({ theme }) => theme.styles?.view?.['_title']};
`;

export const _day = styled.h3`
  ${({ theme }) => theme.styles?.view?.['_day']};
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

export const _list = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const _button = styled.div`
  padding: 8px 12px;
  color: ${({ theme }) => theme.text['base']};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadow['frost']};
  background: ${({ theme }) => theme.background['button_high']};
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;

  &:hover {
    background: ${({ theme }) => theme.background['button_active']};
  }
`;

export const _actions = styled.div``;

export const _purchase = styled.div`
  width: 50%;
  min-width: 50%;
  max-width: 50%;
  min-height: 60px;
  height: 60px;
  background-color: ${({ theme }) => theme.background['lowest']};
  box-shadow: 0 -2px 8px 0 rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 6px 4px 8px 4px;
`;

export const _claim_all = styled.div`
  width: 100%;
  height: 100%;
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
  border: none;
  box-shadow: ${({ theme }) => theme.shadow['glass']};
  background: ${({ theme }) => theme.background['button_high']};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  margin-left: 4px;
  > span {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    color: ${({ theme, $disabled }) =>
      theme.text[$disabled ? 'faded' : 'base']};
    white-space: nowrap;
    text-align: center;
    text-transform: uppercase;
    height: 100%;
  }
`;

export const _header = styled.div`
  width: 100%;
  max-width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const _container = styled.div`
  width: 100%;
  min-height: 48px;
  height: 48px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0 12px 0 8px;
`;

export const _buy = styled.div`
  width: 100%;
  height: 100%;
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
  border: none;
  box-shadow: ${({ theme }) => theme.shadow['glass']};
  background: ${({ theme }) => theme.background['button_high']};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  margin-right: 4px;
  > span {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    color: ${({ theme, $disabled }) =>
      theme.text[$disabled ? 'faded' : 'base']};
    white-space: nowrap;
    text-align: center;
    text-transform: uppercase;
    height: 100%;
  }
`;

export const _divider = styled.div`
  width: 100%;
  min-height: 2px;
  height: 2px;
  background: ${({ theme }) => theme.border['base']};
  margin-top: 8px;
  margin-bottom: 4px;
`;

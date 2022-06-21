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

export const _header = styled.div`
  ${({ theme }) => theme.styles?.view?.['_header']};
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
  padding: 0 16px;
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

export const _buy = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 6px 12px;
  border: 2px solid ${({ theme }) => theme.border['highest']};
  border-radius: 8px;
  cursor: pointer;
  > span {
    font-size: 14px;
    font-weight: 700;
    color: ${({ theme }) => theme.text['base']};
    padding-left: 4px;
    letter-spacing: 0.5px;
  }
  > svg {
    min-width: 14px;
    width: 14px;
    min-height: 14px;
    height: 14px;
    color: ${({ theme }) => theme.text['base']};
  }
`;

export const _actions = styled.div``;

export const _claim_all = styled(__button)`
  width: 128px;
  align-items: center;
  justify-content: center;
  text-align: center;
  left: 128px;
  transition: all 0.2s ease-in-out;
  &:hover {
    background-color: ${({ theme }) => theme.background['highest']};
    transform: scale(1.02);
    color: ${({ theme }) => theme.text['active']};
  }
  bottom: 0;
`;

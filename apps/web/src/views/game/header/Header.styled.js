import styled, { keyframes } from 'styled-components';
import { m } from 'framer-motion';
import { Link } from 'react-router-dom';

export const _header = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zindex['mobile_header']};
  min-width: 100%;
  width: 100%;
  min-height: 48px;
  height: 48px;
  padding: 1px;
`;

export const _container = styled.div`
  min-width: 100%;
  width: 100%;
  min-height: 100%;
  height: 100%;
  border-radius: 18px;
  box-shadow: ${({ theme }) => theme.shadow['glass']};
  background: ${({ theme }) => theme.background['lowest']};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 2px 2px 2px 0;
`;

export const _left = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding-left: 16px;
  height: 100%;
  cursor: pointer;
  overflow-x: scroll;
`;

export const _right = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding-right: 6px;
`;

export const _coin = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 8px;
  &:last-child {
    margin-right: 0;
  }
  &:first-child {
    margin-left: 0;
  }
`;

export const _icon = styled.div`
  min-width: 22px;
  width: 22px;
  min-height: 22px;
  height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  > img {
    max-width: 100%;
    height: auto;
    max-height: 22px;
    color: ${({ $background }) => $background};
  }
`;

export const _amount = styled.div`
  position: relative;
  top: 1px;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['active']};
  padding-left: 2px;
  line-height: 1;
  letter-spacing: -0.5px;
  text-shadow: ${({ theme }) => theme.shadow['text']};
`;

export const _button = styled(m.button)`
  padding: 6px;
  min-width: 36px;
  min-height: 36px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow['glass']};
  background: ${({ theme }) => theme.background['low']};
  border: none;
  left: 2px;
  cursor: pointer;
  &:first-child {
    margin-left: 0;
  }
`;

export const _crank = styled(m.div)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  > svg {
    min-height: 14px;
    height: 14px;
    min-width: 14px;
    width: 14px;
    color: ${({ theme }) => theme.text['base']};
  }
  > span {
    font-size: 14px;
    font-weight: 700;
    color: ${({ theme }) => theme.text['base']};
    padding-left: 6px;
  }
`;

export const _controls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  > button {
    margin-right: 6px;
    &:last-child {
      margin-right: 0;
    }
  }
`;

export const _speed = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['base']};
  padding: 0 8px;
  white-space: nowrap;
`;

export const _google = styled(m.div)`
  padding: 2px 12px 2px 2px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: ${({ theme }) => theme.socials['google']};
  border: none;
  box-shadow: ${({ theme }) => theme.shadow['card']};
  cursor: pointer;
  > svg {
    padding: 6px;
    min-height: 30px;
    height: 30px;
    min-width: 30px;
    width: 30px;
    color: ${({ theme }) => theme.background['lowest']};
    background: white;
    border-radius: 6px;
  }
  > span {
    font-size: 12px;
    font-weight: 400;
    font-family: 'DM Sans', Roboto, 'Helvetica Neue', Helvetica, Arial,
      sans-serif;
    color: #ffffff;
    padding-left: 8px;
    letter-spacing: 0.5px;
  }
`;

export const _square = styled.div`
  min-width: 24px;
  width: 24px;
  min-height: 24px;
  height: 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme.text['ghost']};
  overflow: hidden;
`;

export const _padding = styled.div`
  min-width: 100%;
  width: 100%;
  min-height: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  > svg {
    display: block;
    margin: 50px auto;
    transform: scale(2);
    > path#loader {
      fill: ${({ theme }) => theme.text['ghost']};
    }
    > path#border {
      fill: ${({ theme }) => theme.text['ghost']};
    }
  }
`;

import styled from 'styled-components';
import { m } from 'framer-motion';

export const _items = styled.div`
  width: 100%;
  height: 100%;
  max-height: ${({ $height }) => $height && `${$height - 80}px`};
  display: flex;
  flex-direction: column;
  padding: 16px;
`;

export const _header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const _container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-right: 12px;
`;

export const _type = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  > svg {
    min-width: 28px;
    width: 28px;
    min-height: 28px;
    height: 28px;
    color: ${({ theme }) => theme.text['base']};
  }
  > span {
    font-size: 14px;
    font-weight: 700;
    color: ${({ theme }) => theme.text['base']};
    margin-left: 8px;
  }
`;

export const _scroll = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: scroll;
  padding-top: 16px;
`;

export const _body = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
`;

export const _title = styled.div`
  width: 100%;
  min-height: ${({ $height }) => `${$height}px`};
  height: ${({ $height }) => `${$height}px`};
  display: flex;
  flex-direction: column;
  align-items: ${({ $right }) => ($right ? 'flex-end' : 'flex-start')};
  letter-spacing: 0.5px;
  padding-left: 14px;
  padding-right: 4px;
`;

export const _name = styled.div`
  width: 100%;
  min-height: ${({ $height }) => `${$height}px`};
  height: ${({ $height }) => `${$height}px`};
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.text['base']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  display: flex;
  flex-direction: row;
  justify-content: ${({ $right }) => ($right ? 'flex-end' : 'flex-start')};
  line-height: 1;
`;

export const _tier = styled.div`
  width: 100%;
  min-height: ${({ $height }) => `${$height}px`};
  height: ${({ $height }) => `${$height}px`};
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.text['base']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  line-height: 1;
  display: flex;
  flex-direction: row;
  justify-content: ${({ $right }) => ($right ? 'flex-end' : 'flex-start')};
  > span {
    font-weight: 700;
    color: ${({ theme }) => theme.text['base']};
    margin-left: 6px;
  }
  > b {
    font-family: 'Georgia', serif;
    font-weight: 700;
    margin-left: 6px;
    color: ${({ theme }) => theme.text['active']};
  }
`;

export const _rarity = styled.div`
  width: 100%;
  min-height: ${({ $height }) => `${$height}px`};
  height: ${({ $height }) => `${$height}px`};
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: ${({ theme, $rarity }) => theme.rarity[$rarity]};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  line-height: 1;
  padding-bottom: 4px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

export const _attribute = styled.div`
  width: 100%;
  min-height: ${({ $height }) => `${$height}px`};
  height: ${({ $height }) => `${$height}px`};
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: ${({ theme, $attribute }) => theme.attribute[$attribute]};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  line-height: 1;
  padding-bottom: 4px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

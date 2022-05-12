import styled from 'styled-components';
import { m } from 'framer-motion';
export const _category = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  border-bottom: 2px solid ${({ theme }) => theme.border['base']};
`;

export const _title = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['base']};
  display: flex;
  flex-direction: row;
  align-items: center;
  > svg {
    margin-right: 8px;
    min-width: 16px;
    width: 16px;
    min-height: 16px;
    height: 16px;
    color: ${({ theme }) => theme.text['base']};
  }
`;

export const _items = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 0 4px 0;
  overflow-x: scroll;
`;

export const _item = styled.div`
  min-width: 64px;
  width: 64px;
  min-height: 64px;
  height: 64px;
  border-radius: 12px;
  background: black;
  margin-right: 8px;
  &:last-child {
    margin-right: 0;
  }
`;

export const _cutout = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-radius: 12px;
  background: ${({ theme }) => theme.map['cutout']};
  box-shadow: ${({ theme }) => theme.shadow['cutout']};
`;

export const _amount = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['faded']};
  margin-left: 8px;
`;

export const _container = styled(m.div)`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;
export const _icon = styled(m.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-right: 8px;
  margin-left: 8px;
  > svg {
    min-width: 14px;
    width: 14px;
    aspect-ratio: 1;
    color: ${({ theme }) => theme.text['faded']};
    position: absolute;
  }
  > img {
    position: absolute;
    /* min-width: 16px; */
    width: 16px;
    /* min-height: 16px; */
    aspect-ratio: 1;
    bottom: 2px;
    color: ${({ theme }) => theme.text['clear']};
  }
  transition: all 0.2s ease-in-out;
  &:hover {
    > svg {
      color: ${({ theme }) => theme.text['base']};
      min-width: 18px;
      with: 18px;
    }
    > img {
      color: ${({ theme }) => theme.text['active']};
    }
  }
  &:active,
  &:focus {
    > svg {
      color: ${({ theme }) => theme.text['ghost']};
      min-width: 14px;
      with: 14px;
    }
    > img {
      color: ${({ theme }) => theme.text['ghost']};
    }
  }
`;

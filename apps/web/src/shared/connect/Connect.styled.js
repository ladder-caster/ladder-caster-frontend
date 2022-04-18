import styled from 'styled-components';

export const _connect = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

export const _wallet = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 8px 16px 8px 8px;
  border-radius: 12px;
  margin-right: 4px;
  background: ${({ theme }) => theme.background['lowest']};
  box-shadow: ${({ theme }) => theme.shadow['cutout']};
  width: ${({ $long }) => ($long ? '125px' : 'auto')};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.background['button']};
  }
  > span {
    top: 2px;
    font-size: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.text['base']};
    letter-spacing: 0.5px;
    vertical-align: middle;
    padding-left: 6px;
    padding-right: 8px;
    line-height: 1;
    > span {
      /* opacity: 0.4; */
      font-weight: 500;
    }
  }
  > svg {
    min-height: 16px;
    height: 16px;
    min-width: 16px;
    width: 16px;
    color: ${({ theme }) => theme.text['base']};
  }
`;

import styled from 'styled-components';

export const _slide = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const _carousel = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zindex.modal_low};
  width: 100%;
  min-height: 100px;
  height: 100px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 8px;
  cursor: pointer;
`;

export const _float = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zindex['modal_high']};
  width: 0;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${({ $right }) => ($right ? 'flex-end' : 'flex-start')};
`;

export const _shadow = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zindex['modal_base']};
  width: 0;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${({ $right }) => ($right ? 'flex-end' : 'flex-start')};
`;

export const _gradient = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zindex['modal_base']};
  min-width: 32px;
  width: 32px;
  height: 100%;
  background: linear-gradient(
    ${({ $right }) => ($right ? '90deg' : '-90deg')},
    transparent 0%,
    ${({ theme }) => theme.background['lowest']} 50%,
    ${({ theme }) => theme.background['lowest']} 100%
  );
`;

export const _list = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zindex['modal_base']};
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 12px;
  padding: 0 calc(50% - 50px) 0 calc(50% - 50px);
  overflow: hidden;
`;

export const _description = styled.div`
  min-height: 120px;
`;

export const _prev = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zindex.modal_high};
  height: 100%;
  min-width: 100px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  > svg {
    min-width: 16px;
    width: 16px;
    min-height: 16px;
    height: 16px;
    color: ${({ theme }) => theme.text['base']};
  }
`;

export const _next = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zindex.modal_high};
  height: 100%;
  min-width: 100px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  > svg {
    min-width: 16px;
    width: 16px;
    min-height: 16px;
    height: 16px;
    color: ${({ theme }) => theme.text['base']};
  }
`;

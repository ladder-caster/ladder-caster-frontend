import styled from 'styled-components';
import { m } from 'framer-motion';

export const _swap = styled.div`
  min-width: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 8px 16px;
  overflow: scroll;
`;

export const _form = styled.div`
  min-width: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const _row = styled.div`
  position: relative;
  z-index: ${({ theme, $zindex }) => theme.zindex['drawer_base'] + $zindex};
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
  &:last-child {
    margin-bottom: 0;
  }
`;

export const _section = styled.div`
  width: 100%;
  min-height: 40px;
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const _input = styled.div`
  width: 100%;
  min-height: 40px;
  height: 40px;
  border-radius: 50px;
  background: ${({ theme }) => theme.background['base']};
  box-shadow: ${({ theme }) => theme.shadow['cutout']};
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const _float = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zindex['drawer_base']};
  width: 0;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const _dropdown = styled.div`
  min-width: 88px;
  width: 88px;
  min-height: 36px;
  height: 36px;
  padding-left: 2px;
`;

export const _percent = styled(m.div)`
  min-width: 56px;
  width: 56px;
  min-height: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow['ghost']};
  margin-left: 16px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.text['base']};
  cursor: pointer;
`;

export const _rate = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const _balances = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  top: 2px;
  padding-left: 8px;
`;

export const _submit = styled.div`
  min-width: 120px;
  width: 120px;
  height: 100%;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['special']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  background: ${({ theme }) => theme.background['special']};
  box-shadow: ${({ theme }) => theme.shadow['frost']};
  letter-spacing: 0.5px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const _switch = styled(m.div)`
  min-width: 40px;
  width: 40px;
  min-height: 40px;
  height: 40px;
  border-radius: 50px;
  box-shadow: ${({ theme }) => theme.shadow['ghost']};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: 12px;
  transform: rotate(-45deg);
  > svg {
    min-width: 24px;
    width: 24px;
    min-height: 24px;
    height: 24px;
    color: ${({ theme }) => theme.text['base']};
  }
`;

export const _routing = styled.div`
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.text['success']};
  letter-spacing: 1px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-top: 6px;
  margin-right: 16px;
`;

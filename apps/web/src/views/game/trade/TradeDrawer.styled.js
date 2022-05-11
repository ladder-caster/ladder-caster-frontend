import styled from 'styled-components';
import { m } from 'framer-motion';
export const _trade = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px;
`;

export const _header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px 0;
`;
export const _title = styled.div`
  width: 100%;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['base']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const _float = styled.div`
  width: 0;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
`;
export const _close = styled.div`
  min-width: 36px;
  width: 36px;
  min-height: 36px;
  height: 36px;
  cursor: pointer;
`;
export const _icon_close = styled(m.div)`
  min-width: 100%;
  width: 100%;
  min-height: 100%;
  height: 100%;
  border-radius: 10px;
  background: ${({ theme }) => theme.background['highest']};
  box-shadow: ${({ theme }) => theme.shadow['glass']};
  display: flex;
  justify-content: center;
  align-items: center;
  > svg {
    min-width: 16px;
    width: 16px;
    min-height: 16px;
    height: 16px;
    color: ${({ theme }) => theme.text['base']};
  }
`;
export const _breakpoint = styled.div`
  display: flex;
  width: 100%;
  height: 3px;
  min-height: 3px;
  max-height: 3px;
  border-radius: 50px;
  background: ${({ theme }) => theme.background['base']};
  box-shadow: ${({ theme }) => theme.shadow['divider']};
  margin-bottom: 16px;
`;

export const _link = styled.a`
  padding: 8px 16px;
  border-radius: 50px;
  box-shadow: ${({ theme }) => theme.shadow['glass']};
  background: ${({ theme }) => theme.background['special']};
  font-size: 10px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['special']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  bottom: 6px;
`;

export const _container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${(props) => props.justify || 'center'};
  width: 100%;
  gap: 0px;
  margin-bottom: 8px;
`;
export const _icon = styled.div`
  margin-right: 8px;
  width: 24px;
  height: 24px;
  aspect-ratio: 1;

  display: flex;
  align-items: center;
  justify-content: center;
  > img {
    max-width: 24px;
    height: 24px;
  }

  > svg {
    width: 24px;
    height: 24px;
  }
`;
export const _stack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => props.align || 'center'};
  justify-content: ${(props) => props.justify || 'center'};
  gap: 8px;

  margin-bottom: 8px;
`;
export const _button = styled(m.a)`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['ghost']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  letter-spacing: 0.5px;
  line-height: 1;
  background: transparent;
  box-shadow: ${({ theme }) => theme.shadow['ghost']};
  padding: 8px 14px;
  border-radius: 12px;
  position: relative;
  bottom: 4px;
  cursor: pointer;
`;

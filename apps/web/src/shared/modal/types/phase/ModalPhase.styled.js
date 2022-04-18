import styled from 'styled-components';
import { m } from 'framer-motion';

export const _phase = styled.div`
  min-width: 100%;
  width: 100%;
  min-height: ${({ $height }) => `${$height}px`};
  height: ${({ $height }) => `${$height}px`};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 100px 8px 40px 8px;
`;

export const _board = styled(m.div)`
  max-width: 320px;
  width: 100%;
  min-height: 320px;
  background: ${({ theme }) => theme.background['high']};
  box-shadow: ${({ theme }) => theme.shadow['frost']};
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
  margin-bottom: 24px;
`;

export const _body = styled.div`
  width: 100%;
  min-height: 48px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 4px;
`;

export const _title = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['base']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  width: 100%;
  text-align: center;
  margin-bottom: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  margin-top: 8px;
  > svg {
    min-width: 20px;
    width: 20px;
    color: ${({ theme }) => theme.text['base']};
    margin-left: 4px;
    margin-right: 4px;
  }
`;

export const _description = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: justify;
  padding: 8px 24px 24px 24px;
  > span {
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
    color: ${({ theme }) => theme.text['base']};
    text-shadow: ${({ theme }) => theme.shadow['text']};
    border-radius: 16px;
    padding: 12px;
    border: 2px dashed ${({ theme }) => theme.text['base']};
  }
`;

export const _reminder = styled.div`
  width: 100%;
  height: 100%;
  max-width: 220px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.25;
  color: ${({ theme }) => theme.text['alert']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 8px;
`;

export const _actions = styled.div`
  width: 100%;
  min-height: 48px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  padding: 0 16px;
`;

export const _deny = styled.div`
  width: 100%;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.text['base']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  background: ${({ theme }) => theme.background['low']};
  box-shadow: ${({ theme }) => theme.shadow['cutout']};
  padding: 8px 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  cursor: pointer;
`;

export const _accept = styled(m.div)`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.text['base']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  background: ${({ theme }) => theme.background['highest']};
  box-shadow: ${({ theme }) => theme.shadow['glass']};
  padding: 8px 12px;
  margin-left: 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  cursor: pointer;
`;

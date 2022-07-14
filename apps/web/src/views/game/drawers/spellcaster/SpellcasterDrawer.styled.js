import styled from 'styled-components';

export const _background = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 4px;
  border-radius: 24px;
  padding-bottom: 164px;
`;

export const _spellcaster = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 20px 0 20px;
  min-width: 100%;
  width: 100%;
  height: 100%;
  border-radius: 24px;
  overflow: scroll;
`;

export const _float = styled.div`
  height: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
`;

export const _mining = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const _details = styled.div`
  display: flex;
  flex-direction: column;
`;

export const _caption = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 8px 0 8px;
  > p {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.5px;
    color: ${({ theme }) => theme.text['base']};
  }
`;

export const _title = styled.div`
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.text['base']};
  margin-bottom: 6px;
`;

export const _description = styled.p`
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.text['base']};
  margin-bottom: 16px;
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
`;

export const _section = styled.div`
  display: flex;
  width: ${({ $full }) => ($full ? '100%' : 'auto')};
  flex-direction: column;
  align-items: ${({ $left, $center }) =>
    $left ? 'flex-start' : $center ? 'center' : 'flex-end'};
`;

export const _burn = styled.div`
  min-height: 48px;
  padding: 8px 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadow['frost']};
  background: ${({ theme }) => theme.background['highest']};
  margin-top: 16px;
  margin-right: 8px;
  margin-left: 8px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['base']};
  position: relative;
`;

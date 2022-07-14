import styled from 'styled-components';

export const _settings = styled.div`
  width: 100%;
  min-height: ${({ $height }) => ($height ? `${$height - 80}px` : '100px')};
  height: 100%;
  max-height: ${({ $height }) => ($height ? `${$height - 80}px` : '')};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

export const _body = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  overflow: scroll;
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

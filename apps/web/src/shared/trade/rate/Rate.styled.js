import styled from 'styled-components';

export const _rate = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding-right: 16px;
`;

export const _base = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.text['base']};
  letter-spacing: 0.5px;
`;

export const _quote = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.text['base']};
  letter-spacing: 0.5px;
`;

export const _equals = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text['base']};
  letter-spacing: 0.5px;
  padding: 0 8px;
`;

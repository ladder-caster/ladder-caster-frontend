import styled from 'styled-components';

export const _boost = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 32px;
`;

export const _explainer = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['base']};
  text-align: center;
`;

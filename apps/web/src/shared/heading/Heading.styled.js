import styled from 'styled-components';

export const _heading = styled.div`
  ${({ theme }) => theme.styles?.view?.['_header']};
`;

export const _title = styled.h3`
  ${({ theme }) => theme.styles?.view?.['_title']};
`;

export const _divider = styled.div`
  ${({ theme }) => theme.styles?.view?.['_divider']};
  margin-top: 0;
`;

export const _container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

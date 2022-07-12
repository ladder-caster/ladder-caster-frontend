import styled from 'styled-components';

export const _heading = styled.div`
  ${({ theme }) => theme.styles?.view?.['_header']};
`;

export const _title = styled.h3`
  ${({ theme }) => theme.styles?.view?.['_title']};
`;

export const _divider = styled.div`
  width: 100%;
  height: 2px;
  background: ${({ theme }) => theme.border['base']};
  margin-top: 0;
`;

export const _container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

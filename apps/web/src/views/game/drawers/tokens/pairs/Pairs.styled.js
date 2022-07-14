import styled from 'styled-components';

export const _pairs = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px 0;
`;

export const _row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
  &:last-child {
    margin-bottom: 0;
  }
`;

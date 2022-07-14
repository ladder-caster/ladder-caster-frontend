import styled from 'styled-components';

export const _character = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 100%;
  width: 100%;
  overflow: scroll;
`;

export const _overall = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 16px;
`;

export const _equipment = styled.div`
  display: flex;
  width: 100%;
  min-height: ${({ $height }) => ($height ? `${$height}px` : '0')};
  height: ${({ $height }) => ($height ? `${$height}px` : 'auto')};
`;

export const _power = styled.div`
  display: flex;
  min-width: 20px;
  width: 20px;
  margin-left: 16px;
`;

export const _stats = styled.div`
  display: flex;
  min-height: 400px;
`;

export const _skills = styled.div`
  display: flex;
  min-height: 200px;
`;

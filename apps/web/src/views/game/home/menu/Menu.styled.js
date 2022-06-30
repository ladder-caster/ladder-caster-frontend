import styled from 'styled-components';

export const _menu = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 12px;
`;

export const _hero = styled.div`
  width: 100%;
  min-height: 88px;
  height: 88px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

export const _row = styled.div`
  width: 100%;
  min-height: 64px;
  height: 64px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
`;

export const _half = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  &:first-child {
    margin-right: 4px;
  }
  &:last-child {
    margin-left: 4px;
  }
`;

export const _third = styled.div`
  width: 33.33%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
  &:last-child {
    margin-right: 0;
  }
`;

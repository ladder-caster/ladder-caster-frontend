import styled from 'styled-components';

export const _price = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zindex['header']};
  width: 100%;
  min-height: 48px;
  height: 48px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-top: 3px solid ${({ theme }) => theme.border['high']};
  background: ${({ theme }) => theme.background['lowest']};
  bottom: 42px;
  padding: 0 48px 8px 48px;
  cursor: pointer;
`;

export const _rate = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['base']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  letter-spacing: 0.5px;
  white-space: nowrap;
  margin-right: 20px;
`;

export const _progress = styled.div`
  width: 100%;
  min-height: 16px;
  height: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 50px;
  padding: 2px;
  border: 2px solid ${({ theme }) => theme.border['high']};
  overflow: hidden;
`;

export const _container = styled.div`
  min-width: 100%;
  width: 100%;
  min-height: 100%;
  height: 100%;
  border-radius: 50px;
  overflow: hidden;
`;

export const _fill = styled.div`
  min-width: 100%;
  width: 100%;
  min-height: 100%;
  height: 100%;
  border-radius: 50px;
  background: ${({ theme }) => theme.border['high']};
  right: 100%;
`;

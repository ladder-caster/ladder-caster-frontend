import styled, { keyframes } from 'styled-components';
import { m } from 'framer-motion';

export const _skeleton = styled.div``;

const AnimatedLoading = keyframes`
  0% {
    background-color: rgb(35, 43, 67);
  }
  50% {
    background-color: rgb(52, 60, 87);
  }
  100% {
    background-color: rgb(35, 43, 67);
  }
`;

export const _shimmer = styled(m.div)`
  height: 100%;
  width: 100%;
  animation-name: ${AnimatedLoading};
  animation-duration: 1.8s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
`;

export const _icon = styled(m.div)`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  left: 4px;
  overflow: hidden;
`;

export const _item = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding: 18px 0;
  border-bottom: 2px solid ${({ theme }) => theme.border['base']};
`;

export const _inventory = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const _queue = styled.div`
  width: 100%;
  min-height: 96px;
  height: 96px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 16px 0 24px;
`;

export const _title = styled.div`
  height: 22px;
  width: 150px;
  margin-bottom: 8px;
  border-radius: 12px;
  overflow: hidden;
`;

export const _actions = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 6px 16px 10px 4px;
`;

export const _action = styled(m.div)`
  min-width: 52px;
  width: 52px;
  min-height: 52px;
  height: 52px;
  border-radius: 12px;
  margin-right: 16px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  &:last-child {
    margin-right: 0;
  }
`;

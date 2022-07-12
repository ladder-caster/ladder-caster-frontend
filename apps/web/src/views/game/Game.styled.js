import styled from 'styled-components';
import { media } from 'design';
import { m } from 'framer-motion';

export const _game = styled.div`
  min-width: 100%;
  width: 100%;
  min-height: ${({ $vh }) => `calc(${$vh}px * 100)`};
  height: ${({ $vh }) => `calc(${$vh}px * 100)`};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: black;
  padding: 2px;
  ${media.tablet`
    background: none;
  `}
`;

export const _container = styled.div`
  width: 100%;
  height: 100%;
  > div {
    width: 100%;
    height: 100%;
  }
`;

export const _mobile = styled(m.div)`
  position: relative;
  min-width: 100%;
  width: 100%;
  background: ${({ theme }) => theme.background['base']};
  box-shadow: ${({ theme }) => theme.shadow['card']};
  padding: 12px 10px 10px 10px;
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  ${media.tablet`
    min-width: 360px;
    max-width: 400px;
    min-height: 720px;
    max-height: 800px;
    &:after {
      position: absolute;
      content: '';
      top: 0;
      left: 0;
      right: 0;
      z-index: -1;
      height: 100%;
      width: 100%;
      margin: 0 auto;
      filter: blur(64px);
      transform: scale(1.75, 1.25);
      background: linear-gradient(
        90deg,
        rgba(51, 146, 255, 0.24),
        rgba(214, 113, 239, 0.36)
      );
      background-size: 200% 200%;
      opacity: 0.36;
      transition: opacity 150ms ease-out;
  `}
`;

export const _screen = styled.div`
  min-width: 100%;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background: ${({ theme }) => theme.background['lowest']};
  box-shadow: ${({ theme }) => theme.shadow['cutout']};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
`;

export const _view = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zindex['view']};
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 8px;
  overflow: hidden;
`;

export const _download = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zindex['download']};
  min-width: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0 12px 0;
  > div {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    padding: 4px;
    cursor: pointer;

    > b {
      position: relative;
      height: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-left: 6px;
      bottom: 12px;

      > span {
        font-size: 10px;
        font-weight: 700;
        color: ${({ theme }) => theme.text['base']};
        /* background: ${({ theme }) =>
          `radial-gradient(circle, ${theme.highlight['button']} 0%, ${theme.background['highest']} 150%)`}; */
        box-shadow: ${({ theme }) => theme.shadow['card']};
        padding: 2px 6px;
        border-radius: 4px;
      }
    }
    > span {
      position: relative;
      z-index: ${({ theme }) => theme.zindex['mobile_header']};
      top: 6px;
      font-size: 18px;
      font-weight: 700;
      text-shadow: ${({ theme }) => theme.shadow['text']};
      color: ${({ theme }) => theme.text['base']};
      line-height: 18px;
      padding-left: 8px;
    }
  }
`;

export const _dots = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

export const _app_store = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

export const _store = styled(m.div)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-right: 16px;
  padding: 8px;
  border-radius: 50px;
  background: ${({ theme }) => theme.background['highest']};
  box-shadow: ${({ theme }) => theme.shadow['card']};
  cursor: pointer;
  &:last-child {
    margin-right: 8px;
  }
  > svg {
    min-width: 18px;
    width: 18px;
    min-height: 18px;
    height: 18px;
    color: ${({ theme }) => theme.text['base']};
  }
`;

export const _settings = styled(m.div)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 8px;
  border-radius: 50px;
  cursor: pointer;
  > svg {
    min-width: 18px;
    width: 18px;
    min-height: 18px;
    height: 18px;
    color: ${({ theme }) => theme.text['base']};
  }
`;

export const _fetching = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zindex['fetch']};
  min-width: 100%;
  width: 100%;
  height: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
`;

export const _refresh = styled(m.div)`
  min-width: 34px;
  width: 34px;
  min-height: 34px;
  height: 34px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: 4px;
  cursor: pointer;
  > svg {
    min-width: 20px;
    width: 20px;
    min-height: 20px;
    height: 20px;
    color: ${({ theme }) => theme.text['base']};
  }
`;

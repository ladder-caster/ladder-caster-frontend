import styled, { css, keyframes } from 'styled-components';
import { m } from 'framer-motion';

export const _settings = styled.div`
  width: 100%;
  min-height: ${({ $height }) => ($height ? `${$height - 80}px` : '100px')};
  height: 100%;
  max-height: ${({ $height }) => ($height ? `${$height - 80}px` : '')};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

export const _tab = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

export const _body = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  /* justify-content: space-between; */
  align-items: center;
  padding-bottom: ${({ $noBottom }) => ($noBottom ? '0px' : '16px')};
`;

export const _container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
`;

export const _disconnect = styled(m.div)`
  width: 100%;
  min-height: 48px;
  height: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text['faded']};
  cursor: pointer;
`;

export const _button = styled(m.div)`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme, $disabled }) => theme.text[$disabled ? 'faded' : 'base']};
  background: ${({ theme, $disabled }) =>
    theme.background[$disabled ? 'lowest' : 'base']};
  box-shadow: ${({ theme }) => theme.shadow['card']};
  padding: 16px 20px;
  white-space: nowrap;
  border-radius: 8px;
  line-height: 1;
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ theme, $copied }) =>
      theme.background[$copied ? 'base' : 'highest']};
  }

  ${({ $copied }) => () => {
    if ($copied)
      return css`
        cursor: default;
      `;
  }}
`;

export const _section = styled(m.div)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  padding: 32px;
  width: 100%;
  padding: 0px 32px 8px;
`;

export const _float = styled.div`
  width: 0;
  display: flex;
  flex-direction: row;
  z-index: 1;
`;

export const _item_container = styled.div`
  width: 100%;
  background: ${({ theme, $disabled }) =>
    theme.background[$disabled ? 'lowest' : 'base']};
  box-shadow: ${({ theme }) => theme.shadow['card']};
  position: relative;
  border-radius: 8px;
  border: 1px solid rgb(236 240 254 / 10%);
`;

export const _item = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #8692b1;
  word-break: break-all;
  text-align: center;
  line-height: 24px;
  padding: 24px 32px;
  letter-spacing: 1px;
`;

export const _text = styled.div`
  width: 100%;
  text-align: center;
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['base']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  padding: 16px 0;
`;

export const _blur = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
  border-radius: 8px;

  @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
    transition: backdrop-filter 0.5s;
    backdrop-filter: blur(20px) opacity(1);
    -webkit-backdrop-filter: blur(20px) opacity(1);

    ${({ $animate }) => () => {
      if ($animate) {
        return css`
          backdrop-filter: blur(20px) opacity(0);
          -webkit-backdrop-filter: blur(20px) opacity(0);
        `;
      }
    }}
  }
`;

export const _icon = styled.div`
  min-width: 100%;
  width: 100%;
  min-height: 100%;
  height: 100%;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  > svg {
    min-width: 16px;
    width: 16px;
    min-height: 16px;
    height: 16px;
    color: ${({ theme }) => theme.text['base']};
  }
`;

export const _warning_container = styled.div`
  background: ${({ theme }) => theme.gold['button']};
  background: #ab910073;
  padding: 24px;
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow['card']};
`;

export const _warning_title = styled.div`
  text-align: center;
  font-size: 12px;
  font-weight: 700;
  color: #191605b0;
  padding-bottom: 4px;
`;
export const _warning_subtitle = styled.div`
  text-align: center;
  font-size: 12px;
  font-weight: 200;
  color: #191605b0;
`;

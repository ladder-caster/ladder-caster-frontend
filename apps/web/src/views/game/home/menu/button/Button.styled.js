import styled from 'styled-components';

export const _button = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  min-width: 100%;
  width: 100%;
  cursor: pointer;
  border-radius: 8px;
  min-height: 100%;
  height: 100%;
  box-shadow: ${({ theme, $type }) => theme.shadow['frost']};
  padding: 2px;
  overflow: hidden;
`;

export const _float = styled.div`
  height: 0;
  min-width: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

export const _background = styled.div`
  width: 100%;
  min-height: ${({ $height }) => `${$height - 4}px`};
  height: ${({ $height }) => `${$height - 4}px`};
  background-color: ${({ theme, $type }) => theme.menu[$type]?.background};
  background-image: ${({ theme, $type }) => theme.menu[$type]?.gradient};
  border-radius: 8px;
  filter: blur(6px);
`;

export const _text = styled.div`
  width: 100%;
  min-height: ${({ $height }) => `${$height - 4}px`};
  height: ${({ $height }) => `${$height - 4}px`};
  color: ${({ theme }) => theme.text['active']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0 16px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: rgba(35, 43, 67, 0.88);
  border-radius: 8px;
  letter-spacing: 0.5px;
`;

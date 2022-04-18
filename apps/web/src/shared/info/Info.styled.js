import styled from 'styled-components';
import { m } from 'framer-motion';

export const _info = styled.div``;

export const _equipment = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 8px 0;
  white-space: nowrap;
  overflow: hidden;
`;

export const _gradient = styled.div`
  min-width: 48px;
  width: 48px;
  min-height: 26px;
  height: 26px;
  background: linear-gradient(
    270deg,
    ${({ theme }) => `${theme.background['highest']}, transparent`}
  );
`;

export const _equip = styled(m.div)`
  padding: 4px 12px;
  color: ${({ theme }) => theme.highlight['background']};
  border: 2px solid ${({ theme }) => theme.border['highest']};
  border-radius: 8px;
  background: ${({ theme }) => theme.background['button_active']};
  box-shadow: ${({ theme }) => theme.shadow['glass']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  letter-spacing: 0.5px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: 700;
`;

export const _image = styled.div`
  width: 100%;
  min-height: ${({ $height }) => `${$height}px`};
  height: ${({ $height }) => `${$height}px`};
  display: flex;
  flex-direction: column;
  margin-right: 16px;
`;

export const _power = styled.div`
  min-width: 20px;
  width: 20px;
  min-height: ${({ $height }) => `${$height}px`};
  height: ${({ $height }) => `${$height}px`};
  margin-left: 16px;
  border-radius: 50px;
  border: 2px solid ${({ theme, $rarity }) => theme.rarity[$rarity]};
  background: radial-gradient(
    ${({ theme, $rarity }) =>
      `${theme.rarity[$rarity]}, ${theme.background['lowest']}`}
  );
  opacity: 0.65;
`;

export const _shadow = styled.div`
  min-width: 0;
  width: 0;
  min-height: 26px;
  height: 26px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

export const _text = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 12px;
  > span {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.5px;
    color: ${({ theme }) => theme.text['base']};
    line-height: 1;
  }
`;

export const _wrapper = styled.div`
  width: 100%;
`;

export const _visual = styled.div`
  min-width: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const _mint = styled.div`
  margin-left: 4px;
  padding: 4px 12px;
  color: ${({ theme }) => theme.highlight['background']};
  border: 2px solid ${({ theme }) => theme.border['highest']};
  border-radius: 8px;
  background: ${({ theme }) => theme.background['button_active']};
  box-shadow: ${({ theme }) => theme.shadow['glass']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  letter-spacing: 0.5px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: 700;
`;

export const _odds = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-left: 16px;
  > svg {
    min-width: 18px;
    width: 18px;
    min-height: 18px;
    height: 18px;
    color: ${({ theme }) => theme.text['base']};
  }
  > span {
    top: 1px;
    font-size: 16px;
    font-weight: 700;
    color: ${({ theme }) => theme.text['base']};
    padding-left: 12px;
  }
`;

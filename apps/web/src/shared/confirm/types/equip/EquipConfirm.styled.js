import styled from 'styled-components';

export const _equip = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 4px;
`;

export const _header = styled.div`
  width: 100%;
  padding-bottom: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const _side = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zindex['drawer_back']};
  width: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const _back = styled.div`
  min-width: 16px;
  width: 16px;
  min-height: 16px;
  height: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 16px;
  cursor: pointer;
  > svg {
    min-width: 16px;
    width: 16px;
    min-height: 16px;
    height: 16px;
    color: ${({ theme }) => theme.text['faded']};
  }
`;

export const _title = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zindex['drawer_title']};
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  > span {
    font-size: 18px;
    font-weight: 700;
    color: ${({ theme }) => theme.text['base']};
    text-shadow: ${({ theme }) => theme.shadow['text']};
  }
`;

export const _action = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const _button = styled.div`
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  text-shadow: ${({ theme }) => theme.shadow['text']};
  color: ${({ theme }) => theme.highlight['background']};
  background: ${({ theme }) => theme.background['button_active']};
  box-shadow: ${({ theme }) => theme.shadow['glass']};
  border: 2px solid ${({ theme }) => theme.border['highest']};
  letter-spacing: 0.5px;
  cursor: pointer;
`;

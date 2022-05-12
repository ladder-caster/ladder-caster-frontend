import styled from 'styled-components';

export const _dropdown = styled.div`
  min-width: 108px;
  width: 108px;
  min-height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: ${({ $right }) => ($right ? 'flex-end' : 'flex-start')};
  cursor: pointer;
`;

export const _select = styled.div`
  width: 100%;
  min-height: 100%;
  height: 100%;
  border-radius: 50px;
  background: ${({ theme }) => theme.background['highest']};
  box-shadow: ${({ theme }) => theme.shadow['frost']};
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 8px;
`;

export const _resource = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const _logo = styled.div`
  min-width: 20px;
  width: 20px;
  min-height: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  > img {
    max-width: 100%;
    height: auto;
    max-height: 32px;
    color: ${({ $background }) => $background};
  }
  > svg {
    min-width: 20px;
    min-height: 20px;
    max-width: 100%;
    height: auto;
    max-height: 20px;
    color: ${({ $background }) => $background};
  }
`;

export const _symbol = styled.div`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.text['base']};
  padding: 0 6px;
  top: 1px;
`;

export const _chevron = styled.div`
  min-width: 12px;
  width: 12px;
  min-height: 12px;
  height: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  > svg {
    max-width: 100%;
    height: auto;
    max-height: 28px;
    color: ${({ theme }) => theme.text['faded']};
  }
`;

export const _float = styled.div``;

export const _options = styled.div``;

export const _label = styled.div`
  width: 100%;
  min-height: 100%;
  height: 100%;
  pointer-events: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 8px;
  > span {
    font-size: 14px;
    font-weight: 700;
    color: ${({ theme }) => theme.text['faded']};
    text-shadow: ${({ theme }) => theme.shadow['text']};
    padding-left: 8px;
    top: 1px;
  }
`;

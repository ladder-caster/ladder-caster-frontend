import styled from 'styled-components';

export const _item = styled.div`
  width: 100%;
  min-height: ${({ $height }) => ($height ? `${$height}px` : 0)};
  height: ${({ $height }) => ($height ? `${$height}px` : 0)};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  overflow-y: scroll;
`;

export const _float = styled.div`
  width: 100%;
  height: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
`;

export const _amount = styled.div`
  min-width: 24px;
  width: 24px;
  min-height: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ theme }) => theme.background['base']};
  box-shadow: ${({ theme }) => theme.shadow['cutout']};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  bottom: 4px;
  right: 4px;
  > span {
    font-size: 12px;
    font-weight: 700;
    text-shadow: ${({ theme }) => theme.shadow['text']};
    color: ${({ theme }) => theme.text['base']};
  }
`;

export const _breakpoint = styled.div`
  display: flex;
  width: 100%;
  height: 3px;
  min-height: 3px;
  max-height: 3px;
  border-radius: 50px;
  background: ${({ theme }) => theme.background['base']};
  box-shadow: ${({ theme }) => theme.shadow['divider']};
`;

export const _title = styled.div`
  width: 100%;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['base']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  margin-bottom: 16px;
`;

export const _body = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 16px;
`;

export const _choose = styled.div`
  width: 100%;
  min-height: ${({ $height }) => ($height ? `${$height}px` : '100px')};
  height: ${({ $height }) => ($height ? `${$height}px` : '100px')};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const _row = styled.div`
  width: 100%;
  min-height: calc(50% - 8px);
  height: calc(50% - 8px);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 16px;
  &:last-child {
    margin-bottom: 0;
  }
`;

export const _hat = styled.div`
  width: calc(50% - 8px);
  height: 100%;
  margin-right: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

export const _gem = styled.div`
  width: calc(50% - 8px);
  height: 100%;
  margin-left: 8px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

export const _robe = styled.div`
  width: calc(50% - 8px);
  height: 100%;
  margin-right: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

export const _staff = styled.div`
  width: calc(50% - 8px);
  height: 100%;
  margin-left: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

export const _inner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  background: ${({ theme }) => `radial-gradient(circle,
          ${theme.highlight['button']} 0%,
          ${theme.background['highest']} 150%)`};
  box-shadow: ${({ theme }) => theme.shadow['glass']};
  > svg {
    min-width: 60%;
    width: 60%;
    min-height: 60%;
    height: 60%;
    color: ${({ theme }) => theme.highlight['text']};
    filter: drop-shadow(${({ theme }) => theme.shadow['text']});
    opacity: 1;
    transform: ${({ $scale, $staff }) =>
      $scale
        ? `scale(${$scale})${$staff ? `rotate(${$staff})` : ''}`
        : 'scale(1)'};
  }
`;

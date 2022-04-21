import styled, { css } from 'styled-components';
import { m } from 'framer-motion';

export const _tab = styled.div`
  width: 100%;
  height: 100%;
  /* max-height: ${({ $height }) => $height && `${$height - 80}px`}; */
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

export const buttonStyle = css`
  padding: 8px 12px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.text['base']};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadow['frost']};
  cursor: pointer;
  font-size: 14px;
`;

export const _button = styled.div`
  ${buttonStyle}
`;

// export const _link = styled.a`
//   ${buttonStyle}
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   margin-top: 8px;

//   > svg {
//     height: 14px;
//     width: 14px;
//   }
// `;

export const _coin = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['base']};
  white-space: nowrap;
  padding: 16px 4px;
  border-top: 2px solid ${({ theme }) => theme.border['high']};
  border-bottom: 1px solid ${({ theme }) => theme.border['divide']};
  &:first-child {
    border-top: none;
  }
  &:last-child {
    border-bottom: none;
  }
`;

export const _icon = styled.div`
  margin-right: 8px;
  width: 32px;
  height: 32px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  > img {
    max-width: 32px;
    height: 32px;
  }

  > svg {
    width: 24px;
    height: 24px;
  }
`;

export const _right = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

export const _label = styled.div`
  padding-right: 8px;
  color: ${({ theme }) => theme.text.active};
`;

export const _text = styled.div`
  display: flex;
  flex-direction: column;
`;

export const _amount = styled.div``;

export const _link = styled(m.a)`
  padding: 12px 18px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  box-shadow: ${({ theme, $disabled }) =>
    $disabled ? 'none' : theme.shadow['glass']};
  border: none;
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
  width: ${({ $long }) => ($long ? 'calc(100% - 32px)' : 'initial')};
  transition: 0.25s background-color;

  &:hover {
    background: ${({ theme, $disabled }) =>
      $disabled
        ? theme.background['button']
        : theme.background['button_active']};
  }

  > span {
    font-size: 12px;
    font-weight: 700;

    color: ${({ theme, $disabled }) =>
      $disabled ? theme.text['faded'] : theme.text['base']};
    white-space: nowrap;
  }
`;

export const _more = styled.div`
  font-size: 14px;
  font-weight: 700;
  min-width: 104px;
  border: none;
  color: ${({ theme }) => theme.highlight['background']};
  padding: 8px 16px;
  border-radius: 50px;
  background: ${({ theme }) => theme.background['button_active']};
  box-shadow: ${({ theme }) => theme.shadow['glass']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  letter-spacing: 0.5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

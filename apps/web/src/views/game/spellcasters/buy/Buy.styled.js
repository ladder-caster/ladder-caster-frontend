import styled from 'styled-components';

export const _buy = styled.div`
  width: 100%;
  height: 100%;
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
  border: none;
  box-shadow: ${({ theme, $disabled }) =>
    $disabled ? 'none' : theme.shadow['glass']};
  background: ${({ theme, $disabled }) =>
    $disabled
      ? theme.background['button_high']
      : theme.background['button_high']};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;

  > span {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    color: ${({ theme, $disabled }) =>
      theme.text[$disabled ? 'faded' : 'base']};
    white-space: nowrap;
    text-align: center;
    text-transform: uppercase;
    height: 100%;
  }
`;

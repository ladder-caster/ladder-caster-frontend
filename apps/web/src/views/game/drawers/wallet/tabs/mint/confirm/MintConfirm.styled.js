import styled from 'styled-components';
import { _button as __button } from '../../redeem/confirm/RedeemConfirm.styled';

export const _confirm = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 32px;
`;

export const _button = styled(__button)`
  margin-top: auto;
`;

export const _display = styled.div`
  width: 100%;
  min-height: ${({ $height }) => ($height ? `${$height}px` : '100px')};
  height: ${({ $height }) => ($height ? `${$height}px` : '100px')};
  border-radius: 16px;
  margin: 0 8px;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  max-width: 200px;
  height: 200px;

  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }
`;

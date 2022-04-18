import styled from 'styled-components';
import {
  _accept as __accept,
  _actions as __actions,
  _window as __window,
} from '../../Modal.styled';
import { _breakpoint as __breakpoint } from '../../../../views/game/spellcasters/drawer/Player.styled';

export const _breakpoint = styled(__breakpoint)`
  width: 50%;
`;

export const _window = styled(__window)`
  min-width: 325px;
  max-width: 375px;
  min-height: 300px;
  justify-content: center;
`;

export const _button = styled(__accept)`
  margin: ${({ $noTop }) => ($noTop ? '12px 0 20px' : '20px 0')};
  width: calc(100% - 32px);

  > svg {
    min-height: 14px;
    height: 14px;
    min-width: 14px;
    width: 14px;
    color: ${({ theme, $disabled }) =>
      theme.text[$disabled ? 'faded' : 'base']};
    margin-right: 6px;
  }
`;

export const _actions = styled(__actions)`
  padding: 0;
  justify-content: center;
`;

import styled from 'styled-components';
import { ATTRIBUTE_XP } from 'core/remix/state';

export const _xp = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text['base']};
  > span {
    font-size: 16px;
    font-weight: 500;
    color: ${({ theme }) => theme.attribute[ATTRIBUTE_XP]};
    white-space: nowrap;
  }
`;

import { css } from 'styled-components';
export const _column = css`
  display: flex;
  flex-direction: column;
  justify-content: ${({ $justify }) => $justify ?? 'center'};
  align-items: ${({ $align }) => $align ?? 'center'};
  gap: ${({ $gap }) => $gap ?? '0'};
`;

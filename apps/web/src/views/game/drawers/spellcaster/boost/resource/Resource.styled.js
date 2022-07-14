import styled from 'styled-components';

export const _resource = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  &:last-child {
    margin-bottom: 0;
  }
`;

export const _icon = styled.div`
  min-width: 24px;
  width: 24px;
  min-height: 24px;
  height: 24px;
  > svg {
    min-width: 24px;
    width: 24px;
    min-height: 24px;
    height: 24px;
    color: ${({ theme, $element }) => theme[$element]?.resource};
  }
`;

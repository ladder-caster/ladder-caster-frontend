import styled from 'styled-components';

export const _resource = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text['base']};
  > b {
    top: 2px;
    max-width: 100px;
    display: inline-flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-weight: 700;
    color: ${({ theme, $element }) => theme[$element]?.['resource']};
    white-space: nowrap;
    padding: 0 6px;
    > svg {
      min-width: 16px;
      width: 16px;
      min-height: 16px;
      height: 16px;
      color: ${({ theme, $element }) => theme[$element]?.['resource']};
      margin-right: 4px;
    }
  }
`;

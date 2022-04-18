import styled from 'styled-components';

export const _attributes = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  bottom: 2px;
  margin-right: 22px;
  margin-left: 2px;
`;

export const _attribute = styled.div`
  min-width: 16px;
  width: 16px;
  min-height: 16px;
  height: 16px;
  border-radius: 8px;
  padding: 0 8px;
  > svg {
    min-width: 16px;
    width: 16px;
    min-height: 16px;
    height: 16px;
    color: ${({ theme, $attribute }) =>
      $attribute ? theme.attribute[$attribute] : theme.text['ghost']};
  }
`;

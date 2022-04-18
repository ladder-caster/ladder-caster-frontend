import styled from 'styled-components';

export const _stats = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px 4px;
`;

export const _rows = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const _row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 32px;
  > svg {
    min-width: 20px;
    width: 20px;
    min-height: 20px;
    height: 20px;
    color: ${({ theme, $attribute }) => theme.attribute[$attribute]};
  }
`;

export const _bonus = styled.div`
  font-size: 16px;
  font-weight: 700;
  text-shadow: ${({ theme }) => theme.shadow['text']};
  color: ${({ theme, $attribute }) => theme.attribute[$attribute]};
  top: 2px;
  padding-left: 4px;
`;

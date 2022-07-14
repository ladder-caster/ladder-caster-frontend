import styled from 'styled-components';

export const _input = styled.input`
  position: relative;
  z-index: ${({ theme }) => theme.zindex['drawer_low']};
  width: 100%;
  height: 100%;
  background: none;
  border: none;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 0 16px;
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['input']};
  text-align: right;
  &::placeholder {
    color: ${({ theme }) => theme.text['faded']};
  }
`;

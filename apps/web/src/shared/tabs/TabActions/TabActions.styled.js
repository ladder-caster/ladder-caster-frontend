import styled from 'styled-components';
import { m } from 'framer-motion';

export const _container = styled(m.div)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
export const _row = styled(m.div)`
  width: 100%;
  justify-content: space-between;
  align-items: center;
  display: flex;
  gap: 8px;
`;
export const _player_actions = styled.div`
  width: 100%;
  margin-top: 16px;
  border-radius: 16px;
  border: 2px solid ${({ theme }) => theme.border['high']};
  padding: 0 16px 16px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const _text = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  > span {
    display: flex;
    max-width: 96px;
    text-align: center;
    background: ${({ theme }) => theme.background['highest']};
    padding: 2px 4px;
    font-size: 12px;
    font-weight: 700;
    color: ${({ theme }) => theme.text['base']};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    text-align: center;
  }
  bottom: 16px;
`;

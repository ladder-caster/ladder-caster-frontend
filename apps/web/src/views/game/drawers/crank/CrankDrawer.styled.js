import styled from 'styled-components';
import { m } from 'framer-motion';

export const _crank = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px;
`;

export const _header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px 0;
`;

export const _close = styled.div`
  min-width: 36px;
  width: 36px;
  min-height: 36px;
  height: 36px;
  cursor: pointer;
`;

export const _float = styled.div`
  width: 0;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
`;

export const _icon = styled(m.div)`
  min-width: 100%;
  width: 100%;
  min-height: 100%;
  height: 100%;
  border-radius: 10px;
  background: ${({ theme }) => theme.background['highest']};
  box-shadow: ${({ theme }) => theme.shadow['glass']};
  display: flex;
  justify-content: center;
  align-items: center;
  > svg {
    min-width: 16px;
    width: 16px;
    min-height: 16px;
    height: 16px;
    color: ${({ theme }) => theme.text['base']};
  }
`;

export const _title = styled.div`
  width: 100%;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['base']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
`;

export const _breakpoint = styled.div`
  display: flex;
  width: 100%;
  height: 3px;
  min-height: 3px;
  max-height: 3px;
  border-radius: 50px;
  background: ${({ theme }) => theme.background['base']};
  box-shadow: ${({ theme }) => theme.shadow['divider']};
  margin-bottom: 16px;
`;

export const _description = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text['base']};
  padding: 0 16px;
  margin-bottom: 32px;
`;

export const _button = styled.button`
  min-width: 180px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  text-shadow: ${({ theme }) => theme.shadow['text']};
  color: ${({ theme }) => theme.highlight['background']};
  background: ${({ theme }) => theme.background['button_active']};
  box-shadow: ${({ theme }) => theme.shadow['glass']};
  border: 2px solid ${({ theme }) => theme.border['highest']};
  letter-spacing: 0.5px;
  margin-top: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  pointer-events: ${({ $disabled }) => ($disabled ? 'none' : 'all')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  text-align: center;
`;

export const _timer = styled.div`
  min-width: 200px;
  width: 200px;
  min-height: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${({ theme }) => theme.background['highest']};
  box-shadow: ${({ theme }) => theme.shadow['cutout']};
  border: 2px solid ${({ theme }) => theme.rarity['meter']};
  padding: 2px;
`;

export const _bar = styled(m.div)`
  width: 100%;
  height: 100%;
  border-radius: 4px;
  overflow: hidden;
`;

export const _fill = styled(m.div)`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.rarity['meter']};
  box-shadow: ${({ theme }) => theme.shadow['frost']};
  border-radius: 4px;
`;

export const _countdown = styled.div`
  min-height: 32px;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.highlight['background']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  padding-top: 4px;
  margin-bottom: 16px;
`;

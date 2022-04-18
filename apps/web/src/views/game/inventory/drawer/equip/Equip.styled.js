import styled from 'styled-components';
import { m } from 'framer-motion';

export const _equip = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 4px;
  overflow: scroll;
`;

export const _player = styled.div`
  min-width: 72px;
  width: 72px;
  min-height: 72px;
  height: 72px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-right: 6px;
  > svg {
    min-width: 28px;
    width: 28px;
    min-height: 28px;
    height: 28px;
    color: ${({ theme }) => theme.text['base']};
  }
`;

export const _empty = styled.div`
  min-width: 72px;
  width: 72px;
  min-height: 72px;
  height: 72px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  background: ${({ theme }) => theme.background['base']};
  box-shadow: ${({ theme }) => theme.shadow['frost']};
  > svg {
    min-width: 36px;
    width: 36px;
    min-height: 36px;
    height: 36px;
    color: ${({ theme }) => theme.text['base']};
  }
`;

export const _image = styled.div`
  width: 100%;
  min-height: ${({ $height }) => `${$height}px`};
  height: ${({ $height }) => `${$height}px`};
  display: flex;
  flex-direction: column;
`;

export const _caster = styled(m.div)`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  border-radius: 18px;
  padding: 8px 4px;
  box-shadow: ${({ theme }) => theme.shadow['cutout']};
  background: ${({ theme }) => theme.background['base']};
  cursor: pointer;
`;

export const _item = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const _current = styled.div`
  min-width: 72px;
  width: 72px;
  min-height: 72px;
  height: 72px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
`;

export const _arrow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 12px 0 16px;
  > svg {
    min-width: 16px;
    width: 16px;
    min-height: 16px;
    height: 16px;
    color: ${({ theme }) => theme.text['base']};
    top: 2px;
    filter: drop-shadow(${({ theme }) => theme.shadow['text']});
    &:first-child {
      margin-bottom: 8px;
    }
  }
`;

export const _next = styled.div`
  min-width: 72px;
  width: 72px;
  min-height: 72px;
  height: 72px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  > img {
    min-width: 40px;
    width: 40px;
    min-height: 40px;
    height: 40px;
  }
`;

export const _compare = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-left: 12px;
`;

export const _from = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  opacity: 0.5;
  > svg {
    min-width: 18px;
    width: 18px;
    min-height: 18px;
    height: 18px;
    color: ${({ theme, $attribute }) => theme.attribute[$attribute]};
  }
  > span {
    top: 2px;
    font-size: 16px;
    font-weight: 700;
    color: ${({ theme, $attribute }) => theme.attribute[$attribute]};
    text-shadow: ${({ theme }) => theme.shadow['text']};
    padding-left: 4px;
    text-decoration: line-through;
  }
`;

export const _to = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  > svg {
    min-width: 18px;
    width: 18px;
    min-height: 18px;
    height: 18px;
    color: ${({ theme, $attribute }) => theme.attribute[$attribute]};
  }
  > span {
    top: 3px;
    font-size: 16px;
    font-weight: 700;
    color: ${({ theme, $attribute }) => theme.attribute[$attribute]};
    text-shadow: ${({ theme }) => theme.shadow['text']};
    padding-left: 4px;
  }
`;

export const _choose = styled.div`
  min-width: 36px;
  width: 36px;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  > svg {
    min-width: 14px;
    width: 14px;
    min-height: 14px;
    height: 14px;
    color: ${({ theme }) => theme.text['base']};
  }
`;

export const _header = styled.div`
  width: 100%;
  padding-bottom: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const _side = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zindex['drawer_back']};
  width: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const _back = styled.div`
  min-width: 16px;
  width: 16px;
  min-height: 16px;
  height: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 16px;
  cursor: pointer;
  > svg {
    min-width: 16px;
    width: 16px;
    min-height: 16px;
    height: 16px;
    color: ${({ theme }) => theme.text['faded']};
  }
`;

export const _title = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zindex['drawer_title']};
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  > span {
    font-size: 18px;
    font-weight: 700;
    color: ${({ theme }) => theme.text['base']};
    text-shadow: ${({ theme }) => theme.shadow['text']};
  }
`;

export const _other = styled.div`
  min-width: 18px;
  width: 18px;
  min-height: 72px;
  height: 72px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 2px;
`;

export const _attribute = styled.div`
  min-width: 18px;
  width: 18px;
  min-height: 18px;
  height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:first-child {
    margin-bottom: 8px;
  }
  > svg {
    min-width: 18px;
    width: 18px;
    min-height: 18px;
    height: 18px;
    color: ${({ theme, $attribute }) =>
      $attribute ? theme.attribute[$attribute] : theme.text['ghost']};
  }
`;

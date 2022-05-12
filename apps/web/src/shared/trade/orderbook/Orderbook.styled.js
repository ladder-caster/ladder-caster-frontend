import styled from 'styled-components';

export const _orderbook = styled.div`
  width: 100%;
  display: flex;
  min-height: 134px;
  flex-direction: column;
  padding: 12px 12px 12px 12px;
  border-radius: 12px;
  background: ${({ theme }) => theme.background['base']};
  box-shadow: ${({ theme }) => theme.shadow['cutout']};
  overflow: hidden;
`;

export const _header = styled.div`
  min-width: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const _label = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['base']};
`;

export const _orders = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

export const _asks = styled.div`
  width: 50%;
  min-width: 50%;
  display: flex;
  flex-direction: column;
`;

export const _bids = styled.div`
  width: 50%;
  min-width: 50%;
  display: flex;
  flex-direction: column;
`;

export const _ask = styled.div`
  width: 100%;
  min-height: 28px;
  height: 28px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const _bid = styled.div`
  width: 100%;
  min-height: 28px;
  height: 28px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const _float = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zindex['drawer_low']};
  width: 0;
  min-height: 28px;
  height: 28px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${({ $end }) => ($end ? 'flex-end' : 'flex-start')};
`;

export const _size = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zindex['drawer_high']};
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['active']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
`;

export const _price = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zindex['drawer_base']};
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme, $isBid }) => theme.text[$isBid ? 'success' : 'error']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  padding: 0 4px;
`;

export const _bar = styled.div`
  min-width: ${({ $width }) => ($width ? `${$width}px` : 0)};
  width: ${({ $width }) => ($width ? `${$width}px` : 0)};
  min-height: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${({ $end }) => ($end ? 'flex-end' : 'flex-start')};
  overflow: hidden;
`;

export const _fill = styled.div`
  min-width: 60%;
  width: 60%;
  min-height: 100%;
  height: 100%;
  background: ${({ theme, $isBid }) =>
    theme.background[$isBid ? 'success' : 'error']};
  opacity: 0.5;
`;

export const _center = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zindex['drawer_base']};
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const _click = styled.div`
  min-width: ${({ $width }) => ($width ? `${$width}px` : 0)};
  width: ${({ $width }) => ($width ? `${$width}px` : 0)};
  min-height: 100%;
  height: 100%;
  border-radius: 4px;
  cursor: pointer;
`;

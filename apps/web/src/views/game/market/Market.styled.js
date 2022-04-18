import styled from 'styled-components';
import { m } from 'framer-motion';
import { css } from 'styled-components';

export const _market = styled(m.div)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: ${({ $init }) => ($init ? 'space-between' : 'flex-start')};
`;

export const _header = styled.div`
  ${({ theme }) => theme.styles?.view?.['_header']};
`;

// export const _title = styled.h3`
//   ${({ theme }) => theme.styles?.view?.['_title']};
// `;

export const _loading = styled.div`
  ${({ theme }) => theme.styles?.view?.['_loading']};
`;

export const _bar = styled.div`
  ${({ theme }) => theme.styles?.view?.['_bar']};
`;

export const _fill = styled.div`
  ${({ theme }) => theme.styles?.view?.['_fill']};
`;

export const _divider = styled.div`
  ${({ theme }) => theme.styles?.view?.['_divider']};
`;

export const _body = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 16px;
`;

export const _section = styled.div`
  padding-top: 16px;
  display: flex;
  flex-direction: column;
`;

export const _title = styled.div`
  padding-bottom: 8px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['base']};
`;

export const _fractal = styled.a`
  min-width: 200px;
  width: 200px;
  min-height: 72px;
  height: 72px;
  padding: 12px 18px;
  font-size: 18px;
  border-radius: 12px;
  background: ${({ theme }) => theme.vendors.fractal['background']};
  box-shadow: ${({ theme }) => theme.shadow['frost']};
  border: none;
  > svg {
    min-width: 100%;
    width: 100%;
    min-height: 100%;
    height: 100%;
    color: ${({ theme }) => theme.vendors.fractal['text']};
    cursor: pointer;
  }
`;

export const _holaplex = styled.button`
  min-width: 200px;
  width: 200px;
  min-height: 72px;
  height: 72px;
  padding: 12px 12px 12px 8px;
  font-size: 32px;
  border-radius: 12px;
  text-align: center;
  background: ${({ theme }) => theme.vendors.holaplex['background']};
  box-shadow: ${({ theme }) => theme.shadow['frost']};
  font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
    Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  color: ${({ theme }) => theme.vendors.holaplex['text']};
  cursor: pointer;
  border: none;
  white-space: nowrap;
  margin-bottom: 16px;
  > span {
    margin-right: 8px;
    transform: scale(0.8);
  }
`;

export const _greyscale = styled.div`
  border: 2px solid ${({ theme }) => theme.border['highest']};
  border-radius: 12px;
  padding: 12px 16px;
  min-width: 200px;
  width: 200px;
  min-height: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  > svg {
    color: ${({ theme }) => theme.border['highest']};
    width: 100%;

    &:first-child {
      ${({ $double }) =>
        $double &&
        css`
          width: 50px;
          height: 50px;
          margin-right: 8px;
        `}
    }
  }
`;

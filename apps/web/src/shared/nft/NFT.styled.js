import styled from 'styled-components';

export const _nft = styled.img`
  position: relative;
  z-index: ${({ theme, $zindex }) => ($zindex ? theme.zindex[$zindex] : '')};
  min-width: ${({ $all, $small }) => ($all ? `40%` : $small ? '70%' : '100%')};
  width: ${({ $all, $small }) => ($all ? `40%` : $small ? '70%' : '100%')};
  min-height: ${({ $height, $all, $small }) =>
    $height ? `${$height}px` : $all ? '100%' : $small ? '70%' : '100%'};
  height: ${({ $height, $all, $small }) =>
    $height ? `${$height}px` : $all ? '100%' : $small ? '70%' : '100%'};
  bottom: ${({ $small }) => ($small ? '8px' : '0')};
`;

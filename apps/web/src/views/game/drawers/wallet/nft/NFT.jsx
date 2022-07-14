import React, { useRef } from 'react';
import { _NFT } from './NFT.styled';
import { useSize } from 'core/hooks/useSize';
import { useActions } from '../../../../../../actions';

const NFT = ({ nft }) => {
  const nft_ref = useRef();
  const { width } = useSize(nft_ref);
  const { chooseRedeem } = useActions();

  return (
    <_NFT $grid $height={width} ref={nft_ref} onClick={() => chooseRedeem(nft)}>
      <img src={nft?.data?.image} />
    </_NFT>
  );
};

export default NFT;

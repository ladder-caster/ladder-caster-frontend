import React from 'react';
import { _confirm, _display, _button } from './RedeemConfirm.styled';
import { DRAWER_CONTEXT } from 'core/mesh/state';
import { useMesh } from 'core/state/mesh/useMesh';
import NFT from '../../../nft/NFT';
import { useActions } from '../../../../../../actions';
import { useTranslation } from 'react-i18next';

const RedeemConfirm = () => {
  const [context] = useMesh(DRAWER_CONTEXT);
  const { redeemNFT } = useActions();
  const { t } = useTranslation();

  return (
    <_confirm>
      <_display>
        <NFT nft={context?.nft} />
      </_display>
      <_button onClick={() => redeemNFT()}>{t('modal.confirm')}</_button>
    </_confirm>
  );
};

export default RedeemConfirm;

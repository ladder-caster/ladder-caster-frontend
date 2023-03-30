import React from 'react';
import { _confirm, _display, _button } from './RedeemConfirm.styled';
import { DRAWER_CONTEXT } from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import NFT from '../../../nft/NFT';
import { useActions } from '../../../../../../actions';
import { useTranslation } from 'react-i18next';

const RedeemConfirm = () => {
  const [context] = useRemix(DRAWER_CONTEXT);
  const { confirmRedeem } = useActions();
  const { t } = useTranslation();

  return (
    <_confirm>
      <_display>
        <NFT nft={context?.nft} />
      </_display>
      <_button onClick={() => confirmRedeem()}>{t('modal.confirm')}</_button>
    </_confirm>
  );
};

export default RedeemConfirm;

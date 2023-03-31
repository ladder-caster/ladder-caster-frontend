import React from 'react';
import { _redeem, _button } from './Redeem.styled';
import { useTranslation } from 'react-i18next';
import { useActions } from '../../../actions';

const Redeem = () => {
  const { t } = useTranslation();
  const { drawerMint } = useActions();

  return (
    <_redeem>
      <_button onClick={() => drawerMint()}>{t('heading.mint.nft')}</_button>
    </_redeem>
  );
};

export default Redeem;

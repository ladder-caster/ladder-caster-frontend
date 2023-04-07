import React from 'react';
import { _confirm, _display } from './MintConfirm.styled';
import { useMesh } from 'core/state/mesh/useMesh';
import { DRAWER_CONTEXT } from 'core/mesh/state';
import { useActions } from '../../../../../../actions';
import { _button } from '../../redeem/confirm/RedeemConfirm.styled';
import Item from '../../../../../shared/item/Item';
import Caster from '../../../../../shared/caster/Caster';
import { useTranslation } from 'react-i18next';
const MintConfirm = () => {
  const { t } = useTranslation();
  const [context] = useMesh(DRAWER_CONTEXT);
  const { confirmMint } = useActions();

  return (
    <_confirm>
      <_display>
        {context?.caster ? (
          <Caster item={context?.caster} />
        ) : (
          <Item item={context?.item} />
        )}
      </_display>
      <_button onClick={() => confirmMint()}>{t('modal.confirm')}</_button>
    </_confirm>
  );
};

export default MintConfirm;

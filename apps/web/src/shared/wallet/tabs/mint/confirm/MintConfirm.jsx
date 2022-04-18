import React from 'react';
import { _confirm, _display } from './MintConfirm.styled';
import { useRemix } from 'core/hooks/remix/useRemix';
import { DRAWER_CONTEXT } from 'core/remix/state';
import { useActions } from '../../../../../../actions';
import { _button } from '../../redeem/confirm/RedeemConfirm.styled';
import Item from '../../../../../shared/item/Item';
import Caster from '../../../../../shared/caster/Caster';
const MintConfirm = () => {
  const [context] = useRemix(DRAWER_CONTEXT);
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
      <_button onClick={() => confirmMint()}>Confirm</_button>
    </_confirm>
  );
};

export default MintConfirm;

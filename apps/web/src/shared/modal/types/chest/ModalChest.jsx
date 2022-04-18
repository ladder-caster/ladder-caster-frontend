import React, { useRef } from 'react';
import { _chest, _image, _confirm } from './ModalChest.styled';
import { useTranslation } from 'react-i18next';
import { useActions } from '../../../../../actions';
import { useClickOutside } from 'core/hooks/useClickOutside';
import { AnimateButton } from '../../../../views/game/nav/animations/AnimateButton';
import { _button } from '../loot/ModalLoot.styled';
import {
  GAME_CONFIRM,
  GAME_INVENTORY,
  ITEM_CHEST,
  MODAL_ACTIVE,
} from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import { filter } from 'lodash';
import NFT from '../../../nft/NFT';

const ModalChest = () => {
  const { t } = useTranslation();
  const { modalClear, confirmChest } = useActions();
  const [modal] = useRemix(MODAL_ACTIVE);
  const button_ref = useRef();
  const [inventory] = useRemix(GAME_INVENTORY);
  const [confirm] = useRemix(GAME_CONFIRM);
  const first_chest = filter(
    inventory?.chests,
    (chest) => chest.tier === modal?.tier,
  )?.[0];

  useClickOutside(button_ref, () => modalClear());

  return (
    <_chest>
      <_image onClick={() => confirmChest(first_chest?.mint || first_chest)}>
        {first_chest && <NFT type={ITEM_CHEST} tier={modal?.tier} />}
      </_image>
      <_confirm>
        <AnimateButton $hidden={!confirm} key={'button-modal-chest'}>
          <_button
            disabled={!confirm}
            key={'button-modal-chest'}
            ref={button_ref}
            onClick={() => confirmChest(first_chest?.mint || first_chest)}
          >
            {t('modal.chest.action')}
          </_button>
        </AnimateButton>
      </_confirm>
    </_chest>
  );
};

export default ModalChest;

import React, { useRef } from 'react';
import {
  _loot,
  _visuals,
  _actions,
  _button,
  _description,
  _limit,
} from './ModalLoot.styled';
import { useActions } from '../../../../../actions';
import { useClickOutside } from 'core/hooks/useClickOutside';
import { AnimateButtonModal } from '../../../../views/game/animations/AnimateButtonModal';
import { useTranslation } from 'react-i18next';
import { AnimateLimit } from '../../../../views/game/animations/AnimateLimit';

const ModalLoot = ({ height, options }) => {
  const { t } = useTranslation();
  const { closeModal, lootResources } = useActions();
  const button_ref = useRef();

  useClickOutside(button_ref, () => closeModal({}));

  return (
    <_loot $height={height}>
      <_visuals></_visuals>
      <_actions>
        <AnimateButtonModal key={'button-modal-loot'}>
          <_button
            key={'button-modal-looter'}
            ref={button_ref}
            onClick={() => lootResources(options?.caster)}
          >
            {t('modal.loot.action')}
          </_button>
        </AnimateButtonModal>
        <AnimateLimit>
          <_limit>{t('modal.limit')}</_limit>
        </AnimateLimit>
      </_actions>
    </_loot>
  );
};

export default ModalLoot;

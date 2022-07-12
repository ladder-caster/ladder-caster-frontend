import React, { useRef } from 'react';
import {
  _loot,
  _visuals,
  _actions,
  _button,
  _description,
  _limit,
} from './ModalRedeem.styled';
import { useActions } from '../../../../../actions';
import { useClickOutside } from 'core/hooks/useClickOutside';
import { AnimateButton } from '../../../../views/game/nav/animations/AnimateButton';
import { useTranslation } from 'react-i18next';

const ModalRedeem = ({ height, options }) => {
  const { t } = useTranslation();
  const { closeModal, redeemReward } = useActions();
  const button_ref = useRef();

  useClickOutside(button_ref, () => closeModal());

  return (
    <_loot $height={height}>
      <_visuals></_visuals>
      <_actions>
        <AnimateButton key={'button-modal-loot'}>
          <_button
            key={'button-modal-looter'}
            ref={button_ref}
            onClick={() => redeemReward(options?.caster)}
          >
            {t('modal.redeem.action')}
          </_button>
        </AnimateButton>
        {/* <AnimateLimit>
          <_limit>{t('modal.limit')}</_limit>
        </AnimateLimit> */}
      </_actions>
    </_loot>
  );
};

export default ModalRedeem;

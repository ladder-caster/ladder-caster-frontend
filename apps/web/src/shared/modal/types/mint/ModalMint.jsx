import React, { useRef } from 'react';
import {
  _accept,
  _actions,
  _deny,
  _description,
  _title,
  _window,
  _counter,
  _less,
  _number,
  _more,
} from '../../Modal.styled';
import { _breakpoint } from '../../../../views/game/spellcasters/drawer/Player.styled';
import { AnimateButton } from '../../../button/animations/AnimateButton';
import { AnimateModal } from '../../animations/AnimateModal';
import { useClickOutside } from 'core/hooks/useClickOutside';
import { useActions } from '../../../../../actions';
import { useRemix } from 'core/hooks/remix/useRemix';
import { DRAWER_CONTEXT, MODAL_ACTIVE } from 'core/remix/state';
import { useTranslation } from 'react-i18next';
import { IconMinus } from '../../../../../../libs/design/icons/minus.icon';
import { IconMore } from '../../../../../../libs/design/icons/more.icon';

const ModalMint = () => {
  const { t } = useTranslation();
  const { modalClear, decrementMint, incrementMint } = useActions();
  const [modal] = useRemix(MODAL_ACTIVE);
  const button_ref = useRef();
  const number = modal?.number;

  useClickOutside(button_ref, () => modalClear());

  const active = modal?.active;

  const accept = () => {
    if (active && modal?.accept) modal?.accept();
    modalClear();
  };
  const deny = () => {
    if (active && modal?.deny) modal?.deny();
  };

  return (
    <AnimateModal>
      <_window ref={button_ref}>
        <_title>
          <span>{t('modal.mint')}</span>
        </_title>
        <_breakpoint />
        <_description>{t('modal.demo.description')}</_description>
        <_counter>
          <_less onClick={() => decrementMint()}>
            <IconMinus />
          </_less>
          <_number>{context?.number}</_number>
          <_more onClick={() => incrementMint()}>
            <IconMore />
          </_more>
        </_counter>
        <_actions>
          <_deny onClick={() => deny()}>{t('modal.no')}</_deny>
          <AnimateButton active>
            <_accept onClick={() => accept()}>
              {number > 1
                ? t('modal.mint.create.many', { number })
                : t('modal.mint.create')}
              {}
            </_accept>
          </AnimateButton>
        </_actions>
      </_window>
    </AnimateModal>
  );
};

export default ModalMint;

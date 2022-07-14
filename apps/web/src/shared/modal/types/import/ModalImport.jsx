import React, { useRef, useState } from 'react';
import { _deny, _description, _title, _input } from '../../Modal.styled';
import { _button, _window, _actions, _breakpoint } from './ModalImport.styled';
import { AnimateButton } from '../../../../views/game/animations/AnimateButton';
import { AnimateModal } from '../../../../views/game/animations/AnimateModal';
import { useClickOutside } from 'core/hooks/useClickOutside';
import { useActions } from '../../../../../actions';
import { useRemix } from 'core/hooks/remix/useRemix';
import { MODAL_ACTIVE } from 'core/remix/state';
import { useTranslation } from 'react-i18next';
import { IconWallet } from 'design/icons/wallet.icon';

const ModalImport = () => {
  const { t } = useTranslation();
  const { closeModal } = useActions();
  const [modal] = useRemix(MODAL_ACTIVE);
  const button_ref = useRef();
  const [inputValue, setInputValue] = useState('');

  useClickOutside(button_ref, () => closeModal({}));

  const active = modal?.active;

  const description = modal?.description;

  const handleImport = () => {
    if (active && modal?.import) modal?.import(inputValue);
  };
  const handleGenerate = () => {
    if (active && modal?.generate) modal?.generate();
  };

  return (
    <AnimateModal>
      <_window ref={button_ref}>
        <_title>
          <span>{t('modal.secret.key.title')}</span>
        </_title>
        <_description>{description}</_description>
        <_input>
          <textarea
            onChange={(e) => setInputValue(e.target.value)}
            maxLength="100"
            rows="2"
            placeholder={t('modal.secret.key.enter')}
          />
        </_input>
        <_actions>
          <_button $noTop onClick={() => handleImport()}>
            {t('modal.secret.key.action')}
          </_button>
        </_actions>
        <_breakpoint />
        <_actions>
          <AnimateButton high>
            <_button onClick={() => handleGenerate()}>
              <IconWallet />
              {t('modal.secret.key.generate.burner.wallet')}
            </_button>
          </AnimateButton>
        </_actions>
      </_window>
    </AnimateModal>
  );
};

export default ModalImport;

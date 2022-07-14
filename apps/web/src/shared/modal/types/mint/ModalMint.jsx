import React, { useRef, useState, useMemo } from 'react';
import {
  _accept,
  _actions,
  _deny,
  _description,
  _title,
  _window,
} from '../../Modal.styled';
import { _breakpoint } from '../../../../views/game/drawers/spellcaster/SpellcasterDrawer.styled';
import { AnimateButton } from '../../../button/animations/AnimateButton';
import { AnimateModal } from '../../animations/AnimateModal';
import { useClickOutside } from 'core/hooks/useClickOutside';
import { useActions } from '../../../../../actions';
import { useRemix } from 'core/hooks/remix/useRemix';
import { GAME_CONSTANTS, MODAL_ACTIVE, MINT_COST } from 'core/remix/state';
import { useTranslation } from 'react-i18next';
import {
  _count,
  _count_button,
  _count_counter,
  _count_button_text,
} from './ModalMint.styled';

const ModalMint = () => {
  const { t } = useTranslation();
  const { closeModal } = useActions();
  const [gameConstants] = useRemix(GAME_CONSTANTS);
  const button_ref = useRef();
  const [count, setCount] = useState(1);
  const [cost, name] = useMemo(() => {
    return [count * 1000, count > 1 ? 'Wizards' : 'Wizard'];
  }, [count]);
  const { buyCaster } = useActions();
  useClickOutside(button_ref, () => closeModal({}));

  const accept = () => {
    buyCaster();
    closeModal();
  };
  const deny = () => {
    closeModal();
  };
  const handleSetCount = (value) => {
    if (!value || isNaN(value)) return;
    //clamp between 1 and infinity
    const newCount = Math.max(1, Math.min(count + value, Infinity));
    if (newCount * MINT_COST <= gameConstants.ladaBalance) setCount(newCount);
  };
  const decrement = () => {
    handleSetCount(-1);
  };
  const increment = () => {
    handleSetCount(1);
  };
  return (
    <AnimateModal>
      <_window ref={button_ref}>
        <_title>
          <span>{t('modal.confirm')}</span>
        </_title>
        <_breakpoint />
        <_description>
          {t('modal.buy.description', { count, cost, name })}
        </_description>
        <_count>
          <_count_button onClick={decrement}>
            <_count_button_text>-</_count_button_text>
          </_count_button>
          <_count_counter>{count}</_count_counter>
          <_count_button onClick={increment}>
            <_count_button_text>+</_count_button_text>
          </_count_button>
        </_count>
        <_actions>
          <_deny onClick={() => deny()}>{t('modal.no')}</_deny>
          <AnimateButton high>
            <_accept onClick={() => accept()}>{t('modal.yes')}</_accept>
          </AnimateButton>
        </_actions>
      </_window>
    </AnimateModal>
  );
};

export default ModalMint;

import React, { useRef } from 'react';
import {
  _phase,
  _board,
  _body,
  _title,
  _description,
  _reminder,
  _actions,
  _accept,
  _deny,
} from './ModalPhase.styled';
import { AnimateBoard } from '../../animations/AnimateBoard';
import { useActions } from '../../../../../actions';
import { useClickOutside } from 'core/hooks/useClickOutside';
import { useTranslation } from 'react-i18next';
import { AnimateButton } from '../../../button/animations/AnimateButton';
import { IconArrow } from 'design/icons/arrow.icon';
import { SEEN_PHASE } from 'core/remix/state';

const ModalPhase = ({ height, options }) => {
  const { t } = useTranslation();
  const { modalClear, continueEquipActions } = useActions();
  const board_ref = useRef();
  useClickOutside(board_ref, () => modalClear());

  const deny = () => {
    modalClear();
  };

  const accept = () => {
    localStorage.setItem(SEEN_PHASE, 'true');
    continueEquipActions();
  };

  return (
    <_phase $height={height}>
      <AnimateBoard>
        <_board ref={board_ref}>
          <_body>
            <_title>{t('modal.phase.title')}</_title>
            <_description>
              <span>{t('modal.phase.description')}</span>
            </_description>
            <_reminder>{t('modal.phase.reminder')}</_reminder>
          </_body>
          <_actions>
            <_deny onClick={() => deny()}>{t('modal.phase.deny')}</_deny>
            <AnimateButton high>
              <_accept onClick={() => accept()}>
                {t('modal.phase.accept')}
              </_accept>
            </AnimateButton>
          </_actions>
        </_board>
      </AnimateBoard>
    </_phase>
  );
};

export default ModalPhase;

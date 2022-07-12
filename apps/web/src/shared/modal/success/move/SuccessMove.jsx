import React, { useRef } from 'react';
import { _move, _close, _success } from './SuccessMove.styled';
import { useActions } from '../../../../../actions';
import { useClickOutside } from 'core/hooks/useClickOutside';
import { useTranslation } from 'react-i18next';

const SuccessMove = ({ height, options }) => {
  const { t } = useTranslation();
  const { closeModal } = useActions();
  const caster = options?.caster;
  const success_ref = useRef();

  useClickOutside(success_ref, () => closeModal({}));

  return (
    <_move ref={success_ref} $height={height} onClick={() => closeModal()}>
      <_success>
        <span>{t('success.title')}</span>
      </_success>
      <_close>
        <span>{t('success.move.close')}</span>
      </_close>
    </_move>
  );
};

export default SuccessMove;

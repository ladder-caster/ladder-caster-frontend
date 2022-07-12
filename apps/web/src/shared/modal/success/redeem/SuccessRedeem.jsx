import React, { useRef } from 'react';
import { _redeem } from './SuccessRedeem.styled';
import { _close, _move, _success } from '../move/SuccessMove.styled';
import { useTranslation } from 'react-i18next';
import { useActions } from '../../../../../actions';

const SuccessRedeem = ({ height, options }) => {
  const { t } = useTranslation();
  const { closeModal } = useActions();
  const caster = options?.caster;
  const success_ref = useRef();

  return (
    <_redeem ref={success_ref} $height={height} onClick={() => closeModal()}>
      <_success>
        <span>{t('success.title')}</span>
      </_success>
      <_close>
        <span>{t('success.move.close')}</span>
      </_close>
    </_redeem>
  );
};

export default SuccessRedeem;

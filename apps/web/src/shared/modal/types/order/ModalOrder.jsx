import React, { useRef } from 'react';
import {
  _order,
  _actions,
  _board,
  _header,
  _title,
  _confirm,
  _button,
  _description,
} from './ModalOrder.styled';
import { AnimateBoard } from '../../animations/AnimateBoard';
import { useTranslation } from 'react-i18next';
import { useClickOutside } from 'core/hooks/useClickOutside';
import { useActions } from '../../../../../actions';
import { AnimateButton } from '../../animations/AnimateButton';
import { DRAWER_CONTEXT, SIDE_BUY } from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';

const ModalOrder = ({ options }) => {
  const { t } = useTranslation();
  const [context] = useRemix(DRAWER_CONTEXT);
  const { modalClear, confirmOrder } = useActions();
  const board_ref = useRef();
  const button_ref = useRef();
  const type =
    context?.side === SIDE_BUY ? t('drawer.trade.buy') : t('drawer.trade.sell');
  const coin = context?.quote;

  useClickOutside([board_ref, button_ref], () => modalClear({}));

  return (
    <_order>
      <_actions>
        <AnimateBoard>
          <_board ref={board_ref}>
            <_header>
              <_title>{t('modal.order.title', { type })}</_title>
            </_header>
            <_description></_description>
          </_board>
        </AnimateBoard>
        <_confirm>
          <AnimateButton>
            <_button onClick={() => confirmOrder(options)}>
              {t('modal.order.button', { type, coin })}
            </_button>
          </AnimateButton>
        </_confirm>
      </_actions>
    </_order>
  );
};

export default ModalOrder;

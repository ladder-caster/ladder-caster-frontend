import React from 'react';
import {
  _unequip,
  _header,
  _side,
  _back,
  _title,
  _action,
  _button,
} from './UnequipConfirm.styled';
import { useMesh } from 'core/state/mesh/useMesh';
import {
  DRAWER_CONTEXT,
  ITEM_BOOK,
  ITEM_HAT,
  ITEM_ROBE,
  ITEM_STAFF,
} from 'core/mesh/state';
import { useTranslation } from 'react-i18next';
import { IconChevronLeft } from 'design/icons/chevron-left.icon';
import { useActions } from '../../../../../actions';

const UnequipConfirm = () => {
  const { t } = useTranslation();
  const [context] = useMesh(DRAWER_CONTEXT);
  const { unequipItem } = useActions();
  const item = context?.item;
  const item_type = item?.type;
  const back = context?.back;

  const type = {
    [ITEM_HAT]: t('item.name.hat'),
    [ITEM_ROBE]: t('item.name.robe'),
    [ITEM_STAFF]: t('item.name.staff'),
    [ITEM_BOOK]: t('item.name.book'),
  }[item_type];

  return (
    <_unequip>
      <_header>
        <_side>
          <_back onClick={() => back && back()}>
            <IconChevronLeft />
          </_back>
        </_side>
        <_title>
          <span>{t('confirm.title')}</span>
        </_title>
      </_header>
      <_action>
        <_button onClick={() => unequipItem()}>
          {t('confirm.unequip.action', { type })}
        </_button>
      </_action>
    </_unequip>
  );
};

export default UnequipConfirm;

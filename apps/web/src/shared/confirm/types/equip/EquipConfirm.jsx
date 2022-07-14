import React from 'react';
import {
  _equip,
  _header,
  _side,
  _back,
  _title,
  _action,
  _button,
} from './EquipConfirm.styled';
import {
  DRAWER_CONTEXT,
  ITEM_BOOK,
  ITEM_HAT,
  ITEM_ROBE,
  ITEM_STAFF,
} from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import { IconChevronLeft } from 'design/icons/chevron-left.icon';
import { useTranslation } from 'react-i18next';
import { useActions } from '../../../../../actions';

const EquipConfirm = () => {
  const { t } = useTranslation();
  const [context] = useRemix(DRAWER_CONTEXT);
  const { equipItem } = useActions();
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
    <_equip>
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
        <_button onClick={() => equipItem()}>
          {t('confirm.equip.action', { type })}
        </_button>
      </_action>
    </_equip>
  );
};

export default EquipConfirm;

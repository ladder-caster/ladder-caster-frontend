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
import { useRemix } from 'core/hooks/remix/useRemix';
import {
  DRAWER_CONTEXT,
  ITEM_BOOK,
  ITEM_HAT,
  ITEM_ROBE,
  ITEM_STAFF,
} from 'core/remix/state';
import { useTranslation } from 'react-i18next';
import { IconChevronLeft } from 'design/icons/chevron-left.icon';
import { useActions } from '../../../../../actions';

const UnequipConfirm = () => {
  const { t } = useTranslation();
  const [context] = useRemix(DRAWER_CONTEXT);
  const { unequipItem } = useActions();
  const item = context?.item;
  const item_type = item?.type;
  const back = context?.back;

  const type = {
    [ITEM_HAT]: 'Hat',
    [ITEM_ROBE]: 'Robe',
    [ITEM_STAFF]: 'Staff',
    [ITEM_BOOK]: 'Spellbook',
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

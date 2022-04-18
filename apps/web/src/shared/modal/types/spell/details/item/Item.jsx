import React from 'react';
import { _item } from './Item.styled';
import { _text } from '../Details.styled';
import { useTranslation } from 'react-i18next';

const Item = ({ level }) => {
  const { t } = useTranslation();

  return (
    <_item>
      {t('modal.spell.details.item1')}
      <span> {t('modal.spell.details.item2')} </span>
      {t('modal.spell.details.of')}
      <span>
        {' '}
        {t('modal.spell.details.level')} {level}
      </span>
    </_item>
  );
};

export default Item;

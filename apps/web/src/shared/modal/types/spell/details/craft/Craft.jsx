import React from 'react';
import { _craft } from './Craft.styled';
import { _text } from '../Details.styled';
import { useTranslation } from 'react-i18next';

const Craft = ({ level }) => {
  const { t } = useTranslation();

  return (
    <_craft>
      {t('modal.spell.details.craft1')} {t('modal.spell.details.craft2')}{' '}
      <span>
        {' '}
        {t('modal.spell.details.level')} {level}{' '}
      </span>
      {t('modal.spell.details.lower')}{' '}
      <span>{t('modal.spell.details.craft3')}</span>{' '}
      {t('modal.spell.details.craft4')}
    </_craft>
  );
};

export default Craft;

import React from 'react';
import { _xp } from './Xp.styled';
import { useTranslation } from 'react-i18next';

const Xp = ({ value }) => {
  const { t } = useTranslation();

  return (
    <_xp>
      {t('attribute.spell.xp.desc1')} <span>{value}</span>{' '}
      {t('attribute.spell.xp.desc2')}
    </_xp>
  );
};

export default Xp;

import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ATTRIBUTE_CRIT,
  ATTRIBUTE_RES3,
  ATTRIBUTE_RES1,
  ATTRIBUTE_MAGIC,
  ATTRIBUTE_RES2,
} from 'core/remix/state';

const AttributeItem = ({ attribute }) => {
  const { t } = useTranslation();

  return (
    {
      [ATTRIBUTE_RES1]: t('attribute.name.fire'),
      [ATTRIBUTE_RES2]: t('attribute.name.water'),
      [ATTRIBUTE_RES3]: t('attribute.name.earth'),
      [ATTRIBUTE_MAGIC]: t('attribute.name.magic'),
      [ATTRIBUTE_CRIT]: t('attribute.name.crit'),
    }[attribute]?.toUpperCase() || null
  );
};

export default AttributeItem;

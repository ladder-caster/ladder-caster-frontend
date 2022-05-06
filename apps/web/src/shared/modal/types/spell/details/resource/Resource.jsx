import React from 'react';
import { _resource } from './Resource.styled';
import { IconFiree } from 'design/icons/firee.icon';
import { useTranslation } from 'react-i18next';
import {
  ATTRIBUTE_RES3,
  ATTRIBUTE_RES1,
  ATTRIBUTE_RES2,
} from 'core/remix/state';
import { IconEarth } from 'design/icons/earth.icon';
import { IconWater } from 'design/icons/water.icon';

const Resource = ({ type, value }) => {
  const { t } = useTranslation();

  const Icon = {
    [ATTRIBUTE_RES1]: IconResourcee1,
    [ATTRIBUTE_RES2]: IconResource2,
    [ATTRIBUTE_RES3]: IconResource3,
  }[type];

  const element = {
    [ATTRIBUTE_RES1]: 'resource1',
    [ATTRIBUTE_RES2]: 'resource2',
    [ATTRIBUTE_RES3]: 'resource3',
  }[type];

  return (
    <_resource $element={element}>
      {t('modal.spell.details.resource')}
      <b>
        {' '}
        {!!Icon && <Icon />}
        {value}
      </b>
    </_resource>
  );
};

export default Resource;

import React from 'react';
import { _resource } from './Resource.styled';
import { IconFiree } from 'design/icons/firee.icon';
import { useTranslation } from 'react-i18next';
import {
  ATTRIBUTE_EARTH,
  ATTRIBUTE_FIRE,
  ATTRIBUTE_WATER,
} from 'core/remix/state';
import { IconEarth } from 'design/icons/earth.icon';
import { IconWater } from 'design/icons/water.icon';

const Resource = ({ type, value }) => {
  const { t } = useTranslation();

  const Icon = {
    [ATTRIBUTE_FIRE]: IconFiree,
    [ATTRIBUTE_WATER]: IconWater,
    [ATTRIBUTE_EARTH]: IconEarth,
  }[type];

  const element = {
    [ATTRIBUTE_FIRE]: 'fire',
    [ATTRIBUTE_WATER]: 'water',
    [ATTRIBUTE_EARTH]: 'earth',
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

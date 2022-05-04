import React from 'react';
import { _resource } from './Resource.styled';
import { IconResourcee1 } from 'design/icons/resourcee1.icon';
import { useTranslation } from 'react-i18next';
import {
  ATTRIBUTE_RES3,
  ATTRIBUTE_RES1,
  ATTRIBUTE_RES2,
} from 'core/remix/state';
import { IconResource2 } from 'design/icons/resource2.icon';
import { IconResource3 } from 'design/icons/resource3.icon';

const Resource = ({ type, value }) => {
  const { t } = useTranslation();

  const Icon = {
    [ATTRIBUTE_RES1]: IconFiree,
    [ATTRIBUTE_RES2]: IconWater,
    [ATTRIBUTE_RES3]: IconEarth,
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

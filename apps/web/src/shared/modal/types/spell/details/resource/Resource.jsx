import React from 'react';
import { _resource } from './Resource.styled';
import { IconResourcee1 } from 'design/icons/resourcee1.icon';
import { useTranslation } from 'react-i18next';
import {
  ATTRIBUTE_RESOURCE3,
  ATTRIBUTE_RESOURCE1,
  ATTRIBUTE_RESOURCE2,
} from 'core/remix/state';
import { IconResource2 } from 'design/icons/resource2.icon';
import { IconResource3 } from 'design/icons/resource3.icon';

const Resource = ({ type, value }) => {
  const { t } = useTranslation();

  const Icon = {
    [ATTRIBUTE_RESOURCE1]: IconResourcee1,
    [ATTRIBUTE_RESOURCE2]: IconResource2,
    [ATTRIBUTE_RESOURCE3]: IconResource3,
  }[type];

  const element = {
    [ATTRIBUTE_RESOURCE1]: 'fire',
    [ATTRIBUTE_RESOURCE2]: 'water',
    [ATTRIBUTE_RESOURCE3]: 'earth',
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

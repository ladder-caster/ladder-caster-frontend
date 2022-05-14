import React from 'react';
import { _craft, _button } from './Craft.styled';
import { IconAnvil } from 'design/icons/anvil.icon';
import { AnimateButton } from '../../../../shared/button/animations/AnimateButton';
import { useActions } from '../../../../../actions';
import { useTranslation } from 'react-i18next';

const Craft = () => {
  const { t } = useTranslation();
  const { openDrawerCraft } = useActions();

  return (
    <_craft onClick={() => openDrawerCraft()}>
      <AnimateButton high>
        <_button>
          <IconAnvil />
          <span>{t('thumbar.craft')}</span>
        </_button>
      </AnimateButton>
    </_craft>
  );
};

export default Craft;

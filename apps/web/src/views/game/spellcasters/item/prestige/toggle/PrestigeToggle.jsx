import React from 'react';
import {
  _buy,
  _title,
  _options,
  _option,
  _button,
  _estimate,
  _or,
} from './PrestigeToggle.styled';
import { useTranslation } from 'react-i18next';
import Toggle from '../../../../../../shared/button/toggle/Toggle';
import { useMesh } from 'core/state/mesh/useMesh';
import { PRESTIGE_TOGGLE } from 'core/mesh/state';

const PrestigeToggle = () => {
  const { t } = useTranslation();
  const [toggle, setToggle] = useMesh(PRESTIGE_TOGGLE);
  const handleToggle = () => {
    setToggle(!toggle);
    localStorage.setItem('hide_prestige', !toggle);
  };
  return (
    <_buy>
      <_title>
        {t('hide.prestige')}
        <Toggle onClick={handleToggle} checked={toggle} scale={1.1} />
      </_title>
    </_buy>
  );
};

export default PrestigeToggle;

import React, { useState } from 'react';
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

const PrestigeToggle = () => {
  const { t } = useTranslation();
  const [toggle, setToggle] = useState(
    localStorage.getItem('hide_prestige') === 'true',
  );
  const handleToggle = () => {
    setToggle(!toggle);
    localStorage.setItem('hide_prestige', !toggle);
  };
  return (
    <_buy>
      <_title>{t('hide.prestige')}</_title>
      <_options>
        <_option>
          <Toggle onClick={handleToggle} checked={toggle}></Toggle>
        </_option>
      </_options>
    </_buy>
  );
};

export default PrestigeToggle;

import React, { useState, useEffect } from 'react';
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
  const [toggle, setToggle] = useState(false);
  const handleToggle = () => {
    setToggle(!toggle);
    localStorage.setItem('hide_prestige', !toggle);
  };
  useEffect(() => {
    setToggle(localStorage.getItem('hide_prestige') === 'true');
  }, [localStorage.getItem('hide_prestige')]);
  console.log('TOGGLE', toggle);
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

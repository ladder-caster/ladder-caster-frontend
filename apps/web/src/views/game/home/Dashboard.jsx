import React from 'react';
import {
  _home,
  _header,
  _title,
  _feed,
  _section,
  _description,
  _button,
  _actions,
  _item,
  _step,
  _order,
  _task,
  _divider,
  _button_override,
  _link,
} from './Dashboard.styled';
import { useTranslation } from 'react-i18next';
import { map as _map } from 'lodash';
import { _controls, _speed } from '../header/Header.styled';
import { _wallet } from '../inventory/Inventory.styled';
import Heading from '../../../shared/heading/Heading';
import { Onboarding } from './onboarding/Onboarding';

const Dashboard = () => {
  const { t } = useTranslation();

  return (
    <_home>
      <Heading title={t('title.home')} />
      <_feed>
        <Onboarding home />
      </_feed>
    </_home>
  );
};

export default Dashboard;

import React from 'react';
import {
  _settings,
  _body,
  _breakpoint,
  _header,
} from './SettingsDrawer.styled';
import {
  _close,
  _float,
  _icon,
  _title,
  _actions,
  _button,
} from '../../views/game/inventory/drawer/craft/character/Character.styled';
import { AnimateButton } from '../button/animations/AnimateButton';
import { IconClose } from 'design/icons/close.icon';
import { useMesh } from 'core/state/mesh/useMesh';
import { VIEW_SIZE } from 'core/mesh/state';
import { useTranslation } from 'react-i18next';
import { useActions } from '../../../actions';

const SettingsDrawer = () => {
  const { t } = useTranslation();
  const [view_height] = useMesh(VIEW_SIZE);

  const {
    closeDrawer,
    testGiveLADA,
    testInitCaster,
    testGiveChest,
    testGiveResources,
    testGiveHat,
    testGiveRobe,
    testGiveStaff,
    testGiveSpell,
    testRefresh,
  } = useActions();

  return (
    <_settings $height={view_height}>
      <_header>
        <_title>{t('drawer.settings.title')}</_title>
        <_float>
          <_close>
            <AnimateButton high>
              <_icon onClick={() => closeDrawer()}>
                <IconClose />
              </_icon>
            </AnimateButton>
          </_close>
        </_float>
      </_header>
      <_breakpoint />
      <_body>
        <_actions>
          <_button onClick={() => testGiveLADA()}>Test Give LADA</_button>
          <_button onClick={() => testInitCaster()}>Create Caster</_button>
          <_button onClick={() => testGiveChest()}>Test Give Chest</_button>
          <_button onClick={() => testGiveResources()}>
            Test Give Resources
          </_button>
          <_button onClick={() => testGiveHat()}>Test Give Hat</_button>
          <_button onClick={() => testGiveRobe()}>Test Give Robe</_button>
          <_button onClick={() => testGiveStaff()}>Test Give Staff</_button>
          <_button onClick={() => testGiveSpell()}>Test Give Spell</_button>
          <_button onClick={() => testRefresh()}>Refresh</_button>
        </_actions>
      </_body>
    </_settings>
  );
};

export default SettingsDrawer;

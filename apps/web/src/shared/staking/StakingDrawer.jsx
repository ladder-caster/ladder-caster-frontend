import React from 'react';
import {
  _staking,
  _close,
  _float,
  _icon,
  _title,
  _breakpoint,
} from './StakingDrawer.styled.js';
import { AnimateButton } from '../button/animations/AnimateButton';
import { IconClose } from 'design/icons/close.icon';
import { _header } from '../settings/SettingsDrawer.styled';
import { useRemix } from 'core/hooks/remix/useRemix';
import { VIEW_SIZE } from 'core/remix/state';
import { useTranslation } from 'react-i18next';
import { useActions } from '../../../actions';

const StakingDrawer = () => {
  const { t } = useTranslation();
  const [view_height] = useRemix(VIEW_SIZE);
  const { closeDrawer } = useActions();

  return (
    <_staking $height={view_height}>
      <_header>
        <_title>{t('drawer.staking.title')}</_title>
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
    </_staking>
  );
};

export default StakingDrawer;

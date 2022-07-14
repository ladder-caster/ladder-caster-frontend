import React from 'react';
import {
  _tokens,
  _close,
  _float,
  _header,
  _icon,
  _title,
} from './TokensDrawer.styled';
import { AnimateButton } from '../../../../shared/button/animations/AnimateButton';
import { IconClose } from 'design/icons/close.icon';
import { useTranslation } from 'react-i18next';
import { useActions } from '../../../../../actions';
import Pairs from './pairs/Pairs';
import { TOKENS_ACTIVE } from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import Trade from './trade/Trade';
import { _breakpoint } from '../spellcaster/SpellcasterDrawer.styled';

const TokensDrawer = () => {
  const { t } = useTranslation();
  const { closeDrawer } = useActions();
  const [tokens] = useRemix(TOKENS_ACTIVE);

  return (
    <_tokens>
      <_header>
        <_title>{t('drawer.tokens.title')}</_title>
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
      {!tokens?.pair ? <Pairs /> : <Trade />}
    </_tokens>
  );
};

export default TokensDrawer;

import React, { useState } from 'react';
import {
  _settings,
  _body,
  _disconnect,
  _section,
  _button,
  _float,
  _item_container,
  _item,
  _text,
  _blur,
  _icon,
  _warning_container,
  _warning_title,
  _warning_subtitle,
  _tab,
} from './ManageKey.styled';
import {
  _close,
  _header,
  _title,
} from '../../../../views/game/inventory/drawer/craft/character/Character.styled';
import { AnimateButton } from '../../../button/animations/AnimateButton';
import { useTranslation } from 'react-i18next';
import { IconChevronLeft } from 'design/icons/chevron-left.icon';

const ManageKey = ({ close, keyValue, type, title, hasBlur, hasWarning }) => {
  const { t } = useTranslation();
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (navigator?.clipboard) {
      navigator.clipboard
        .writeText(keyValue)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 5000);
        })
        .catch(() => {
          console.log('could not copy!');
        });
    }
  };

  return (
    <_tab>
      <_header>
        <_float>
          <_close>
            <AnimateButton high>
              <_icon onClick={() => close()}>
                <IconChevronLeft />
              </_icon>
            </AnimateButton>
          </_close>
        </_float>
        <_title>{title || t('drawer.settings.key.manage')}</_title>
      </_header>
      <_body $noBottom>
        <_section onClick={() => setShowKey(!showKey)}>
          <_item_container>
            {hasBlur && <_blur $animate={showKey} />}
            <_item>{keyValue}</_item>
          </_item_container>
          {hasBlur && <_text>{t('drawer.settings.key.tap', { type })}</_text>}
        </_section>
        <_section>
          {hasWarning && (
            <_warning_container>
              <_warning_title>
                {t('drawer.settings.key.warning.title', { type })}
              </_warning_title>
              <_warning_subtitle>
                {t('drawer.settings.key.warning.desc', { type })}
              </_warning_subtitle>
            </_warning_container>
          )}
          <_button
            onClick={() => !hasBlur && !copied && copyToClipboard()}
            $copied={copied}
          >
            {copied ? t('copied.clipboard') : t('copy.clipboard')}
          </_button>
        </_section>
      </_body>
    </_tab>
  );
};

export default ManageKey;

import React, { useRef } from 'react';
import { _button, _float, _background, _text } from './Button.styled.js';
import { useTranslation } from 'react-i18next';
import { useSize } from 'core/hooks/useSize';

const Button = ({ type, ...props }) => {
  const { t } = useTranslation();
  const button_ref = useRef();
  const { height } = useSize(button_ref);

  return (
    <_button ref={button_ref} {...props}>
      <_float>
        <_background $height={height} $type={type} />
      </_float>
      <_float>
        <_text $type={type} $height={height}>
          {t(`menu.${type}`)}
        </_text>
      </_float>
    </_button>
  );
};

export default Button;

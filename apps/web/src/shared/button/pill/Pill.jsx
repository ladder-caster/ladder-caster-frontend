import React from 'react';
import { _container, _pill, _text } from './Pill.styled';
function Pill({ onClick, $scale, text, disabled, $pulse }) {
  return (
    <_container
      onClick={onClick}
      $scale={$scale}
      $pulse={$pulse}
      $disabled={disabled}
    >
      <_pill>
        <_text>{text}</_text>
      </_pill>
    </_container>
  );
}

export default Pill;

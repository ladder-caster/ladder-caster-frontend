import React from 'react';
import { _option } from './Option.styled';
import { AnimateOption } from '../../../../../views/game/animations/AnimateOption';

const Option = ({ label, icon, callback, selected }) => {
  return (
    <AnimateOption>
      <_option onClick={callback}>
        {icon}
        <span>{label}</span>
      </_option>
    </AnimateOption>
  );
};
export default Option;

import React, { useState } from 'react';
import { _resources, _element } from './Resources.styled';
import IconResource from '../../../types/icons/IconResource';
import { IconArrow } from 'design/icons/arrow.icon';
import { TOKENS_ACTIVE } from 'core/mesh/state';
import { useMesh } from 'core/state/mesh/useMesh';
import { useActions } from '../../../../../actions';

const Resources = ({ pair }) => {
  const [tokens] = useMesh(TOKENS_ACTIVE);
  const { flipSide } = useActions();
  const flip = tokens?.flip;
  const input = pair?.split('/')?.[!flip ? 0 : 1];
  const output = pair?.split('/')?.[!flip ? 1 : 0];

  return (
    <_resources onClick={() => flipSide()}>
      <_element $element={input}>
        <IconResource type={input} />
      </_element>
      <IconArrow />
      <_element $element={output}>
        <IconResource type={output} />
      </_element>
    </_resources>
  );
};

export default Resources;

import React from 'react';
import { _resource, _icon } from './Resource.styled';
import Counter from './counter/Counter';

const Resource = ({ element }) => {
  return (
    <_resource>
      <Counter element={element} />
    </_resource>
  );
};

export default Resource;

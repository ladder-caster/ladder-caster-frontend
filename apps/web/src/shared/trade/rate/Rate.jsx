import React from 'react';
import { _rate, _base, _equals, _quote } from './Rate.styled';
import { useRemix } from 'core/hooks/remix/useRemix';
import { DRAWER_CONTEXT } from 'core/remix/state';

const Rate = () => {
  const [context] = useRemix(DRAWER_CONTEXT);
  const base = context?.base;
  const quote = context?.quote;

  return (
    <_rate>
      <_base>1 {base}</_base>
      <_equals>≈</_equals>
      <_quote>1 {quote}</_quote>
    </_rate>
  );
};

export default Rate;

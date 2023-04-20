import React, { useMemo } from 'react';
import { domMax, LazyMotion } from 'framer-motion';
import { useKeys } from 'core/hooks/useKeys';

export const LazyAnimations = ({
  children,
  listen_key,
  animate_key,
  watch = [],
  ...props
}) => {
  const key = useKeys(2, listen_key);

  const childrenWithProps =
    children &&
    useMemo(
      () =>
        React.Children.map(children, (child) =>
          React.cloneElement(child, {
            ...props,
            key: `lazy-key-${animate_key || key[0]?.key}`,
          }),
        ),
      [watch, children],
    );

  return useMemo(
    () => (
      <LazyMotion
        key={`lazy-motion-${animate_key || key[1]?.key}`}
        features={domMax}
      >
        {childrenWithProps}
      </LazyMotion>
    ),
    [...watch, childrenWithProps],
  );
};

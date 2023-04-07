import React from 'react';
import { LazyAnimations } from 'design/animations';
import { withTheme } from 'styled-components';
import { TYPE_LEGENDARY } from 'core/mesh/state';

export const AnimateRewards = withTheme(({ theme, children, ...props }) => {
  const variants = {
    initial: {
      scale: 1.15,
      x: 8,
      y: 2,
      background: theme[TYPE_LEGENDARY]?.['button'],
    },
    animate: {
      scale: 1.15,
      x: 8,
      y: 2,
      background: theme[TYPE_LEGENDARY]?.['button'],
    },
    hover: {
      scale: 1.2,
    },
    tap: {
      scale: 1.1,
      background: theme[TYPE_LEGENDARY]?.['tap'],
    },
  };

  return (
    <LazyAnimations
      initial={'initial'}
      animate={'animate'}
      whileHover={'hover'}
      whileTap={'tap'}
      variants={variants}
      {...props}
    >
      {children}
    </LazyAnimations>
  );
});

import React from 'react';
import { LazyAnimations } from 'design/animations';
import { withTheme } from 'styled-components';

export const AnimateProgress = withTheme(
  ({ theme, children, fill, ...props }) => {
    const variants = {
      initial: {
        x: `${fill}%` || `-100%`,
      },
      animate: {
        x: `${fill}%` || `-100%`,
      },
      exit: {},
      hover: {},
      tap: {},
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
  },
);

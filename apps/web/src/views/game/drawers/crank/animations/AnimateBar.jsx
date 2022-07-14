import React from 'react';
import { LazyAnimations } from 'design/animations';
import { withTheme } from 'styled-components';

export const AnimateBar = withTheme(
  ({ theme, children, position, width, $vh, ...props }) => {
    const variants = {
      initial: {
        opacity: 0,
      },
      animate: {
        opacity: 1,
        transition: {
          duration: 0.4,
        },
      },
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

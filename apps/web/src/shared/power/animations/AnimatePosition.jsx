import React from 'react';
import { LazyAnimations } from 'design/animations';
import { withTheme } from 'styled-components';

export const AnimatePosition = withTheme(
  ({ theme, children, position, ...props }) => {
    const variants = {
      initial: {
        y: 16,
      },
      animate: {
        y: -position,
        transition: {
          delay: 0.25,
          duration: 0.25,
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

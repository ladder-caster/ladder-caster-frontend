import React from 'react';
import { LazyAnimations } from 'design/animations';
import { withTheme } from 'styled-components';

export const AnimateAfter = withTheme(
  ({ theme, children, position, width, $vh, ...props }) => {
    const variants = {
      initial: {},
      animate: {
        rotate: '1turn',
        transition: {
          ease: 'linear',
          duration: 10,
          repeat: Infinity,
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

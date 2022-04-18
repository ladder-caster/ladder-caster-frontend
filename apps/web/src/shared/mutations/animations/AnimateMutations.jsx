import React from 'react';
import { LazyAnimations } from 'design/animations';
import { withTheme } from 'styled-components';

export const AnimateMutations = withTheme(
  ({ theme, children, position, width, instant, $vh, ...props }) => {
    const variants = {
      initial: {
        opacity: 0,
        transition: {
          duration: 0.4,
          type: 'easeOut',
        },
      },
      animate: {
        opacity: 1,
        transition: {
          duration: 0.4,
          type: 'easeOut',
        },
      },
      exit: {
        opacity: 0,
        transition: {
          duration: 0.4,
          delay: instant ? 0 : 0.5,
          type: 'easeOut',
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
        exit={'exit'}
        variants={variants}
        {...props}
      >
        {children}
      </LazyAnimations>
    );
  },
);

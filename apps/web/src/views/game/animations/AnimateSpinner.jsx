import React from 'react';
import { LazyAnimations } from 'design/animations';
import { withTheme } from 'styled-components';

export const AnimateSpinner = withTheme(
  ({ theme, children, position, width, instant, $vh, ...props }) => {
    const variants = {
      initial: {
        opacity: 0.5,
        rotate: 0,
        scaleX: -1,
        scale: 1,
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        },
      },
      animate: {
        opacity: 0.5,
        rotate: -360,
        scaleX: -1,
        scale: 1,
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        },
      },
      exit: {
        opacity: 0,
        rotate: -360,
        scaleX: -1,
        scale: 0,
        transition: {
          duration: 0.4,
          ease: 'linear',
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

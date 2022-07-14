import React from 'react';
import { LazyAnimations } from 'design/animations';
import { withTheme } from 'styled-components';

export const AnimateShimmer = withTheme(
  ({ theme, children, position, width, $vh, ...props }) => {
    const variants = {
      initial: {
        x: -80,
        scale: 1.5,
        rotate: 15,
        opacity: 0.6,
        transition: {
          duration: 0.2,
          type: 'easeIn',
        },
      },
      animate: {
        x: width || 500,
        opacity: 0.6,
        scale: 1.5,
        rotate: 15,
        transition: {
          duration: 2.5,
          ease: 'easeIn',
          repeat: Infinity,
        },
      },
      exit: {
        opacity: 0,
        transition: {
          delay: 0,
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

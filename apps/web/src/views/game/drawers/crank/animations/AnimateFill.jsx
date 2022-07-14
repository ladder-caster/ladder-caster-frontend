import React from 'react';
import { LazyAnimations } from 'design/animations';
import { withTheme } from 'styled-components';

export const AnimateFill = withTheme(
  ({ theme, children, position, remaining, delay, start, ...props }) => {
    const current_position = `-${position * 100}%`;

    const variants = {
      initial: {
        x: current_position,
      },
      animate: {
        x: `-100%`,
        transition: {
          duration: remaining,
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
        variants={variants}
        {...props}
      >
        {children}
      </LazyAnimations>
    );
  },
);

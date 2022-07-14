import React from 'react';
import { LazyAnimations } from 'design/animations';
import { withTheme } from 'styled-components';

export const AnimateFill = withTheme(
  ({ theme, children, height, power, position, ...props }) => {
    // const adjusted_height = height - 8;

    const variants = {
      initial: {
        y: '105%',
      },
      animate: {
        y: `${100 - power * 100}%`,
        transition: {
          delay: 0.5,
          duration: 0.8,
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

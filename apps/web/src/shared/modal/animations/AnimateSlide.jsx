import React from 'react';
import { LazyAnimations } from 'design/animations';
import { withTheme } from 'styled-components';

export const AnimateSlide = withTheme(
  ({ theme, index, prev, next, active, children, ...props }) => {
    const variants = {
      initial: {
        scale: 0.85,
        opacity: 0,
        x: 0,
      },
      animate: {
        scale: active ? 1 : 0.8,
        opacity: prev || next ? 0.5 : 1,
        x: `-${107.5 * index}%`,
        transition: {
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

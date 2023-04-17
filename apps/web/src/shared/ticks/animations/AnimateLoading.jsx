import React from 'react';
import { LazyAnimations } from 'design/animations';
import { withTheme } from 'styled-components';
import { useMesh } from 'core/state/mesh/useMesh';
import { GAME_OPTIONS } from 'core/mesh/state';

export const AnimateLoading = withTheme(
  ({ theme, children, position, ...props }) => {
    const [options] = useMesh(GAME_OPTIONS);

    const variants = {
      initial: {
        x: `0%`,
      },
      animate: {
        x: `0%`,
        transition: {
          type: 'tween',
          stiffness: 100,
          duration: options?.speed || 20,
          ease: 'linear',
        },
      },
      hover: {},
      tap: {},
      transition: {},
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

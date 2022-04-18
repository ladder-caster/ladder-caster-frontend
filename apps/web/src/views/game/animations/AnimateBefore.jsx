import React from 'react';
import { LazyAnimations } from 'design/animations';
import { withTheme } from 'styled-components';

export const AnimateBefore = withTheme(
  ({ theme, children, position, width, $vh, ...props }) => {
    const variants = {
      initial: {},
      animate: {
        rotate: ['0.5turn', '0.5turn', '0turn', '0turn'],
        background: [
          theme.background['lowest'],
          theme.background['lowest'],
          theme.rarity['meter'],
          theme.rarity['meter'],
        ],
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

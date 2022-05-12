import React from 'react';
import { LazyAnimations } from 'design/animations';
import { withTheme } from 'styled-components';

export const AnimateBar = withTheme(
  ({ theme, children, active, bid, ...props }) => {
    const variants = {
      initial: {
        background: bid
          ? theme.background['success']
          : theme.background['error'],
        border: `2px solid ${
          bid ? theme.border['success'] : theme.border['error']
        }`,
        opacity: active ? 1 : 0.5,
      },
      animate: {
        background: bid
          ? theme.background['success']
          : theme.background['error'],
        border: `2px solid ${
          bid ? theme.border['success'] : theme.border['error']
        }`,
        opacity: active ? 1 : 0.5,
      },
      hover: {
        background: bid
          ? theme.background['success']
          : theme.background['error'],
      },
      tap: {
        background: bid
          ? theme.background['success']
          : theme.background['error'],
      },
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

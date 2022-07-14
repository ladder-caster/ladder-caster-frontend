import React from 'react';
import { LazyAnimations } from 'design/animations';
import { withTheme } from 'styled-components';

export const AnimatePulse = withTheme(({ theme, children, ...props }) => {
  const variants = {
    initial: {
      background: theme.background['button_highest'],
      opacity: 0,
    },
    animate: {
      background: theme.background['button_highest'],
      opacity: 0,
    },
    hover: {
      background: theme.background['button_highest'],
      opacity: 0.3,
      transition: {
        duration: 0.1,
      },
    },
    tap: {
      background: theme.background['button_highest'],
      opacity: 0.5,
      transition: {
        duration: 0.05,
      },
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
});

import React from 'react';
import { LazyAnimations } from 'design/animations';
import { withTheme } from 'styled-components';

export const AnimatePercent = withTheme(({ theme, children, ...props }) => {
  const variants = {
    initial: {
      background: theme.background['button_high'],
    },
    animate: {
      background: theme.background['button_high'],
    },
    hover: {
      background: theme.background['button_low'],
      transition: {
        duration: 0.1,
      },
    },
    tap: {
      background: theme.background['button_active'],
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

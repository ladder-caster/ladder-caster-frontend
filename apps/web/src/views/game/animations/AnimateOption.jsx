import React from 'react';
import { LazyAnimations } from 'design/animations';
import { withTheme } from 'styled-components';

export const AnimateOption = withTheme(({ theme, children, ...props }) => {
  const variants = {
    initial: {
      background: theme.background['button_active'],
    },
    animate: {
      background: theme.background['button_active'],
    },
    hover: {
      background: theme.background['button_higher'],
      transition: {
        duration: 0.1,
      },
    },
    tap: {
      background: theme.background['button_highest'],
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

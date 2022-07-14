import React from 'react';
import { LazyAnimations } from 'design/animations';
import { withTheme } from 'styled-components';

export const AnimateSpotlight = withTheme(({ theme, children, ...props }) => {
  const variants = {
    initial: {
      rotate: 0,
      transition: {
        repeat: Infinity,
        duration: 180,
        ease: 'linear',
      },
    },
    animate: {
      rotate: 360,
      transition: {
        repeat: Infinity,
        duration: 180,
        ease: 'linear',
      },
    },
    exit: {},
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
});

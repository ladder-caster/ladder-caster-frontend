import React from 'react';
import { LazyAnimations } from 'design/animations';
import { withTheme } from 'styled-components';

export const AnimateDots = withTheme(({ theme, children, ...props }) => {
  const variants = {
    initial: {
      background: 'rgba(255,255,255,0)',
    },
    animate: {
      background: 'rgba(255,255,255,0)',
      transition: {
        type: 'ease-out',
        duration: 0.1,
      },
    },
    hover: {
      background: 'rgba(255,255,255,0.05)',
      transition: {
        type: 'ease-out',
        duration: 0.1,
      },
    },
    tap: {
      background: 'rgba(255,255,255,0.1)',
      transition: {
        type: 'ease-out',
        duration: 0.1,
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

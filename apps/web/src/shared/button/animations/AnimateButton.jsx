import React from 'react';
import { LazyAnimations } from 'design/animations';
import { withTheme } from 'styled-components';

export const AnimateButton = withTheme(
  ({
    theme,
    children,
    low,
    high,
    element,
    active,
    shake,
    disabled,
    ...props
  }) => {
    const variants = {
      initial: {
        background: element
          ? theme[element]?.['button']
          : theme.background[
              active
                ? 'button_active'
                : high
                ? 'button_high'
                : low
                ? 'button_low'
                : disabled
                ? 'button_disabled'
                : 'button'
            ],
        x: 0,
        y: 0,
        rotate: 0,
      },
      animate: {
        background: element
          ? theme[element]?.['button']
          : theme.background[
              active
                ? 'button_active'
                : high
                ? 'button_high'
                : low
                ? 'button_low'
                : disabled
                ? 'button_disabled'
                : 'button'
            ],
        transition: {
          duration: 0.25,
        },
        x: shake ? [1, -1, -3, 3, 1, -1, -3, 3, -1, 1, 1] : 0,
        y: shake ? [1, -2, 0, 2, -1, 2, 1, 1, -1, 2, -2] : 0,
        rotate: shake ? [0, -1, 1, 0, 1, -1, 0, -1, 1, 0, -1] : 0,
      },
      hover: {
        background: element
          ? theme[element]?.['button']
          : theme.background[
              active
                ? 'button_top'
                : high
                ? 'button_active'
                : low
                ? 'button_high'
                : disabled
                ? 'button_disabled'
                : 'button'
            ],
        transition: {
          duration: 0.1,
        },
      },
      tap: {
        background: element
          ? theme[element]?.['tap']
          : disabled
          ? theme.background['button_disabled']
          : active
          ? theme.background['button_active']
          : theme.tap['button_high'],
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

import React, { useEffect } from 'react';
import { animate } from 'framer-motion';

export const useAnimatedNumber = (ref, from, to) => {
  useEffect(() => {
    const number = ref?.current;

    const controls = animate(from, to, {
      duration: 1,
      onUpdate(value) {
        if (number) number.textContent = Math.floor(value?.toFixed);
      },
    });

    return () => controls.stop();
  }, [from, to]);
};

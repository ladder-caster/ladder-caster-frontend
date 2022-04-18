import { animate } from 'framer-motion';
import React, { useEffect, useRef } from 'react';
import { _amount } from '../../views/game/header/Header.styled';

const Counter = ({ from, to }) => {
  const nodeRef = useRef();

  useEffect(() => {
    let controls;
    const node = nodeRef.current;

    controls = animate(from, to, {
      //TODO: fix animation to correct speed for number change. Duration might have to change according to from-to diff
      duration: 1,
      onUpdate(value) {
        node.textContent = value.toFixed(0);
      },
    });

    return () => controls?.stop();
  }, [from, to]);

  return <_amount ref={nodeRef} />;
};

export default Counter;

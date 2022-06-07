import { motion } from 'framer-motion';
import React from 'react';
import { _container, _toggle_background, _toggle_orb } from './Toggle.styled';
function Toggle({ onClick, checked, scale }) {
  return (
    <_container onClick={onClick}>
      <_toggle_background checked={checked}>
        <_toggle_orb
          checked={checked}
          as={motion.div}
          animate={{
            right: checked ? -10 : 10,
          }}
          // whileHover={{ scale: 1.1 }}
          // whileTap={{ scale: 0.9 }}
        />
      </_toggle_background>
    </_container>
  );
}

export default Toggle;

import React from 'react';
import { _swap, _board } from './ModalSwap.styled';
import { AnimateBoard } from '../../../../views/game/animations/AnimateBoard';

const ModalSwap = ({ height, options }) => {
  return (
    <_swap>
      <AnimateBoard>
        <_board></_board>
      </AnimateBoard>
    </_swap>
  );
};

export default ModalSwap;

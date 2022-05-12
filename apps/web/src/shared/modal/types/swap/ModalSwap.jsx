import React from 'react';
import { _swap } from './ModalSwap.styled';
import { _board } from '../order/ModalOrder.styled';
import { AnimateBoard } from '../../animations/AnimateBoard';

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

import React, { useRef, useEffect } from 'react';
import {
  _modal,
  _float,
  _fade,
  _area,
  _center,
  _container,
} from './Modal.styled';
import {
  MODAL_ACTIVE,
  MODAL_CHEST,
  MODAL_MINT,
  MODAL_CRAFT,
  MODAL_LOOT,
  MODAL_MOVE,
  MODAL_SPELL,
  MODAL_REDEEM,
  MODAL_IMPORT,
  USER_PHASE,
  PHASE_EQUIP,
  PHASE_REWARDS,
  SEEN_PHASE,
} from 'core/remix/state';

import { useRemix } from 'core/hooks/remix/useRemix';
import { useTranslation } from 'react-i18next';
import { useActions } from '../../../actions';
import { AnimateFade } from './animations/AnimateFade';
import { AnimatePresence } from 'framer-motion';
import ModalImport from './types/import/ModalImport';
import ModalMint from './types/mint/ModalMint';
import ModalMove from './types/move/ModalMove';
import ModalSpell from './types/spell/ModalSpell';
import ModalLoot from './types/loot/ModalLoot';
import ModalCraft from './types/craft/ModalCraft';
import ModalChest from './types/chest/ModalChest';
import ModalRedeem from './types/redeem/ModalRedeem';

const Modal = ({ screen_height }) => {
  const { t } = useTranslation();
  const { modalClear } = useActions();
  const [phase] = useRemix(USER_PHASE);
  const [modal] = useRemix(MODAL_ACTIVE);
  const [seen, setSeen] = useRemix(SEEN_PHASE);
  const modal_ref = useRef();
  const options = modal?.options;
  const isSuccess = modal?.success;
  const active = modal?.active && !isSuccess;

  useEffect(() => {
    const seen = localStorage.getItem(SEEN_PHASE);
    if (seen) setSeen(true);
  }, []);

  const ModalSwitch = {
    [MODAL_MINT]: ModalMint,
    [MODAL_MOVE]: ModalMove,
    [MODAL_SPELL]: ModalSpell,
    [MODAL_LOOT]: ModalLoot,
    [MODAL_CRAFT]: ModalCraft,
    [MODAL_REDEEM]: ModalRedeem,
    [MODAL_CHEST]: ModalChest,
    [MODAL_IMPORT]: ModalImport,
  }[modal?.type];

  // useLayoutEffect(() => {
  //   const blob = new Blob([ref.current], {type: 'text/html'});
  //   saveAs(blob, "hello world.txt");
  //    Going to convert the view from game into an image then distort with webgl post launch
  // }, [modal]);

  return (
    <_modal>
      <AnimatePresence>
        {active && (
          <AnimateFade key={'modal-fade'}>
            <_float>
              <_fade $height={screen_height} onClick={() => modalClear()} />
            </_float>
          </AnimateFade>
        )}
        {active && (
          <_container key={'modal-container'} $height={screen_height}>
            <_center>
              <_area $height={screen_height} ref={modal_ref}>
                {!!ModalSwitch && (
                  <ModalSwitch options={options} height={screen_height} />
                )}
              </_area>
            </_center>
          </_container>
        )}
      </AnimatePresence>
    </_modal>
  );
};

export default Modal;

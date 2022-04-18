import React from 'react';
import { CONFIRM_EQUIP, CONFIRM_UNEQUIP } from 'core/remix/state';
import EquipConfirm from './types/equip/EquipConfirm';
import UnequipConfirm from './types/unequip/UnequipConfirm';

const Confirm = ({ type, ...props }) => {
  return (
    {
      [CONFIRM_EQUIP]: <EquipConfirm {...props} />,
      [CONFIRM_UNEQUIP]: <UnequipConfirm {...props} />,
    }[type] || null
  );
};

export default Confirm;

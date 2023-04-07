import React, { useRef, useMemo } from 'react';
import {
  _loot,
  _close,
  _success,
  _container,
  _chest,
  _chests,
} from './SuccessLoot.styled';
import { useTranslation } from 'react-i18next';
import { useActions } from '../../../../../actions';
import { useClickOutside } from 'core/hooks/useClickOutside';
import { useMesh } from 'core/state/mesh/useMesh';
import {
  ITEM_CHEST,
  MODAL_ACTIVE,
  TYPE_RES3,
  TYPE_RES1,
  TYPE_RES2,
} from 'core/mesh/state';
import NFT from '../../../nft/NFT';
import { IconResourcee1 } from 'design/icons/resourcee1.icon';
import { IconResource2 } from 'design/icons/resource2.icon';
import { IconResource3 } from 'design/icons/resource3.icon';
import { INVERSE_TIER_MAP } from 'core/utils/switch';
import { css } from 'styled-components';

const SuccessLoot = ({ height }) => {
  const { t } = useTranslation();
  const { closeModal } = useActions();
  const [rewards] = useMesh(MODAL_ACTIVE, (modal) => modal?.rewards);
  const success_ref = useRef();

  const type = rewards?.type;
  const chests = rewards?.chests;
  const num_chests = chests?.length;

  const resource_reward = useMemo(() => {
    const ResourceIcon = {
      [TYPE_RES1]: IconResourcee1,
      [TYPE_RES2]: IconResource2,
      [TYPE_RES3]: IconResource3,
    }[type];

    // return (
    //   // <_resources>
    //   //   {!!ResourceIcon && <ResourceIcon/>}
    //   //   <_number ref={number_ref}></_number>
    //   // </_resources>
    // )
  }, [rewards]);

  const chest_reward = useMemo(() => {
    const chests_list = [];
    if (num_chests) {
      for (let i = 0; i < num_chests; i++) {
        chests_list.push(
          <_chest>
            <NFT type={ITEM_CHEST} tier={INVERSE_TIER_MAP[chests?.[i]?.tier]} />
          </_chest>,
        );
      }
    }

    return chests_list;
  }, [rewards]);

  useClickOutside(success_ref, () => closeModal());

  return (
    <_loot ref={success_ref} $height={height} onClick={() => closeModal()}>
      <_container>{num_chests && <_chests>{chest_reward}</_chests>}</_container>
      <_close>
        <span>{t('success.move.close')}</span>
      </_close>
    </_loot>
  );
};

export default SuccessLoot;

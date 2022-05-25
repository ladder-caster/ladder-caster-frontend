import React, { useRef, useMemo } from 'react';
import {
  _caster,
  _level,
  _overview,
  _overlay,
  _img,
  _cover,
  _name,
  _upgrade,
} from './Caster.styled';
import { useSize } from 'core/hooks/useSize';
import { useActions } from '../../../actions';
import { EDITION_LIMITED, GAME_INVENTORY } from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';

const Caster = ({ caster, grid, small, callback, isOld }) => {
  const caster_ref = useRef();
  const { width } = useSize(caster_ref);
  const { craftChooseCharacter } = useActions();
  const [inventory] = useRemix(GAME_INVENTORY);
  const items = inventory?.items || [];
  const currentGear = useMemo(() => {
    return {
      hat: caster?.hat,
      robe: caster?.robe,
      staff: caster?.staff,
    };
  }, [caster]);
  const isValidUpgradePath = (item, casterItem, currentUpgradeItem) => {
    if (casterItem == null) {
      return { available: true, item };
    }
    const casterSameType = item.type == casterItem.type;
    const currentItemSameType = currentUpgradeItem
      ? item.type == currentUpgradeItem.type
      : false;
    const currentItemValue = currentUpgradeItem ? currentUpgradeItem.value : 0;
    //prioritize current element before alternative
    if (
      (casterSameType && item.value > casterItem.value) ||
      (currentItemSameType && item.value > currentItemValue)
    ) {
      return { available: true, item };
    } else if (item.value > casterItem.value) {
      return { available: true, item };
    }
    return currentUpgradeItem;
  };
  const upgradeAvailable = useMemo(() => {
    if (items.length == 0) return { canUpgrade: false, upgrades: null };
    const upgrades = {
      hat: {
        available: false,
        item: null,
      },
      robe: {
        available: false,
        item: null,
      },
      staff: {
        available: false,
        item: null,
      },
    };

    let canUpgrade = false;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      let upgrade = null;
      if (item.level > caster?.level) {
        continue;
      }
      switch (item.type) {
        case 'hat':
        case 'robe':
        case 'staff':
          upgrade = isValidUpgradePath(
            item,
            caster?.[item.type],
            currentGear[item.type],
          );
          break;
        default:
          continue;
      }
      if (upgrade.available) {
        upgrades[item.type] = upgrade;
        canUpgrade = true;
      }
    }
    return { canUpgrade, upgrades };
  }, [items]);
  console.log('UPGRADE CASTER', upgradeAvailable);

  const src = isOld
    ? require('../../../../libs/design/assets/old_wizard.png')
    : caster?.edition === EDITION_LIMITED
    ? require('../../../../libs/design/assets/wizard_limited_edition.png')
    : require('../../../../libs/design/assets/wizard.png');

  return (
    <_caster
      $hue={caster?.hue}
      $grid={grid}
      $height={width}
      ref={caster_ref}
      onClick={() => {
        if (!isOld && callback) callback();
        else if (!isOld) craftChooseCharacter(caster);
      }}
    >
      {upgradeAvailable.canUpgrade && <_upgrade $hue={caster?.hue ?? '360'} />}
      <_img $isOld={isOld} src={src} alt={'Wizard NFT'} $height={width} />
      <_overlay>
        <_overview $small={small} $hue={caster?.hue}>
          <_level $small={small} $hue={caster?.hue}>
            <span>{caster?.level}</span>
          </_level>
          <_name $small={small} $hue={caster?.hue}>
            {caster?.publicKey
              ?.substr(caster?.publicKey?.length - 4, 4)
              ?.toUpperCase()}
          </_name>
        </_overview>
        <_cover $hue={caster?.hue} />
      </_overlay>
    </_caster>
  );
};

export default Caster;

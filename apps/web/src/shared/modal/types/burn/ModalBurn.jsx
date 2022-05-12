import React, { useState, useRef } from 'react';
import {
  _container,
  _button,
  _title,
  _subtitle,
  _header,
  _checkbox_container,
  _checkbox_hidden,
  _checkbox,
  _float,
  _icon,
  _nft_container,
  _subtitle_container,
  _resource_gain,
  _container_center,
  _resource,
  _root_container,
} from './ModalBurn.styled';
import { _visual, _image } from '../../../info/Info.styled';
import { useTranslation } from 'react-i18next';
import { useActions } from '../../../../../actions';
import {
  MODAL_ACTIVE,
  RARITY_COMMON,
  RARITY_RARE,
  RARITY_EPIC,
  RARITY_LEGENDARY,
} from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import Item from '../../../item/Item';
import { useSize } from 'core/hooks/useSize';
import { IconResourcee1 } from 'design/icons/resourcee1.icon';
import { IconResource2 } from 'design/icons/resource2.icon';
import { IconResource3 } from 'design/icons/resource3.icon';
const ModalBurn = () => {
  const { t } = useTranslation();
  const { modalClear, confirmBurn } = useActions();
  const [modal] = useRemix(MODAL_ACTIVE);
  const image_ref = useRef();
  const { width } = useSize(image_ref);
  const item = modal?.item;
  const [showHideModal, setShowHideModal] = useState(false);

  const modalToggle = () => {
    // this is for future rendering and toggeling of the modal
    localStorage.setItem('hide_burn_modal', !showHideModal);
    setShowHideModal(!showHideModal);
  };
  const rarityMap = {
    [RARITY_COMMON]: 1,
    [RARITY_RARE]: 2,
    [RARITY_EPIC]: 3,
    [RARITY_LEGENDARY]: 4,
  };
  var resourceGain = item ? item.level * rarityMap[item.rarity] : 0;
  const burn = () => {
    confirmBurn(item);
    modalClear();
  };
  const cancel = () => {
    modalClear();
    localStorage.setItem('hide_burn_modal', 'false');
  };
  return (
    <_root_container $filter={'blur(4px)'}>
      <_header>
        <_title>{t('modal.item_burn.title').toUpperCase()}</_title>
        <_subtitle_container>
          <_subtitle>{t('modal.item_burn.description')}</_subtitle>
        </_subtitle_container>
      </_header>
      <_container>
        <_nft_container>
          <_visual>
            <_image ref={image_ref} $height={width}>
              <Item item={item} />
            </_image>
          </_visual>
        </_nft_container>
        <_float>
          <_checkbox_container onClick={modalToggle}>
            <_checkbox_hidden checked={showHideModal} />
            <_checkbox $checked={showHideModal}>
              <_icon viewBox="0 0 24 24" $checked={showHideModal}>
                <polyline points="20 6 9 17 4 12" />
              </_icon>
            </_checkbox>
          </_checkbox_container>

          <_subtitle $fontStyle={'italic'} $size={'12px'}>
            {t('modal.item_burn.go_away')}
          </_subtitle>
        </_float>
        <_container_center $gap="8px" $marginTop={'8px'}>
          <_subtitle $size={'20px'} $fontWeight={'bold'}>
            {t('modal.item_burn.reward')}
          </_subtitle>
          <_resource_gain>
            <_resource>
              <IconResourcee1 /> <span>{resourceGain}</span>
            </_resource>
            <_resource>
              <IconResource2 /> <span>{resourceGain}</span>
            </_resource>
            <_resource>
              <IconResource3 /> <span>{resourceGain}</span>
            </_resource>
          </_resource_gain>
          <_float $gap={'96px'}>
            <_button onClick={cancel}>{t('modal.item_burn.cancel')}</_button>
            <_button $burn onClick={burn}>
              {t('modal.item_burn.confirm')}
            </_button>
          </_float>
        </_container_center>
      </_container>
    </_root_container>
  );
};

export default ModalBurn;

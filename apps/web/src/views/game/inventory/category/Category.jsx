import React, { useRef, useMemo } from 'react';
import {
  _category,
  _title,
  _items,
  _item,
  _cutout,
  _amount,
  _container,
  _icon,
} from './Category.styled';
import {
  ATTRIBUTE_CRIT,
  ATTRIBUTE_MAGIC,
  DRAWER_ACTIVE,
  GAME_INVENTORY,
  ITEM_BOOK,
  ITEM_GEM,
  ITEM_HAT,
  ITEM_ROBE,
  ITEM_STAFF,
} from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import { useTranslation } from 'react-i18next';
import { filter, sortBy, reverse } from 'lodash';
import { EQUIP_MAP, ICON_EQUIP_MAP } from 'core/utils/switch';
import Item from '../../../../shared/item/Item';
import { useActions } from '../../../../../actions';
import { IconChevronLeft } from 'design/icons/chevron-left.icon';
import { IconChevronRight } from 'design/icons/chevron-right.icon';
const Category = ({ type }) => {
  const { t } = useTranslation();
  const { openDrawerInventory } = useActions();
  const [, setDrawer] = useRemix(DRAWER_ACTIVE);
  const [inventory] = useRemix(GAME_INVENTORY);
  const items_ref = useRef();
  var scrollInterval = null;
  const title = {
    [ITEM_HAT]: t('inventory.title.hat'),
    [ITEM_ROBE]: t('inventory.title.robe'),
    [ITEM_STAFF]: t('inventory.title.staff'),
    [ITEM_GEM]: t('inventory.title.gem'),
    [ITEM_BOOK]: t('inventory.title.book'),
  }[type];

  const Icon = ICON_EQUIP_MAP[type];

  const item_type = EQUIP_MAP[type];

  const amount = filter(inventory?.items, (match) => match?.type === item_type)
    ?.length;

  const resource_items_list = reverse(
    sortBy(
      filter(
        inventory?.items,
        (item) =>
          item.type === item_type &&
          item.attribute !== ATTRIBUTE_CRIT &&
          item.attribute !== ATTRIBUTE_MAGIC,
      ),
      (sort) => sort?.value,
    ),
  );

  const chance_items_list = reverse(
    sortBy(
      filter(
        inventory?.items,
        (item) =>
          item.type === item_type &&
          (item.attribute === ATTRIBUTE_CRIT ||
            item.attribute === ATTRIBUTE_MAGIC),
      ),
      (sort) => sort?.value,
    ),
  );

  const items_list = [...resource_items_list, ...chance_items_list];

  const min_items = items_list?.length > 7 ? items_list.length : 7;

  const items = useMemo(() => {
    let list = [];

    for (let i = 0; i < min_items; i++) {
      const item = items_list[i];

      list.push(
        <_item key={`${i}-category`}>
          <_cutout>
            {item && (
              <Item
                small
                item={item}
                callback={() => openDrawerInventory(item)}
              />
            )}
          </_cutout>
        </_item>,
      );
    }
    return list;
  }, [min_items, inventory]);
  const chevronScroll = (left) => {
    if (!items_ref || !items_ref.current) {
      if (scrollInterval) {
        clearInterval(scrollInterval);
      }
      return;
    }
    scrollInterval = setInterval(() => {
      items_ref.current.scrollLeft += left ? -40 : 40;
    }, 40);
  };
  const stopScroll = () => {
    clearInterval(scrollInterval);
  };
  const scrollLeft = () => {
    chevronScroll(true);
  };
  const scrollRight = () => {
    chevronScroll(false);
  };
  return (
    <_category>
      <_title>
        <Icon />
        {title}
        {amount ? <_amount>{amount}</_amount> : null}
      </_title>
      <_container>
        <_icon onMouseDown={scrollLeft} onMouseUp={stopScroll}>
          <IconChevronLeft />
        </_icon>
        <_items ref={items_ref}>{items}</_items>
        <_icon onMouseDown={scrollRight} onMouseUp={stopScroll}>
          <IconChevronRight />
        </_icon>
      </_container>
    </_category>
  );
};

export default Category;

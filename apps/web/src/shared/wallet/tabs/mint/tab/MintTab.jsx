import React, { useMemo } from 'react';
import { _grid, _row, _tab, _empty } from './MintTab.styled';
import { useRemix } from 'core/hooks/remix/useRemix';
import {
  DRAWER_CONTEXT,
  GAME_INVENTORY,
  GAME_SPELLCASTERS,
  VIEW_SIZE,
} from 'core/remix/state';
import { gridList } from 'core/utils/lists';
import { map } from 'lodash';
import Item from '../../../../../shared/item/Item';
import MintConfirm from '../confirm/MintConfirm';
import Caster from '../../../../../shared/caster/Caster';
import { useTranslation } from 'react-i18next';
import { useActions } from '../../../../../../actions';

const MintTab = () => {
  const { t } = useTranslation();
  const [context] = useRemix(DRAWER_CONTEXT);
  const [inventory] = useRemix(GAME_INVENTORY);
  const [view_height] = useRemix(VIEW_SIZE);
  const items = inventory?.items.concat(inventory?.chests);
  const [spellcasters] = useRemix(GAME_SPELLCASTERS);
  const { chooseMintItem, chooseMintCaster } = useActions();

  const list_items = useMemo(() => {
    if (items?.length || spellcasters?.length) {
      const item_list = gridList(items.concat(spellcasters));

      const itemDisplay = map(item_list, (row, keyRow) => {
        return (
          <_row key={`${keyRow}-row-mint`}>
            {map(row, (item, key) => {
              if (item.type) {
                return (
                  <Item
                    key={`${keyRow}-${key}-mint`}
                    callback={() => {
                      chooseMintItem(item);
                    }}
                    item={item}
                    grid
                  />
                );
              } else {
                return (
                  <Caster
                    key={`${keyRow}-${key}-mint`}
                    callback={() => {
                      chooseMintCaster(item);
                    }}
                    caster={item}
                    grid
                  />
                );
              }
            })}
          </_row>
        );
      });

      return itemDisplay;
    } else {
      return <_empty>{t('modal.mint.empty')}</_empty>;
    }
  }, [items, spellcasters]);

  return (
    <_tab $height={view_height}>
      {context?.item || context?.caster ? (
        <MintConfirm />
      ) : (
        <_grid>{list_items}</_grid>
      )}
    </_tab>
  );
};

export default MintTab;

import React, { useMemo } from 'react';
import {
  _character,
  _header,
  _title,
  _float,
  _close,
  _grid,
  _row,
  _icon,
  _breakpoint,
  _empty,
} from './Character.styled';
import { useTranslation } from 'react-i18next';
import { IconClose } from 'design/icons/close.icon';
import { useRemix } from 'core/hooks/remix/useRemix';
import {
  DRAWER_ACTIVE,
  GAME_MAP,
  GAME_SPELLCASTERS,
  VIEW_SIZE,
} from 'core/remix/state';
import { map, sortBy } from 'lodash';
import Caster from '../../../../../shared/caster/Caster';
import { AnimateButton } from '../../../../../shared/button/animations/AnimateButton';
import { gridList } from 'core/utils/lists';
import { useActions } from '../../../../../../actions';

const Character = () => {
  const { t } = useTranslation();
  const [view_height] = useRemix(VIEW_SIZE);
  const [spellcasters] = useRemix(GAME_SPELLCASTERS);
  const [board] = useRemix(GAME_MAP);
  const { closeDrawer } = useActions();

  const list_spellcasters = useMemo(() => {
    if (spellcasters?.length && board) {
      const filterSpellcasters = spellcasters.filter((caster) => {
        const col = caster?.position?.slice(0, 1);
        const row = +caster?.position?.slice(1, caster?.position?.length);
        return (
          board[row - 1][col].type === 'crafting' ||
          board[row - 1][col].type === 'legendary'
        );
      });
      const list = gridList(sortBy(filterSpellcasters, (sort) => sort?.hue));

      return map(list, (row) => {
        return (
          <_row>
            {map(row, (caster) => (
              <Caster caster={caster} grid />
            ))}
          </_row>
        );
      });
    }
  }, [spellcasters]);

  return (
    <_character $height={view_height}>
      <_header>
        <_title>{t('drawer.inventory.character.title')}</_title>
        <_float>
          <_close>
            <AnimateButton high>
              <_icon onClick={() => closeDrawer()}>
                <IconClose />
              </_icon>
            </AnimateButton>
          </_close>
        </_float>
      </_header>
      <_breakpoint />
      {list_spellcasters?.length ? (
        <_grid>{list_spellcasters}</_grid>
      ) : (
        <_empty>{t('drawer.inventory.character.empty')}</_empty>
      )}
    </_character>
  );
};

export default Character;

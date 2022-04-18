import React, { useRef, useMemo, useEffect } from 'react';
import {
  _spell,
  _actions,
  _board,
  _confirm,
  _header,
  _title,
  _list,
  _button,
  _limit,
  _description,
} from './ModalSpell.styled';
import { useTranslation } from 'react-i18next';
import { useActions } from '../../../../../actions';
import { useClickOutside } from 'core/hooks/useClickOutside';
import { AnimateBoard } from '../../animations/AnimateBoard';
import Item from './item/Item';
import Slide from '../../../slide/Slide';
import Details from './details/Details';
import { useRemix } from 'core/hooks/remix/useRemix';
import { GAME_INVENTORY, GAME_SPELL, ITEM_BOOK } from 'core/remix/state';
import { filter, map } from 'lodash';
import { AnimateLimit } from '../../animations/AnimateLimit';
import { AnimateButton } from '../../../../views/game/nav/animations/AnimateButton';
import { EQUIP_MAP } from 'core/utils/switch';

const ModalSpell = ({ height, options }) => {
  const { t } = useTranslation();
  const [spell] = useRemix(GAME_SPELL);
  const { modalClear, castSpell } = useActions();
  const [inventory, setInventory] = useRemix(GAME_INVENTORY);
  const board_ref = useRef();
  const button_ref = useRef();
  const caster = options?.caster;

  useClickOutside([board_ref, button_ref], () => modalClear({}));

  const spells = useMemo(
    () =>
      filter(inventory?.items, (item) => item.type === EQUIP_MAP[ITEM_BOOK]),
    [inventory?.items],
  );
  const hasSpell = spells.length > 0;

  const items = useMemo(() => {
    if (spells?.length)
      return map(spells, () => ({
        Item,
        Details,
      }));
  }, [spells]);

  const slides = useMemo(() => <Slide list={spells} items={items} />, [
    spells,
    items,
  ]);

  return (
    <_spell $height={height}>
      <_actions>
        <AnimateBoard>
          <_board ref={board_ref}>
            <_header>
              <_title>
                {hasSpell ? t('modal.spell.title') : t('modal.spell.buy')}
              </_title>
            </_header>
            {hasSpell && <_list>{slides}</_list>}
            {!hasSpell && <_description></_description>}
          </_board>
        </AnimateBoard>
        <_confirm>
          <AnimateButton key={'button-modal-spell'}>
            <_button
              $hidden={!hasSpell}
              key={'button-modal-speller'}
              onClick={() => castSpell(spell, options.caster)}
              ref={button_ref}
            >
              {t('modal.spell.action')}
            </_button>
          </AnimateButton>
          <AnimateLimit $hidden={!confirm}>
            <_limit>
              <span>{t('modal.limit')}</span>
            </_limit>
          </AnimateLimit>
        </_confirm>
      </_actions>
    </_spell>
  );
};

export default ModalSpell;

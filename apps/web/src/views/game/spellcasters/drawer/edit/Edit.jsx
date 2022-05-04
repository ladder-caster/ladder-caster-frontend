import React, { useMemo } from 'react';
import {
  _edit,
  _title,
  _choose,
  _resources,
  _order,
  _save,
  _element,
} from './Edit.styled';
import { useTranslation } from 'react-i18next';
import { GAME_SPELLCASTERS } from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import { find } from 'lodash';
import { IconResourcee1 } from 'design/icons/resourcee1.icon';
import { IconResource2 } from 'design/icons/resource2.icon';
import { IconResource3 } from 'design/icons/resource3.icon';

const Edit = ({ spell_id }) => {
  const { t } = useTranslation();
  const [spellcasters] = useRemix(GAME_SPELLCASTERS);
  const spellcaster = useMemo(
    () => find(spellcasters, (caster) => caster.id === spell_id),
    [spellcasters],
  );
  const mining = spellcaster?.mining;
  const order = [];

  const icons = {
    fire: <IconResourcee1 />,
    earth: <IconResource3 />,
    water: <IconResource2 />,
  };

  const elements = useMemo(() => {
    if (mining) {
      return mining.map((element) => <_element>{icons[element]}</_element>);
    }
  }, [mining, order]);

  return (
    <_edit>
      <_title>{t('edit.title')}</_title>
      <_choose>
        <_resources>{elements}</_resources>
        <_order></_order>
        <_save></_save>
      </_choose>
    </_edit>
  );
};

export default Edit;

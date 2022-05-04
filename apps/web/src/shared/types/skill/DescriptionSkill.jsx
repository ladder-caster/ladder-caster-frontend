import React from 'react';
import {
  ATTRIBUTE_CRAFT,
  ATTRIBUTE_CRIT,
  ATTRIBUTE_RES3,
  ATTRIBUTE_RES1,
  ATTRIBUTE_ITEM,
  ATTRIBUTE_MAGIC,
  ATTRIBUTE_RES2,
  ATTRIBUTE_XP,
} from 'core/remix/state';
import { _value } from '../../../views/game/inventory/drawer/attributes/Attributes.styled';
import { useTranslation } from 'react-i18next';

const DescriptionSkill = ({ level, attribute, value, spell }) => {
  const { t } = useTranslation();

  const Description = {
    [ATTRIBUTE_RES1]: (
      <_value $attribute={attribute}>
        {`${t(`attribute${spell ? '.spell' : ''}.fire.desc1`)}`}
        <b>+{value}</b>
        {`${t('attribute.fire.desc2')}`}
      </_value>
    ),
    [ATTRIBUTE_RES2]: (
      <_value $attribute={attribute}>
        {`${t(`attribute${spell ? '.spell' : ''}.water.desc1`)}`}
        <b>+{value}</b>
        {`${t('attribute.water.desc2')}`}
      </_value>
    ),
    [ATTRIBUTE_RES3]: (
      <_value $attribute={attribute}>
        {`${t(`attribute${spell ? '.spell' : ''}.earth.desc1`)}`}
        <b>+{value}</b>
        {`${t('attribute.earth.desc2')}`}
      </_value>
    ),
    [ATTRIBUTE_CRIT]: (
      <_value $attribute={attribute}>
        {`${t('attribute.crit.desc1')}`}
        <b>{value}</b>
        {`${t('attribute.crit.desc2')}`}
      </_value>
    ),
    [ATTRIBUTE_MAGIC]: (
      <_value $attribute={attribute}>
        {`${t('attribute.magic.desc1')}`}
        <b>{value}</b>
        {`${t('attribute.magic.desc2')}`}
      </_value>
    ),
    [ATTRIBUTE_XP]: (
      <_value $attribute={attribute}>
        {`${t('attribute.spell.xp.desc1')}`}
        <b>{value}</b>
        {`${t('attribute.spell.xp.desc2')}`}
      </_value>
    ),
    [ATTRIBUTE_ITEM]: (
      <_value $attribute={attribute}>
        {`${t('attribute.spell.item.desc1')}`}
        <b>{level}</b>
        {`${t('attribute.spell.item.desc2')}`}
      </_value>
    ),
    [ATTRIBUTE_CRAFT]: (
      <_value $attribute={attribute}>
        {`${t('attribute.spell.craft.desc1')}`}
        <b>
          {t('modal.spell.details.level')} {level}
        </b>
        {`${t('attribute.spell.craft.desc2')}`}
        <b>{t('attribute.spell.craft.desc3')}</b>
        {`${t('attribute.spell.craft.desc4')}`}
      </_value>
    ),
  }[attribute];

  return (!!Description && Description) || null;
};

export default DescriptionSkill;

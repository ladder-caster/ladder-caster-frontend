import React from 'react';
import { _menu, _hero, _row, _half, _third } from './Menu.styled.js';
import { useTranslation } from 'react-i18next';
import Button from './button/Button';
import { useActions } from '../../../../../actions';

const Menu = () => {
  const { t } = useTranslation();
  const { openDrawerStaking } = useActions();

  return (
    <_menu>
      <_hero>
        <Button type={'earn'} onClick={() => openDrawerStaking()} />
      </_hero>
      {/*<_row>*/}
      {/*  <_third>*/}
      {/*    <Button type={'rules'}/>*/}
      {/*  </_third>*/}
      {/*  <_third>*/}
      {/*    <Button type={'roadmap'}/>*/}
      {/*  </_third>*/}
      {/*  <_third>*/}
      {/*    <Button type={'developers'}/>*/}
      {/*  </_third>*/}
      {/*</_row>*/}
      {/*<_row>*/}
      {/*  <_half>*/}
      {/*    <Button type={'friend'}/>*/}
      {/*  </_half>*/}
      {/*  <_half>*/}
      {/*    <Button type={'minigames'}/>*/}
      {/*  </_half>*/}
      {/*</_row>*/}
      {/*<_row>*/}
      {/*  <_half>*/}
      {/*    <Button type={'lada'}/>*/}
      {/*  </_half>*/}
      {/*  <_half>*/}
      {/*    <Button type={'twin'}/>*/}
      {/*  </_half>*/}
      {/*</_row>*/}
      {/*<_row>*/}
      {/*  <_half>*/}
      {/*    <Button type={'marketplace'}/>*/}
      {/*  </_half>*/}
      {/*  <_half>*/}
      {/*    <Button type={'resources'}/>*/}
      {/*  </_half>*/}
      {/*</_row>*/}
      {/*<_row>*/}
      {/*  <_half>*/}
      {/*    <Button type={'roadmap'}/>*/}
      {/*  </_half>*/}
      {/*  <_half>*/}
      {/*    <Button type={'developers'}/>*/}
      {/*  </_half>*/}
      {/*</_row>*/}
      {/*<_row>*/}
      {/*  <_half>*/}
      {/*    <Button type={'rules'}/>*/}
      {/*  </_half>*/}
      {/*  <_half>*/}
      {/*    <Button type={'staking'}/>*/}
      {/*  </_half>*/}
      {/*</_row>*/}
    </_menu>
  );
};

export default Menu;

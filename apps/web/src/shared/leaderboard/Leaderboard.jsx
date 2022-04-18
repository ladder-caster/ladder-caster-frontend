import React from 'react';
import { _leaderboard, _coming } from './Leaderboard.styled';
import { useTranslation } from 'react-i18next';

const Leaderboard = () => {
  const { t } = useTranslation();

  return (
    <_leaderboard>
      <_coming>{t('coming.soon')}</_coming>
    </_leaderboard>
  );
};

export default Leaderboard;

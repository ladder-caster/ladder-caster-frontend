import { ITEM_BOOK, ITEM_HAT, ITEM_ROBE, ITEM_STAFF } from 'core/mesh/state';
import { useTranslation } from 'react-i18next';

const LevelItem = ({ type }) => {
  const { t } = useTranslation();

  return (
    {
      [ITEM_HAT]: t('item.name.hat'),
      [ITEM_ROBE]: t('item.name.robe'),
      [ITEM_STAFF]: t('item.name.staff'),
      [ITEM_BOOK]: t('item.name.book'),
    }[type]?.toUpperCase() || null
  );
};

export default LevelItem;

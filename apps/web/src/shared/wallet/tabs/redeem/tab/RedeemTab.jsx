import React, { useMemo } from 'react';
import { _tab, _grid, _row, _empty } from './RedeemTab.styled';
import { gridList } from 'core/utils/lists';
import NFT from '../../../nft/NFT';
import { map } from 'lodash';
import { useKeys } from 'core/hooks/useKeys';
import { DRAWER_ACTIVE, DRAWER_CONTEXT } from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import RedeemConfirm from '../confirm/RedeemConfirm';
import { CHAIN_NFTS } from 'chain/hooks/state';
import { useTranslation } from 'react-i18next';

const RedeemTab = () => {
  const { t } = useTranslation();
  const [k0, k1, k2, k3] = useKeys(4);
  const [context] = useRemix(DRAWER_CONTEXT);
  const [nfts] = useRemix(CHAIN_NFTS);

  const list_nfts = useMemo(() => {
    if (nfts?.length) {
      const list = gridList(nfts);

      return map(list, (row) => {
        return (
          <_row {...k0}>
            {map(row, (nft) => (
              <NFT {...k1} nft={nft} />
            ))}
          </_row>
        );
      });
    } else {
      return <_empty>{t('modal.redeem.empty')}</_empty>;
    }
  }, [nfts]);

  return (
    <_tab {...k2}>
      {context?.nft ? <RedeemConfirm /> : <_grid {...k3}>{list_nfts}</_grid>}
    </_tab>
  );
};

export default RedeemTab;

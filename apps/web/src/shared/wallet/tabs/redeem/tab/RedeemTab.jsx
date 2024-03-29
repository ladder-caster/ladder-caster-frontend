import React, { useMemo, useEffect } from 'react';
import { _tab, _grid, _row, _empty } from './RedeemTab.styled';
import { gridList } from 'core/utils/lists';
import NFT from '../../../nft/NFT';
import { map } from 'lodash';
import { useKeys } from 'core/hooks/useKeys';
import { DRAWER_CONTEXT } from 'core/mesh/state';
import { useMesh } from 'core/state/mesh/useMesh';
import RedeemConfirm from '../confirm/RedeemConfirm';
import { CHAIN_LOCAL_CLIENT, CHAIN_NFTS } from 'chain/hooks/state';
import { useTranslation } from 'react-i18next';
import nftUtil from 'sdk/src/utils/NFTUtil';

const RedeemTab = () => {
  const { t } = useTranslation();
  const [k0, k1, k2, k3] = useKeys(4);
  const [context] = useMesh(DRAWER_CONTEXT);
  const [client] = useMesh(CHAIN_LOCAL_CLIENT);
  const [nfts, setNfts] = useMesh(CHAIN_NFTS);

  useEffect(() => {
    const getAllNFTs = async () => {
      try {
        return await nftUtil.getNFTS();
      } catch (e) {
        // catch error
      }
    };
    if (!nfts?.length)
      getAllNFTs().then((success) => {
        if (!nfts?.length) setNfts(success);
      });
  }, [context, client]);

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

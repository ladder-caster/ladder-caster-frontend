import React, { useMemo, useEffect } from 'react';
import { _tab, _grid, _row, _empty } from './RedeemTab.styled';
import { gridList } from 'core/utils/lists';
import NFT from '../../../nft/NFT';
import { map, filter } from 'lodash';
import { useKeys } from 'core/hooks/useKeys';
import { DRAWER_CONTEXT } from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import RedeemConfirm from '../confirm/RedeemConfirm';
import { CHAIN_LOCAL_CLIENT, CHAIN_NFTS } from 'chain/hooks/state';
import { useTranslation } from 'react-i18next';
import { PlayerContext } from 'sdk/src';

const RedeemTab = () => {
  const { t } = useTranslation();
  const [k0, k1, k2, k3] = useKeys(4);
  const [context] = useRemix(DRAWER_CONTEXT);
  const [client] = useRemix(CHAIN_LOCAL_CLIENT);
  const [nfts, setNfts] = useRemix(CHAIN_NFTS);

  useEffect(() => {
    const getAllNFTs = async () => {
      try {
        const playerContext = new PlayerContext();
        console.log('PLAYER CONTEXT', playerContext);
        return await playerContext.getNFTUris(await playerContext.getNFTS());
      } catch {
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
      // const filter_nfts = filter(
      //   nfts,
      //   (nft) => nft?.data?.collection?.name === 'LadderCaster',
      // );
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

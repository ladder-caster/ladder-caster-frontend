import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import {
  CHAIN_CASTERS,
  CHAIN_LOCAL_CLIENT,
  CHAIN_PLAYER,
  INIT_CHAIN_LOAD,
} from 'chain/hooks/state';
import {
  _google,
  _section,
  _description,
  _button,
  _actions,
  _item,
  _step,
  _order,
  _task,
  _link,
  _linkActual,
  _icon,
  _card,
  _circle,
  _beta,
  _text,
  _warning,
} from '../Dashboard.styled';
import { useRemix } from 'core/hooks/remix/useRemix';
import { GAME_INIT, GAME_RESOURCES, USER_PHASE } from 'core/remix/state';
import React, { useState, useEffect, useMemo } from 'react';
import { useActions } from '../../../../../actions';
import { useTranslation } from 'react-i18next';
import { IconWallet } from 'design/icons/wallet.icon';
import { IconHat } from 'design/icons/hat.icon';
import Spotlight from '../../../../shared/spotlight/Spotlight';
import { IconMoney } from 'design/icons/money.icon';
import { IconLightning } from 'design/icons/lightning.icon';
import Skeleton from './skeleton/Skeleton';
import { IconGoogle } from '../../../../../../libs/design/icons/google.icon';

export const Onboarding = ({ home }) => {
  const { t } = useTranslation();
  const [noFunds, setNoFunds] = useState(false);
  const [player] = useRemix(CHAIN_PLAYER);
  const [casters] = useRemix(CHAIN_CASTERS);
  const [resources] = useRemix(GAME_RESOURCES);
  const [, setInitalized, isSetInitReady] = useRemix(GAME_INIT);
  const [client] = useRemix(CHAIN_LOCAL_CLIENT);
  const [initLoading] = useRemix(INIT_CHAIN_LOAD);
  const [phase] = useRemix(USER_PHASE);
  const { openDrawerRedeem } = useActions();
  const { setVisible } = useWalletModal();
  const {
    visitCasters,
    modalBuyLADA,
    web3AuthConnect,
    openDrawerTrade,
  } = useActions();
  const getFunds = async () => {
    setNoFunds((await client.getSOLBalance()) === 0);
  };

  const connectWallet = () => {
    setVisible(true);
  };

  useEffect(() => {
    if (client) {
      getFunds();
    }
  }, [client]);

  const { active, account, hasPlayer, initialized } = useMemo(() => {
    if (client !== undefined) {
      const account = player;
      return {
        active: client,
        account,
        initialized: account && client,
        hasPlayer: player,
      };
    }

    return {
      active: false,
      account: false,
      initialized: false,
      hasPlayer: false,
    };
  }, [client, player]);

  useEffect(() => {
    if (isSetInitReady) setInitalized(initialized);
  }, [initialized, isSetInitReady]);

  if ((initLoading && active) || (!phase && casters?.length))
    return <Skeleton />;

  return (
    <>
      {!active && (
        <_section>
          <_description>{t('home.description')}</_description>
          <_actions $long>
            <_button $big $long onClick={() => connectWallet()}>
              <IconWallet />
              <span>{t('connect.wallet')}</span>
            </_button>
            <_beta>
              <_text>
                <span>BETA</span>
              </_text>
              <_google
                $big
                $long
                onClick={() => {
                  web3AuthConnect('google');
                }}
              >
                <_circle>
                  <IconGoogle />
                </_circle>
                <span>{t('connect.web3Auth')}</span>
              </_google>
              <_warning>{t('onboarding.google.warning')}</_warning>
            </_beta>
          </_actions>
        </_section>
      )}
      {active && !account && (
        <>
          {noFunds ? (
            <_step>
              <_order>0</_order>
              <_item>
                <_task>{t('home.task.add.funds')}</_task>
              </_item>
            </_step>
          ) : null}
          <_step>
            <_order>1</_order>
            <_item>
              <_task $disabled={hasPlayer}>{t('home.task.init.player')}</_task>
              <_actions>
                <_linkActual
                  $big
                  disabled={hasPlayer}
                  $disabled={hasPlayer}
                  href="https://laddercaster.com/r/laddercaster"
                  target="_blank"
                >
                  {t('home.refer')}
                </_linkActual>
              </_actions>
            </_item>
          </_step>
        </>
      )}
      {(initialized && casters?.length === 0) || (initialized && home) ? (
        <>
          <_step>
            <_card $active={!(resources?.lada !== 0 || casters?.length !== 0)}>
              <Spotlight>
                <_icon
                  $active={!(resources?.lada !== 0 || casters?.length !== 0)}
                  $step={1}
                >
                  <IconMoney />
                </_icon>
              </Spotlight>
            </_card>
            <_item>
              <_task $disabled={resources?.lada !== 0 || casters?.length !== 0}>
                1. {t('home.task.redeem')}
                <span>{t('home.task.lada')}</span>
              </_task>
              <_actions>
                <_button
                  disabled={resources?.lada >= 1000 || casters?.length !== 0}
                  $disabled={resources?.lada >= 1000 || casters?.length !== 0}
                  style={{ marginRight: 8 }}
                  onClick={() => openDrawerRedeem()}
                  $noIcon
                >
                  <span>{t('visit.redeem')}</span>
                </_button>
                <span>or</span>
                <_link
                  onClick={() => openDrawerTrade()}
                  disabled={resources?.lada !== 0 || casters?.length !== 0}
                  $disabled={resources?.lada !== 0 || casters?.length !== 0}
                  style={{ marginLeft: 8 }}
                  $noIcon
                >
                  <span>{t('visit.buy.lada')}</span>
                </_link>
              </_actions>
            </_item>
          </_step>
          <_step>
            <_card $active={!(resources.lada === 0 || casters?.length !== 0)}>
              <Spotlight>
                <_icon
                  $active={!(resources.lada === 0 || casters?.length !== 0)}
                  $step={2}
                >
                  <IconHat />
                </_icon>
              </Spotlight>
            </_card>
            <_item>
              <_task $disabled={resources.lada === 0 || casters?.length !== 0}>
                2. {t('home.task.spellcasters')}
              </_task>
              <_actions>
                <_button
                  style={{ marginRight: 8 }}
                  disabled={resources.lada === 0 || casters?.length !== 0}
                  $disabled={resources.lada === 0 || casters?.length !== 0}
                  onClick={() => {
                    if (!(resources.lada === 0 || casters?.length !== 0))
                      modalBuyLADA();
                  }}
                  $noIcon
                >
                  <span>{t('spellcasters.mint')}</span>
                </_button>
              </_actions>
            </_item>
          </_step>
          <_step>
            <_card $active={!(casters?.length === 0)}>
              <Spotlight>
                <_icon $active={!(casters?.length === 0)} $step={3}>
                  <IconLightning />
                </_icon>
              </Spotlight>
            </_card>
            <_item>
              <_task $disabled={casters?.length === 0}>
                3. {t('home.task.start')}
              </_task>
              <_actions>
                <_button
                  style={{ marginRight: 16 }}
                  disabled={casters?.length === 0}
                  $disabled={casters?.length === 0}
                  onClick={() => {
                    if (!(casters?.length === 0)) visitCasters();
                  }}
                  $noIcon
                >
                  <span>{t('visit.get.started')}</span>
                </_button>
              </_actions>
            </_item>
          </_step>
        </>
      ) : null}
    </>
  );
};

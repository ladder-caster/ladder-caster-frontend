import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import {
  CHAIN_CASTERS,
  CHAIN_LOCAL_CLIENT,
  CHAIN_PLAYER,
  INIT_CHAIN_LOAD,
} from 'chain/hooks/state';
import {
  _home,
  _header,
  _title,
  _feed,
  _section,
  _description,
  _button,
  _actions,
  _item,
  _step,
  _order,
  _task,
  _divider,
  _button_override,
  _link,
  _icon,
  _card,
} from '../Dashboard.styled';
import { IconUser } from 'design/icons/user.icon';
import { useLocalWallet } from 'chain/hooks/useLocalWallet';
import { useRemix } from 'core/hooks/remix/useRemix';
import { DEMO_MODE, GAME_INIT, GAME_RESOURCES, USER_PHASE } from 'core/remix/state';
import React, { useState, useEffect, useMemo } from 'react';
import { AnimateButton } from '../../../../shared/button/animations/AnimateButton';
import { useActions } from '../../../../../actions';
import { useTranslation } from 'react-i18next';
import { IconWallet } from 'design/icons/wallet.icon';
import { IconHat } from 'design/icons/hat.icon';
import Spotlight from '../../../../shared/spotlight/Spotlight';
import { IconMoney } from 'design/icons/money.icon';
import { IconLightning } from 'design/icons/lightning.icon';
import Skeleton from './skeleton/Skeleton';

export const Onboarding = ({ home }) => {
  const { t } = useTranslation();
  const [noFunds, setNoFunds] = useState(false);
  const [demo] = useRemix(DEMO_MODE);
  const [player] = useRemix(CHAIN_PLAYER);
  const [casters] = useRemix(CHAIN_CASTERS);
  const [resources] = useRemix(GAME_RESOURCES);
  const [, setInitalized, isSetInitReady] = useRemix(GAME_INIT);
  const [client] = useRemix(CHAIN_LOCAL_CLIENT);
  const [initLoading] = useRemix(INIT_CHAIN_LOAD);
  const [phase, setPhase] = useRemix(USER_PHASE);
  const { createLocalWallet } = useLocalWallet();
  const { setVisible } = useWalletModal();
  const { startDemo, initPlayer, visitCasters, modalBuyLADA } = useActions();
  const getFunds = async () => {
    setNoFunds((await client.getSOLBalance()) === 0);
  };

  const connectWallet = () => {
    setVisible(true);
  };

  const generateTestWallet = async () => {
    createLocalWallet();
    if (demo) startDemo();
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
    const account = demo?.player && demo?.ladaAccount;
    return {
      active: demo?.active,
      account,
      initialized: account && demo?.active,
      hasPlayer: demo?.player,
    };
  }, [client, demo, player]);

  useEffect(() => {
    if (isSetInitReady) setInitalized(initialized);
  }, [initialized, isSetInitReady]);

  if ((initLoading && active) || (!phase && casters?.length)) return <Skeleton />;

  return (
    <>
      {!active && (
        <_section>
          <_description>{t('home.description')}</_description>
          <_actions $long>
            {/* <AnimateButton high> */}
            <_button $big $long onClick={() => connectWallet()}>
              <IconWallet />
              <span>{t('connect.wallet')}</span>
            </_button>
            {/* </AnimateButton> */}
            {demo ? (
              <AnimateButton low>
                <_button $long onClick={() => generateTestWallet()}>
                  <IconWallet />
                  <span>{t('connect.local_wallet')}</span>
                </_button>
              </AnimateButton>
            ) : null}
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
                <_button
                  $big
                  disabled={hasPlayer}
                  $disabled={hasPlayer}
                  onClick={() => initPlayer()}
                >
                  <IconUser />
                  <span>
                    {!hasPlayer
                      ? t('player.initialize')
                      : t('player.initialized')}
                  </span>
                </_button>
              </_actions>
            </_item>
          </_step>
        </>
      )}
      {(initialized && casters?.length === 0) || (initialized && home) ? (
        <>
          <_step>
            <_card $active={!(resources.lada !== 0 || casters?.length !== 0)}>
              <Spotlight>
                <_icon
                  $active={!(resources.lada !== 0 || casters?.length !== 0)}
                  $step={1}
                >
                  <IconMoney />
                </_icon>
              </Spotlight>
            </_card>
            <_item>
              <_task $disabled={resources.lada !== 0 || casters?.length !== 0}>
                1. {t('home.task.lada')}
              </_task>
              <_actions>
                <_link
                  disabled={resources.lada !== 0 || casters?.length !== 0}
                  $disabled={resources.lada !== 0 || casters?.length !== 0}
                  href={
                    resources.lada !== 0 || casters?.length !== 0
                      ? '#'
                      : 'https://jup.ag/swap/USDC-LADA'
                  }
                  target={
                    resources.lada !== 0 || casters?.length !== 0
                      ? '_self'
                      : '_blank'
                  }
                >
                  <IconHat />
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
                <span>or</span>
                <_button
                  style={{ marginLeft: 8 }}
                  disabled={true}
                  $disabled={true}
                  $noIcon
                >
                  <span>{t('spellcasters.stake')}</span>
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

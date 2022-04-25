import React from 'react';
import { _trade, _close, _float, _header, _icon, _title, _body, _breakpoint } from './TradeDrawer.styled';
import { IconClose } from 'design/icons/close.icon';
import { useTranslation } from 'react-i18next';
import { useActions } from '../../../actions';
import { TAB_LIMIT, TAB_SWAP, TABS_SWAP_LIMIT } from 'core/remix/tabs';
import Tabs from '../tabs/Tabs';
import SwapTab from './tabs/swap/SwapTab';
import LimitTab from './tabs/limit/LimitTab';

const TradeDrawer = () => {
    const { t } = useTranslation();
    const { closeDrawer } = useActions();
    
    return (
        <_trade>
            <_header>
                <_title>{t('drawer.wallet.title')}</_title>
                <_float>
                    <_close>
                        <_icon onClick={() => closeDrawer()}>
                            <IconClose />
                        </_icon>
                    </_close>
                </_float>
            </_header>
            <_body>
                <_breakpoint />
                <SwapTab/>
            </_body>
        </_trade>
    );
};

export default TradeDrawer;

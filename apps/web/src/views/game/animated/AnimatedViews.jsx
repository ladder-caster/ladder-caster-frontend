import React, { useMemo } from 'react';
import Spellcasters from '../spellcasters/Spellcasters';
import {
  VIEW_SPELLCASTERS,
  VIEW_MAP,
  VIEW_INVENTORY,
  VIEW_HOME,
  VIEW_MARKET,
} from 'core/routes/routes';
import Map from '../map/Map';
import Market from '../market/Market';
import Inventory from '../inventory/Inventory';
import Dashboard from '../home/Dashboard';
import { AnimatePresence, motion } from 'framer-motion';
import { VIEW_NAVIGATION } from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import { useMesh } from 'core/state/mesh/useMesh';

const variants = {
  initial: {
    y: 8,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.25,
    },
  },
  exit: {
    y: 16,
    opacity: 0,
  },
};

export const AnimatedViews = () => {
  const [view] = useRemix(VIEW_NAVIGATION);

  const View = ({ children, $key }) => {
    return useMemo(
      () => (
        <motion.div {...variants} key={$key}>
          {children}
        </motion.div>
      ),
      [children],
    );
  };
  const Views = useMemo(
    () => () => (
      <AnimatePresence>
        {!view || view === VIEW_HOME ? (
          <View key={'view-home'} $key={'view-home-motion'}>
            <Dashboard />
          </View>
        ) : null}
        {view === VIEW_INVENTORY && (
          <View key={'view-inventory'} $key={'view-inventory-motion'}>
            <Inventory />
          </View>
        )}
        {view === VIEW_SPELLCASTERS && (
          <View key={'view-spellcasters'} $key={'view-spellcasters-motion'}>
            <Spellcasters />
          </View>
        )}
        {view === VIEW_MAP && (
          <View key={'view-map'} $key={'view-map-motion'}>
            <Map />
          </View>
        )}
        {view === VIEW_MARKET && (
          <View key={'view-market'} $key={'view-market-motion'}>
            <Market />
          </View>
        )}
      </AnimatePresence>
    ),
    [view],
  );

  return <Views />;
};

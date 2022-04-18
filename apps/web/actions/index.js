import { useRemix } from 'core/hooks/remix/useRemix';
import { DEMO_MODE } from 'core/remix/state';
import { useChainActions } from './useChainActions';
import { useDemoActions } from './useDemoActions';

export const useActions = () => {
  const demoActions = useDemoActions();
  const chainActions = useChainActions();
  const [demo] = useRemix(DEMO_MODE);

  if (demo) return { ...demoActions };
  return { ...chainActions };
};

import { useChainActions } from './useChainActions';

export const useActions = () => {
  const chainActions = useChainActions();

  return { ...chainActions };
};

import { useChainActions } from './useChainActions';
import { useTesters } from './useTesters';
import { useConnections } from './useConnections';
import { useStateActions } from './useStateActions';

export const useActions = () => {
  const chainActions = useChainActions();
  const testers = useTesters();
  const connections = useConnections();
  const states = useStateActions();

  return { ...chainActions, ...testers, ...connections, ...states };
};

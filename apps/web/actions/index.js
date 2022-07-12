import { useConnections } from './useConnections';
import { useInstructions } from './useInstructions';
import { useStateActions } from './useStateActions';
import { useTesters } from './useTesters';

export const useActions = () => {
  const connections = useConnections();
  const testers = useTesters();
  const stateActions = useStateActions();
  const instructions = useInstructions();

  return { ...connections, ...testers, ...stateActions, ...instructions };
};

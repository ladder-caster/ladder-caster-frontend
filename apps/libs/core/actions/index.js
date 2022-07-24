import { useConnections } from '../../../web/actions/useConnections';
import { useInstructions } from '../../../web/actions/useInstructions';
import { useStateActions } from '../../../web/actions/useStateActions';
import { useTesters } from '../../../web/actions/useTesters';

const configureActions = () => {
  const connections = useConnections();
  const testers = useTesters();
  const stateActions = useStateActions();
  const instructions = useInstructions();
  return { ...connections, ...testers, ...stateActions, ...instructions };
};

export const loadedActions = () => {
  return configureActions();
};

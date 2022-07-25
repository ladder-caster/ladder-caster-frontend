import { useConnections } from './useConnections';
import { useInstructions } from './useInstructions';
import { useStateActions } from './useStateActions';
import { useTesters } from './useTesters';

export const useActions = () => {
  return {
    ...useConnections(),
    ...useInstructions(),
    ...useStateActions(),
    ...useTesters(),
  };
};

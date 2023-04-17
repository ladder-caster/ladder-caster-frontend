import { useEffect } from 'react';
import { useEventListener } from './useEventListener';
import { USER_OFFLINE } from '../mesh/state';
import { useMesh } from 'core/state/mesh/useMesh';

export const useOffline = () => {
  const [offline, setOffline] = useMesh(USER_OFFLINE);

  useEventListener('offline', () => {
    if (!offline) setOffline(true);
  });

  useEventListener('online', () => {
    if (offline) setOffline(false);
  });

  useEffect(() => {
    window.onoffline = () => {
      if (!offline) setOffline(true);
    };
    window.ononline = () => {
      if (offline) setOffline(false);
    };
  }, []);
};

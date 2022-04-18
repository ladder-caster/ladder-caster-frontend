import { useLayoutEffect } from 'react';
import { useEventListener } from './useEventListener';
import { USER_OFFLINE } from '../remix/state';
import { useRemix } from './remix/useRemix';

export const useOffline = () => {
  const [offline, setOffline] = useRemix(USER_OFFLINE);

  useEventListener('offline', () => {
    if (!offline) setOffline(true);
  });

  useEventListener('online', () => {
    if (offline) setOffline(false);
  });

  useLayoutEffect(() => {
    window.onoffline = () => {
      if (!offline) setOffline(true);
    };
    window.ononline = () => {
      if (offline) setOffline(false);
    };
  }, []);
};

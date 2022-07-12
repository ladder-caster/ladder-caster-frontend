import { useRemix } from 'core/hooks/remix/useRemix';
import { WEB3AUTH_CLIENT, WEB3AUTH_PROVIDER } from 'core/remix/state';
import { WALLET_ADAPTERS } from '@web3auth/base';

export const useConnections = () => {
  const [web3Auth] = useRemix(WEB3AUTH_CLIENT);
  const [, setProvider] = useRemix(WEB3AUTH_PROVIDER);

  return {
    async web3AuthConnect(loginProvider: string) {
      try {
        if (!web3Auth) {
          console.log('web3auth not initialized yet');
          return;
        }
        const provider = await web3Auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
          loginProvider,
          login_hint: '',
        });

        setProvider(provider);
        const user = await web3Auth.getUserInfo();
        console.log(user);
      } catch (error) {
        console.error(error);
      }
    },
    async web3AuthDisconnect() {
      if (!web3Auth) {
        console.log('web3auth not initialized yet');
        return;
      }
      await web3Auth.logout();
      setProvider(null);
    },
  };
};

import { useWallet } from '@solana/wallet-adapter-react';

export const useWalletAdapter = () => {
  const { connected, disconnect } = useWallet();

  const handleDisconnect = async () => {
    if (connected) {
      try {
        await disconnect();
        localStorage.removeItem('adapter-connected');
      } catch (e) {
        // TODO: handle failed
        console.log(e);
        // if (error) error();
      }
    }
  };

  return { handleDisconnect };
};

import { useWallet } from '@solana/wallet-adapter-react';
import { useW3A } from 'chain/hooks/connections/useW3A';
import { useWalletAdapter } from 'chain/hooks/connections/useWalletAdapter';

export const useConnections = () => {
  const { handleDisconnect: w3aDisconnect, handleConnect } = useW3A();
  const { handleDisconnect } = useWalletAdapter();
  const { connected: walletConnected } = useWallet();

  return {
    async web3AuthConnect(loginProvider: string) {
      handleConnect(loginProvider);
    },
    async disconnect() {
      if (walletConnected) handleDisconnect();
      else w3aDisconnect();
    },
  };
};

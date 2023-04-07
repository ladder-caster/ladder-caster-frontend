import { useWallet } from '@solana/wallet-adapter-react';
import { useMesh } from 'core/state/mesh/useMesh';
import { CREATE_MUTATION, WALLET_DISCONNECT } from 'core/mesh/state';
import { useEffect, useMemo } from 'react';
import { nanoid } from 'nanoid';
import { TxStates } from 'sdk/src/hooks/useMutations';

export const useWalletAdapter = () => {
  const { connected, disconnect, disconnecting } = useWallet();
  const [, setMutation] = useMesh(CREATE_MUTATION);
  const id = useMemo(() => nanoid(), []);

  const handleDisconnect = async () => {
    if (connected) {
      try {
        setMutation({
          id,
          state: TxStates.EXECUTING,
          type: WALLET_DISCONNECT,
        });
        await disconnect();
        localStorage.removeItem('adapter-connected');
      } catch (e) {
        // TODO: handle failed
        console.log(e);
        // if (error) error();
      }
    }
  };

  useEffect(() => {
    if (disconnecting) {
      setMutation({
        id,
        state: TxStates.DONE,
        type: WALLET_DISCONNECT,
      });
    }
  }, [disconnecting]);

  return { handleDisconnect };
};

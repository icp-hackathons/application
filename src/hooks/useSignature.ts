import { useCallback, useState } from 'react';
import { SiweMessage } from 'siwe';
import { useAccount, useSignMessage } from 'wagmi';
import { setLocalStorageAddress } from './useLSAddress';

const useSignature = ({ canister = 'sybil' } = {}) => {
  const [signatureData, setSignatureData] = useState<{
    message: string;
    signature: string;
  } | null>(null);

  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const signMessage = useCallback(
    async (chainId: number) => {
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: `Sign in with Ethereum to the ${canister}.`,
        uri: window.location.origin,
        version: '1',
        chainId: chainId,
      });
      const messageString = message.prepareMessage();

      const signature = await signMessageAsync({
        message: messageString,
      });

      setSignatureData({
        message: messageString,
        signature,
      });

      const data = setLocalStorageAddress(address, messageString, signature);
    },
    [address]
  );

  return {
    signMessage,
    signatureData,
  };
};

export default useSignature;

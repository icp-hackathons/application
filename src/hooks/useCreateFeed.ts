import { createFeed } from '@/sybil/createFeed';
import { useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';
import { useCurrentNetwork } from '@/modules/wagmi';
import { remove0x } from '@/utils/truncateAddress';

export const useCreateFeed = () => {
  // const { myChain: selectedChain } = useCurrentNetwork();
  const [isCreating, setIsCreating] = useState(false);
  const { address } = useAccount();

  const create = async (signatureData) => {
    console.log('Creating feed', signatureData);
    setIsCreating(true);

    try {
      const data = await createFeed({
        id: 'test',
        feed_type: {
          Custom: null,
        },
        update_freq: 1660,
        sources: [],
        decimals: [18],
        msg: signatureData.message,
        sig: remove0x(signatureData.signature),
      });

      console.log('Feed created', data);
    } catch (error) {
      console.error('Error creating feed', error);
    } finally {
      setIsCreating(false);
    }
  };

  return {
    create,
    isCreating,
  };
};

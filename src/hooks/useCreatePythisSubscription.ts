import { createSubscription } from '@/pythia/createSubscription';
import { useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';
import {INVESTLY_LOGIC_ADDRESS, useCurrentNetwork} from '@/modules/wagmi';
import { remove0x } from '@/utils/truncateAddress';
import { ABI } from '../modules/abi.ts';

export const useCreatePythiaSubscription = () => {
  // const { myChain: selectedChain } = useCurrentNetwork();
  const [isCreating, setIsCreating] = useState(false);
  const { address } = useAccount();

  const create = async ({ feedId, label, frequency, chainId }) => {
    console.log('Creating subscription');
    setIsCreating(true);

    try {
      const payload = {
        label,
        chain_id: chainId,
        feed_id: [feedId],
        contract_addr: remove0x(INVESTLY_LOGIC_ADDRESS),
        method_abi: 'executeSwap(string, uint256, uint256)',
        frequency_condition: [frequency],
        is_random: false,
        gas_limit: BigInt(500000),
        msg: 'investly',
        sig: 'signed investly',
        price_mutation_condition: [],
      };

      console.log({ payload });

      const data = await createSubscription(payload);

      console.log('Subscription created', data);
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

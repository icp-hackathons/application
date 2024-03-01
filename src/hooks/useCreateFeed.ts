import { createFeed } from '@/sybil/createFeed';
import { useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';
import {INVESTLY_LOGIC_ADDRESS, useCurrentNetwork} from '@/modules/wagmi';
import { remove0x } from '@/utils/truncateAddress';
import { ABI } from '../modules/abi.ts';

export const useCreateFeed = () => {
  // const { myChain: selectedChain } = useCurrentNetwork();
  const [isCreating, setIsCreating] = useState(false);
  const { address } = useAccount();

  const create = async ({ feedId, blockHash, topic }) => {
    console.log('Creating feed');
    setIsCreating(true);

    try {
      const payload = {
        id: feedId,
        feed_type: {
          Custom: null,
        },
        update_freq: 1800,
        sources: [{EvmEventLogsSource: {
            rpc: `https://arbitrum-mainnet.infura.io/v3/${import.meta.env.VITE_INFURA_RPC_CODE}`,
            event_abi: JSON.stringify([{
              "type": "event",
              "name": "SubscriptionAdded",
              "inputs": [
                { "name": "subId", "type": "uint32", "indexed": false, "internalType": "uint32" },
                { "name": "user", "type": "address", "indexed": true, "internalType": "address" },
                { "name": "sellToken", "type": "address", "indexed": false, "internalType": "address" },
                { "name": "buyToken", "type": "address", "indexed": true, "internalType": "address" },
                { "name": "sellAmount", "type": "uint256", "indexed": false, "internalType": "uint256" }
              ],
              "anonymous": false
            },]),
            topic: [topic],
            block_hash: [blockHash], // needs
            log_index: 0,
            address: [INVESTLY_LOGIC_ADDRESS],
            to_block: [],
            event_log_field_name: 'subId',
            from_block: [],
            event_name: 'SubscriptionAdded',
          }}],
        decimals: [0],
        msg: 'investly',
        sig: 'signed investly',
      };

      console.log({ payload });

      const data = await createFeed(payload);

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

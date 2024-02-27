import React from 'react';
import { WagmiConfig, useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';

import {
  AnyCoinType,
  CHAINS,
  CustomCoinType,
  MyChainKey,
  WAGMI_METADATA,
  WALLET_CONNECT_PROJECT_ID,
} from './constants';
import { GetNetworkResult } from 'wagmi/actions';
import { createSingletonState, useSingletonState } from '@/hooks/useSingletonState';

export type NetworkType = 'testnet' | 'mainnet';

const NETWORK_TYPE: NetworkType = import.meta.env.VITE_NETWORK_TYPE || 'testnet';

export type WagmiChain = GetNetworkResult['chain'];

const wagmiConfig = defaultWagmiConfig({
  chains: CHAINS.map((c) => c[NETWORK_TYPE]),
  projectId: WALLET_CONNECT_PROJECT_ID,
  metadata: WAGMI_METADATA,
});

export const initWeb3Modal = () => {
  createWeb3Modal({
    wagmiConfig,
    projectId: WALLET_CONNECT_PROJECT_ID,
    chains: CHAINS.map((c) => c[NETWORK_TYPE]),
    themeMode: 'dark',
    themeVariables: {
      '--w3m-accent': '#273A3C',
      '--w3m-border-radius-master': '1px',
      '--w3m-font-family':
        '--apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    },
  });
};

export default function WagmiProvider({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}

export const useCurrentNetworkType = () => NETWORK_TYPE;

const networkState = createSingletonState<MyChainKey>('ethereum');

export const useCurrentNetwork = () => {
  const { isConnected } = useAccount();
  const networkType = useCurrentNetworkType();
  const { chain: connectedChain } = useNetwork();
  const [currentNetwork, setCurrentNetwork] = useSingletonState(networkState);
  const { switchNetworkAsync } = useSwitchNetwork();

  const foundedChain = CHAINS.find((c) => c.key === currentNetwork) || CHAINS[0];

  const handleSetNetwork = React.useCallback(
    async (selectedKey: MyChainKey) => {
      const selectedChain = CHAINS.find((c) => c.key === selectedKey);
      if (!isConnected) {
        setCurrentNetwork(selectedKey);
      } else if (switchNetworkAsync && selectedChain) {
        await switchNetworkAsync(selectedChain[networkType].id);
        setCurrentNetwork(selectedKey);
      }
    },
    [switchNetworkAsync]
  );

  React.useEffect(() => {
    if (connectedChain) {
      const connectedMyChain = CHAINS.find((c) => c[networkType].id === connectedChain.id);

      if (connectedMyChain && connectedMyChain.key !== currentNetwork) setCurrentNetwork(connectedMyChain.key);
    }
  }, [connectedChain]);

  return {
    chain: foundedChain[networkType],
    myChain: foundedChain,
    myChains: CHAINS,
    networkType,
    switchNetwork: handleSetNetwork,
  };
};

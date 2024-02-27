import React from 'react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount } from 'wagmi';

import { truncateEthAddress } from '@/utils/truncateAddress';
import useWindowDimensions from '@/utils/useWindowDimensions';
import { BREAK_POINT_MOBILE } from '@/modules/constants';

// https://docs.walletconnect.com/web3modal/react/about?platform=wagmi1
function ConnectButton() {
  const { isConnected, address } = useAccount();
  const { open: openWeb3Modal } = useWeb3Modal();

  const { width } = useWindowDimensions();
  const isMobile = width <= BREAK_POINT_MOBILE;

  return <w3m-button balance={isMobile ? 'hide' : 'show'} size="sm" />;
}

export default ConnectButton;

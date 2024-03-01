import { useContractRead } from 'wagmi';

export const useTokenAddress = (token: 'NATIVE' | 'USDT' | 'USDC') => {
  let functionName: 'usdtToken' | 'usdcToken' | undefined;
  switch (token) {
    case 'USDT':
      functionName = 'usdtToken';
      break;
    case 'USDC':
      functionName = 'usdcToken';
      break;
    case 'NATIVE':
    default:
  }

  const contractAddress = '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9';
  // https://1.x.wagmi.sh/react/hooks/useContractRead
  const { data: tokenAddress } = useContractRead({
    address: contractAddress,
    abi: {}, // add appropriate ABI
    functionName,
    enabled: !!contractAddress && !!functionName,
  });

  return tokenAddress;
};

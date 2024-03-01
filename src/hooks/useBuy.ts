import { utils } from 'ethers';
import { useContractWrite } from 'wagmi';
import {INVESTLY_LOGIC_ADDRESS, Token} from '../modules/wagmi';
import { ABI } from '../modules/abi';

export const useBuy = (selectedChainId: any) => {
  let buy: (amount: bigint, token: Token) => Promise<any>;

  const { data, isLoading, isSuccess, writeAsync } = useContractWrite({
    address: INVESTLY_LOGIC_ADDRESS,
    abi: ABI,
    functionName: 'depositToken',
    onSuccess: () => {
      console.log('success');
    },
  });

  buy = (amount, token) => writeAsync({ args: [token, amount] });

  return { data, isLoading, isSuccess, buy };
};

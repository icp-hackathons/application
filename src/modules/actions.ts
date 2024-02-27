import { utils } from 'ethers';
import { writeContract, readContract, waitForTransaction } from '@wagmi/core';
import { remove0x } from '@/utils/truncateAddress';
import { ARBITRUM_TOKENS } from './wagmi/constants';

export const ZERO_X_API_KEY = import.meta.env.VITE_ZERO_X_API_KEY;

const INVESTLY_LOGIC_ADDRESS = '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f'; // some constant address

export const fetch0XSwapData = async () => {
  const headers = { '0x-api-key': ZERO_X_API_KEY }; // This is a placeholder. Get your live API key from the 0x Dashboard (https://dashboard.0x.org/apps)

  // use query-string to define queries more readable
  const quoteUrl = `https://arbitrum.api.0x.org/swap/v1/quote?sellToken=0xaf88d065e77c8cC2239327C5EDb3A432268e5831&buyToken=0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f&sellAmount=10000000`;
  const response = await fetch(quoteUrl, { headers });
  const quote = await response.json();

  console.log({ quote });

  // queue required
  const params = {
    sellToken: quote.sellTokenAddress,
    buyToken: quote.buyTokenAddress,
    sellAmount: quote.sellAmount,
    spender: quote.allowanceTarget,
    swapTarget: quote.to,
    swapCallData: quote.data,
    value: quote.value,
  };

  console.log({ params });
};

const approveSellToken = async () => {
  const tokenAddressFromInput = ARBITRUM_TOKENS[0]; // token selected
  const selectedChainId = 42161; // chain selected
  const inputAmount = '100'; // amount from input

  return writeContract({
    address: tokenAddressFromInput.address,
    abi: [
      {
        name: 'approve',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          {
            name: 'spender',
            type: 'address',
          },
          {
            name: 'amount',
            type: 'uint256',
          },
        ],
        outputs: [
          {
            name: '',
            type: 'bool',
          },
        ],
      },
    ],
    functionName: 'approve',
    args: [INVESTLY_LOGIC_ADDRESS, utils.parseUnits(inputAmount, tokenAddressFromInput.decimals)],
    chainId: selectedChainId,
  });
};

const depositAmount = async () => {
  const tokenAddressFromInput = ARBITRUM_TOKENS[0]; // token selected
  const selectedChainId = 42161; // chain selected
  const inputAmount = '100'; // amount from input

  return writeContract({
    address: INVESTLY_LOGIC_ADDRESS,
    abi: [], // abi file
    functionName: 'depositToken',
    args: [tokenAddressFromInput, utils.parseUnits(inputAmount, tokenAddressFromInput.decimals)],
    chainId: selectedChainId,
  });
};

const addSubscription = async () => {
  const quote = {}; // quote from 0x
  const params = {
    sellToken: quote.sellTokenAddress,
    buyToken: quote.buyTokenAddress,
    sellAmount: quote.sellAmount,
    spender: quote.allowanceTarget,
    swapTarget: quote.to,
    swapCallData: quote.data,
    value: quote.value,
  }; // queue required as formatted as from `fetch0XSwapData` return

  const { hash } = writeContract({
    address: INVESTLY_LOGIC_ADDRESS,
    abi: [], // abi file
    functionName: 'addSubscription',
    args: Object.keys(params),
    chainId: selectedChainId,
  }); // here from response will be subscriptino_id

  const receipt = waitForTransaction({ hash });

  setupSybilCustomDataFetcher(receipt.blockNumber, receipt.subscription_id); // not sure about sub_id like that
};

const setupSybilCustomDataFetcher = (blockNumber, subscription_id) => {
  // const { createFeed } = useSybilData();

  createFeed({
    id: `investly_subscription_{user_address}_{subscription_id}`, // sub_id from response on write contract `addSubscription`
    feed_type: {
      Custom: null,
    },
    update_freq: +frequency * 60, // 30 min
    // @ts-ignore
    sources: [
      {
        uri: 'get_logs({INVESTLY_LOGIC_ADDRESS}, blockNumber-1, blockNumber+1, SubscriptionAdded)',
        resolver: '/0',
        api_keys: [],
      },
    ],
    decimals: [],
    msg: addressData.message,
    sig: remove0x(addressData.signature),
  });
};

const setupPythiaSubscription = () => {};

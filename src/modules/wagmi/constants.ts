import { arbitrum, base, arbitrumSepolia, baseSepolia } from 'viem/chains';
import ethIcon from '../../assets/ethereum.svg';
import arbitrumIcon from '../../assets/arbitrum.svg';
import tetherIcon from '../../assets/tether.svg';
import usdcIcon from '../../assets/usdc.svg';
import wbtcIcon from '../../assets/wbtc.svg';
import uniIcon from '../../assets/uni.svg';
import wethIcon from '../../assets/weth.svg';
import baseIcon from '../../assets/base.svg';

export type AnyCoinType = 'USDT' | 'USDC' | 'ETH' | 'MATIC' | 'BNB' | 'Card';
export type CustomCoinType = 'USDT' | 'USDC';
export type NativeCoinType = 'ETH' | 'MATIC' | 'BNB';

export const WALLET_CONNECT_PROJECT_ID = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

export const WAGMI_METADATA = {
  name: import.meta.env.VITE_WAGMI_METADATA_NAME,
  description: import.meta.env.VITE_WAGMI_METADATA_DESCRIPTION,
  url: import.meta.env.VITE_WAGMI_METADATA_URL,
  icons: import.meta.env.VITE_WAGMI_METADATA_ICONS ? JSON.parse(import.meta.env.VITE_WAGMI_METADATA_ICONS) : [],
};

export interface Coin {
  title: AnyCoinType;
  type: 'native' | 'custom' | 'card';
  icon: string;
  precision: number;
  decimals: number;
}

export const CHAINS = [
  {
    key: 'base',
    name: 'Base' as string,
    nativeToken: 'eth',
    mainnet: base,
    testnet: baseSepolia,
    img: baseIcon,
    explorer: {
      mainnet: 'https://basescan.org/',
      testnet: 'https://sepolia.basescan.org/',
    },
    tokens: [
      {
        title: 'ETH',
        type: 'native',
        icon: ethIcon,
        precision: 5,
        decimals: 18,
      },
      {
        title: 'USDT',
        type: 'custom',
        icon: tetherIcon,
        precision: 1,
        decimals: 6,
      },
    ],
  },
  {
    key: 'arbitrum',
    name: 'Arbitrum' as string,
    nativeToken: 'eth',
    mainnet: arbitrum,
    testnet: arbitrumSepolia,
    img: arbitrumIcon,
    explorer: {
      mainnet: 'https://arbiscan.io/',
      testnet: 'https://sepolia.arbiscan.io/',
    },
    tokens: [
      {
        title: 'USDT',
        type: 'custom',
        icon: tetherIcon,
        precision: 1,
        decimals: 6,
      },
      {
        title: 'ETH',
        type: 'native',
        icon: ethIcon,
        precision: 5,
        decimals: 18,
      },
    ],
  },
] as const;

export const ARBITRUM_TOKENS = [
  {
    symbol: 'USDT' as AnyCoinType,
    label: 'Tether USD',
    address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    decimals: 6,
    img: tetherIcon,
  },
  {
    symbol: 'USDC' as AnyCoinType,
    label: 'USD Coin',
    address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    decimals: 6,
    img: usdcIcon,
  },
  {
    symbol: 'WBTC' as AnyCoinType,
    label: 'Wrapped BTC',
    address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
    decimals: 8,
    img: wbtcIcon,
  },
  {
    symbol: 'WETH' as AnyCoinType,
    label: 'Wrapped Ether',
    address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    decimals: 18,
    img: wethIcon,
  },
  {
    symbol: 'UNI' as AnyCoinType,
    label: 'Uniswap',
    address: '0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0',
    decimals: 18,
    img: uniIcon,
  },
  {
    symbol: 'ARB' as AnyCoinType,
    label: 'Arbitrum',
    address: '0x912CE59144191C1204E64559FE8253a0e49E6548',
    decimals: 18,
    img: arbitrumIcon,
  },
];

export const BASE_TOKENS = [
  {
    symbol: 'USDC' as AnyCoinType,
    label: 'USD Coin',
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    decimals: 6,
    img: usdcIcon,
  },
  {
    symbol: 'WETH' as AnyCoinType,
    label: 'Wrapped Ether',
    address: '0x4200000000000000000000000000000000000006',
    decimals: 18,
    img: wethIcon,
  },
];

export type MyChainKey = MyChain['key'];

export type MyChain = (typeof CHAINS)[number];

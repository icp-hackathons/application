import { Card, Flex, Space, Spin, notification } from 'antd';
import './App.css';
import { ChooseNetwork } from './components/ChooseNetwork';
import Header from './components/Header';
import { InvestForm } from './components/InvestForm';
import { useEffect, useState } from 'react';
import { ARBITRUM_TOKENS, AnyCoinType, BASE_TOKENS, Token, useCurrentNetwork } from './modules/wagmi';
import { SetFrequency } from './components/SetFrequency';
import useWindowDimensions from './utils/useWindowDimensions';
import { BREAK_POINT_MOBILE, MAX_ALLOWANCE } from './modules/constants';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { Unit, convertFrequencyToSeconds } from './utils/convertFrequencyToSeconds';
import styled from 'styled-components';
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

import { utils } from 'ethers';
import { useBuy } from './hooks/useBuy';
import { parseUnits } from 'viem';
import { useCreateFeed } from './hooks/useCreateFeed';
import useSignature from './hooks/useSignature';
import { sign } from 'viem/accounts';

const StyledButton = styled.button`
  background: #273a3c;
  border-radius: 14px;
  border: 1px solid #77e5ef;
  color: #77e5ef;
  padding: 8px 24px;
  cursor: pointer;
  font-size: 18px;
  width: 100%;
`;

const StyledSpinWrap = styled(Flex)`
  position: absolute;
  top: 30px;
  left: 0;
  right: 0;
`;

const INVESTLY_LOGIC_ADDRESS = '0x269C36463d6284775A9B944A4Fa3cF02a08f6dE5';

function App() {
  const { myChain: selectedChain, networkType, myChains, switchNetwork } = useCurrentNetwork();
  const [sellCoin, setSellCoin] = useState<Token>(selectedChain.tokens[0]);
  const [receiveCoin, setReceiveCoin] = useState<Token>(selectedChain.tokens[1]);
  const [investAmount, setInvestAmount] = useState('0');
  const [frequency, setFrequency] = useState('0');
  const { open: openWeb3Modal } = useWeb3Modal();
  const { isConnected, address } = useAccount();
  const { signMessage, signatureData } = useSignature();
  const [isSigning, setIsSigning] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  console.log({ signatureData });

  const { create, isCreating } = useCreateFeed();

  useEffect(() => {
    if (signatureData !== null) create(signatureData);
  }, [signatureData]);

  const {
    data: buyResult,
    buy,
    isLoading: isBuying,
    isSuccess: isBuySuccess,
  } = useBuy({
    selectedChainId: selectedChain[networkType].id,
  });

  useEffect(() => {
    setSellCoin(selectedChain.tokens[0]);
    setReceiveCoin(selectedChain.tokens[1]);
  }, [selectedChain]);

  const { width } = useWindowDimensions();
  const isMobile = width <= BREAK_POINT_MOBILE;

  const onInvestAmountChange = (value: string) => {
    if (!/^[0-9]*\.?[0-9]*$/.test(value)) {
      return;
    }
    if (Number(value) !== 0) {
      setInvestAmount(value);
    }
  };

  const onFrequencyChange = (value: string, units: Unit) => {
    if (!/^[0-9]*\.?[0-9]*$/.test(value)) {
      return;
    }
    setFrequency(value);

    // console.log(convertFrequencyToSeconds(Number(value), units));
    // for create feed BigInt(convertFrequencyToSeconds(frequency.value, frequency.units))
  };

  // Allowance
  // https://0x.org/docs/0x-swap-api/advanced-topics/how-to-set-your-token-allowances
  const { data: allowance, refetch: refetchAllowance } = useContractRead({
    address: INVESTLY_LOGIC_ADDRESS,
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
    functionName: 'allowance',
    args: [address, INVESTLY_LOGIC_ADDRESS],
  });

  const { config: configAllowance } = usePrepareContractWrite({
    address: INVESTLY_LOGIC_ADDRESS,
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
    args: [INVESTLY_LOGIC_ADDRESS, utils.parseUnits(investAmount, sellCoin.decimals)],
    chainId: selectedChain[networkType].id,
    onSuccess: () => {
      console.log('approve success');
    },
  });

  const { data: allowanceApproveResult, writeAsync: approveAsync, error } = useContractWrite(configAllowance);

  const { isLoading: isApproving } = useWaitForTransaction({
    hash: allowanceApproveResult ? allowanceApproveResult.hash : undefined,
    onSuccess(data) {
      console.log('approve success');
    },
  });

  const handleBuy = () => {
    buy(parseUnits(investAmount, sellCoin.decimals), sellCoin);
  };

  const trxHash = buyResult?.hash;
  console.log({ trxHash });
  console.log({ allowanceApproveResult });

  const handleSign = async () => {
    setIsSigning(true);
    try {
      signMessage(selectedChain[networkType].id);
      api.info({
        message: 'Sign message',
        description: 'Loading...',
        duration: 3,
      });
    } catch {
      console.error('Error signing message');
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <div>
      {contextHolder}
      <main>
        <Header />
        <Flex vertical className="wrapper" gap="middle">
          {isBuying && (
            <StyledSpinWrap justify="center" align="center">
              <Spin spinning={true} size="large" />
            </StyledSpinWrap>
          )}
          <Flex
            gap="small"
            vertical={isMobile}
            style={{
              filter: isBuying || isApproving ? 'blur(4px)' : 'none',
            }}
          >
            <Space
              size="small"
              direction="vertical"
              style={{
                minWidth: isMobile ? '100%' : 400,
                width: '100%',
              }}
            >
              <ChooseNetwork
                sellCoin={sellCoin}
                receiveCoin={receiveCoin}
                setSellCoin={setSellCoin}
                setReceiveCoin={setReceiveCoin}
              />
              <InvestForm
                investAmount={investAmount}
                onInvestAmountChange={onInvestAmountChange}
                sellToken={sellCoin}
              />
              <SetFrequency frequency={frequency} onFrequencyChange={onFrequencyChange} />
            </Space>
          </Flex>
          {!isConnected ? (
            <StyledButton onClick={() => openWeb3Modal()}>Connect</StyledButton>
          ) : signatureData === null ? (
            <StyledButton onClick={handleSign}>Sign message</StyledButton>
          ) : allowance === 0n ? (
            <StyledButton
              disabled={isApproving}
              onClick={async () => {
                if (!approveAsync) return;
                const writtenValue = await approveAsync();
              }}
            >
              {isApproving ? 'Approving…' : `Approve ${sellCoin.symbol}`}
            </StyledButton>
          ) : (
            <StyledButton
              style={{
                textTransform: 'uppercase',
                width: '100%',
              }}
              onClick={handleBuy}
              disabled={isBuying}
            >
              {isBuying ? 'Buying...' : 'Buy now'}
            </StyledButton>
          )}
          <Card title="What is DCA?">
            Dollar-cost averaging is a tool an investor can use to build savings and wealth over a long period while
            neutralizing the short-term volatility in the market. The purchases occur regardless of the asset's price
            and at regular intervals. In effect, this strategy removes much of the detailed work of attempting to time
            the market in order to make purchases of assets at the best prices.
          </Card>

          {/* approve -> deposit -> sign message */}
        </Flex>
      </main>
      <div className="custom-bg"></div>
    </div>
  );
}

export default App;

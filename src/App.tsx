import { Card, Flex, Space, Spin, notification } from 'antd';
import './App.css';
import { ChooseNetwork } from './components/ChooseNetwork';
import Header from './components/Header';
import { InvestForm } from './components/InvestForm';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  ARBITRUM_TOKENS,
  AnyCoinType,
  BASE_TOKENS,
  Token,
  useCurrentNetwork,
  INVESTLY_LOGIC_ADDRESS
} from './modules/wagmi';
import { SetFrequency } from './components/SetFrequency';
import useWindowDimensions from './utils/useWindowDimensions';
import { BREAK_POINT_MOBILE, MAX_ALLOWANCE } from './modules/constants';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { Unit, convertFrequencyToSeconds } from './utils/convertFrequencyToSeconds';
import styled from 'styled-components';
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction, useToken, erc20ABI, useSwitchNetwork } from 'wagmi';
import { ABI } from './modules/abi.ts';

import { utils } from 'ethers';
import { useBuy } from './hooks/useBuy';
import { parseUnits } from 'viem';
import { useCreateFeed } from './hooks/useCreateFeed';
import { useCreatePythiaSubscription } from './hooks/useCreatePythisSubscription';
import useSignature from './hooks/useSignature';
import { sign } from 'viem/accounts';
import { writeContract, waitForTransaction } from 'wagmi/actions';
import {formatUnits} from "@ethersproject/units/src.ts";

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

function App() {
  const { myChain: selectedChain, networkType, myChains, switchNetwork } = useCurrentNetwork();
  const [sellCoin, setSellCoin] = useState<Token>(selectedChain.tokens[0]);
  const [receiveCoin, setReceiveCoin] = useState<Token>(selectedChain.tokens[1]);
  const [investAmount, setInvestAmount] = useState('0');
  const [frequency, setFrequency] = useState('0');
  const [frequencyValue, setFrequencyValue] = useState('0');
  const { open: openWeb3Modal } = useWeb3Modal();
  const { isConnected, address } = useAccount();
  const { signMessage, signatureData } = useSignature();
  const [isSigning, setIsSigning] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  console.log({ signatureData, selectedChain, networkType });
  const [isApproving, setIsApproving] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const { create: createFeed, isCreatingFeed } = useCreateFeed();
  const { create: createSubscription, isCreating: isCreatingSubscription } = useCreatePythiaSubscription();

  // useEffect(() => {
  //   if (signatureData !== null) create(signatureData);
  // }, [signatureData]);

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

    setInvestAmount(value);
  };

  const onFrequencyChange = (value: string, units: Unit) => {
    if (!/^[0-9]*\.?[0-9]*$/.test(value)) {
      return;
    }

    // set seconds
    switch(units) {
      case 'day':
        setFrequencyValue(convertFrequencyToSeconds(1, 'day'));
        break;
      case 'week':
        setFrequencyValue(convertFrequencyToSeconds(1, 'week'));
        break;
      case 'month':
        setFrequencyValue(convertFrequencyToSeconds(1, 'month'));
        break;
    }

    setFrequency(value);

    // console.log(convertFrequencyToSeconds(Number(value), units));
    // for create feed BigInt(convertFrequencyToSeconds(frequency.value, frequency.units))
  };

  const { data: allowance, refetch: refetchAllowance } = useContractRead({
    address: sellCoin.address,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [address, INVESTLY_LOGIC_ADDRESS],
  });

  const { data: tokenBalance } = useContractRead({
    address: INVESTLY_LOGIC_ADDRESS,
    abi: ABI,
    functionName: 'tokenBalances',
    args: [address, sellCoin.address],
  });

  console.log({ allowance, tokenBalance, address, sellCoin });

  const approve = async () => {
    console.log({ investAmount });
    setIsApproving(true);

    try {
      const { hash } = await toast.promise(
        writeContract({
          address: sellCoin.address,
          abi: erc20ABI,
          functionName: 'approve',
          args: [INVESTLY_LOGIC_ADDRESS, utils.parseUnits(investAmount, sellCoin.decimals)],
        }),
        {
          pending: `Approving...`,
          success: `Approved successfully`,
          error: {
            render({ error }) {
              console.error(`Deposit`, error);

              return 'Something went wrong. Try again later.';
            },
          },
        }
      );

      console.log({hash});

      const res = await waitForTransaction({hash});

      refetchAllowance();

      console.log({res});
    } catch (error) {
      console.error(error);
    } finally {
      setIsApproving(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      setIsSubscribing(true);

      console.log({investAmount, frequency});

      const {hash} = await toast.promise(
        writeContract({
          address: INVESTLY_LOGIC_ADDRESS,
          abi: ABI,
          functionName: 'depositTokenAndSubscribe',
          args: [sellCoin.address, receiveCoin.address, parseUnits(investAmount, sellCoin.decimals), parseUnits((Number(investAmount) / Number(frequency)).toFixed(4), sellCoin.decimals)],
        }),
        {
          pending: `Depositing...`,
          success: `Deposited successfully`,
          error: {
            render({ error }) {
              console.error(`Deposit`, error);

              return 'Something went wrong. Try again later.';
            },
          },
        }
      );

      console.log({hash});

      const res = await waitForTransaction({hash});

      console.log('subscription added', {res});

      // const data = "0x0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000fd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb90000000000000000000000000000000000000000000000000000000000989680"
      const data = res.logs[3].data;
      const topic = res.logs[3].topics[0];

      const callDataInterface = new utils.Interface([
        'event SubscriptionAdded(uint32 subId, address indexed user, address sellToken, address indexed buyToken, uint256 sellAmount)',
      ]);

      const decodedCallData = callDataInterface.decodeEventLog(
        'SubscriptionAdded',
        data
      );

      const subId = decodedCallData[0];
      // const subId = 5;
      const feedId = `investly-${address}-${subId}`;

      console.log({ decodedCallData });

      // res.blockHash
      // res.logs

      await toast.promise(
        createFeed({
          feedId,
          blockHash: res?.blockHash,
          topic,
        }),
        {
          pending: `Creating Feed...`,
          success: `Feed created`,
          error: {
            render({ error }) {
              console.error(`Deposit`, error);

              return 'Something went wrong. Try again later.';
            },
          },
        }
      );

      console.log({ selectedChain, networkType });

      await toast.promise(
        createSubscription({
          feedId: `custom_${feedId}`,
          label: `Subscription for ${feedId}`,
          chainId: selectedChain[networkType].id,
          frequency: frequencyValue,
        }),
        {
          pending: `Creating Subscription...`,
          success: `Subscription created`,
          error: {
            render({ error }) {
              console.error(`Deposit`, error);

              return 'Something went wrong. Try again later.';
            },
          },
        }
      );

    } catch (error) {
      console.error(error);
    } finally {
      setIsSubscribing(false);
    }
  };

  const trxHash = buyResult?.hash;
  // console.log({ trxHash });
  // Number(utils.formatUnits(tokenBalance ?? 0, sellCoin.decimals)) < investAmount ?
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
          ) : Number(utils.formatUnits(allowance ?? 0, sellCoin.decimals)) < investAmount ? (
            <StyledButton
              disabled={isApproving}
              onClick={async () => {
                approve();
              }}
            >
              {isApproving ? 'Approving…' : `Approve ${sellCoin.symbol}`}
            </StyledButton>
          ) : (
            (
              <StyledButton
                style={{
                  textTransform: 'uppercase',
                  width: '100%',
                }}
                onClick={handleSubscribe}
                disabled={isBuying || investAmount === '0' || frequency === '0' || isCreatingFeed || isCreatingSubscription || isSubscribing}
              >
                {isSubscribing ? 'Depositing & Subscribing...' : 'Deposit & Subscribe'}
              </StyledButton>
            )
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

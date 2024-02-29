import { Card, Flex, Space } from 'antd';
import './App.css';
import { ChooseNetwork } from './components/ChooseNetwork';
import Header from './components/Header';
import { InvestForm } from './components/InvestForm';
import { useEffect, useState } from 'react';
import { ARBITRUM_TOKENS, AnyCoinType, BASE_TOKENS, useCurrentNetwork } from './modules/wagmi';
import { SetFrequency } from './components/SetFrequency';
import useWindowDimensions from './utils/useWindowDimensions';
import { BREAK_POINT_MOBILE } from './modules/constants';
import { fetch0XSwapData } from './modules/actions';

function App() {
  const { myChain: selectedChain, networkType, myChains, switchNetwork } = useCurrentNetwork();
  const [sellCoin, setSellCoin] = useState<AnyCoinType>(BASE_TOKENS[0].symbol);
  const [receiveCoin, setReceiveCoin] = useState<AnyCoinType>(ARBITRUM_TOKENS[0].symbol);
  const [investAmount, setInvestAmount] = useState('0');
  const [frequency, setFrequency] = useState('0');

  // useEffect(() => {
  //   fetch0XSwapData();
  // }, []);

  console.log(selectedChain);

  const { width } = useWindowDimensions();
  const isMobile = width <= BREAK_POINT_MOBILE;

  const onInvestAmountChange = (value: string) => {
    if (!/^[0-9]*\.?[0-9]*$/.test(value)) {
      return;
    }
    setInvestAmount(value);
  };

  const onFrequencyChange = (value: string) => {
    if (!/^[0-9]*\.?[0-9]*$/.test(value)) {
      return;
    }
    setFrequency(value);
  };

  return (
    <div>
      <main>
        <Header />
        <Flex className="wrapper" gap="small" vertical={isMobile}>
          <Space
            size="small"
            direction="vertical"
            style={{
              minWidth: isMobile ? '100%' : 400,
            }}
          >
            <ChooseNetwork
              sellCoin={sellCoin}
              receiveCoin={receiveCoin}
              setSellCoin={setSellCoin}
              setReceiveCoin={setReceiveCoin}
            />
            <InvestForm investAmount={investAmount} onInvestAmountChange={onInvestAmountChange} />
            <SetFrequency frequency={frequency} onFrequencyChange={onFrequencyChange} />
          </Space>
          <Card title="What is DCA?">
            Dollar-cost averaging is a tool an investor can use to build savings and wealth over a long period while neutralizing the short-term volatility in the market.
            The purchases occur regardless of the asset's price and at regular intervals. In effect, this strategy removes much of the detailed work of attempting to time the market in order to make purchases of assets at the best prices.
          </Card>
        </Flex>
      </main>
      <div className="custom-bg"></div>
    </div>
  );
}

export default App;

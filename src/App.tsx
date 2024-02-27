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
            Lorem ipsum dolor sit amet consectetur. Enim mattis fames molestie amet dolor. Mauris cursus rutrum aliquam
            parturient nunc et. Rhoncus arcu velit porttitor ullamcorper. Eu habitant eget volutpat malesuada neque
            egestas ornare tellus sed.
          </Card>
        </Flex>
      </main>
      <div className="custom-bg"></div>
    </div>
  );
}

export default App;

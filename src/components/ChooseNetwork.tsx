import { BREAK_POINT_MOBILE } from '@/modules/constants';
import { ARBITRUM_TOKENS, AnyCoinType, BASE_TOKENS, Coin, MyChainKey, useCurrentNetwork } from '@/modules/wagmi';
import useWindowDimensions from '@/utils/useWindowDimensions';
import { Card, Flex, Modal, Select, Space, Typography } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import { DownOutlined, SwapOutlined } from '@ant-design/icons';

const StyledTitle = styled(Typography.Text)`
  white-space: nowrap;
  color: #9a9fa4;
  font-size: 14px;
`;

const StyledNetwork = styled(Flex)`
  cursor: pointer;
`;

const StyledModal = styled(Modal)`
  .ant-modal-title {
    text-align: center;
  }
`;

const StyledCoinIcon = styled.img`
  transition: width 0.2s;
`;

const StyledIconWrap = styled.div`
  position: absolute;
  top: 52%;
  left: 48%;
  cursor: pointer;

  @media (max-width: 768px) {
    top: 49%;
    left: 100px;
  }
`;

type ChooseNetworkProps = {
  sellCoin: Coin['title'];
  receiveCoin: Coin['title'];
  setSellCoin: (coin: Coin['title']) => void;
  setReceiveCoin: (coin: Coin['title']) => void;
};

export const ChooseNetwork = ({ sellCoin, receiveCoin, setReceiveCoin, setSellCoin }: ChooseNetworkProps) => {
  const [isNetworkModalVisible, setNetworkModalVisible] = useState(false);
  const { myChain: selectedChain, networkType, myChains, switchNetwork } = useCurrentNetwork();

  const [baseTokens, setBaseTokens] = useState(BASE_TOKENS);
  const [receivedTokens, setReceivedTokens] = useState(ARBITRUM_TOKENS);

  const { width } = useWindowDimensions();
  const isMobile = width <= BREAK_POINT_MOBILE;

  const handleSwitchNetwork = (chainKey: MyChainKey) => {
    setNetworkModalVisible(false);
    switchNetwork(chainKey);
  };

  const onSwapClick = () => {
    setReceiveCoin(sellCoin);
    setSellCoin(receiveCoin);
    setReceivedTokens(baseTokens);
    setBaseTokens(receivedTokens);
  };

  const onReceiveCoinChange = (value: AnyCoinType) => {
    if (value !== sellCoin) {
      setReceiveCoin(value);
    }
  };

  const onSellCoinChange = (value: AnyCoinType) => {
    if (value !== receiveCoin) {
      setSellCoin(value);
    }
  };

  return (
    <Card title="Choose network">
      <Space size="middle" direction="vertical" style={{ width: '100%' }}>
        <Flex justify="space-between" align="center" gap="middle">
          <Flex gap="small" vertical>
            {!isMobile && <StyledTitle>Select Network</StyledTitle>}
            <StyledNetwork gap="small" align="center" justify="center" onClick={() => setNetworkModalVisible(true)}>
              {selectedChain ? <img src={selectedChain.img} alt="Network" style={{ maxWidth: 24 }} /> : null}
              <Typography.Text
                style={{
                  wordBreak: 'normal',
                  fontSize: 20,
                }}
              >
                {selectedChain ? selectedChain.name : 'Select Network'}
              </Typography.Text>
              <DownOutlined style={{ color: '#8D8D8D', fontSize: 12 }} />
            </StyledNetwork>
          </Flex>
        </Flex>

        <Flex
          vertical={isMobile}
          gap="large"
          style={{
            backgroundColor: '#273a3c',
            padding: 20,
            borderRadius: 16,
            width: '100%',
            color: 'white',
            position: 'relative',
          }}
        >
          <Flex vertical style={{ flex: 1 }} gap="small">
            <Typography.Text>Sell</Typography.Text>
            <Select value={sellCoin} style={{ width: 120 }} onChange={onSellCoinChange}>
              {baseTokens.map((token) => (
                <Select.Option key={token.symbol} value={token.symbol}>
                  <Flex gap="small" align="center">
                    <StyledCoinIcon
                      src={token.img}
                      alt={token.symbol}
                      style={{
                        maxWidth: 24,
                      }}
                    />
                    <span>{token.symbol}</span>
                  </Flex>
                </Select.Option>
              ))}
            </Select>
          </Flex>
          <StyledIconWrap onClick={onSwapClick}>
            <SwapOutlined />
          </StyledIconWrap>
          <Flex vertical style={{ alignSelf: isMobile ? 'flex-start' : 'flex-end' }} gap="small">
            <Typography.Text>Receive</Typography.Text>
            <Select value={receiveCoin} style={{ width: 120 }} onChange={onReceiveCoinChange}>
              {receivedTokens.map((token) => (
                <Select.Option key={token.symbol} value={token.symbol}>
                  <Flex gap="small" align="center">
                    <StyledCoinIcon
                      src={token.img}
                      alt={token.symbol}
                      style={{
                        maxWidth: 24,
                      }}
                    />
                    <span>{token.symbol}</span>
                  </Flex>
                </Select.Option>
              ))}
            </Select>
          </Flex>
        </Flex>
      </Space>

      <StyledModal
        title="Select Network"
        open={isNetworkModalVisible}
        footer={null}
        onCancel={() => setNetworkModalVisible(false)}
        centered
        style={{ maxWidth: isMobile ? '100%' : 472 }}
      >
        <Flex justify="center" align="start" gap={24} style={{ paddingTop: 16 }}>
          {myChains.map((chain) => (
            <Flex
              gap="small"
              align="center"
              vertical
              style={{ maxWidth: 111, textAlign: 'center', cursor: 'pointer' }}
              key={chain.key}
              onClick={() => handleSwitchNetwork(chain.key)}
            >
              <img src={chain.img} alt={chain.name} style={{ width: 40 }} />
              <Typography.Title level={5} style={{ color: '#8D8D8D' }}>
                {chain.name}
              </Typography.Title>
            </Flex>
          ))}
        </Flex>
      </StyledModal>
    </Card>
  );
};

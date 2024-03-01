import { useTokenAddress } from '@/hooks/useTokenAddress';
import { Card, Flex, Space } from 'antd';
import { useAccount, useBalance } from 'wagmi';
import { StyledInput } from './SetFrequency';
import styled from 'styled-components';
import { Token } from '@/modules/wagmi';

const StyledTag = styled.div`
  background-color: #273a3c;
  border-radius: 14px;
  padding: 8px 24px;
  color: #77e5ef;
`;

type InvestFormProps = {
  investAmount: string;
  onInvestAmountChange: (value: string) => void;
  sellToken: Token;
};

export const InvestForm = ({ investAmount, onInvestAmountChange, sellToken }: InvestFormProps) => {
  const { isConnected, address } = useAccount();
  const tokenAddress = useTokenAddress('USDT'); // or 'USDC' or 'NATIVE'

  const { data: userBalance, refetch: refetchBalance } = useBalance({
    address,
    token: tokenAddress,
    watch: true,
  });

  const formattedBalance = Number(userBalance?.formatted).toLocaleString(undefined, {
    minimumFractionDigits: 4,
  });

  return (
    <Card title={`How much ${sellToken.symbol} do you want to invest`}>
      <Flex vertical gap="small">
        <Flex align="center">
          <StyledInput
            value={investAmount}
            onChange={(e) => onInvestAmountChange(e.target.value)}
            id="pay-amount"
            placeholder="Enter Amount"
            autoComplete="off"
          />
          <Space size="small">
            <StyledTag onClick={() => onInvestAmountChange(formattedBalance)}>Max</StyledTag>
            <StyledTag
              onClick={() => onInvestAmountChange(Number(formattedBalance) > 0 ? Number(formattedBalance) / 2 : 0)}
            >
              Half
            </StyledTag>
          </Space>
        </Flex>
        {userBalance ? (
          <span style={{ flex: 1 }}>
            Balance: {formattedBalance} {userBalance?.symbol}{' '}
          </span>
        ) : null}
        {/* show balance for the current chain and sell token  */}
      </Flex>
    </Card>
  );
};

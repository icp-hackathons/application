import { useWeb3Modal } from '@web3modal/wagmi/react';
import { Card, Flex, Input, Space } from 'antd';
import { useState } from 'react';
import styled from 'styled-components';

export const StyledInput = styled(Input)`
  border-radius: 0;
  border: none;
  // border-bottom: 1px solid #8d8d8d;
  background-color: transparent;
  font-size: 24px;
  padding: 3px 0 0;
  &:focus,
  &:focus-within,
  &:hover {
    background-color: transparent;
    box-shadow: none;
    outline: none;
  }
  &.ant-input-affix-wrapper-readonly {
    border-bottom: 1px solid #8d8d8d;
  }

  .ant-input-prefix {
    margin-inline-end: 10px;

    img {
      max-width: 24px;
    }
  }
`;

export const StyledDayTag = styled.div<{ $isActive: boolean }>`
  border: 1px solid #9a9fa4;
  border-radius: 14px;
  color: #9a9fa4;
  width: 60px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  ${(props) => props.$isActive && `border-color: #77e5ef; color: #77e5ef;`}
`;

const StyledTextTab = styled.div<{ $isActive: boolean }>`
  font-size: 18px;
  color: #9a9fa4;
  cursor: pointer;
  ${(props) => props.$isActive && `color: white;`}
`;

const StyledButton = styled.button`
  background: #273a3c;
  border-radius: 14px;
  border: none;
  color: #77e5ef;
  padding: 8px 24px;
  cursor: pointer;
  font-size: 18px;
  width: 100%;
`;

const DAY_TAGS = [7, 14, 30];
const WEEK_TAGS = [1, 2, 3, 4];

type SetFrequencyProps = {
  frequency: string;
  onFrequencyChange: (value: string) => void;
};

export const SetFrequency = ({ frequency, onFrequencyChange }: SetFrequencyProps) => {
  const [activeTag, setActiveTag] = useState(7);
  const [isDaily, setIsDaily] = useState(true);
  const { open: openWeb3Modal } = useWeb3Modal();

  const onDayTagClick = (day: string) => {
    setActiveTag(+day);
    onFrequencyChange(day);
  };

  return (
    <Card
      title={
        <Flex gap="small">
          <StyledTextTab onClick={() => setIsDaily(true)} $isActive={isDaily}>
            Daily
          </StyledTextTab>
          <StyledTextTab onClick={() => setIsDaily(false)} $isActive={!isDaily}>
            Weekly
          </StyledTextTab>
        </Flex>
      }
    >
      <Space size="middle" direction="vertical">
        {isDaily ? (
          <Flex>
            <StyledInput
              value={frequency}
              onChange={(e) => onFrequencyChange(e.target.value)}
              id="frequency"
              placeholder="How many days?"
              autoComplete="off"
            />
            <Space size="small">
              {DAY_TAGS.map((day) => (
                <StyledDayTag key={day} onClick={() => onDayTagClick(day)} $isActive={activeTag === day}>
                  {day}
                </StyledDayTag>
              ))}
            </Space>
          </Flex>
        ) : (
          <Flex>
            <StyledInput
              value={frequency}
              onChange={(e) => onFrequencyChange(e.target.value)}
              id="frequency"
              placeholder="Enter frequency"
              autoComplete="off"
            />
            <Space size="small">
              {WEEK_TAGS.map((week) => (
                <StyledDayTag key={week} onClick={() => onDayTagClick(week.toString())} $isActive={activeTag === week}>
                  {week}
                </StyledDayTag>
              ))}
            </Space>
          </Flex>
        )}

        <StyledButton onClick={() => openWeb3Modal()}>Connect</StyledButton>
      </Space>
    </Card>
  );
};

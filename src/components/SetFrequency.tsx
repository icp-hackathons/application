import { DAY_TAGS, WEEK_TAGS, MONTH_TAGS } from '@/modules/constants';
import { Unit } from '@/utils/convertFrequencyToSeconds';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { Card, Flex, Input, Space } from 'antd';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const FREQUENCY_PERIODS = ['Daily', 'Weekly', 'Monthly'];

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

type SetFrequencyProps = {
  frequency: string;
  onFrequencyChange: (value: string, units: Unit) => void;
};

export const SetFrequency = ({ frequency, onFrequencyChange }: SetFrequencyProps) => {
  const [activeTag, setActiveTag] = useState<number | null>(null);
  const [period, setPeriod] = useState(FREQUENCY_PERIODS[0]);

  const onTagClick = (tagNum: number, units: Unit) => {
    setActiveTag(tagNum);
    onFrequencyChange(tagNum.toString(), units);
  };

  useEffect(() => {
    setActiveTag(null);
    onFrequencyChange('0', 'day');
  }, [period]);

  const getFrequencyInput = (period: string) => {
    switch (period) {
      case 'Daily':
        return (
          <Flex>
            <StyledInput
              value={frequency}
              onChange={(e) => onFrequencyChange(e.target.value, 'day')}
              id="frequency"
              placeholder="How many days?"
              autoComplete="off"
            />
            <Space size="small">
              {DAY_TAGS.map((day) => (
                <StyledDayTag key={day} onClick={() => onTagClick(day, 'day')} $isActive={activeTag === day}>
                  {day}
                </StyledDayTag>
              ))}
            </Space>
          </Flex>
        );
      case 'Weekly':
        return (
          <Flex>
            <StyledInput
              value={frequency}
              onChange={(e) => onFrequencyChange(e.target.value, 'week')}
              id="frequency"
              placeholder="Enter frequency"
              autoComplete="off"
            />
            <Space size="small">
              {WEEK_TAGS.map((week) => (
                <StyledDayTag key={week} onClick={() => onTagClick(week, 'week')} $isActive={activeTag === week}>
                  {week}
                </StyledDayTag>
              ))}
            </Space>
          </Flex>
        );
      case 'Monthly':
        return (
          <Flex>
            <StyledInput
              value={frequency}
              onChange={(e) => onFrequencyChange(e.target.value, 'month')}
              id="frequency"
              placeholder="Enter frequency"
              autoComplete="off"
            />
            <Space size="small">
              {MONTH_TAGS.map((month) => (
                <StyledDayTag key={month} onClick={() => onTagClick(month, 'month')} $isActive={activeTag === month}>
                  {month}
                </StyledDayTag>
              ))}
            </Space>
          </Flex>
        );
    }
  };

  return (
    <Card
      title={
        <Flex gap="small">
          {FREQUENCY_PERIODS.map((p) => (
            <StyledTextTab key={p} $isActive={period === p} onClick={() => setPeriod(p)}>
              {p}
            </StyledTextTab>
          ))}
        </Flex>
      }
    >
      <Space size="middle" direction="vertical" style={{ width: ' 100%' }}>
        {getFrequencyInput(period)}
      </Space>
    </Card>
  );
};

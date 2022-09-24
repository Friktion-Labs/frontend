import { formatUSDForPrice } from "09/format09";
import { RedBar } from "09/glow09";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Popover } from "antd";
import { ColumnsType } from "antd/lib/table";
import { Button } from "common/components/Button";
import { AlamedaIcon } from "components/CustomIcon";
import { ProgressBar } from "components/ProgressBar";
import { WithBorrowers, WithUSDC } from "components/Table";
import { NoWrap, InfoI } from "components/VoltPerformance/VoltPerformance";

interface LendingTableType {
  key: string | number;
  borrowersIcon: React.ReactNode[];
  subVoltName: string;
  apy: number;
  yourDeposits: number;
  capacity: number;
  totalContributions: number;
}

export const lendingData: LendingTableType[] = [
  {
    key: "1",
    borrowersIcon: [<AlamedaIcon />, <AlamedaIcon />, <AlamedaIcon />],
    subVoltName: "Apollo",
    apy: 15,
    yourDeposits: 1000,
    capacity: 2000000,
    totalContributions: 254500,
  },
  {
    key: "2",
    borrowersIcon: [<AlamedaIcon />, <AlamedaIcon />, <AlamedaIcon />],
    subVoltName: "Athena",
    apy: 43.8,
    yourDeposits: 240,
    capacity: 3000000,
    totalContributions: 2545000,
  },
  {
    key: "3",
    borrowersIcon: [<AlamedaIcon />, <AlamedaIcon />, <AlamedaIcon />],
    subVoltName: "Apollo",
    apy: 6.9,
    yourDeposits: 10000,
    capacity: 20000000,
    totalContributions: 20000000,
  },
  {
    key: "4",
    borrowersIcon: [<AlamedaIcon />, <AlamedaIcon />, <AlamedaIcon />],
    subVoltName: "Apollo",
    apy: 69,
    yourDeposits: 0,
    capacity: 690000,
    totalContributions: 42000,
  },
  {
    key: "5",
    borrowersIcon: [<AlamedaIcon />, <AlamedaIcon />, <AlamedaIcon />],
    subVoltName: "Apollo",
    apy: 69,
    yourDeposits: 0,
    capacity: 690000,
    totalContributions: 42000,
  },
  {
    key: "6",
    borrowersIcon: [<AlamedaIcon />, <AlamedaIcon />, <AlamedaIcon />],
    subVoltName: "Apollo",
    apy: 69,
    yourDeposits: 0,
    capacity: 690000,
    totalContributions: 42000,
  },
  {
    key: "7",
    borrowersIcon: [<AlamedaIcon />, <AlamedaIcon />, <AlamedaIcon />],
    subVoltName: "Apollo",
    apy: 69,
    yourDeposits: 0,
    capacity: 690000,
    totalContributions: 42000,
  },
  {
    key: "8",
    borrowersIcon: [<AlamedaIcon />, <AlamedaIcon />, <AlamedaIcon />],
    subVoltName: "Apollo 5",
    apy: 69,
    yourDeposits: 0,
    capacity: 690000,
    totalContributions: 42000,
  },
  {
    key: "9",
    borrowersIcon: [<AlamedaIcon />, <AlamedaIcon />, <AlamedaIcon />],
    subVoltName: "Apollo 4",
    apy: 69,
    yourDeposits: 0,
    capacity: 690000,
    totalContributions: 42000,
  },
  {
    key: "10",
    borrowersIcon: [<AlamedaIcon />, <AlamedaIcon />, <AlamedaIcon />],
    subVoltName: "Apollo 3",
    apy: 69,
    yourDeposits: 0,
    capacity: 690000,
    totalContributions: 42000,
  },
  {
    key: "11",
    borrowersIcon: [<AlamedaIcon />, <AlamedaIcon />, <AlamedaIcon />],
    subVoltName: "Apollo 2",
    apy: 69,
    yourDeposits: 0,
    capacity: 690000,
    totalContributions: 42000,
  },
];

export const columns: (onClick: () => void) => ColumnsType<LendingTableType> = (
  onClick
) => [
  {
    title: "borrowers",
    dataIndex: "borrowersIcon",
    key: "borrowersIcon",
    render: (borrowersIcon, { subVoltName }) => (
      <WithBorrowers
        borrowersIcon={borrowersIcon}
        popoverContent={subVoltName}
      />
    ),
  },
  {
    title: "Subvolt",
    dataIndex: "subVoltName",
    key: "subVoltName",
    render: (subVoltName) => (
      <div
        css={css`
          font-weight: 600;
        `}
      >
        {subVoltName}
      </div>
    ),
  },
  {
    title: (
      <Popover
        destroyTooltipOnHide
        placement={"bottom"}
        css={css`
          cursor: pointer;
        `}
        content="Something here"
      >
        <NoWrap>
          APY
          <InfoI />
        </NoWrap>
      </Popover>
    ),
    dataIndex: "apy",
    key: "apy",
    render: (apy) => <div>{apy}%</div>,
  },
  {
    title: (
      <Popover
        destroyTooltipOnHide
        placement={"bottom"}
        css={css`
          cursor: pointer;
        `}
        content="Something here"
      >
        <NoWrap>
          your deposits
          <InfoI />
        </NoWrap>
      </Popover>
    ),
    dataIndex: "yourDeposits",
    key: "yourDeposits",
    render: (yourDeposits) => <WithUSDC amount={yourDeposits} />,
  },
  {
    title: (
      <Popover
        destroyTooltipOnHide
        placement={"bottom"}
        css={css`
          cursor: pointer;
        `}
        content="Something here"
      >
        <NoWrap>
          Capacity
          <InfoI />
        </NoWrap>
      </Popover>
    ),
    dataIndex: "capacity",
    key: "capacity",
    render: (capacity, { totalContributions, yourDeposits }) => {
      const currentProgress = Math.max(
        5,
        Math.min(190, (totalContributions / capacity) ** 0.9 * 185 + 5)
      );
      return (
        <CapacityContainer>
          <div>
            {formatUSDForPrice(capacity)} - {currentProgress.toFixed(1)}%
          </div>
          <ProgressBar
            background="#3B3E4D"
            progressHeight={4}
            currentProgress={currentProgress}
            barComponent={<RedBar />}
          />
        </CapacityContainer>
      );
    },
  },
  {
    title: "Action",
    key: "action",
    render: (_, { yourDeposits }) => {
      const isDeposit = !!yourDeposits;
      return (
        <Button
          variant={isDeposit ? "outline-primary" : "primary"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick();
          }}
        >
          {isDeposit ? "Manage loan" : "Deposit"}
        </Button>
      );
    },
  },
];

const CapacityContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

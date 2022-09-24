import styled from "@emotion/styled";
import { css } from "@emotion/react";

import { Popover } from "antd";
import type { ColumnsType } from "antd/lib/table";
import { FunctionComponent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Table, WithBorrowers, WithUSDC } from "../Table";
import { VoltCard } from "../VoltCard";
import { Card } from "../../common/components/Card";
import { ProgressBar } from "../ProgressBar";

import { formatUSDForPrice } from "../../09/format09";
import { InfoI, NoWrap } from "../VoltPerformance/VoltPerformance";
import { RedBar } from "../../09/glow09";
import { Button as ButtonCommon } from "common/components/Button";
import { AlamedaIcon, ListIcon } from "../CustomIcon";
import GridViewIcon from "@mui/icons-material/GridView";

interface LendingTableType {
  key: string | number;
  borrowersIcon: React.ReactNode[];
  subVoltName: string;
  apy: number;
  yourDeposits: number;
  capacity: number;
  totalContributions: number;
}

const data: LendingTableType[] = [
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

export const LendingOption: FunctionComponent<{ onClick: () => void }> = ({
  onClick,
}) => {
  const [isShowGrid, setIsShowGrid] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window
      .matchMedia("(min-width: 490px)")
      .addEventListener("change", () => setIsShowGrid(false));
  }, []);

  const columns: ColumnsType<LendingTableType> = [
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
            <CapacityText>
              {formatUSDForPrice(capacity)} - {currentProgress.toFixed(1)}%
            </CapacityText>
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

  return (
    <LendingOptionContainer>
      <LendingOptionWrapper>
        <Title>Lending options</Title>
        <ViewOption onClick={() => setIsShowGrid(!isShowGrid)}>
          <>
            {isShowGrid ? <GridViewIcon /> : <ListIcon />}
            <span>{isShowGrid ? "Grid" : "List"}</span>
          </>
        </ViewOption>
      </LendingOptionWrapper>
      {isShowGrid ? (
        <Table
          columns={columns}
          dataSource={data}
          onRow={(record) => {
            return {
              onClick: () =>
                navigate(record.subVoltName, {
                  state: {
                    ...record,
                  },
                }),
            };
          }}
        />
      ) : (
        <ListView>
          {data.map((item) => (
            <VoltCard {...item} onDeposit={onClick} />
          ))}
        </ListView>
      )}
    </LendingOptionContainer>
  );
};

const LendingOptionContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 26px;
`;

const LendingOptionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  ${(props) => props.theme.typography.bodyXl}
  color: #ffffff;
`;

const ViewOption = styled(Card)<{ onClick: () => void }>`
  width: 78px;
  height: 40px;
  & > div:first-child {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 6px 8px;
    border-radius: 6px;
    background: ${({ theme }) =>
      theme.palette.mode === "dark" ? "#323441" : "#ffffffb3"};
    border: ${({ theme }) =>
      theme.palette.mode === "dark" ? "none" : "1px solid #8d94a01a;"};
  }

  & span {
    font-weight: 500;
    ${(props) => props.theme.typography.bodyS}
  }
  ${({ theme }) => {
    const color = theme.palette.mode === "dark" ? "#CECED8" : "#5D5D64";
    return `
      & span {
        color: ${color};
      }
      & svg {
        color: ${color};
      }
    `;
  }};
`;

const Button = styled(ButtonCommon)`
  border-radius: 8px;
  padding: 7px 8px;
  min-width: 96px;
  min-height: 0;
`;

const CapacityContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CapacityText = styled.div``;

export const ListView = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  justify-content: space-around;
  align-items: center;
  gap: 18px;
`;

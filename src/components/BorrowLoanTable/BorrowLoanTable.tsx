import { FunctionComponent } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import type { ColumnsType } from "antd/lib/table";
import { Popover } from "antd";
import moment from "moment";

import { RowTableData, Table, WithUSDC } from "../Table";
import { NoWrap } from "../VoltPerformance/VoltPerformance";

interface BorrowLoanTableType {
  key: string | number;
  counterParty: {
    borrowIconPath: string;
    name: string;
  };
  startDate: string;
  loanAmount: number;
  collateral: string | undefined;
  apy: number;
  term: string;
  status: string;
}

const HelpIcon = ({ alt }: { alt: string }) => {
  return (
    <img
      height="16"
      width="16"
      css={css`
        margin-left: 4px;
      `}
      src={require("../../09/greatLogos/logos/help.png")}
      alt={alt}
    />
  );
};

const columns: ColumnsType<BorrowLoanTableType> = [
  {
    title: "COUNTERPARTY",
    dataIndex: "counterParty",
    key: "counterParty",
    render: ({ borrowIconPath, name }) => (
      <RowTableData>
        <img height="32" width="32" src={borrowIconPath} alt={name} />
        <div
          css={css`
            font-weight: 500;
          `}
        >
          {name}
        </div>
      </RowTableData>
    ),
  },
  {
    title: "Start date",
    dataIndex: "startDate",
    key: "startDate",
    render: (startDate) => {
      return (
        <div
          css={css`
            font-weight: 500;
          `}
        >
          {moment(startDate).format("LL")}
        </div>
      );
    },
  },
  {
    title: "Loan amount",
    dataIndex: "loanAmount",
    key: "loanAmount",
    render: (loanAmount) => <WithUSDC amount={loanAmount} />,
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
        <NoWrap
          css={css`
            display: flex;
            align-items: center;
          `}
        >
          Collateral
          <HelpIcon alt="collaretal" />
        </NoWrap>
      </Popover>
    ),
    dataIndex: "collateral",
    key: "collateral",
    render: (collateral) => {
      if (collateral) {
        return (
          <RowTableData>
            <img
              height="24"
              width="24"
              src={require("../../09/greatLogos/logos/USDC.png")}
              alt="usdc"
            />
            <div>{collateral}</div>
          </RowTableData>
        );
      }
      return (
        <div
          css={(theme) => css`
            color: ${theme.palette.grey[400]};
          `}
        >
          Uncollateralized
        </div>
      );
    },
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
        <NoWrap
          css={css`
            display: flex;
            align-items: center;
          `}
        >
          APY
          <HelpIcon alt="apy" />
        </NoWrap>
      </Popover>
    ),
    dataIndex: "apy",
    key: "apy",
    render: (apy) => <div>{apy}%</div>,
  },
  {
    title: "Term",
    dataIndex: "term",
    key: "term",
    render: (term) => <div>{term}</div>,
  },
  {
    title: "status",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <Status>
        <div>{status}</div>
        <div>
          {`${status === "Active" ? "Maturing" : "Matured"}`} 11 Oct ‘22
        </div>
      </Status>
    ),
  },
  {
    title: "Tx",
    key: "tx",
    render: (_) => (
      <div>
        <img
          height="20"
          width="20"
          src={require("../../09/greatLogos/logos/open.svg")}
          alt="open"
        />
      </div>
    ),
  },
];

const data: BorrowLoanTableType[] = [
  {
    key: "1",
    startDate: new Date().toDateString(),
    counterParty: {
      borrowIconPath: require("../../09/greatLogos/logos/ALAMEDA.svg"),
      name: "Alameda Labs",
    },
    apy: 10,
    loanAmount: 12000000,
    collateral: "200 BTC",
    term: "2 years",
    status: "Active",
  },
  {
    key: "2",
    startDate: new Date().toDateString(),
    counterParty: {
      borrowIconPath: require("../../09/greatLogos/logos/MAVEN11.svg"),
      name: "Maven11 Capital",
    },
    apy: 10,
    loanAmount: 12000000,
    collateral: "3000 SOL",
    term: "2 years",
    status: "Mature",
  },
  {
    key: "3",
    startDate: new Date().toDateString(),
    counterParty: {
      borrowIconPath: require("../../09/greatLogos/logos/MAVEN11.svg"),
      name: "Maven11 Capital",
    },
    apy: 10,
    loanAmount: 12000000,
    collateral: undefined,
    term: "2 years",
    status: "Mature",
  },
];

export const BorrowLoanTable: FunctionComponent = () => {
  return <Table columns={columns} dataSource={data} />;
};

const Status = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  & div:first-child {
    font-weight: 500;
  }
  & div:last-child {
    color: ${(props) => props.theme.palette.grey[400]};
  }
`;

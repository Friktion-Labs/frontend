import { FunctionComponent } from "react";
import { css } from "@emotion/react";
import type { ColumnsType } from "antd/lib/table";
import moment from "moment";

import { Table, WithTerm, WithUSDC } from "../Table";
import { ChipLabel, ChipColors } from "../ChipLabel";

interface ApplicationsTableType {
  key: string | number;
  startDate: string;
  volt: string;
  apr: number;
  loanAmount: number;
  rePayments: string;
  firstPayment: string;
  term: {
    years: string;
    date: string;
  };
  status: string;
}

const columns: ColumnsType<ApplicationsTableType> = [
  {
    title: "START DATE",
    dataIndex: "startDate",
    key: "startDate",
    render: (startDate) => {
      return (
        <div
          css={css`
            font-weight: 500;
          `}
        >
          {moment(startDate).format("DD MMM YYYY")}
        </div>
      );
    },
  },
  {
    title: "VOLT",
    dataIndex: "volt",
    key: "volt",
    render: (volt) => <div>{volt}</div>,
  },
  {
    title: "APR",
    dataIndex: "apr",
    key: "apr",
    render: (apr) => <div>{apr}%</div>,
  },
  {
    title: "LOAN AMOUNT",
    dataIndex: "loanAmount",
    key: "loanAmount",
    render: (loanAmount) => <WithUSDC amount={loanAmount} />,
  },
  {
    title: "REPAYMENTS",
    dataIndex: "rePayments",
    key: "rePayments",
    render: (rePayments) => <div>{rePayments}</div>,
  },
  {
    title: "FIRST PAYMENT",
    dataIndex: "firstPayment",
    key: "firstPayment",
    render: (firstPayment) => {
      return (
        <div
          css={css`
            font-weight: 500;
          `}
        >
          {moment(firstPayment).format("DD MMM 'YY")}
        </div>
      );
    },
  },
  {
    title: "TERM",
    dataIndex: "term",
    key: "term",
    render: (term) => <WithTerm {...term} />,
  },
  {
    title: "STATUS",
    dataIndex: "status",
    key: "status",
    render: (status) => {
      let chipColor = ChipColors.Success;
      if (status === "In review") {
        chipColor = ChipColors.Warning;
      }
      if (status === "Rejected") {
        chipColor = ChipColors.Danger;
      }
      return <ChipLabel color={chipColor}>{status}</ChipLabel>;
    },
  },
  {
    title: "ACTION",
    key: "action",
    render: (_) => (
      <div>
        <img
          height="20"
          width="20"
          src={require("../../09/greatLogos/logos/edit.svg")}
          alt="edit"
        />
      </div>
    ),
  },
];

const data: ApplicationsTableType[] = [
  {
    key: "1",
    startDate: new Date().toDateString(),
    volt: "Apollo",
    apr: 10,
    loanAmount: 12000000,
    rePayments: "All at maturity",
    firstPayment: new Date().toDateString(),
    term: {
      years: "2 years",
      date: "11 May '24",
    },
    status: "In review",
  },
  {
    key: "2",
    startDate: new Date().toDateString(),
    volt: "Apollo",
    apr: 10,
    loanAmount: 12000000,
    rePayments: "Monthly",
    firstPayment: new Date().toDateString(),
    term: {
      years: "2 years",
      date: "11 May '24",
    },
    status: "Rejected",
  },
  {
    key: "3",
    startDate: new Date().toDateString(),
    volt: "Apollo",
    apr: 10,
    loanAmount: 12000000,
    rePayments: "Monthly",
    firstPayment: new Date().toDateString(),
    term: {
      years: "2 years",
      date: "11 May '24",
    },
    status: "Accepted",
  },
];

export const ApplicationsTable: FunctionComponent = () => {
  return <Table columns={columns} dataSource={data} />;
};

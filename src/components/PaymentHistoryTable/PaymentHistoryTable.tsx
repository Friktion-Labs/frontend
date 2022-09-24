import { FunctionComponent } from "react";
import { css } from "@emotion/react";
import type { ColumnsType } from "antd/lib/table";
import moment from "moment";

import { Table, WithUSDC } from "../Table";

interface PaymentHistoryTableType {
  key: string | number;
  date: string;
  amount: number;
  rePayments: string;
  paymentsMade: string;
  nextPaymentDate: string;
}

const columns: ColumnsType<PaymentHistoryTableType> = [
  {
    title: "DATE",
    dataIndex: "date",
    key: "date",
    render: (date) => {
      return (
        <div
          css={css`
            font-weight: 500;
          `}
        >
          {moment(date).format("DD MMM 'YY")}
        </div>
      );
    },
  },
  {
    title: "AMOUNT",
    dataIndex: "amount",
    key: "amount",
    render: (amount) => <WithUSDC amount={amount} />,
  },
  {
    title: "REPAYMENTS",
    dataIndex: "rePayments",
    key: "rePayments",
    render: (rePayments) => <div>{rePayments}</div>,
  },
  {
    title: "PAYMENTS MADE",
    dataIndex: "paymentsMade",
    key: "paymentsMade",
    render: (paymentsMade) => <div>{paymentsMade}</div>,
  },
  {
    title: "NEXT PAYMENT DATE",
    dataIndex: "nextPaymentDate",
    key: "nextPaymentDate",
    render: (nextPaymentDate) => {
      return (
        <div
          css={css`
            font-weight: 500;
          `}
        >
          {moment(nextPaymentDate).format("DD MMM 'YY")}
        </div>
      );
    },
  },
  {
    title: "TX",
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

const data: PaymentHistoryTableType[] = [
  {
    key: "1",
    date: new Date().toDateString(),
    amount: 12000000,
    rePayments: "All at maturity",
    paymentsMade: "1/10",
    nextPaymentDate: new Date().toDateString(),
  },
  {
    key: "2",
    date: new Date().toDateString(),
    amount: 120000,
    rePayments: "Monthly",
    paymentsMade: "3/24",
    nextPaymentDate: new Date().toDateString(),
  },
];

export const PaymentHistoryTable: FunctionComponent = () => {
  return <Table columns={columns} dataSource={data} />;
};

import styled from "@emotion/styled";
import { css } from "@emotion/react";

import type { ColumnsType } from "antd/lib/table";
import moment from "moment";
import { FunctionComponent, useState } from "react";

import { ChipLabel, ChipColors } from "../ChipLabel";
import { Table, WithTerm, WithUSDC } from "../Table";
import { RepayLoanModal, CompletedModal } from "../Modals/";

import { Button as ButtonCommon } from "common/components/Button";

interface LoanTableType {
  key: string | number;
  startDate: string;
  volt: string;
  apr: number;
  loanAmount: number;
  rePayments: string;
  nextPayment: {
    total: number;
    yourMoneyPaid: number;
    day?: string;
  };
  term: {
    years: string;
    date: string;
  };
}

const data: LoanTableType[] = [
  {
    key: "1",
    startDate: new Date().toDateString(),
    volt: "Apollo",
    apr: 10,
    loanAmount: 12000000,
    rePayments: "All at maturity",
    nextPayment: {
      total: 12000000,
      yourMoneyPaid: 12000000,
      day: new Date().toDateString(),
    },
    term: {
      years: "2 years",
      date: "11 May '24",
    },
  },
  {
    key: "2",
    startDate: new Date().toDateString(),
    volt: "Apollo",
    apr: 10,
    loanAmount: 12000000,
    rePayments: "Monthly",
    nextPayment: {
      total: 12000000,
      yourMoneyPaid: 0,
      day: new Date().toDateString(),
    },
    term: {
      years: "2 years",
      date: "11 May '24",
    },
  },
];

export const LoanTable: FunctionComponent = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCompletedModalVisible, setIsCompletedModalVisible] = useState(false);

  const columns: ColumnsType<LoanTableType> = [
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
            {moment(startDate).format("LL")}
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
      title: "NEXT PAYMENT",
      dataIndex: "nextPayment",
      key: "nextPayment",
      render: ({ yourMoneyPaid, total }) => {
        const isPaid = yourMoneyPaid === total;
        const isLate = yourMoneyPaid === 0;
        return (
          <NextPayment>
            <div>
              {yourMoneyPaid.toLocaleString("en-US")} /{" "}
              {total.toLocaleString("en-US")} USDC
            </div>
            <ChipLabel color={isLate ? ChipColors.Primary : ChipColors.Success}>
              {isPaid && "Paid"}
              {isLate && "30d left"}
            </ChipLabel>
          </NextPayment>
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
      title: "Action",
      key: "action",
      render: ({ apr, loanAmount, rePayments, nextPayment, term }) => {
        const currentInstalment = (loanAmount * (apr + 100)) / 100 / 12; // mock logic
        return (
          <>
            <RepayLoanModal
              isModalVisible={isModalVisible}
              handleOk={() => setIsModalVisible(false)}
              handleCancel={() => setIsModalVisible(false)}
              setIsCompletedModalVisible={setIsCompletedModalVisible}
              apy={apr}
              loanAmount={loanAmount}
              currentInstalment={currentInstalment}
              payment={`${moment(term.date).format(
                "DD / MM"
              )} (${rePayments} for ${term.years})`}
              dueDate={`In 3 days (${moment(nextPayment.day).format(
                "DD MM YYYY"
              )})`}
              walletBalance={1000}
            />
            <Button
              variant="outline-primary"
              onClick={() => setIsModalVisible(true)}
            >
              Pay now
            </Button>
          </>
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

  return (
    <>
      <CompletedModal
        handleOk={() => setIsCompletedModalVisible(false)}
        handleCancel={() => setIsCompletedModalVisible(false)}
        isModalVisible={isCompletedModalVisible}
        title={Date.now() % 2 === 0 ? "Loan fully repaid" : "Instalment paid"}
        description="Thank you."
      />
      <Table columns={columns} dataSource={data} />
    </>
  );
};

const Button = styled(ButtonCommon)`
  cursor: pointer;
  padding: 7px 8px;
  min-width: 80px;
  min-height: 0;
`;

const NextPayment = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 6px;
`;

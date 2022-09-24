import { FunctionComponent } from "react";
import styled from "@emotion/styled";
import type { ColumnsType } from "antd/lib/table";
import moment from "moment";

import { Table, RowTableData, WithTerm } from "../Table";
import { WithUSDC } from "../Table";
import { AlamedaIcon } from "../CustomIcon";
import { useNavigate } from "react-router";

interface SubVoltLoansTableType {
  key: string | number;
  borrower: {
    borrowIconPath: React.ReactNode;
    name: string;
  };
  startDate: string;
  loanAmount: number;
  rePayments: string;
  term: {
    years: string;
    date: string;
  };
  apr: number;
}

const data: SubVoltLoansTableType[] = [
  {
    key: "1",
    borrower: {
      borrowIconPath: <AlamedaIcon />,
      name: "Alameda Labs",
    },
    startDate: new Date().toDateString(),
    loanAmount: 12000000,
    apr: 10,
    rePayments: "All at maturity",
    term: {
      years: "2 years",
      date: new Date().toDateString(),
    },
  },
  {
    key: "2",
    borrower: {
      borrowIconPath: <AlamedaIcon />,
      name: "Alameda Labs",
    },
    startDate: new Date().toDateString(),
    loanAmount: 12000000,
    apr: 10,
    rePayments: "All at maturity",
    term: {
      years: "2 years",
      date: new Date().toDateString(),
    },
  },
  {
    key: "3",
    borrower: {
      borrowIconPath: <AlamedaIcon />,
      name: "Alameda Labs",
    },
    startDate: new Date().toDateString(),
    loanAmount: 12000000,
    apr: 10,
    rePayments: "All at maturity",
    term: {
      years: "2 years",
      date: new Date().toDateString(),
    },
  },
];

export const SubVoltLoansTable: FunctionComponent = () => {
  const navigate = useNavigate();

  const columns: ColumnsType<SubVoltLoansTableType> = [
    {
      title: "BORROWER",
      dataIndex: "borrower",
      key: "borrower",
      render: ({ borrowIconPath, name }) => (
        <RowWrapper>
          {borrowIconPath}
          <div>{name}</div>
        </RowWrapper>
      ),
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      key: "startDate",
      render: (startDate) => {
        return <div>{moment(startDate).format("DD MMM YYYY")}</div>;
      },
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
      title: "TERM",
      dataIndex: "term",
      key: "term",
      render: (term) => <WithTerm {...term} />,
    },
    {
      title: "APR",
      dataIndex: "apr",
      key: "apr",
      render: (apr) => <div>{apr}%</div>,
    },
    {
      title: "ACTION",
      key: "action",
      render: (_, { borrower }) => {
        return (
          <Action>
            <div onClick={() => navigate("lending/" + borrower.name)}>
              <img
                height="20"
                width="20"
                src={require("../../09/greatLogos/logos/eye.svg")}
                alt="view subvolt"
              />
            </div>
            <div>
              <img
                height="20"
                width="20"
                src={require("../../09/greatLogos/logos/checked.svg")}
                alt="checked subvolt"
              />
            </div>
            <div>
              <img
                height="20"
                width="20"
                src={require("../../09/greatLogos/logos/trash.svg")}
                alt="delete subvolt"
              />
            </div>
          </Action>
        );
      },
    },
  ];

  return <Table columns={columns} dataSource={data} />;
};

const Action = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2px;

  & div {
    padding: 10px;
    cursor: pointer;
  }
`;
const RowWrapper = styled(RowTableData)`
  font-family: "Euclid Circular B";
  font-weight: 500;
`;

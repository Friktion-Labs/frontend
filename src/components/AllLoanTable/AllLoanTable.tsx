import { FunctionComponent } from "react";
import styled from "@emotion/styled";
import type { ColumnsType } from "antd/lib/table";

import { Table, WithUSDC, WithBorrowers } from "../Table";
import { AlamedaIcon } from "../CustomIcon";

interface AllLoanTableType {
  key: string | number;
  volt: string;
  lenderType: string;
  totalDeposits: number;
  totaLoaned: number;
  utilisationRate: number;
  lenders: number;
  borrowersIcon: React.ReactNode[];
}

const columns: ColumnsType<AllLoanTableType> = [
  {
    title: "VOLT",
    dataIndex: "volt",
    key: "volt",
    render: (volt) => <Volt>{volt}</Volt>,
  },
  {
    title: "LENDER TYPE",
    dataIndex: "lenderType",
    key: "lenderType",
    render: (lenderType) => <div>{lenderType}</div>,
  },
  {
    title: "TOTAL DEPOSITS",
    dataIndex: "totalDeposits",
    key: "totalDeposits",
    render: (totalDeposits) => <WithUSDC amount={totalDeposits} />,
  },
  {
    title: "TOTAL LOANED",
    dataIndex: "totaLoaned",
    key: "totaLoaned",
    render: (totaLoaned) => <WithUSDC amount={totaLoaned} />,
  },
  {
    title: "UTILISATION RATE",
    dataIndex: "utilisationRate",
    key: "utilisationRate",
    render: (utilisationRate) => <div>{utilisationRate}%</div>,
  },
  {
    title: "LENDERS",
    dataIndex: "lenders",
    key: "lenders",
    render: (lenders) => <div>{lenders.toLocaleString("en-US")}</div>,
  },
  {
    title: "BORROWERS",
    dataIndex: "borrowersIcon",
    key: "borrowersIcon",
    render: (borrowersIcon) => {
      return <WithBorrowers borrowersIcon={borrowersIcon} />;
    },
  },
  {
    title: "ACTION",
    key: "action",
    render: (_) => (
      <Action>
        <div>
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
            src={require("../../09/greatLogos/logos/trash.svg")}
            alt="delete subvolt"
          />
        </div>
      </Action>
    ),
  },
];

const data: AllLoanTableType[] = [
  {
    key: "1",
    volt: "Apollo",
    lenderType: "Permissioned",
    totalDeposits: 12000000,
    totaLoaned: 1200000,
    utilisationRate: 80,
    lenders: 1350,
    borrowersIcon: [<AlamedaIcon />, <AlamedaIcon />, <AlamedaIcon />],
  },
  {
    key: "2",
    volt: "Zeus",
    lenderType: "Permissionless",
    totalDeposits: 12000000,
    totaLoaned: 1200000,
    utilisationRate: 80,
    lenders: 1350,
    borrowersIcon: [
      <AlamedaIcon />,
      <AlamedaIcon />,
      <AlamedaIcon />,
      <AlamedaIcon />,
      <AlamedaIcon />,
      <AlamedaIcon />,
      <AlamedaIcon />,
      <AlamedaIcon />,
    ],
  },
  {
    key: "3",
    volt: "Hermes",
    lenderType: "Permissionless",
    totalDeposits: 12000000,
    totaLoaned: 1200000,
    utilisationRate: 80,
    lenders: 1350,
    borrowersIcon: [],
  },
];

export const AllLoanTable: FunctionComponent = () => {
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
const Volt = styled.div`
  font-weight: 500;
`;

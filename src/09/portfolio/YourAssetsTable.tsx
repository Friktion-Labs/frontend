import { ColumnsType } from "antd/lib/table";
import { Card09Props } from "../Card10";
import {
  AllSymbolsUnion,
  GlobalId,
  SubvoltDef10,
  VoltNumber,
} from "../registry10";
import { CustomTable } from "./CustomTable";
import styled from "@emotion/styled";
import { useMarkPrices } from "../MarkPrices10";
import { VoltBadge } from "../VoltBadge";
import { StatusButton } from "./StatusButton";
import { NetReturnData } from "./PortfolioPage";
import { css } from "@emotion/react";
import { ManualUniversalAssetLogo } from "../UniversalAssetLogo";
import { formatUSDAdaptable } from "../format09";

export interface YourAssetsTableType {
  key: string | number;
  volt: VoltNumber;
  def: SubvoltDef10;
  depositAmount: string;
  depositTokenSymbol: string;
  underlyingTokenSymbol: string;
  optionType: string | undefined;
  usdcAmount: number | null;
  netReturn: string;
  netReturnUsdc: number | null;
  netReturnIsPositive: boolean | null;
  voltTokenAmount: string;
  winRate: string;
  isHighVoltage: boolean;
  status: UserDepositStatus;
  pendingAmount: string | null;
}

export enum UserDepositStatus {
  ActivelyEarning,
  PendingDeposit,
  PendingWithdrawal,
}

const columns: ColumnsType<YourAssetsTableType> = [
  {
    title: "VOLT",
    dataIndex: "volt",
    key: "volt",
    render: (volt) => <VoltBadge volt={volt} />,
  },
  {
    title: "DEPOSIT",
    dataIndex: "depositAmount",
    key: "depositAmount",
    render: (
      depositAmount,
      { depositTokenSymbol, optionType, underlyingTokenSymbol }
    ) => (
      <SymbolAndText>
        <LogoHolder>
          <ManualUniversalAssetLogo
            mainSymbol={depositTokenSymbol as AllSymbolsUnion}
            secondarySymbol={
              optionType === "call"
                ? undefined
                : (underlyingTokenSymbol as AllSymbolsUnion)
            }
          />
        </LogoHolder>
        <div>{depositAmount}</div>
      </SymbolAndText>
    ),
  },
  {
    title: "VALUE",
    dataIndex: "usdcAmount",
    key: "usdcAmount",
    render: (usdcAmount) => (
      <div>{usdcAmount !== null ? formatUSDAdaptable(usdcAmount) : "..."}</div>
    ),
    sorter: {
      compare: (a, b) => {
        const aAmount = a.usdcAmount === null ? 0 : a.usdcAmount;
        const bAmount = b.usdcAmount === null ? 0 : b.usdcAmount;
        return aAmount - bAmount;
      },
      multiple: 1,
    },
  },
  {
    title: "NET RETURN",
    dataIndex: "netReturn",
    key: "netReturn",
    render: (netReturn, { netReturnUsdc, netReturnIsPositive }) => (
      <Column
        css={css`
          line-height: 1.3;
        `}
      >
        <div>{`${netReturn}`}</div>
        <div
          css={css({
            color:
              netReturnIsPositive === null
                ? "hsl(230, 15%, 60%)"
                : netReturnIsPositive
                ? "#00c137"
                : "#EF3A25",
          })}
        >
          {netReturnUsdc !== null && netReturnIsPositive !== null
            ? `${netReturnIsPositive ? "+" : "-"}${formatUSDAdaptable(
                Math.abs(netReturnUsdc)
              )}`
            : "..."}
        </div>
      </Column>
    ),
    sorter: {
      compare: (a, b) => {
        const aAmount = a.netReturnUsdc === null ? 0 : a.netReturnUsdc;
        const bAmount = b.netReturnUsdc === null ? 0 : b.netReturnUsdc;
        return aAmount - bAmount;
      },
      multiple: 2,
    },
  },
  {
    title: "VOLT TOKENS",
    dataIndex: "voltTokenAmount",
    key: "voltTokenAmount",
    render: (voltTokenAmount, { depositTokenSymbol }) => (
      // <SymbolAndText>
      //   <img
      //     width={20}
      //     height={20}
      //     src={ImportantAssetLogos[depositTokenSymbol as AllSymbolsUnion]}
      //     alt={depositTokenSymbol}
      //   />
      //   <div>{voltTokenAmount}</div>
      // </SymbolAndText>
      <div>{voltTokenAmount}</div>
    ),
  },
  {
    title: "WIN RATE",
    dataIndex: "winRate",
    key: "winRate",
    render: (winRate) => <div>{winRate}</div>,
  },
  {
    title: "VOLTAGE",
    dataIndex: "isHighVoltage",
    key: "isHighVoltage",
    render: (isHighVoltage) => <div>{isHighVoltage ? "High" : "Low"}</div>,
  },
  {
    title: "STATUS",
    dataIndex: "status",
    key: "status",
    render: (status, { pendingAmount, def }) => (
      <StatusButton
        status={status}
        formattedAmount={`${pendingAmount ? pendingAmount : "..."}`}
        def={def}
      />
    ),
  },
];

export const YourAssetsTable: React.FC<{
  cards: Card09Props[];
  isLoading: boolean;
  disableClick: boolean;
  netReturnData: NetReturnData;
  winRateMap: Record<GlobalId, string | null>;
}> = ({ cards, isLoading, disableClick, netReturnData, winRateMap }) => {
  const { markPrices } = useMarkPrices();
  const data: Array<YourAssetsTableType | null> = isLoading
    ? []
    : cards
        .filter(
          (card) =>
            card.def &&
            card.deposits &&
            !(
              card.deposits.totalDeposits.isZero() &&
              card.deposits.pendingWithdrawals.isZero()
            )
        )
        .map((card) => {
          if (!card.def || !card.deposits) {
            return null;
          }
          const netReturnDataForId = netReturnData[card.def.globalId];
          const netReturn =
            netReturnDataForId !== null &&
            netReturnDataForId !== undefined &&
            netReturnDataForId.length > 0
              ? netReturnDataForId[0]
              : undefined;
          const netReturnUsdc =
            netReturnDataForId !== null &&
            netReturnDataForId !== undefined &&
            netReturnDataForId.length > 1
              ? netReturnDataForId[1]
              : null;
          const netReturnIsPositive =
            netReturn !== undefined ? netReturn >= 0 : null;

          return {
            key: card.def.globalId,
            volt: card.volt,
            def: card.def,
            depositAmount: `${card.def.depositToken.format(
              card.deposits.totalDeposits.toNumber()
            )}`,
            depositTokenSymbol: card.def.depositToken.symbol,
            underlyingTokenSymbol: card.def.underlying.symbol,
            optionType: card.def.optionType,
            usdcAmount:
              card.def.volt === 1 && markPrices
                ? card
                    .deposits!.totalDeposits.mul(
                      markPrices[card.def.underlying.symbol]
                    )
                    .toNumber()
                : card.def.volt === 1
                ? null
                : card.deposits.totalDeposits.toNumber(),
            netReturn:
              netReturn !== undefined
                ? card.def.depositToken.format(netReturn)
                : "...",
            netReturnUsdc:
              netReturnUsdc !== null && netReturnIsPositive !== undefined
                ? netReturnUsdc
                : null,
            netReturnIsPositive,
            voltTokenAmount: `${card.def.depositToken.format(
              card.deposits.sharesInWallet,
              card.def.shareTokenSymbol
            )}`,
            winRate: winRateMap[card.def.globalId] ?? "...",
            isHighVoltage:
              card.def.isVoltage !== undefined ? card.def.isVoltage : false,
            status: card.deposits.pendingDeposits.greaterThan(0)
              ? UserDepositStatus.PendingDeposit
              : card.deposits.pendingWithdrawals.greaterThan(0)
              ? UserDepositStatus.PendingWithdrawal
              : UserDepositStatus.ActivelyEarning,
            pendingAmount: card.deposits.pendingDeposits.greaterThan(0)
              ? `${card.def.depositToken.format(
                  card.deposits.pendingDeposits.toNumber()
                )}`
              : card.deposits.pendingWithdrawals.greaterThan(0)
              ? `${card.def.depositToken.format(
                  card.deposits.pendingWithdrawals.toNumber()
                )}`
              : null,
          };
        })
        .filter((r) => r !== null);

  return (
    <TableContainer>
      <AnotherContainer>
        <CustomTable
          columns={columns}
          dataSource={data}
          disableClick={disableClick}
        ></CustomTable>
      </AnotherContainer>
    </TableContainer>
  );
};

const TableContainer = styled.div`
  width: 100%;
  margin-top: 20px;
  overflow: auto;
`;

const AnotherContainer = styled.div`
  padding: 4px 40px;
`;

const SymbolAndText = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const LogoHolder = styled.div`
  display: flex;
  align-items: center;
  transform-origin: left center;
  transform: scale(0.6);
`;

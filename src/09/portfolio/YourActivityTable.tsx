import { ColumnsType } from "antd/lib/table";
import {
  AllSymbolsUnion,
  GlobalId,
  STRONG_SUBVOLTS,
  SubvoltDef10,
  VoltNumber,
} from "../registry10";
import { CustomTable } from "./CustomTable";
import styled from "@emotion/styled";
import { VoltBadge } from "../VoltBadge";
import { useQuery } from "react-query";
import moment from "moment";
import { ManualUniversalAssetLogo } from "../UniversalAssetLogo";
import {
  AsyncButton09,
  button09Reset,
  button09Standard,
  SquareA09,
  TableButton,
} from "../Button09";
import Select from "react-select";
import {
  generateSolanaFmLink,
  generateSolscanLink,
} from "../../hooks/useExplorerLink";
import LaunchIcon from "@mui/icons-material/Launch";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { css } from "@emotion/react";
import { CSVDownload } from "react-csv";
import { useCallback, useState } from "react";
import { Popover } from "antd";
import { useQuarantineChristmas10VFACWarningOnlyWorksWithCoveredCalls } from "../useChristmasCard10";
import { Card09Props } from "../Card10";
import { withdrawFromVolt1 } from "../transactionHandler";
import Decimal from "decimal.js";
import useOwnedTokenAccounts from "../../hooks/useOwnedTokenAccounts";
import { OwnedTokenAccountsContextT } from "../../contexts/OwnedTokenAccounts";
import { EpochCountdown } from "../FormattedCountdown";

export type ActivityAction = {
  Amount: number;
  DepositTokenSymbol: string;
  GlobalID: string;
  Hash: string;
  UnixTime: number;
  UserAction: string;
};

export interface YourActivityTableType {
  key: string | number;
  def: SubvoltDef10 | null;
  card: Card09Props | undefined;
  isStalkingAnotherWallet: boolean;
  ownedTokenAccountsContext: OwnedTokenAccountsContextT | undefined;
  volt: VoltNumber;
  depositTokenSymbol: string;
  underlyingTokenSymbol: string;
  optionType: string | undefined;
  amount: number | null;
  action: string;
  isHighVoltage: boolean;
  time: string;
  unixTime: number;
  hash: string;
  globalId: string;
}

const csvHeaders = [
  { label: "Time", key: "time" },
  { label: "Volt #", key: "volt" },
  { label: "Volt ID", key: "globalId" },
  { label: "Action", key: "action" },
  { label: "Amount", key: "amount" },
  { label: "Deposit Token", key: "depositTokenSymbol" },
  { label: "TX ID", key: "hash" },
];

const columns: ColumnsType<YourActivityTableType> = [
  {
    title: "VOLT",
    dataIndex: "volt",
    key: "volt",
    render: (volt) => <VoltBadge volt={volt} />,
  },
  {
    title: "AMOUNT",
    dataIndex: "amount",
    sorter: {
      compare: (a, b) => {
        const aAmount = a.amount === null ? 0 : a.amount;
        const bAmount = b.amount === null ? 0 : b.amount;
        return aAmount - bAmount;
      },
      multiple: 1,
    },
    key: "amount",
    render: (
      amount,
      { depositTokenSymbol, optionType, underlyingTokenSymbol, def, action }
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
        <div>
          {def && amount !== null
            ? `${action === "Withdraw" ? "≈ " : ""}${def.depositToken.format(
                amount
              )}`
            : ""}
          {def && amount !== null && action === "Withdraw" && (
            <Popover
              placement="bottom"
              content={
                <span
                  css={css`
                    display: block;
                    max-width: 200px;
                    font-size: 14px;
                    font-family: "Euclid Circular B";
                    text-align: center;
                  `}
                >
                  This shows an estimate of the withdraw, as the epoch is not
                  over yet.
                </span>
              }
            >
              <span
                css={css`
                  &:after {
                    content: " ⓘ";
                    font-size: 12px;
                    font-weight: bold;
                    font-family: "Euclid Circular B";
                    cursor: pointer;
                  }
                `}
              ></span>
            </Popover>
          )}
        </div>
      </SymbolAndText>
    ),
  },
  {
    title: "ACTION",
    dataIndex: "action",
    key: "action",
    render: (action) => <div>{action}</div>,
  },
  {
    title: "TIME",
    dataIndex: "time",
    key: "time",
    render: (
      time,
      {
        action,
        unixTime,
        card,
        ownedTokenAccountsContext,
        isStalkingAnotherWallet,
      }
    ) => (
      <Col>
        <div>{time}</div>
        {!isStalkingAnotherWallet &&
          action === "Withdraw" &&
          card !== undefined &&
          card.def !== null &&
          card.deposits !== null &&
          ownedTokenAccountsContext !== undefined &&
          (card.deposits.claimableWithdrawals.greaterThan(0) ||
            unixTime * 1000 > Date.now() - 6 * 24 * 60 * 60 * 1000) && (
            <div>
              {card.deposits.claimableWithdrawals.greaterThan(0) ? (
                <AsyncButton09
                  theme={card.volt}
                  disabled={false}
                  label={"Claim Withdraw"}
                  onClick={async (goodies) => {
                    await withdrawFromVolt1(
                      goodies,
                      card.def,
                      ownedTokenAccountsContext,
                      card.deposits?.estimatedTotalUnderlyingWithoutPending,
                      new Decimal(0),
                      "Claim Withdraw",
                      card.data?.extraVaultData ?? undefined
                    );
                  }}
                />
              ) : (
                <CountdownText>
                  Countdown to claim:{" "}
                  <EpochCountdown
                    isEntropy={card.def.optionType === undefined}
                  />
                </CountdownText>
              )}
            </div>
          )}
      </Col>
    ),
  },
  {
    title: "VOLTAGE",
    dataIndex: "isHighVoltage",
    key: "isHighVoltage",
    render: (isHighVoltage) => <div>{isHighVoltage ? "High" : "Low"}</div>,
  },
  {
    title: "TX",
    dataIndex: "hash",
    key: "hash",
    render: (hash, { globalId }) => (
      <SquareA09
        href={
          globalId.includes("_eth")
            ? generateSolanaFmLink(hash, "mainnet-beta")
            : generateSolscanLink(hash, "mainnet-beta")
        }
      >
        <LaunchIcon
          css={css`
            opacity: 0.8;
          `}
        />
      </SquareA09>
    ),
  },
];

enum SortMethod {
  TIME_NEWEST = "TIME_NEWEST",
  TIME_OLDEST = "TIME_OLDEST",
}

export const YourActivityTable: React.FC<{
  walletAddy: string | null;
  isStalkingAnotherWallet: boolean;
}> = ({ walletAddy, isStalkingAnotherWallet }) => {
  const vfac09 = useQuarantineChristmas10VFACWarningOnlyWorksWithCoveredCalls();
  const ownedTokenAccountsContext = useOwnedTokenAccounts();
  const [shouldDownloadCSV, setShouldDownloadCSV] = useState(false);
  type Op = { value: string; label: string };
  const options: Op[] = [
    {
      value: SortMethod.TIME_NEWEST,
      label: "Time (Newest)",
    },
    {
      value: SortMethod.TIME_OLDEST,
      label: "Time (Oldest)",
    },
  ];
  const [selectedSortOption, setSelectedSortOption] = useState<Op>(options[0]);

  const handleChange = useCallback((a: Op) => {
    if (a.value === "clear") {
      setSelectedSortOption(options[0]);
    } else {
      setSelectedSortOption(a);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activityQuery = useQuery<
    unknown,
    unknown,
    { userTransactions: ActivityAction[] }
  >(
    "activityQuery" + walletAddy,
    () => {
      if (!walletAddy) {
        return {};
      }
      return fetch(
        `https://solana-stream.prod.zettablock.com/graphql?query={userTransactions(userAddress:"${walletAddy}"){Hash,Amount,UnixTime,UserAction,GlobalID,DepositTokenSymbol}}`
      ).then((res) => res.json());
    },
    { staleTime: Infinity }
  );

  const activityMap: Record<string, ActivityAction> = {};
  if (activityQuery.data && activityQuery.data["userTransactions"]) {
    activityQuery.data["userTransactions"].forEach((action) => {
      activityMap[action.Hash] = action;
    });
  }

  const data: YourActivityTableType[] = Object.entries(activityMap)
    .map(([hash, action]) => {
      const def: SubvoltDef10 | undefined =
        STRONG_SUBVOLTS[action.GlobalID as GlobalId];
      return {
        key: hash,
        globalId: action.GlobalID,
        def: def,
        isStalkingAnotherWallet: isStalkingAnotherWallet,
        // only need ownedTokenAccountsContext for claim withdraws
        ownedTokenAccountsContext:
          action.UserAction === "Withdraw"
            ? ownedTokenAccountsContext
            : undefined,
        // only need card for claim withdraws
        card:
          action.UserAction === "Withdraw"
            ? vfac09.cards.find((card) => card.def?.globalId === def?.globalId)
            : undefined,
        volt: def ? def.volt : 1,
        depositTokenSymbol: action.DepositTokenSymbol,
        underlyingTokenSymbol: def ? def.underlying.symbol : "USDC",
        optionType: def ? def.optionType : undefined,
        amount: def
          ? def.depositToken.normalize(action.Amount).toNumber()
          : null,
        action: action.UserAction,
        isHighVoltage: def && def.isVoltage ? true : false,
        unixTime: action.UnixTime,
        time: moment.unix(action.UnixTime).format("MMMM Do YYYY, h:mm A"),
        hash: action.Hash,
      };
    })
    .sort((a, b) => {
      switch (selectedSortOption.value) {
        case SortMethod.TIME_NEWEST:
          return b.unixTime - a.unixTime;
        case SortMethod.TIME_OLDEST:
          return a.unixTime - b.unixTime;
        default:
          return b.unixTime - a.unixTime;
      }
    });

  const customStyles = {
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? "hsl(230, 15%, 22%)" : "inherit",
      fontFamily: "Euclid Circular B",
    }),
  };
  return (
    <Col>
      <TableControlsRow>
        <TableControlsText>Sort by</TableControlsText>
        <ViewOption>
          <Select
            styles={customStyles}
            options={options}
            value={selectedSortOption}
            classNamePrefix="react-select"
            //@ts-ignore // ugh i dont want to deal with this. its not infectious
            onChange={handleChange}
          />
        </ViewOption>
        <TableButton
          onClick={() => {
            setShouldDownloadCSV(true);
          }}
        >
          <FileDownloadOutlinedIcon /> Download .CSV
        </TableButton>
        {shouldDownloadCSV && (
          <CSVDownload
            data={data}
            headers={csvHeaders}
            filename="my-friktion-actions.csv"
            target="_blank"
          />
        )}
      </TableControlsRow>
      <TableContainer>
        <AnotherContainer>
          <CustomTable
            columns={columns}
            dataSource={data}
            disableClick={true}
          ></CustomTable>
        </AnotherContainer>
      </TableContainer>
    </Col>
  );
};

const Col = styled.div`
  display: flex;
  flex-direction: column;
`;

const TableControlsRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;
  z-index: 1;
  padding: 0 40px;
  gap: 15px;

  @media (max-width: 659px) {
    gap: 10px;
  }

  @media (max-width: 535px) {
    flex-direction: column;
    width: fit-content;
  }
`;

const TableContainer = styled.div`
  width: 100%;
  margin-top: 20px;
  overflow: auto;
`;

const AnotherContainer = styled.div`
  min-width: 681px;
  padding: 4px 40px;
`;

const CountdownText = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #a7a7b1;
`;

const SymbolAndText = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const LogoHolder = styled.div`
  display: flex;
  align-items: center;
  transform-origin: left center;
  transform: scale(0.6);
`;

const TableControlsText = styled.div`
  display: flex;
  font-size: 14px;
  font-family: "Euclid Circular B";
  align-items: center;
`;

export const ViewOption = styled.div`
  background: transparent;
  cursor: pointer;
  & span {
    font-family: "Euclid Circular B";
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 21px;
    color: #ceced8;
  }

  .react-select__control {
    ${button09Reset}
    ${button09Standard}
    display: flex;
    align-items: center;
    gap: 10px;
    line-height: 20px;
    padding: 0px 16px;
    color: #fff;
    background: transparent;
    user-select: none;
    text-shadow: 0 0.66px 0 rgba(0, 0, 0, 0.12);
    border: 2px solid #2a2a51;
    border-radius: 8px;
    font-family: "Euclid Circular B";
    min-width: inherit;

    @media (max-width: 659px) {
      font-size: 12px;
      padding: 0px 8px;
    }

    @media print {
      & {
        outline: 2px solid rgba(0, 0, 0, 0.2);
      }
    }

    box-shadow: none;

    .react-select__single-value {
      color: #fff !important;
    }
    .react-select__value-container {
      padding: 0 !important;
    }
    transition: 0.1s all ease-out;
  }
  .react-select__control:hover {
    background: #111122;
    border: 2px solid #2a2a51;
    /* animation: selectHoverAnim 0.3s ease-out forwards; */
  }
  .react-select__option:hover {
    background: hsl(230, 15%, 22%);
  }
  .react-select__indicator-separator {
    background-color: transparent;
    /* first place to uncomment if we want the separator (second place below) */
    /* @keyframes colorAnim {
        from {
          background-color: transparent;
        }
        to {
          background-color: hsl(0, 0%, 80%);
        }
      } */
  }
  /* .react-select__control:hover {
    animation: selectHoverAnim 0.3s ease-out forwards;
  } */
  /* second place to uncomment if we want the separator (first place above) */
  /* .react-select__control:hover .react-select__indicator-separator {
      animation: colorAnim 0.3s ease-out forwards;
    } */

  .react-select__menu {
    background: #0c0c0f;
    /* box-shadow: 0 0 16px rgba(0, 0, 0, 0.5); */
  }
`;

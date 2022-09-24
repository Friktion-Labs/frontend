import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { InlineDocMissingLink } from "./misc09";
import EditIcon from "@mui/icons-material/Edit";
import {
  SquareButton09,
  ConnectWalletButton09,
  AsyncButton09,
} from "./Button09";
import { useAppWallet } from "features/wallet";
import { useEffect, useState } from "react";
import { Card09Props } from "./Card10";
import { Popover } from "antd";
import {
  claimableWithdrawalsExplanation,
  pendingDepositsExplanation,
  pendingWithdrawalsExplanation,
} from "./textForTooltipsOnly";
import { VoltNumber } from "./VoltNumber";
import { apyFromData } from "./YieldTooltip";
import { SubvoltDef10, voltTitle } from "./registry10";
import { AutoUniversalAssetLogo } from "./UniversalAssetLogo";
import {
  cancelPendingDepositForVolt,
  cancelPendingWithdrawalsForVolt,
} from "./transactionHandler";
import useOwnedTokenAccounts from "../hooks/useOwnedTokenAccounts";
import { mintableVoltTokensExplanation } from "./textForTooltipsOnly";
import Bolt from "./friktionLogos/bolt80.png";
import { useAuctionResults } from "./AuctionResults";

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

// TODO: Format the numbers properly
export const YourPortfolio = ({
  cards,
  loading,
  openModal,
}: {
  cards: Card09Props[];
  loading: boolean;
  openModal: (globalId: string) => void;
}) => {
  const { publicKey } = useAppWallet();
  const ownedTokenAccountsContext = useOwnedTokenAccounts();
  const [keepWaiting, setKeepWaiting] = useState(true);
  const { yieldDataPerVolt } = useAuctionResults();

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setKeepWaiting(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (!publicKey) {
    return (
      <YourPortfolioRowContainer>
        <YourPortfolioRow className="noHover">
          <YourPortfolioRowEmpty>
            <ConnectWalletButton09 />
          </YourPortfolioRowEmpty>
        </YourPortfolioRow>
      </YourPortfolioRowContainer>
    );
  }

  let cardsLoading = false;
  for (const card of cards) {
    if (card.def && !card.deposits) {
      cardsLoading = true;
    }
  }

  if (loading || cardsLoading) {
    return (
      <YourPortfolioRowContainer>
        <YourPortfolioRow className="noHover">
          <YourPortfolioRowEmpty>Loading...</YourPortfolioRowEmpty>
        </YourPortfolioRow>
      </YourPortfolioRowContainer>
    );
  }

  let noneHavePending = true;
  let foundNoDepositsYet = true;

  const yourPortfolioRows = [];

  for (const card of cards) {
    const def = card.def;
    const data = card.data;

    // If null, this means info is not yet loaded. Otherwise data it would be 0
    const deposits = card.deposits;

    if (!def || !data || !deposits) {
      continue;
    }

    const pendingTableRows: React.ReactNode[] = [];

    // TODO: Hover to show price. see Card10 for example
    if (deposits.pendingDeposits.greaterThan(0)) {
      pendingTableRows.push(
        <tr key={`${def.depositToken.symbol}-pending-deposit`}>
          <td>{def.format(deposits.pendingDeposits)}</td>
          <td>
            <InlineDocMissingLink content={pendingDepositsExplanation}>
              Pending deposits
            </InlineDocMissingLink>
          </td>
        </tr>
      );
      if (
        (def.volt !== 3 && def.volt !== 4) ||
        (def.canDepositsBeTurnedOff() &&
          data.extraVaultData?.turnOffDepositsAndWithdrawals === false)
      ) {
        pendingTableRows.push(
          <tr key={`${def.depositToken.symbol}-cancel-pending-deposit`}>
            <td colSpan={2}>
              <AsyncButton09
                label={"Cancel Pending Deposit"}
                onClick={async (goodies) => {
                  await cancelPendingDepositForVolt(
                    goodies,
                    def,
                    ownedTokenAccountsContext
                  );
                }}
              />
            </td>
          </tr>
        );
      }
    }

    if (deposits.pendingWithdrawals.greaterThan(0)) {
      pendingTableRows.push(
        <tr key={`${def.depositToken.symbol}-pending-withdrawal`}>
          <td>{def.format(deposits.pendingWithdrawals)}</td>
          <td>
            <InlineDocMissingLink content={pendingWithdrawalsExplanation}>
              Pending withdrawals
            </InlineDocMissingLink>
          </td>
        </tr>
      );
      if (
        (def.volt !== 3 && def.volt !== 4) ||
        (def.requiresExtraVoltData() &&
          data.extraVaultData?.turnOffDepositsAndWithdrawals === false)
      ) {
        pendingTableRows.push(
          <tr key={`${def.depositToken.symbol}-cancel-pending-withdrawal`}>
            <td colSpan={2}>
              <AsyncButton09
                label={"Cancel Pending Withdrawal"}
                onClick={async (goodies) => {
                  await cancelPendingWithdrawalsForVolt(
                    goodies,
                    def,
                    ownedTokenAccountsContext
                  );
                }}
              />
            </td>
          </tr>
        );
      }
    }

    if (deposits.claimableWithdrawals.greaterThan(0)) {
      pendingTableRows.push(
        <tr key={`${def.depositToken.symbol}-claimable-withdrawal`}>
          <td>{def.format(deposits.claimableWithdrawals)}</td>
          <td>
            <InlineDocMissingLink content={claimableWithdrawalsExplanation}>
              Claimable withdrawals
            </InlineDocMissingLink>
          </td>
        </tr>
      );
    }

    if (deposits.mintableShares.greaterThan(0)) {
      pendingTableRows.push(
        <tr key={`${def.depositToken.symbol}-mintable-shares`}>
          <td>{def.format(deposits.mintableShares)}</td>
          <td>
            <InlineDocMissingLink content={mintableVoltTokensExplanation}>
              Mintable volt tokens
            </InlineDocMissingLink>
          </td>
        </tr>
      );
    }

    if (pendingTableRows.length > 0) {
      noneHavePending = false;
    }

    const depositOnlyTable = (
      <DepositTableWrapper css={depositTableWrapperDepositOnly}>
        <DepositTable>
          <tbody>
            <tr
              key={`${def.depositToken.symbol}-normal-deposit`}
              className={"depositOnly"}
            >
              <td>
                <Popover
                  destroyTooltipOnHide
                  placement="bottom"
                  content={
                    <span
                      css={css`
                        max-width: 250px;
                        display: inline-block;
                      `}
                    >
                      Your total deposits, including pending deposits; excluding
                      pending withdrawals
                    </span>
                  }
                >
                  {def.format(deposits.totalDeposits)}
                </Popover>
              </td>
            </tr>
          </tbody>
        </DepositTable>
      </DepositTableWrapper>
    );

    if (deposits.totalDeposits.greaterThan(0) || pendingTableRows.length > 0) {
      foundNoDepositsYet = false;
    }

    if (deposits.totalDeposits.isZero() && pendingTableRows.length === 0) {
      continue;
    }

    const yieldData = yieldDataPerVolt[def.globalId];

    yourPortfolioRows.push(
      <YourPortfolioRowInner key={def.globalId}>
        <YourPortfolioRow>
          <TitleContainer>
            <VoltTitle>
              <span>{voltTitle(card.volt)}</span>
              <VoltNumber voltNum={card.volt} />
            </VoltTitle>
            <AssetLogoWrapper>
              <AutoUniversalAssetLogo def={card.def} />
            </AssetLogoWrapper>
            <TitleTable>
              <tbody>
                <tr>
                  <td>{def.depositToken.name}</td>
                </tr>

                <tr>
                  <td>
                    <span>
                      {apyFromData(
                        data,
                        yieldData ? yieldData.averagedEpochYield : null
                      )}{" "}
                      APY
                    </span>
                  </td>
                </tr>
                <tr>
                  <VoltageAdornment def={def} />
                </tr>
              </tbody>
            </TitleTable>
          </TitleContainer>
          {depositOnlyTable}
          <DepositTableWrapper
            css={depositTableWrapperPendingOnly}
            className={pendingTableRows.length === 0 ? "empty" : ""}
          >
            <DepositTable>
              <tbody>{pendingTableRows}</tbody>
            </DepositTable>
          </DepositTableWrapper>
          <SquareButton09
            onClick={() => {
              openModal(def.globalId);
            }}
            css={css`
              opacity: 0.6;
              &:hover {
                opacity: 1;
              }

              @media only screen and (max-width: 940px) {
                align-self: center;
                margin: -5px 5px;
              }
            `}
          >
            <EditIcon />
          </SquareButton09>
        </YourPortfolioRow>
      </YourPortfolioRowInner>
    );
  }

  if (foundNoDepositsYet || yourPortfolioRows.length === 0) {
    if (keepWaiting) {
      return (
        <YourPortfolioRowContainer>
          <YourPortfolioRow className="noHover">
            <YourPortfolioRowEmpty>
              Loading...
              {isLocalhost ? "WE ARE LOADED = TRUE BUT FOUND NOTHING" : ""}
            </YourPortfolioRowEmpty>
          </YourPortfolioRow>
        </YourPortfolioRowContainer>
      );
    }
    return (
      <YourPortfolioRowContainer>
        <YourPortfolioRow className="noHover">
          <YourPortfolioRowEmpty>No deposits found</YourPortfolioRowEmpty>
        </YourPortfolioRow>
      </YourPortfolioRowContainer>
    );
  }
  return (
    <YourPortfolioRowContainer
      className={
        noneHavePending
          ? "noneHavePending yourPortfolioLoaded"
          : "yourPortfolioLoaded"
      }
    >
      {yourPortfolioRows}
    </YourPortfolioRowContainer>
  );
};

const VoltageAdornment = ({ def }: { def: SubvoltDef10 }) => {
  const isHighVoltage = def.isVoltage;
  const hasVoltage = def.highVoltage;

  return (
    <td
      css={css({
        display: isHighVoltage || hasVoltage ? "flex" : "none",
        alignItems: "center",
      })}
    >
      <img
        css={css({
          userSelect: "none",
          width: "16px",
          height: "16px",
          marginRight: "8px",
          filter:
            def.volt === 1
              ? "brightness(0) saturate(100%) invert(63%) sepia(77%) saturate(1620%) hue-rotate(159deg) brightness(98%) contrast(108%)"
              : def.volt === 2
              ? "brightness(0) saturate(100%) invert(64%) sepia(72%) saturate(4899%) hue-rotate(88deg) brightness(122%) contrast(123%)"
              : def.volt === 3
              ? "brightness(0) saturate(100%) invert(83%) sepia(69%) saturate(617%) hue-rotate(4deg) brightness(107%) contrast(102%)"
              : "brightness(0) saturate(100%) invert(61%) sepia(17%) saturate(1274%) hue-rotate(209deg) brightness(101%) contrast(98%)",
        })}
        src={Bolt}
        alt=""
      />
      <span
        css={css({
          color:
            def.volt === 1
              ? "#17c9ff"
              : def.volt === 2
              ? "#5ded39"
              : def.volt === 3
              ? "#ff0"
              : "#a695fc",
        })}
      >
        {isHighVoltage ? "High" : "Low"}
      </span>
      <img
        css={css({
          userSelect: "none",
          width: "16px",
          height: "16px",
          marginLeft: "8px",
          filter:
            def.volt === 1
              ? "brightness(0) saturate(100%) brightness(0) saturate(100%) invert(63%) sepia(77%) saturate(1620%) hue-rotate(159deg) brightness(98%) contrast(108%)"
              : def.volt === 2
              ? "brightness(0) saturate(100%) invert(64%) sepia(72%) saturate(4899%) hue-rotate(88deg) brightness(122%) contrast(123%)"
              : def.volt === 3
              ? "brightness(0) saturate(100%) invert(83%) sepia(69%) saturate(617%) hue-rotate(4deg) brightness(107%) contrast(102%)"
              : "brightness(0) saturate(100%) invert(61%) sepia(17%) saturate(1274%) hue-rotate(209deg) brightness(101%) contrast(98%)",
        })}
        src={Bolt}
        alt=""
      />
    </td>
  );
};

// We don't show totals, because earning yield is not a mixed strategy game.
// Thus, the ideal move is to have all of the tokens in one location.

const DepositTableWrapper = styled.div`
  @media only screen and (max-width: 940px) {
    /* width: 100%;
    order: 1; */
    display: flex;
    justify-content: center;
    margin-top: 0;
    margin-bottom: 0;
  }
  min-width: 250px;
  display: flex;
  justify-content: flex-end;
`;
const depositTableWrapperDepositOnly = css`
  min-width: 125px;
  text-align: right;

  margin-left: 10px;
  margin-right: 10px;
`;
const depositTableWrapperPendingOnly = css`
  .noneHavePending & {
    display: none;
  }
  min-width: 230px;
  text-align: right;

  @media only screen and (max-width: 940px) {
    &.empty {
      display: none;
    }
    margin: 2px 0;
  }
`;
const DepositTable = styled.table`
  tr.depositOnly {
    font-size: 18px;
  }
  tr:not(:first-child) {
    td {
      padding-top: 6px;
    }
  }
  td {
    text-align: right;
    line-height: 17px;
  }
  td:nth-of-type(1) {
    padding-right: 3px;
    white-space: nowrap;
  }
  td:nth-of-type(2) {
    text-align: left;
  }
  @media only screen and (max-width: 940px) {
    margin-top: 5px;
    margin-bottom: 5px;
  }
`;

const YourPortfolioRowContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const YourPortfolioRow = styled.div`
  position: relative;
  min-height: 104px; // Add a few pixels for better cross browser consistency
  padding: 25px 20px 25px 25px;
  flex-grow: 1;
  width: 100%;

  @media only screen and (max-width: 940px) {
    /* padding-bottom: 10px; // due to the pen and table having 5px to avoid colliding with each other */
  }

  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;

  border-radius: 4px;
  &:hover {
    background: linear-gradient(hsl(230, 15%, 19%), hsl(230, 15%, 15%) 80%);
    box-shadow: 0 -1px 0 0 hsl(230, 15%, 21%);
  }
  &,
  &:hover.noHover {
    background: linear-gradient(hsl(230, 15%, 15%), hsl(230, 15%, 11%) 80%);
    box-shadow: 0 -1px 0 0 hsl(230, 15%, 17%);
  }
  margin-bottom: 15px;
  &:last-child {
    margin-bottom: 0;
  }

  @media only screen and (max-width: 940px) {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }
`;

const YourPortfolioRowInner = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
`;
const YourPortfolioRowEmpty = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 55px;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;

  @media only screen and (max-width: 940px) {
    width: 100%;
    justify-content: center;
    margin-bottom: 10px;
  }

  @media only screen and (max-width: 940px) {
    margin-bottom: 5px;
  }
`;

const AssetLogoWrapper = styled.div`
  min-width: 80px;
  display: flex;
  justify-content: center;
`;
// Use tables for everything so they match up with pixel perfection
const TitleTable = styled.table`
  white-space: nowrap;
  @media only screen and (max-width: 940px) {
    min-width: 125px;
  }
  td {
    line-height: 17px;
  }
`;
const VoltTitle = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 2px;
  margin-right: 10px;
  min-width: 110px;

  @media only screen and (max-width: 940px) {
    min-width: 0;
    margin-right: 10px;
    white-space: nowrap;
  }
  @media only screen and (max-width: 450px) {
    margin-right: 10px;
  }
`;

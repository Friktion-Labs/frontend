import { Card09Props } from "09/Card10";
import { GlobalId, VoltNumber } from "09/registry10";
import { biggestYieldNumber } from "09/YieldTooltip";
import { getCapacityFilledPercent } from "./getCardStats";
import styled from "@emotion/styled";
import { lighten, darken } from "@mui/material";
import { button09Reset, button09Standard } from "09/Button09";
import { YieldDataForVolt } from "09/AuctionResults";

export enum SortMethod {
  YOUR_DEPOSITS = "YOUR_DEPOSITS",
  TOTAL_DEPOSITS = "TOTAL_DEPOSITS",
  APY = "APY",
  CAPACITY = "CAPACITY",
}

export type Op = { value: string; label: string };
export const sortOptions: Op[] = [
  {
    value: SortMethod.YOUR_DEPOSITS,
    label: "Your Deposits",
  },
  {
    value: SortMethod.TOTAL_DEPOSITS,
    label: "Total Deposits",
  },
  {
    value: SortMethod.APY,
    label: "APY",
  },
  {
    value: SortMethod.CAPACITY,
    label: "Capacity",
  },
];

export const customSelectOptionStyles = {
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected ? "hsl(230, 15%, 22%)" : "inherit",
    fontFamily: "Euclid Circular B",
  }),
};

export const voltageDefAdjustedCards = (
  cards: Card09Props[],
  yieldDataPerVolt: Record<GlobalId, YieldDataForVolt | null>,
  voltNumber?: VoltNumber,
  sortBy?: SortMethod,
  filterQuery?: string
): Card09Props[] => {
  let result = cards
    .filter((card) => {
      const yuh =
        !card.def?.isVoltage &&
        (voltNumber === undefined || card.volt === voltNumber) &&
        card.def?.globalId !== "mainnet_income_call_luna" &&
        card.def?.globalId !== "mainnet_income_put_luna";
      return filterQuery !== undefined
        ? yuh &&
            (card.underlyingAssetSymbol.toLowerCase().includes(filterQuery) ||
              card.quoteAssetSymbol.toLowerCase().includes(filterQuery) ||
              card.def?.underlying.name.toLowerCase().includes(filterQuery))
        : yuh;
    })
    .map((card) => {
      const highVoltageGlobalId = card.def?.highVoltage;
      if (highVoltageGlobalId) {
        const highVoltageCard = cards.find((card) => {
          return card.def && card.def.globalId === highVoltageGlobalId;
        });
        card.highVoltageDef = highVoltageCard ? highVoltageCard?.def : null;
        card.highVoltageData = highVoltageCard ? highVoltageCard?.data : null;
        card.highVoltageDeposits = highVoltageCard
          ? highVoltageCard?.deposits
          : null;
      }

      return card;
    });

  if (sortBy !== undefined) {
    switch (sortBy) {
      case "APY":
        result.sort((a, b) => {
          if (a.data && b.data) {
            const bYieldData = yieldDataPerVolt[b.def.globalId];
            const bAveragedEpochYield = bYieldData
              ? bYieldData.averagedEpochYield
              : null;
            const aYieldData = yieldDataPerVolt[a.def.globalId];
            const aAveragedEpochYield = aYieldData
              ? aYieldData.averagedEpochYield
              : null;
            return (
              (bAveragedEpochYield
                ? biggestYieldNumber(bAveragedEpochYield)
                : b.data.apy) -
              (aAveragedEpochYield
                ? biggestYieldNumber(aAveragedEpochYield)
                : a.data.apy)
            );
          } else if (a.data && b.data === null) {
            const aYieldData = yieldDataPerVolt[a.def.globalId];
            const aAveragedEpochYield = aYieldData
              ? aYieldData.averagedEpochYield
              : null;
            return -(aAveragedEpochYield
              ? biggestYieldNumber(aAveragedEpochYield)
              : a.data.apy);
          } else if (b.data && a.data === null) {
            const bYieldData = yieldDataPerVolt[b.def.globalId];
            const bAveragedEpochYield = bYieldData
              ? bYieldData.averagedEpochYield
              : null;
            return bAveragedEpochYield
              ? biggestYieldNumber(bAveragedEpochYield)
              : b.data.apy;
          } else {
            return 0;
          }
        });
        break;
      case "CAPACITY":
        result.sort(
          (a, b) => getCapacityFilledPercent(b) - getCapacityFilledPercent(a)
        );
        break;
      case "TOTAL_DEPOSITS":
        result.sort((a, b) => {
          if (a.data && b.data) {
            return (
              b.data.totalDeposits.mul(b.data.markPrice).toNumber() -
              a.data.totalDeposits.mul(a.data.markPrice).toNumber()
            );
          } else if (a.data && b.data === null) {
            return -a.data.totalDeposits.mul(a.data.markPrice).toNumber();
          } else if (b.data && a.data === null) {
            return b.data.totalDeposits.mul(b.data.markPrice).toNumber();
          } else {
            return 0;
          }
        });
        break;
      default:
        result.sort((a, b) => {
          if (a.deposits && a.data && b.deposits && b.data) {
            return (
              b.deposits.totalDeposits.mul(b.data.markPrice).toNumber() -
              a.deposits.totalDeposits.mul(a.data.markPrice).toNumber()
            );
          } else if (
            a.deposits &&
            a.data &&
            (b.deposits === null || b.data === null)
          ) {
            return -a.deposits.totalDeposits.mul(a.data.markPrice).toNumber();
          } else if (
            b.deposits &&
            b.data &&
            (a.deposits === null || a.data === null)
          ) {
            return b.deposits.totalDeposits.mul(b.data.markPrice).toNumber();
          } else {
            return 0;
          }
        });
    }
  }

  return result;
};

export const TableControlsRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;
  z-index: 2;
  gap: 24px;

  @media (max-width: 774px) {
    gap: 10px;
  }

  @media (max-width: 620px) {
    flex-direction: column;
  }

  @media (max-width: 899px) {
    justify-content: space-between;
  }
`;

export const SortByTextAndControlRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
`;

export const SortBySelect = styled.div`
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
    padding: 0px 0px 0px 12px;
    color: #fff;
    background: transparent;
    user-select: none;
    text-shadow: 0 0.66px 0 rgba(0, 0, 0, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    font-family: "Euclid Circular B";
    font-size: 16px;
    min-width: inherit;

    @media (max-width: 659px) {
      font-size: 12px;
      padding: 0px 0px 0px 8px;
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
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.15);
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

export const TableControlsText = styled.div`
  display: flex;
  font-size: 16px;
  font-family: "Euclid Circular B";
  align-items: center;
`;

export const SearchBox = styled.div`
  width: 320px;
  height: 42px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.15);
  gap: 8px;
  border-radius: 8px;
  padding: 0 12px;

  @media (max-width: 774px) {
    width: 220px;
  }

  @media (max-width: 620px) {
    width: 300px;
  }
`;

export const AmountInput = styled.input`
  font-family: "Euclid Circular B";
  font-size: 16px;
  position: relative;
  background: transparent;
  border: none;
  outline: none;
  line-height: 1.5;
  height: 30px;
  padding: 0;
  flex-grow: 1;
  width: 100%;
  z-index: 2;

  ::placeholder {
    font-family: "Euclid Circular B";
    color: ${({ theme }) => theme.palette.grey[500]};
    @media (max-width: 659px) {
      font-size: 12px;
    }
  }
  &:hover,
  &:focus {
    border-radius: 4px 0 0 4px;
    background: transparent;
    ::placeholder {
      color: ${({ theme }) =>
        theme.palette.mode === "dark"
          ? lighten(theme.palette.grey[500], 0.55)
          : darken(theme.palette.grey[500], 0.55)};
    }
  }

  @media (max-width: 659px) {
    font-size: 12px;
  }
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 10px;
`;
export const Col = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

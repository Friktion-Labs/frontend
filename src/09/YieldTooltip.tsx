import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { ProtectionDataPoint } from "./ProtectionData";
import { EpochRow, EpochYield, GlobalId, Subvolt1Data } from "./registry10";
// import React, { useEffect } from "react";
// import { newListingAPY } from "./textForTooltipsOnly";

export const YieldTooltip = (latestEpochYield: EpochYield) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      css={css`
        max-width: 240px;
      `}
    >
      {YieldTooltipInner(latestEpochYield)}
    </div>
  );
};

export const biggestYieldNumber = (averagedEpochYield: EpochYield) => {
  return (
    100 *
    (Math.pow(
      1 +
        (averagedEpochYield.epochYield / averagedEpochYield.epochLength) *
          (7 * 86400),
      365.2422 / 7
    ) -
      1)
  );
};

export const apyFromData = (
  data: Subvolt1Data | null,
  averagedEpochYield: EpochYield | null,
  decimals = 1
) => {
  if (!data) {
    return "...";
  }

  if (!averagedEpochYield || data.volt === 4 || data.volt === 5) {
    return data.apy.toFixed(decimals) + "%";
  }

  const apy = biggestYieldNumber(averagedEpochYield).toFixed(decimals) + "%";

  return apy;
};

export const apyFromDataNoPercentageSign = (
  data: Subvolt1Data | null,
  averagedEpochYield: EpochYield | null,
  decimals = 1,
  additionalBoostYield?: number | undefined
) => {
  if (!data) {
    return "...";
  }

  if (!averagedEpochYield || data.volt === 4 || data.volt === 5) {
    if (additionalBoostYield) {
      return (additionalBoostYield + data.apy).toFixed(decimals);
    }
    return data.apy.toFixed(decimals);
  }

  const apy = additionalBoostYield
    ? (additionalBoostYield + biggestYieldNumber(averagedEpochYield)).toFixed(
        decimals
      )
    : biggestYieldNumber(averagedEpochYield).toFixed(decimals);

  return apy;
};

export const apyNumberFromData = (
  data: Subvolt1Data,
  averagedEpochYield: EpochYield | null
) => {
  if (!averagedEpochYield) {
    return data.apy;
  }
  return biggestYieldNumber(averagedEpochYield);
};

// export const sevenDayYield = (averagedEpochYield: EpochYield) => {
// const color = averagedEpochYield.epochYield > 0 ? "#54b843" : "#ff6766";
// const NumberSpan = styled.span`
//   color: ${color};
//   font-weight: bold;
// `;
// return (
//   <>
//     <strong>Extrapolated yields</strong>
//     <br />
//     {!averagedEpochYield.epochYield ? (
//       "Epoch not yet complete"
//     ) : (
//       <>
//         <NumberSpan>
//           {(
//             ((100 * averagedEpochYield.epochYield) /
//               averagedEpochYield.epochLength) *
//             (7 * 86400)
//           ).toFixed(2)}
//           %{" "}
//         </NumberSpan>
//         7-day yield{" "}
//         <span
//           css={css`
//             opacity: 0.7;
//           `}
//         >
//           (current epoch)
//         </span>

export const YieldTooltipInner = (
  latestEpochYield: EpochYield,
  averagedEpochYield?: EpochYield,
  additionalBoostYield?: string
) => {
  const color = latestEpochYield.epochYield > 0 ? "#54b843" : "#ff6766";
  const NumberSpan = styled.span`
    color: ${color};
    font-weight: bold;
  `;

  const yieldForExtrapolation = averagedEpochYield
    ? averagedEpochYield
    : latestEpochYield;

  const crunchOnLatest = crunchYieldExtrapolations(latestEpochYield);
  const crunch = crunchYieldExtrapolations(yieldForExtrapolation);

  return (
    <div
      css={css`
        font-family: "Euclid Circular B";
      `}
    >
      {averagedEpochYield ? (
        <div
          css={css`
            margin-bottom: 8px;
          `}
        >
          <NumberSpan>{crunchOnLatest["7day"]}% </NumberSpan>
          7-day yield{" "}
          <span
            css={css`
              opacity: 0.7;
            `}
          >
            (current epoch)
          </span>
          <p
            css={css`
              font-size: 11px;
              line-height: 1.5 !important;
              margin-bottom: 0;
            `}
          >
            The "7-day yield" is calculated from only the latest epoch, scaled
            to 7 days.
          </p>
        </div>
      ) : null}

      <div
        css={css`
          /* margin-top: 8px; */
          margin-bottom: 0;
        `}
      >
        <strong css={css``}>Extrapolated premiums</strong>
      </div>
      {!yieldForExtrapolation.epochYield ? (
        "Epoch not yet complete"
      ) : (
        <>
          <NumberSpan>{crunch.WPY}% </NumberSpan>
          WPY{" "}
          <span
            css={css`
              opacity: 0.7;
            `}
          >
            (7-days)
          </span>
          <br />
          <NumberSpan>{crunch.MPY}% </NumberSpan>
          MPY{" "}
          <span
            css={css`
              opacity: 0.7;
            `}
          >
            (monthly)
          </span>
          <br />
          <NumberSpan>{crunch.APR}% </NumberSpan>
          APR{" "}
          <span
            css={css`
              opacity: 0.7;
            `}
          >
            (annually)
          </span>
          <br />
          <NumberSpan>{crunch.APYBeforeFees}% </NumberSpan>
          APY{" "}
          <span
            css={css`
              opacity: 0.7;
            `}
          >
            (compounded)
          </span>
          <br />
          <NumberSpan>{crunch.APYAfterFees}% </NumberSpan>
          APY{" "}
          <span
            css={css`
              opacity: 0.7;
            `}
          >
            (after fees)
          </span>
          <br />
        </>
      )}

      {additionalBoostYield && (
        <>
          <div
            css={css`
              margin-top: 8px;
            `}
          >
            <strong css={css``}>Additional Staking Boost</strong>
          </div>
          <>
            <NumberSpan>+{additionalBoostYield}</NumberSpan> APY{" "}
            <span
              css={css`
                opacity: 0.7;
              `}
            >
              (compounded)
            </span>
          </>
        </>
      )}
    </div>
  );
};

export const crunchYieldExtrapolations = (
  yieldForExtrapolation: EpochYield
) => {
  return {
    "7day": (
      ((100 * yieldForExtrapolation.epochYield) /
        yieldForExtrapolation.epochLength) *
      (7 * 86400)
    ).toFixed(2),
    WPY: (
      ((100 * yieldForExtrapolation.epochYield) /
        yieldForExtrapolation.epochLength) *
      (7 * 86400)
    ).toFixed(2),
    MPY: (
      (Math.pow(
        1 +
          (yieldForExtrapolation.epochYield /
            yieldForExtrapolation.epochLength) *
            (7 * 86400),
        4.3481428571
      ) -
        1) *
      100
    ).toFixed(2),
    APR: (
      ((100 * yieldForExtrapolation.epochYield) /
        yieldForExtrapolation.epochLength) *
      (365.2422 * 86400)
    ).toFixed(1),
    APYBeforeFees: biggestYieldNumber(yieldForExtrapolation).toFixed(1),
    APYAfterFees: (
      100 *
      (Math.pow(
        1 +
          ((yieldForExtrapolation.epochYield * 0.9) /
            yieldForExtrapolation.epochLength) *
            (7 * 86400),
        365.2422 / 7
      ) -
        1)
    ).toFixed(1),
  };
};

const cached30DayGrowth: Partial<Record<GlobalId, null | number | undefined>> =
  {};
export const calculate30DayGrowth = (
  globalId: GlobalId,
  auctionData: EpochRow[]
) => {
  if (cached30DayGrowth[globalId] !== undefined) {
    return cached30DayGrowth[globalId];
  }
  const epochRows = auctionData.filter((row) => row.globalId === globalId);
  let growth30 = null;
  if (epochRows.length > 0) {
    // loop through epochRows
    for (
      let iOfFirstInPast = 0;
      iOfFirstInPast < epochRows.length - 1;
      iOfFirstInPast++
    ) {
      const epochRow = epochRows[iOfFirstInPast];
      if (epochRow.endEpoch * 1000 > Date.now()) {
        continue;
      }
      // loop through epochRows and from the first row, sum up until we reach past 30 days in the past
      const latestExpiry = epochRows[iOfFirstInPast].endEpoch;
      let cumDays = 0;
      let multiplicativeYield = 1;
      for (let i = iOfFirstInPast; i < epochRows.length; i++) {
        const row = epochRows[i];
        const netRealizedPnl =
          row.realizedPnl > 0 ? 0.9 * row.realizedPnl : row.realizedPnl;

        const rowMultiplicativeYield = 1 + netRealizedPnl / row.balanceStart;

        if (row.startEpoch > latestExpiry - 30 * 86400) {
          multiplicativeYield *= rowMultiplicativeYield;
        } else if (cumDays < 30) {
          const remainingDaysAfterCum = 30 - cumDays;
          const fractionOfEpoch =
            (remainingDaysAfterCum * 86400) / (row.endEpoch - row.startEpoch);
          // Get the percent that this is within the 30 day boundary
          const scaledNetRPNL = netRealizedPnl * fractionOfEpoch;
          const scaledMultiplicativeYield =
            1 + scaledNetRPNL / row.balanceStart;
          multiplicativeYield *= scaledMultiplicativeYield;

          // console.log(
          //   cumDays,
          //   fractionOfEpoch,
          //   scaledNetRPNL / row.balanceStart,
          //   scaledMultiplicativeYield
          // );

          cumDays += (row.endEpoch - row.startEpoch) / 86400;
          break;
        } else {
          if (window.location.hostname === "localhost") {
            console.error("More than 30 cum Days. This is a bug!");
          }
          break;
        }
        cumDays += (row.endEpoch - row.startEpoch) / 86400;
      }
      if (cumDays >= 30) {
        growth30 = multiplicativeYield - 1;
      }
      break;
    }
  }

  cached30DayGrowth[globalId] = growth30;
};

const cachedYieldSinceInception: Partial<
  Record<GlobalId, null | number | undefined>
> = {};

/**
 * Needs to be multiplied by 100
 */
export const calculateYieldSinceInception = (
  globalId: GlobalId,
  auctionData: EpochRow[]
): number => {
  const cachedResult = cachedYieldSinceInception[globalId];
  if (cachedResult) {
    return cachedResult;
  }
  let multiplicativeYield = 1;

  const epochRows = auctionData.filter((row) => row.globalId === globalId);
  for (let i = 0; i < epochRows.length; i++) {
    const row = epochRows[i];
    const netRealizedPnl =
      row.realizedPnl > 0 ? 0.9 * row.realizedPnl : row.realizedPnl;

    // console.log(multiplicativeYield, epochRows);
    multiplicativeYield *= 1 + netRealizedPnl / row.balanceStart;
  }

  const yieldSinceInception = multiplicativeYield - 1;

  cachedYieldSinceInception[globalId] = yieldSinceInception;
  return yieldSinceInception;
};

export const calculate30DayYield = (
  globalId: GlobalId,
  auctionData: EpochRow[]
) => {
  const g = calculate30DayGrowth(globalId, auctionData);

  if (g) {
    return 100 * 2 * (Math.pow(g + 1, 6) - 1);
  } else {
    return g;
  }
};

export const FullYieldTooltip = (
  data: Subvolt1Data | null,
  averagedEpochYield: EpochYield | null,
  latestEpochYield: EpochYield | null,
  vol5Apy?: ProtectionDataPoint | null,
  additionalBoostYield?: string | undefined
) => {
  if (!data) {
    return "loading APY...";
  }
  if (data.volt === 5) {
    const NumberSpan = styled.span`
      color: #54b843;
      font-weight: bold;
    `;
    return (
      <span
        onClick={(e) => e.stopPropagation()}
        css={css`
          max-width: 230px;
          display: inline-block;
          font-family: "Euclid Circular B";
          position: relative;
        `}
      >
        <NumberSpan
          css={css`
            margin-left: 12px;
          `}
        >
          {vol5Apy && vol5Apy.lendingApy
            ? vol5Apy.lendingApy.toFixed(2)
            : "..."}
          %{" "}
        </NumberSpan>
        Base APY
        <br />
        <div
          css={css`
            position: absolute;
          `}
        >
          +
        </div>
        <NumberSpan
          css={css`
            margin-left: 12px;
          `}
        >
          {vol5Apy && vol5Apy.optionsApy
            ? vol5Apy.optionsApy.toFixed(2)
            : "..."}
          %{" "}
        </NumberSpan>
        Volatility APY
        <br />
        <div
          css={css`
            height: 1px;
            width: 150px;
            background: rgba(255, 255, 255, 0.7);
            margin-top: 2px;
            margin-bottom: 4px;
          `}
        />
        <NumberSpan
          css={css`
            margin-left: 12px;
          `}
        >
          {vol5Apy && vol5Apy.apy ? vol5Apy.apy.toFixed(2) : "..."}%{" "}
        </NumberSpan>
        Total
        <br />
        <div
          css={css`
            margin-top: 8px;
            display: flex;
            flex-direction: column;
            gap: 6px;
          `}
        >
          <div>
            <span
              css={css`
                font-weight: 500;
              `}
            >
              Base APY:
            </span>{" "}
            Current lending interest rate. A portion of interest earned is used
            to buy put options to hedge downside volatility weekly.
          </div>
          <div>
            <span
              css={css`
                font-weight: 500;
              `}
            >
              Volatility APY:
            </span>{" "}
            Calculated using{" "}
            <a
              href="https://friktionlabs.medium.com/volt-05-capital-protection-is-now-live-3c5761ec09c0"
              target="_blank"
              rel="noreferrer"
            >
              simulated
            </a>{" "}
            volatility levels from the last 1 year.
          </div>
        </div>
        <div
          css={css`
            margin-top: 8px;
          `}
        >
          <a
            href="https://docs.friktion.fi/products/capital-protection"
            target="_blank"
            rel="noreferrer"
          >
            Learn more
          </a>
        </div>
      </span>
    );
  }
  if (data.volt === 4) {
    return (
      <span
        onClick={(e) => e.stopPropagation()}
        css={css`
          max-width: 230px;
          display: inline-block;
          font-family: "Euclid Circular B";
        `}
      >
        For Volt #04 - Basis Yield, the apy is calculated as: Total funding /
        Time period where Time period is MIN(Time existing, 30 days)
      </span>
    );
  }
  return latestEpochYield && averagedEpochYield ? (
    <span
      onClick={(e) => e.stopPropagation()}
      css={css`
        max-width: 230px;
        display: inline-block;
        font-family: "Euclid Circular B";
      `}
    >
      {YieldTooltipInner(
        latestEpochYield,
        averagedEpochYield,
        additionalBoostYield
      )}
      <div
        css={css`
          margin-top: 8px;
        `}
      >
        <a
          href="https://docs.friktion.fi/products/faq/what-is-apy"
          target="_blank"
          rel="noreferrer"
        >
          Learn more
        </a>
      </div>
    </span>
  ) : (
    <span
      css={css`
        max-width: 200px;
        display: inline-block;
        font-family: "Euclid Circular B";
      `}
    >
      Loading...
    </span>
  );
};

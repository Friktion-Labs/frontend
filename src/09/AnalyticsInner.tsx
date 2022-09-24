import React, { useMemo } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import {
  BlueBar,
  BlueSpan,
  BlueParticlesRadial,
  BlueFillGlow,
  AlanGreenSpan,
  GreenBar,
  GreenParticlesRadial,
  GreenFillGlow,
  YellowSpan,
  PinkSpan,
  YellowBar,
  PinkBar,
  YellowFillGlow,
  PinkFillGlow,
  YellowParticlesRadial,
  PinkParticlesRadial,
  VioletSpan,
  VioletBar,
  VioletFillGlow,
  VioletParticlesRadial,
} from "./glow09";
import { DocLink, InlineDocMissingLink, InlineHoverDoc } from "./misc09";
import { Card09Props } from "./Card10";
import { useQuarantineChristmas10VFACWarningOnlyWorksWithCoveredCalls } from "./useChristmasCard10";
import profitRangeFormulaLong from "./voltPics/profitRangeFormulaLong.svg";
import {
  dontUseRoundLocaleN,
  formatUSDForPrice,
  formatUSDRoundDown,
  greatFloorLocaleN,
} from "./format09";
import { VoltPerformanceAndTitle } from "../components/VoltPerformance/VoltPerformance";
import {
  apyDisclaimerFragmentStartingWiththe,
  autoCompoundingExplanation,
  coingeckoPriceDisclaimer,
  performanceFeeExplanation,
  withdrawFeeExplanation,
} from "./textForTooltipsOnly";
import { matchPath, useLocation } from "react-router-dom";
import {
  AllEntropySymbolsUnion,
  CrabCardData,
  EpochRow,
  formatOptionProductShort,
  GlobalId,
  newGlobalIdToNull,
  parseOptionProduct,
  STRONG_SUBVOLTS,
} from "./registry10";
import moment from "moment";
import { HARDCODED_DEVNET_DATA } from "../components/VoltPerformance/hardcodedDevnetData";
import { TokenLink } from "./tokenLink";
import {
  AutoUniversalAssetLogo,
  MiniAssetLogo,
  MiniShareTokenLogo,
} from "./UniversalAssetLogo";
import {
  coingeckoConversionReal,
  isStablecoin,
  useMarkPrices,
} from "./MarkPrices10";
import { EpochCountdown } from "./FormattedCountdown";
import {
  calculate30DayGrowth,
  calculate30DayYield,
  calculateYieldSinceInception,
  crunchYieldExtrapolations,
} from "./YieldTooltip";
import { useQuery } from "react-query";
import { PriceAndStrikeChart, SharePricePlot } from "./AnalyticsGraphs";
import {
  useManagementModal,
  ZeroNineManagementModal,
} from "./ZeroNineManagementModal";
import { useCrabData } from "./CrabData";
import {
  generateSolanaFmLink,
  useExplorerLink,
} from "../hooks/useExplorerLink";
import { useAppConnection } from "features/connection";
import { Card10GroupWrapped } from "./Card10";
import { useAuctionResults } from "./AuctionResults";

interface Props {
  children?: React.ReactNode;
}

const NotFound: React.FC<Props> = (props) => (
  <div
    css={css`
      text-align: center;
      padding-top: 60px;
      padding-bottom: 60px;
    `}
  >
    Page not found for "{props.children}"
  </div>
);

export const AnalyticsInner: React.FC = () => {
  const { createExplorerLink } = useExplorerLink();
  const vfac09 = useQuarantineChristmas10VFACWarningOnlyWorksWithCoveredCalls();
  const location = useLocation();
  const { network } = useAppConnection();
  const { markPrices } = useMarkPrices();
  const { openModal, modalSesameBall } = useManagementModal();
  const { crabVoltData } = useCrabData();
  const { auctionData, yieldDataPerVolt } = useAuctionResults();

  const subpageMatch = matchPath(
    `/analytics/:shareTokenSymbol`,
    location.pathname
  );

  let shareTokenSymbol = subpageMatch?.params?.shareTokenSymbol;

  const def = Object.values(STRONG_SUBVOLTS)
    .filter((def) => def.network === "mainnet-beta")
    .find((def) => {
      return def.shareTokenSymbol === shareTokenSymbol;
    });

  const card = vfac09.cards.find(
    (card) => card.def?.globalId === def?.globalId
  );

  const sharePriceQuery = useQuery<unknown, unknown, [number, number][]>(
    "sharePrices" + def?.globalId,
    () => {
      if (!def) {
        throw new Error("No def");
      }
      return fetch(
        `https://api.friktion.fi/share_prices?GlobalID=${def.globalId}`
      ).then((res) => res.json());
    }
  );

  const coingeckoPriceQuery = useQuery<unknown, unknown, [number, number][]>(
    "coingeckoPrice" + def?.globalId,
    () => {
      if (!def) {
        throw new Error("No def");
      }
      return fetch(
        `https://api.friktion.fi/spot_prices_underlying?coingeckoId=${
          coingeckoConversionReal[def.underlying.symbol]
        }`
      ).then((res) => res.json());
    }
  );

  const winRateQuery = useQuery<
    unknown,
    unknown,
    Record<GlobalId, { win: number; count: number }>[]
  >(
    "winRateQuery",
    () => {
      return fetch("https://api.friktion.fi/win_rate").then((res) =>
        res.json()
      );
    },
    { staleTime: Infinity, retry: 3 }
  );
  const winRateMap: Record<GlobalId, string | null> = newGlobalIdToNull();
  if (winRateQuery.data) {
    winRateQuery.data.forEach((data) => {
      const entries = Object.entries(data);
      if (entries.length) {
        const reformattedData = entries[0];
        if (reformattedData.length > 1) {
          const id = reformattedData[0];
          const actualNumbers = reformattedData[1];
          if (actualNumbers) {
            winRateMap[
              id as GlobalId
            ] = `${actualNumbers.win}/${actualNumbers.count}`;
          }
        }
      }
    });
  }

  const allDataIncludingIrrelevantOnes: EpochRow[] | null = useMemo(() => {
    return network === "mainnet-beta" ? auctionData : HARDCODED_DEVNET_DATA;
  }, [network, auctionData]);

  if (!def || !card || !card.def) {
    return (
      <Wrapper>
        <NotFound>{shareTokenSymbol}</NotFound>
      </Wrapper>
    );
  }

  let crabCardData: CrabCardData | undefined;
  let allCardData: Card09Props = {
    ...card,
  };
  if (def.volt === 3 && markPrices) {
    const crabData =
      crabVoltData && def
        ? crabVoltData[def.underlying.symbol as AllEntropySymbolsUnion]
        : undefined;

    if (crabData && crabData.profitRangeLow && crabData.profitRangeHigh) {
      const markPrice = markPrices[def.underlying.symbol];
      const numDecimals = markPrice > 300 ? 0 : 2;
      const start = crabData.profitRangeLow.toFixed(numDecimals);
      const end = crabData.profitRangeHigh.toFixed(numDecimals);
      crabCardData = {
        start,
        end,
        markPrice: markPrice.toFixed(numDecimals),
      };
      allCardData = {
        ...card,
        crabCardData,
      };
    }
  }

  const compoundName =
    def.volt === 1
      ? def.depositToken.name
      : `${def.depositToken.symbol}-${def.underlying.symbol}`;

  document.title = `Friktion Analytics | Volt #0${def.volt} ${compoundName}`;

  const epochRows =
    allDataIncludingIrrelevantOnes === null
      ? []
      : allDataIncludingIrrelevantOnes.filter(
          (row) => row.globalId === def.globalId
        );

  const voltType =
    def.volt === 1
      ? "Volt #01: Generate Income"
      : def.volt === 2
      ? "Volt #02: Sustainable Stables"
      : def.volt === 3
      ? "Volt #03: Crab Strategy"
      : def.volt === 4
      ? "Volt #04: Basis Yield"
      : "Volt #05: Capital Protection";

  const underlyingName = def.globalId.toLowerCase().includes("high")
    ? def.underlying.name + " High Voltage"
    : def.underlying.name.includes("LIDO")
    ? "LIDO SOL"
    : def.underlying.name.includes("(")
    ? def.underlying.name.substring(0, def.underlying.name.indexOf("("))
    : def.underlying.name;
  const name =
    def.volt === 2 || def.volt === 3 || def.volt === 4
      ? `${def.depositToken.symbol}-${underlyingName}`
      : underlyingName;

  let ColorSpan: typeof BlueSpan;
  let ColorBar: typeof BlueBar;
  let ColorFillGlow: typeof BlueFillGlow;
  let ColorParticlesRadial: typeof GreenParticlesRadial;
  if (def.volt === 1) {
    ColorSpan = BlueSpan;
    ColorBar = BlueBar;
    ColorFillGlow = BlueFillGlow;
    ColorParticlesRadial = BlueParticlesRadial;
  } else if (def.volt === 2) {
    ColorSpan = AlanGreenSpan;
    ColorBar = GreenBar;
    ColorFillGlow = GreenFillGlow;
    ColorParticlesRadial = GreenParticlesRadial;
  } else if (def.volt === 3) {
    ColorSpan = YellowSpan;
    ColorBar = YellowBar;
    ColorFillGlow = YellowFillGlow;
    ColorParticlesRadial = YellowParticlesRadial;
  } else if (def.volt === 4) {
    ColorSpan = PinkSpan;
    ColorBar = PinkBar;
    ColorFillGlow = PinkFillGlow;
    ColorParticlesRadial = PinkParticlesRadial;
  } else if (def.volt === 5) {
    ColorSpan = VioletSpan;
    ColorBar = VioletBar;
    ColorFillGlow = VioletFillGlow;
    ColorParticlesRadial = VioletParticlesRadial;
  } else {
    ColorSpan = BlueSpan;
    ColorBar = BlueBar;
    ColorFillGlow = BlueFillGlow;
    ColorParticlesRadial = BlueParticlesRadial;
  }

  const averagedEpochYield = yieldDataPerVolt[def.globalId]?.averagedEpochYield;

  const latestEpochYield = yieldDataPerVolt[def.globalId]?.latestEpochYield;

  const averageCrunch = averagedEpochYield
    ? crunchYieldExtrapolations(averagedEpochYield)
    : null;
  const latestCrunch = latestEpochYield
    ? crunchYieldExtrapolations(latestEpochYield)
    : null;

  const g = auctionData
    ? calculate30DayGrowth(def.globalId, auctionData)
    : null;
  const dayYield30 = auctionData
    ? calculate30DayYield(def.globalId, auctionData)
    : null;

  const yieldSinceInception = auctionData
    ? calculateYieldSinceInception(def.globalId, auctionData)
    : null;
  const annualizedYieldSinceInception =
    yieldSinceInception !== null
      ? epochRows.length > 0
        ? 100 *
          (Math.pow(
            Math.pow(
              1 + yieldSinceInception,
              1 /
                ((epochRows[0].endEpoch -
                  epochRows[epochRows.length - 1].startEpoch) /
                  86400 /
                  7)
            ),
            365.2422 / 7
          ) -
            1)
        : null
      : null;
  // console.log(
  //   "Yield,",
  //   yieldSinceInception,
  //   annualizedYieldSinceInception,
  //   epochRows[0],
  //   epochRows[epochRows.length - 1],
  //   (epochRows[0].endEpoch - epochRows[epochRows.length - 1].startEpoch) /
  //     86400 /
  //     7,
  //   Math.pow(
  //     1 + yieldSinceInception,
  //     1 /
  //       ((epochRows[0].endEpoch - epochRows[epochRows.length - 1].startEpoch) /
  //         86400 /
  //         7)
  //   )
  // );
  // console.log(
  //   epochRows[0].endEpoch - epochRows[epochRows.length - 1].startEpoch
  // );
  if (window.location.hostname === "localhost") {
    if (Date.now() > 1670747320000) {
      // December 11 2022

      alert(
        "We need to update the 12-month growth to actually look at 12 months. We got away with not having to write that code because the protocol was younger than 12 months"
      );
    }
  }

  const lastTradedOption = yieldDataPerVolt[def.globalId]?.lastTradedOption;

  let latestOption = lastTradedOption
    ? parseOptionProduct(lastTradedOption.product)
    : null;
  if (typeof latestOption === "string") {
    latestOption = null;
  }

  const breakevenPrice =
    latestOption && latestCrunch
      ? def.volt === 1
        ? latestOption.strike * (1 + Number(latestCrunch["7day"]) / 100)
        : latestOption.strike * (1 - Number(latestCrunch["7day"]) / 100)
      : null;
  const breakevenDistance =
    markPrices && breakevenPrice
      ? breakevenPrice - markPrices[card.def.underlying.symbol]
      : null;
  const breakevenColor = breakevenDistance
    ? (def.volt === 1 ? breakevenDistance > 0 : breakevenDistance < 0)
      ? "#54b843"
      : "#ff6766"
    : "";

  const tokenSummary =
    def.volt === 1 || def.volt === 2 ? (
      <>
        <p>
          The {def.shareTokenSymbol} Volt generates growth by following a{" "}
          {def.volt === 1 ? (
            <DocLink href="https://docs.friktion.fi/volts/covered-call">
              covered call selling
            </DocLink>
          ) : (
            <DocLink href="https://docs.friktion.fi/volts/volt-02-sustainable-stables">
              protected put selling
            </DocLink>
          )}{" "}
          strategy. The vault sells out-of-the-money{" "}
          {def.volt === 1 ? "call options" : "put options"} and auto-compounds
          the premium into the deposit token at the end of every epoch.
        </p>
        <p>
          Option strikes and expiries are algorithmically determined to maximize
          your returns and minimize the chance of an option being called or
          underlying asset assigned.
        </p>
      </>
    ) : def.volt === 3 ? (
      <>
        {" "}
        <p>
          The {def.shareTokenSymbol} Volt generates yield in range-bound "crab"
          markets by running a delta-neutral automated volatility harvesting
          strategy. This Volt earns funding payments by putting on a short
          Power² perpetual position on entropy.trade while delta hedging with a
          long perp position. The Volt then auto-compounds the payments into the
          deposit token at the end of every epoch.
        </p>
        <p>
          The profit range is derived from funding collected on Entropy since
          the start of the Epoch. The range is centered on the{" "}
          <b>Rebalance Price</b>, or spot price at time of rebalance. Profit is
          maximized the closer the spot price is to this rebalance price.
        </p>
        <img
          src={profitRangeFormulaLong}
          alt="Profit range formula"
          css={css`
            width: 100%;
            margin-top: 6px;
          `}
        />
      </>
    ) : def.volt === 4 ? (
      <>
        <p>
          The {def.shareTokenSymbol} Volt runs a delta-neutral basis trading
          strategy. The USDC deposited by users is deployed into a long basis
          position on <DocLink href="https://mango.markets">Mango</DocLink>. The
          position longs{" "}
          <DocLink href="https://trade.mango.markets/?name=SOL/USDC">
            SOL-PERP
          </DocLink>{" "}
          and shorts SOL to delta-hedge. Epochs are resolved every Wednesday
          night (UTC). Large balance changes require a longer rebalance period.
          Learn more in our strategy{" "}
          <DocLink href="https://docs.friktion.fi/volts/basis-yield">
            documentation
          </DocLink>
          .
        </p>
      </>
    ) : def.volt === 5 ? (
      <>
        <p>The {def.shareTokenSymbol} Volt runs a change me change me.</p>
      </>
    ) : (
      <></>
    );

  const tokenRisk =
    def.volt === 1 || def.volt === 2 ? (
      <p>
        The Volt may incur a loss if the price of the underlying asset goes{" "}
        {def.volt === 2 ? "below" : "above"} the strike price and the option is
        exercised.
      </p>
    ) : def.volt === 3 ? (
      <>
        <p>
          The Volt may incur a loss if price moves outside a profit range over
          the next 24 hours, resulting in a loss in principal for that epoch.
          The Entropy exchange has risks which may affect performance including
          variable funding rates, slippage from rebalances, and smart contract
          risk.
        </p>
      </>
    ) : (
      <></>
    );

  const additionalRiskSection = (
    <p>
      This volt undergoes additional risk because it uses bridged assets. Read
      more about that{" "}
      <DocLink href="https://docs.friktion.fi/friktions-risk-management-tools/supported-assets">
        here
      </DocLink>
      .
    </p>
  );

  const sharePriceTooltip = `The price of 1 Friktion volt token. This amount is relative to the deposit token. For example, a volt token price of 1.05 means 1 ${def.shareTokenSymbol} may be redeemed for 1.05 ${def.depositToken.symbol}`;
  return (
    <Wrapper>
      <IntroWithCard>
        <IntroWithCardTitle>
          <ColorSpan
            css={css`
              /* padding-left: 10px; */

              @media only screen and (max-width: 660px) {
                padding-right: 100px;
              }

              @media only screen and (max-width: 470px) {
                padding-right: 10px;
              }
            `}
          >
            <IntroVoltName>{name}</IntroVoltName>
          </ColorSpan>
          <ColorBar
            css={css`
              /* min-width: 360px; */
              margin-top: 6px;
              margin-bottom: 10px;
            `}
          >
            <ColorFillGlow />
          </ColorBar>
          <ColorSpan
            css={css`
              /* padding-left: 10px; */

              @media only screen and (max-width: 660px) {
                padding-right: 100px;
              }

              @media only screen and (max-width: 470px) {
                padding-right: 10px;
              }
            `}
          >
            <IntroVoltType>{voltType}</IntroVoltType>
            <ColorParticlesRadial />
          </ColorSpan>
          <IntroLogo>
            <IntroLogoScaler>
              <AutoUniversalAssetLogo def={def} />
            </IntroLogoScaler>
          </IntroLogo>
        </IntroWithCardTitle>
        <Card10GroupWrapped card={allCardData} openModal={openModal} />
      </IntroWithCard>
      {epochRows.length > 0 ? (
        <SharePricePlot
          def={def}
          timeseries={sharePriceQuery.data}
          card={card}
        />
      ) : null}
      <PriceAndStrikeChart
        def={def}
        timeseries={coingeckoPriceQuery.data}
        epochRows={epochRows}
      />

      <BoringBoxContainer>
        <BoringBox>
          <BoringBoxCol>
            <BoringBoxSection>
              <BoringBoxTitle>
                <h3>
                  <ColorSpan>{def.shareTokenSymbol} Summary</ColorSpan>
                </h3>
              </BoringBoxTitle>
              <BoringBoxTitleSpacerWhenNoTable />
              {tokenSummary}
            </BoringBoxSection>
            <BoringBoxSection>
              <BoringBoxTitle>
                <h3>
                  <ColorSpan>Key Information</ColorSpan>{" "}
                  <BoringAsOf>As of {moment().format("ll")}</BoringAsOf>
                </h3>
              </BoringBoxTitle>
              <BoringRow>
                <BoringLabel>
                  <InlineHoverDoc
                    content={
                      "The time when the first epoch started and the deposits started earning. Users may have been able to deposit a week before this date."
                    }
                  >
                    Inception Date
                  </InlineHoverDoc>
                </BoringLabel>
                <BoringDatum>
                  {epochRows.length
                    ? moment(
                        Math.min(...epochRows.map((row) => row.startEpoch)) *
                          1000
                      ).format("ll")
                    : "Not yet started"}
                </BoringDatum>
              </BoringRow>
              <BoringRow>
                <BoringLabel>
                  <InlineHoverDoc
                    content={
                      "The number of epochs that have been started, including the current one."
                    }
                  >
                    Total Epoch Count
                  </InlineHoverDoc>
                </BoringLabel>
                <BoringDatum>{epochRows.length} epochs</BoringDatum>
              </BoringRow>
              <BoringRow>
                <BoringLabel>
                  <InlineHoverDoc
                    content={
                      "the number of epochs where there was no loss / the number of epochs that have been started, including the current one"
                    }
                  >
                    Win rate
                  </InlineHoverDoc>
                </BoringLabel>
                <BoringDatum>{winRateMap[def.globalId] ?? "-"}</BoringDatum>
              </BoringRow>
              {/* // Some had weird first epochs
            <BoringRow>
              <BoringLabel>
                <InlineHoverDoc
                  content={
                    "Calculated by comparing the current volt token price to the first recorded volt token price."
                  }
                >
                  Return since inception
                </InlineHoverDoc>
              </BoringLabel>
              <BoringDatum>{epochRows.length}</BoringDatum>
            </BoringRow> */}
              <BoringRow>
                <BoringLabel>Total Deposits</BoringLabel>
                <BoringDatum>
                  <MiniAssetLogo ultra={def.depositToken} />
                  {def.depositToken.format(card.data?.totalDeposits)}
                </BoringDatum>
              </BoringRow>
              <BoringRow>
                <BoringLabel>
                  <InlineHoverDoc
                    content={
                      "The limit of maximum amount of deposit tokens that can be deposited. The capacity helps ensures that the amount of tokens deposited can be reliably handled during options sales"
                    }
                  >
                    Capacity
                  </InlineHoverDoc>
                </BoringLabel>
                <BoringDatum>
                  <MiniAssetLogo ultra={def.depositToken} />
                  {isStablecoin(card.def.depositToken) ? "$" : ""}
                  {card.data
                    ? greatFloorLocaleN(card.def, card.data.capacity, 0)
                    : "..."}
                  {isStablecoin(card.def.depositToken) ? null : (
                    <> {card.def.depositToken.symbol}</>
                  )}
                  {card.data
                    ? " (" +
                      dontUseRoundLocaleN(
                        card.data.totalDeposits
                          .div(card.data.capacity)
                          .mul(100),
                        1
                      ) +
                      "%)"
                    : ""}
                </BoringDatum>
              </BoringRow>
              <BoringRow>
                <BoringLabel>
                  <InlineHoverDoc
                    content={
                      "The USD value of all deposits. Calculated by taking total deposits and multiplying by CoinGecko price"
                    }
                  >
                    Total Value Deposited
                  </InlineHoverDoc>
                </BoringLabel>
                <BoringDatum>
                  {card.data
                    ? formatUSDRoundDown(card.data?.totalDepositsUSD)
                    : "..."}
                </BoringDatum>
              </BoringRow>
              <BoringRow>
                <BoringLabel>
                  <InlineDocMissingLink content={performanceFeeExplanation}>
                    Performance Fee
                  </InlineDocMissingLink>
                </BoringLabel>
                <BoringDatum>10%</BoringDatum>
              </BoringRow>
              <BoringRow>
                <BoringLabel>
                  <InlineDocMissingLink content={withdrawFeeExplanation}>
                    Withdraw Fee
                  </InlineDocMissingLink>
                </BoringLabel>
                <BoringDatum>0.1%</BoringDatum>
              </BoringRow>
              <BoringRow>
                <BoringLabel>
                  <InlineDocMissingLink
                    content={
                      "Friktion does not charge a recurring management fee on any Volts. This line is only included to help users compare Friktion to other protocols that may charge a 2% management fee. There are currently no plans to add a recurring management fee, but governance voters have power to potentially change this"
                    }
                  >
                    Annualized Management Fee
                  </InlineDocMissingLink>
                </BoringLabel>
                <BoringDatum>0%</BoringDatum>
              </BoringRow>
            </BoringBoxSection>

            <BoringBoxSection>
              <BoringBoxTitle>
                <h3>
                  <ColorSpan>Risks</ColorSpan>
                </h3>
              </BoringBoxTitle>
              <BoringBoxTitleSpacerWhenNoTable />
              {tokenRisk}
              <p>
                Friktion is a decentralized protocol running on smart contracts
                on the{" "}
                <a href="https://solana.com/" target="_blank" rel="noreferrer">
                  Solana network
                </a>
                . There may be unforeseen smart contract risks. Solana
                blockchain transactions are irreversible, and you are solely
                responsible for the transactions you perform on the Solana
                network.
              </p>
              {def.volt === 1 &&
                def.underlying.name.includes("(") &&
                additionalRiskSection}
            </BoringBoxSection>
            <BoringBoxSection>
              <BoringBoxTitle>
                <h3>
                  <ColorSpan>Transparency & Accuracy</ColorSpan>
                </h3>
              </BoringBoxTitle>
              <BoringBoxTitleSpacerWhenNoTable />
              <p>
                Friktion aims to be the most transparent DeFi structured product
                protocol, and attempts to provide the most accurate information
                possible. This page shows 5 variations of APY to provide more
                transparency and help users make more informed conclusions when
                comparing to other protocols.
              </p>
              <p>
                If you notice any flaws, please share your findings with the
                community. Numbers and projections are an only observation of
                past performance. Past performance does not guarantee future
                results.
              </p>
            </BoringBoxSection>
          </BoringBoxCol>
          <BoringBoxCol>
            <BoringBoxSection>
              <BoringBoxTitle>
                <h3>
                  <ColorSpan>Trading Details</ColorSpan>{" "}
                  <BoringAsOf>As of {moment().format("ll")}</BoringAsOf>
                </h3>
              </BoringBoxTitle>
              <BoringRow>
                <BoringLabel>Volt Token Symbol</BoringLabel>
                <BoringDatum>
                  <MiniShareTokenLogo def={def} />
                  {card.data?.shareMint ? (
                    <a
                      href={createExplorerLink(
                        card.data?.shareMint.toBase58(),
                        card.data.globalId.includes("_eth")
                          ? generateSolanaFmLink
                          : undefined
                      )}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {def.shareTokenSymbol}
                    </a>
                  ) : (
                    def.shareTokenSymbol
                  )}
                </BoringDatum>
              </BoringRow>
              <BoringRow>
                <BoringLabel>
                  <InlineHoverDoc content={sharePriceTooltip}>
                    Volt Token Price
                  </InlineHoverDoc>
                </BoringLabel>
                <BoringDatum>
                  <MiniAssetLogo ultra={def.depositToken} />
                  {card.data ? card.data?.sharePrice.toFixed(5) : "..."}{" "}
                  {card.def.depositToken.symbol}
                </BoringDatum>
              </BoringRow>
              <BoringRow>
                <BoringLabel>
                  <InlineHoverDoc
                    content={
                      "The hypothetical amount of volt tokens outstanding if all volt tokens were minted. The actual circulating amount as seen on block explorers may be lower because minting is optional and not all users elect to mint their volt tokens"
                    }
                  >
                    Volt Tokens Outstanding
                  </InlineHoverDoc>
                </BoringLabel>
                <BoringDatum>
                  <MiniShareTokenLogo def={def} />

                  {card.data
                    ? def.depositToken.format(
                        card.data.totalDeposits.div(card.data.sharePrice),
                        def.shareTokenSymbol
                      )
                    : "..."}
                </BoringDatum>
              </BoringRow>
              <BoringRow>
                <BoringLabel>
                  <InlineHoverDoc
                    content={coingeckoPriceDisclaimer(
                      coingeckoConversionReal[card.def.underlying.symbol]
                    )}
                  >
                    {card.def.underlying.symbol} price
                  </InlineHoverDoc>
                </BoringLabel>
                <BoringDatum>
                  <a
                    href={`https://www.coingecko.com/en/coins/${
                      coingeckoConversionReal[card.def.underlying.symbol]
                    }`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {markPrices
                      ? formatUSDForPrice(
                          markPrices[card.def.underlying.symbol]
                        )
                      : "..."}
                  </a>
                </BoringDatum>
              </BoringRow>
              <BoringRow>
                <BoringLabel>
                  <InlineHoverDoc
                    content={
                      "The net asset value of 1 volt token in USD. This amount is net AFTER the 1% withdraw fee. It represents the value of 1 volt token if redeemed for the deposit token and sold for the price as quoted by CoinGecko"
                    }
                  >
                    Volt Token NAV
                  </InlineHoverDoc>
                </BoringLabel>
                <BoringDatum>
                  {card.data && markPrices
                    ? formatUSDForPrice(
                        card.data?.sharePrice
                          .mul(markPrices[card.def.depositToken.symbol])
                          .mul(0.999)
                          .toNumber()
                      )
                    : "..."}{" "}
                </BoringDatum>
              </BoringRow>
              {epochRows.length ? (
                def.optionType !== undefined ? (
                  <BoringRow>
                    <BoringLabel>
                      <InlineHoverDoc
                        content={
                          <div>
                            For the current epoch, the price of the underlying
                            at which the Volt will break even at if exercised.
                            The true breakeven point may slightly vary based on
                            the execution price when buying back the deposit
                            token.
                            <br />
                            <br />
                            <code>= spot price + latest premia</code>
                          </div>
                        }
                      >
                        Breakeven Price
                      </InlineHoverDoc>
                    </BoringLabel>
                    <BoringDatum>
                      {card.data && markPrices ? (
                        latestOption &&
                        breakevenPrice &&
                        breakevenDistance &&
                        breakevenColor ? (
                          <>
                            {formatUSDForPrice(breakevenPrice)}{" "}
                            <span
                              css={css`
                                color: ${breakevenColor} !important;
                              `}
                            >
                              (
                              {breakevenPrice >
                              markPrices[card.def.underlying.symbol]
                                ? "+"
                                : "-"}
                              {(
                                (breakevenDistance /
                                  markPrices[card.def.underlying.symbol]) *
                                100
                              )
                                .toFixed(1)
                                .replace("-", "")}
                              %)
                            </span>
                          </>
                        ) : (
                          "no data"
                        )
                      ) : (
                        "..."
                      )}
                    </BoringDatum>
                  </BoringRow>
                ) : (
                  <BoringRow>
                    <BoringLabel>
                      <InlineHoverDoc
                        content={
                          <div>
                            Spot price at time of Volt #03 Rebalance. Profit is
                            maximized the closer the spot price is to this
                            rebalance price.
                          </div>
                        }
                      >
                        Rebalance Price
                      </InlineHoverDoc>
                    </BoringLabel>
                    <BoringDatum>
                      {card.data && markPrices ? (
                        latestOption &&
                        breakevenPrice &&
                        breakevenDistance &&
                        breakevenColor ? (
                          <>{formatUSDForPrice(breakevenPrice)}</>
                        ) : (
                          "no data"
                        )
                      ) : (
                        "..."
                      )}
                    </BoringDatum>
                  </BoringRow>
                )
              ) : null}
              {def.optionType !== undefined && (
                <BoringRow>
                  <BoringLabel>Last Traded Option</BoringLabel>
                  <BoringDatum>
                    {!card.data
                      ? "..."
                      : lastTradedOption
                      ? formatOptionProductShort(lastTradedOption.product)
                      : "not yet started"}
                  </BoringDatum>
                </BoringRow>
              )}

              {epochRows.length ? (
                <BoringRow>
                  <BoringLabel>Last Traded Size</BoringLabel>
                  <BoringDatum>
                    <MiniAssetLogo ultra={def.depositToken} />

                    {def.depositToken.format(epochRows[0].balanceStart)}
                  </BoringDatum>
                </BoringRow>
              ) : null}

              {epochRows.length ? (
                <BoringRow>
                  <BoringLabel>
                    <InlineHoverDoc
                      content={"Rounded to the nearest whole day"}
                    >
                      Last Epoch Length
                    </InlineHoverDoc>
                  </BoringLabel>
                  <BoringDatum>
                    {Math.round(
                      (epochRows[0].endEpoch - epochRows[0].startEpoch) / 86400
                    )}{" "}
                    days
                  </BoringDatum>
                </BoringRow>
              ) : null}
              {def.optionType !== undefined && (
                <BoringRow>
                  <BoringLabel>
                    <InlineHoverDoc
                      content={
                        <span>
                          There are different styles of options. To learn more,
                          see the{" "}
                          <a
                            href="https://en.wikipedia.org/wiki/Option_style#American_and_European_options"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Wikipedia article on option styles
                          </a>
                        </span>
                      }
                    >
                      Option Style
                    </InlineHoverDoc>
                  </BoringLabel>
                  <BoringDatum>
                    <InlineHoverDoc
                      content={
                        "Friktion European options can only be exercised in the last 30 minutes of the epoch"
                      }
                    >
                      European
                    </InlineHoverDoc>
                  </BoringDatum>
                </BoringRow>
              )}
              <BoringRow>
                <BoringLabel>
                  <InlineDocMissingLink content={autoCompoundingExplanation}>
                    {card.data === null
                      ? "Auto-compounding in"
                      : averagedEpochYield
                      ? "Auto-compounding in"
                      : "Epoch begins in"}
                  </InlineDocMissingLink>
                </BoringLabel>
                <BoringDatum>
                  {" "}
                  <EpochCountdown isEntropy={def.optionType === undefined} />
                </BoringDatum>
              </BoringRow>
            </BoringBoxSection>
            <BoringBoxSection>
              <BoringBoxTitle>
                <h3>
                  <ColorSpan>Growth Data</ColorSpan>{" "}
                  <BoringAsOf>As of {moment().format("ll")}</BoringAsOf>
                </h3>
              </BoringBoxTitle>
              <BoringRow>
                <BoringLabel>
                  <InlineHoverDoc
                    content={
                      <div
                        css={css`
                          font-size: 12px;
                        `}
                      >
                        Extrapolated APY calculated from{" "}
                        {apyDisclaimerFragmentStartingWiththe(
                          averagedEpochYield?.windowSize || 1
                        )}{" "}
                        Compounded weekly to the length of a year.
                        <br />
                        <br />
                        Past performance and is not a guarantee of future
                        results
                      </div>
                    }
                  >
                    Extrapolated APY (pre-fees)
                  </InlineHoverDoc>
                </BoringLabel>
                <BoringDatum>
                  {!card.data
                    ? "..."
                    : epochRows.length === 0
                    ? "no epochs yet"
                    : averageCrunch?.APYBeforeFees + "%"}
                </BoringDatum>
              </BoringRow>
              <BoringRow>
                <BoringLabel>
                  <InlineHoverDoc
                    content={
                      <div
                        css={css`
                          font-size: 12px;
                        `}
                      >
                        Extrapolated APY calculated from{" "}
                        {apyDisclaimerFragmentStartingWiththe(
                          averagedEpochYield?.windowSize || 1
                        )}{" "}
                        The performance fee is subtracted from each epoch, and
                        then is compounded weekly to the length of a year.
                        <br />
                        <br />
                        Past performance and is not a guarantee of future
                        results
                      </div>
                    }
                  >
                    Extrapolated APY (post-fees)
                  </InlineHoverDoc>
                </BoringLabel>
                <BoringDatum>
                  {!card.data
                    ? "..."
                    : epochRows.length === 0
                    ? "no epochs yet"
                    : averageCrunch?.APYAfterFees + "%"}
                </BoringDatum>
              </BoringRow>
              <BoringRow>
                <BoringLabel>
                  <InlineHoverDoc
                    content={
                      "The premia of the latest epoch, multiplicatively scaled to exactly 168 hours. This scaling may be relevant in the case of an abnormal epoch that is more than 7 days long. This figure often reflects an epoch in progress, and has not yet been calculated into the volt token price. This does not take into account the performance fee"
                    }
                  >
                    Latest 7-day Growth
                  </InlineHoverDoc>
                </BoringLabel>
                <BoringDatum>
                  {!card.data
                    ? "..."
                    : epochRows.length === 0
                    ? "no epochs yet"
                    : latestCrunch
                    ? latestCrunch["7day"] + "% (7 days)"
                    : "..."}
                </BoringDatum>
              </BoringRow>
              <BoringRow>
                <BoringLabel>
                  <InlineHoverDoc
                    content={
                      <div>
                        The premia of the latest epoch (from "Latest 7-day
                        Growth"), annualized with weekly compounding to the
                        length of 1 year.
                        <br />
                        <br />
                        Past performance and is not a guarantee of future
                        results
                      </div>
                    }
                  >
                    Latest Epoch Annualized
                  </InlineHoverDoc>
                </BoringLabel>
                <BoringDatum>
                  {!card.data ? (
                    "..."
                  ) : epochRows.length === 0 ? (
                    "no epochs yet"
                  ) : latestCrunch ? (
                    <InlineHoverDoc
                      content={
                        <div>
                          After fees: {latestCrunch["APYAfterFees"]}% APY
                        </div>
                      }
                    >
                      {latestCrunch["APYBeforeFees"]}%
                    </InlineHoverDoc>
                  ) : (
                    "..."
                  )}
                </BoringDatum>
              </BoringRow>
              <BoringRow>
                <BoringLabel>
                  <InlineHoverDoc
                    content={
                      <div
                        css={css`
                          font-size: 12px;
                        `}
                      >
                        The post-fee compounded yield of the trailing period
                        from the end time of the latest epoch to 30.0 days (720
                        hours) prior. The performance fee is accounted for
                        before compounding. Derived from data in the Volt
                        Performance table (as opposed to volt token price).
                        <br />
                        <br />
                        Starting from the latest epoch (including the current
                        one in progress), epochs are iterated from new to old
                        until 30 days in the past is reached. The realized PnL %
                        (after performance fees) of included epochs (within 30
                        days) are multiplied together. In the case that an epoch
                        crosses the 30 day mark from the latest epoch, the
                        realized PnL % is scaled by the proportion that the
                        epoch is within 30 days (e.g. if a 7 day epoch had 2
                        days within 30 days from the latest epoch, the realized
                        PnL % for that epoch is reduced to 2/7th).
                      </div>
                    }
                  >
                    30-day Growth
                  </InlineHoverDoc>
                </BoringLabel>
                <BoringDatum>
                  {!card.data
                    ? "..."
                    : g
                    ? (100 * g).toFixed(2) + "% (30 days)"
                    : "too new"}
                </BoringDatum>
              </BoringRow>
              <BoringRow>
                <BoringLabel>
                  <InlineHoverDoc
                    content={
                      <div
                        css={css`
                          font-size: 12px;
                        `}
                      >
                        The post-fee annualized projected growth based on the
                        trailing 30-day growth.
                        <br />
                        <br />
                        Calculated from annualizing the "30-day Growth" from the
                        previous line using the follow formula.
                        <br />
                        <br />
                        <code>
                          g = 30-day Growth (previous line)
                          <br />
                          30-day Growth (annu.) = 2×[(g + 1)<sup>6</sup> - 1]
                        </code>
                        <br />
                        <br />
                        NAV is not included in this computation because the
                        realized PnL is growth relative to deposited assets.
                        This calculation methodology is may be a more accurate
                        alternative to traditional methods of calculating the
                        30-day growth using NAV because this figure is not
                        distorted by current NAV. <code>g</code> is already
                        after fees.
                      </div>
                    }
                  >
                    30-day Growth (Annualized)
                  </InlineHoverDoc>
                </BoringLabel>
                <BoringDatum>
                  {!card.data ? (
                    "..."
                  ) : dayYield30 ? (
                    <InlineHoverDoc
                      content={`${dayYield30.toFixed(2) + "%"} is post-fees`}
                    >
                      {dayYield30.toFixed(2) + "%"}
                    </InlineHoverDoc>
                  ) : (
                    "too new"
                  )}
                </BoringDatum>
              </BoringRow>
              <BoringRow>
                <BoringLabel>
                  <InlineHoverDoc
                    content={
                      <div>
                        The 12-Month trailing growth post-fees. If less than 12
                        months of history is available, the growth since
                        inception is annualized by compounding weekly to the
                        length of 1 year.
                        <br />
                        <br />
                        This includes the premia from the latest epoch as if it
                        were not exercised.
                      </div>
                    }
                  >
                    12-Month Growth
                  </InlineHoverDoc>
                </BoringLabel>
                <BoringDatum>
                  {!card.data ? (
                    "..."
                  ) : epochRows.length < 2 || !annualizedYieldSinceInception ? (
                    "too new"
                  ) : (
                    <InlineHoverDoc
                      content={`${
                        annualizedYieldSinceInception.toFixed(2) + "%"
                      } is post-fees`}
                    >
                      {annualizedYieldSinceInception.toFixed(2) + "%"}
                    </InlineHoverDoc>
                  )}
                </BoringDatum>
              </BoringRow>
              <BoringRow>
                <BoringLabel>
                  <InlineHoverDoc
                    content={
                      <div>
                        Compounded post-fee growth since inception. Based on
                        volt performance data. This amount may be different from
                        the figure calculated from the volt token price.
                        <br />
                        <br />
                        This number is derived from "Volt Performance" and may
                        slightly differs from volt token price. Volt token price
                        history may be missing the first few epochs because
                        historical data was not collected until a few weeks
                        after Friktion launched.
                        <br />
                        <br />
                        This includes the premia from the latest epoch as if it
                        were not exercised.
                      </div>
                    }
                  >
                    Growth Since Inception
                  </InlineHoverDoc>
                </BoringLabel>
                <BoringDatum>
                  {!card.data || yieldSinceInception === null
                    ? "..."
                    : (yieldSinceInception * 100).toFixed(2) + "%"}{" "}
                  (
                  {Math.floor(
                    (Date.now() -
                      Math.min(...epochRows.map((row) => row.startEpoch)) *
                        1000) /
                      86400_000
                  )}{" "}
                  days)
                </BoringDatum>
              </BoringRow>
              <BoringRow>
                <BoringLabel>
                  <InlineHoverDoc
                    content={
                      <div>
                        The 12-Month trailing growth post-fees. If less than 12
                        months of history is available, the growth since
                        inception is annualized by compounding weekly to the
                        length of 1 year.
                        <br />
                        <br />
                        This includes the premia from the latest epoch as if it
                        were not exercised.
                      </div>
                    }
                  >
                    Since Inception (Annualized)
                  </InlineHoverDoc>
                </BoringLabel>
                <BoringDatum>
                  {!card.data || !annualizedYieldSinceInception ? (
                    "..."
                  ) : epochRows.length < 2 ? (
                    "too new"
                  ) : (
                    <>
                      <InlineHoverDoc
                        content={`${
                          annualizedYieldSinceInception.toFixed(2) + "%"
                        } is post-fees`}
                      >
                        {annualizedYieldSinceInception.toFixed(2) + "%"}
                      </InlineHoverDoc>
                    </>
                  )}
                </BoringDatum>
              </BoringRow>
              <BoringRow>
                <BoringLabel>
                  <InlineHoverDoc
                    content={
                      <div>
                        Only includes epochs that have finished. USD amount is
                        calculated using the spot price at the time of expiry.
                        Does not include premiums from epochs with a loss
                      </div>
                    }
                  >
                    Total Premium Generated
                  </InlineHoverDoc>
                </BoringLabel>
                <BoringDatum>
                  {formatUSDRoundDown(
                    epochRows
                      .map((row) =>
                        row.endEpoch < Date.now() && row.realizedPnl > 0
                          ? row.balancePnl *
                            (row.globalId.includes("income_call")
                              ? row.spotPriceAtAuctionEnd
                              : 1)
                          : 0
                      )
                      .reduce((p, c) => p + c, 0)
                  )}
                </BoringDatum>
              </BoringRow>
            </BoringBoxSection>
            <BoringBoxSection>
              <BoringBoxTitle>
                <h3>
                  <ColorSpan>Technical Details</ColorSpan>
                </h3>
              </BoringBoxTitle>
              <BoringRow>
                <BoringLabel>Deposit Token</BoringLabel>
                <BoringDatum>
                  {" "}
                  <TokenLink
                    network={network}
                    token={card.def.depositToken}
                    useSolanaFm={card.def.globalId.includes("_eth")}
                  />
                </BoringDatum>
              </BoringRow>
              <BoringRow>
                <BoringLabel>Underlying Asset</BoringLabel>
                <BoringDatum>
                  {" "}
                  <TokenLink
                    network={network}
                    token={card.def.underlying}
                    useSolanaFm={card.def.globalId.includes("_eth")}
                  />
                </BoringDatum>
              </BoringRow>
              <BoringRow>
                <BoringLabel>Quote Asset</BoringLabel>
                <BoringDatum>
                  {" "}
                  <TokenLink
                    network={network}
                    token={card.def.quote}
                    useSolanaFm={card.def.globalId.includes("_eth")}
                  />
                </BoringDatum>
              </BoringRow>
              <BoringRow>
                <BoringLabel>
                  <InlineHoverDoc
                    content={`A "mint address" on Solana refers to the address that identifies this token on the blockchain.`}
                  >
                    Volt Token Mint
                  </InlineHoverDoc>
                </BoringLabel>
                <BoringDatum>
                  {card.data?.shareMint ? (
                    <a
                      href={createExplorerLink(
                        card.data?.shareMint.toBase58(),
                        card.data.globalId.includes("_eth")
                          ? generateSolanaFmLink
                          : undefined
                      )}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {card.data?.shareMint.toBase58().substring(0, 5)}..
                      {card.data?.shareMint
                        .toBase58()
                        .substring(card.data?.shareMint.toBase58().length - 5)}
                    </a>
                  ) : (
                    "..."
                  )}
                </BoringDatum>
              </BoringRow>
              <BoringRow>
                <BoringLabel>
                  {" "}
                  <InlineHoverDoc
                    content={
                      "The number of digits to shift over when converting a u64 amount to normalized display format. In Friktion, the number of decimals in the volt token is the same as that of the deposit token"
                    }
                  >
                    Volt Token Decimals
                  </InlineHoverDoc>
                </BoringLabel>
                <BoringDatum>
                  {card.def.depositToken.decimals} digits
                </BoringDatum>
              </BoringRow>{" "}
              <BoringRow>
                <BoringLabel>Network</BoringLabel>
                <BoringDatum>
                  <a
                    href="https://docs.solana.com/clusters#mainnet-beta"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Solana Mainnet Beta
                  </a>
                </BoringDatum>
              </BoringRow>
              <BoringRow>
                <BoringLabel>
                  <InlineHoverDoc
                    content={
                      "The Solana Program ID where the smart contract for this Volt is deployed"
                    }
                  >
                    Friktion Smart Contract Program ID
                  </InlineHoverDoc>
                </BoringLabel>
                <BoringDatum>
                  <a
                    href={createExplorerLink(
                      `VoLT1mJz1sbnxwq5Fv2SXjdVDgPXrb9tJyC8WpMDkSp`
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {"VoLT1mJz1sbnxwq5Fv2SXjdVDgPXrb9tJyC8WpMDkSp".substring(
                      0,
                      5
                    )}
                    ..
                    {"VoLT1mJz1sbnxwq5Fv2SXjdVDgPXrb9tJyC8WpMDkSp".substring(
                      "VoLT1mJz1sbnxwq5Fv2SXjdVDgPXrb9tJyC8WpMDkSp".length - 5
                    )}
                  </a>
                </BoringDatum>
              </BoringRow>
            </BoringBoxSection>
          </BoringBoxCol>
        </BoringBox>
      </BoringBoxContainer>
      <VoltPerformanceAndTitle
        twenty={true}
        onlyGlobalId={def.globalId}
        hideFirstColAt={1390}
        css={css`
          margin-top: 10px;
        `}
      />
      <ZeroNineManagementModal modalSesameBall={modalSesameBall} />
    </Wrapper>
  );
};

const IntroWithCard = styled.div`
  padding: 15px 20px 20px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  @media only screen and (max-width: 660px) {
    flex-wrap: wrap;
  }
`;

const IntroWithCardTitle = styled.div`
  padding-left: 50px;

  @media only screen and (max-width: 800px) {
    padding-left: 10px;
  }

  @media only screen and (max-width: 660px) {
    width: 100%;
  }
`;
const IntroLogo = styled.div`
  height: 90px;
  padding-top: 35px;
  padding-left: 16px;
  @media print {
    position: absolute;
    top: 0;
    right: 80px;
  }

  @media only screen and (max-width: 660px) {
    position: absolute;
    top: 20px;
    right: 80px;
  }

  @media only screen and (max-width: 470px) {
    display: none;
  }
`;
const IntroLogoScaler = styled.div`
  transform-origin: left center;
  transform: scale(2);
`;
const IntroVoltType = styled.div`
  font-size: 16px;
  text-transform: uppercase;
  font-weight: bold;
  margin-bottom: -4px;
`;

const IntroVoltName = styled.h2`
  font-size: 40px;
  margin-bottom: 0;

  @media only screen and (max-width: 740px) {
    font-size: 36px;
  }
  @media only screen and (max-width: 540px) {
    font-size: 32px;
  }
`;
const BoringBoxContainer = styled.div`
  padding-left: 20px;
  padding-right: 20px;

  @media print {
    & {
      color: #333 !important;
    }
  }
`;
const BoringBox = styled.div`
  background: linear-gradient(
    hsla(230, 15%, 40%, 0.4),
    hsla(230, 15%, 30%, 0.4) 80%
  );
  padding: 20px 24px;
  border-radius: 4px;
  h3 {
    font-weight: bold;
    font-size: 18px;
    line-height: 1.4;
    margin-bottom: 0;
    /* padding-right: 8px;
    padding-left: 8px; */
  }
  font-size: 14px;

  a {
    color: inherit;
  }
  p {
    margin-bottom: 0.5em;
    /* padding-right: 8px;
    padding-left: 8px; */
  }
  p:last-child {
    margin-bottom: 0;
  }

  display: grid;
  gap: 28px;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media only screen and (max-width: 780px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 0;
  }
`;
const BoringBoxCol = styled.div`
  @media only screen and (max-width: 780px) {
    margin-bottom: 20px;
  }
`;
const BoringBoxSection = styled.div`
  margin-bottom: 20px;

  @media only screen and (max-width: 780px) {
    max-width: 380px;
    margin: 0 auto 20px auto;
    &:last-of-type {
      margin-bottom: 0;
    }
  }
`;
const BoringAsOf = styled.span`
  font-size: 11px;
  margin-left: 8px;
  font-weight: 400;
`;
export const BoringRow = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid hsla(230, 15%, 35%, 0.5);
  min-height: 35px;
  align-items: center;
  padding: 6px 8px;
  line-height: 1.2;

  @media only screen and (max-width: 780px) {
    padding-left: 0;
    padding-right: 0;
  }
`;
export const BoringLabel = styled.div`
  font-weight: bold;
  padding-right: 4px;
`;
export const BoringDatum = styled.div`
  text-align: right;
  flex-shrink: 0;
  a {
    text-decoration: dotted underline;
  }

  @media only screen and (max-width: 530px) {
    flex-shrink: 1;
  }
`;
const BoringBoxTitle = styled.div`
  padding-bottom: 4px;
  border-bottom: 4px solid hsla(230, 15%, 35%, 0.5);
`;
const BoringBoxTitleSpacerWhenNoTable = styled.div`
  padding-bottom: 4px;
`;

// const clickableStyle = css`
//   cursor: pointer;
// `;

const Wrapper = styled.div`
  /* max-width: 980px; */
  margin: 0 auto;
`;

import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { VoltNumber, voltTitle } from "./registry10";
import {
  getCardGlowBG,
  getVoltBolt,
  getVoltColorPair,
  getVoltSpan,
} from "./glow09";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useQuarantineChristmas10VFACWarningOnlyWorksWithCoveredCalls } from "./useChristmasCard10";
import { Card09Props } from "./Card10";
import React from "react";
import {
  CoveredCallChart,
  BasisChart,
  CashSecuredPutChart,
  CrabChart,
} from "features/home-charts";
import { Button } from "common/components/Button";
import { PerformanceSummary } from "features/volts-pages/components/volt-description-cards/PerformanceCard";
import { voltageDefAdjustedCards } from "common/utils/voltageDefAdjustedCards";
import { useElementSize } from "usehooks-ts";
import {
  MobileCashSecuredPutChart,
  MobileCrabChart,
} from "../features/home-charts";
import { useTotalTVL } from "./useTotalTVL";
import { formatUSDRoundDown } from "./format09";
import { useAuctionResults } from "./AuctionResults";
import { Volt5OutcomesChart } from "features/home-charts/components/Volt5OutcomesChart";

export const ZeroNineHomepageV2 = () => {
  return (
    <>
      <HeroHeader />
      <YieldProductsSection
        css={css`
          z-index: 10000;
        `}
      />
    </>
  );
};

const HeroHeader = styled((props: { className?: string }) => {
  const totalTvl = useTotalTVL();

  return (
    <div
      {...props}
      css={css`
        gap: 12px;
      `}
    >
      <div
        css={(theme) => css`
          font-family: "Avenir";
          font-weight: 700;
          font-size: 16px;
          z-index: 10000;
          color: ${theme.palette.pink[600]};
          @media only screen and (max-width: 570px) {
            font-size: 14px;
          }
        `}
      >
        OUR PRODUCTS
      </div>
      <div
        css={(theme) => css`
          font-family: "Recoleta";
          font-weight: 700;
          font-size: 36px;
          text-align: center;
          z-index: 10000;
          color: ${theme.palette.mode === "dark"
            ? "white"
            : theme.palette.grey[950]};

          @media only screen and (max-width: 900px) {
            font-size: 30px;
          }
          @media only screen and (max-width: 640px) {
            font-size: 24px;
          }
          @media only screen and (max-width: 570px) {
            font-size: 28px;
            line-height: 1.2;
            font-weight: bold;
          }
        `}
      >
        Volts are powerful investment strategies
      </div>
      <TVLCount>
        Total Deposits:{" "}
        <span
          css={css`
            font-weight: 700;
          `}
        >
          {totalTvl ? formatUSDRoundDown(totalTvl) : "..."}
        </span>
      </TVLCount>
    </div>
  );
})`
  margin: auto;
  padding: 32px 16px 60px 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: content-box;

  @media (max-width: 570px) {
    padding: 32px 16px 40px 16px;
  }
`;

const YieldProductsSection = styled((props: { className?: string }) => {
  const vfac09 = useQuarantineChristmas10VFACWarningOnlyWorksWithCoveredCalls();
  const navigate = useNavigate();
  const { yieldDataPerVolt } = useAuctionResults();

  return (
    <div {...props}>
      <div
        css={css`
          max-width: 1200px;
          width: 100%;
        `}
      >
        {Array.from({ length: 5 }, (_, i) => {
          const voltNumber = (i + 1) as VoltNumber;
          const cards = voltageDefAdjustedCards(
            vfac09.cards,
            yieldDataPerVolt,
            voltNumber
          );

          const voltPath =
            voltNumber === 1
              ? "/income"
              : voltNumber === 2
              ? "/stables"
              : voltNumber === 3
              ? "/crab"
              : voltNumber === 4
              ? "/basis"
              : "/protection";

          return (
            <div
              key={`volt-${voltNumber}`}
              onClick={() => {
                navigate(voltPath, { replace: true });
              }}
              css={css`
                cursor: pointer;
              `}
            >
              <YieldProductCard key={`volt-${voltNumber}`} volt={voltNumber}>
                <YieldProductCardDescription
                  volt={voltNumber}
                  voltPath={voltPath}
                  navigate={navigate}
                />
                <YieldProductChartSection volt={voltNumber} cards={cards} />
              </YieldProductCard>
            </div>
          );
        })}
      </div>
    </div>
  );
})`
  padding: 0px 20px;
  display: flex;
  justify-content: center;
  font-family: "SF Pro";
  margin-bottom: 150px;
`;

interface YieldProductCardDescriptionProps {
  className?: string;
  volt: VoltNumber;
  voltPath: string;
  navigate: NavigateFunction;
}
const YieldProductCardDescription = styled(
  ({ volt, voltPath, navigate, ...rest }: YieldProductCardDescriptionProps) => {
    const Bolt = getVoltBolt(volt);
    const Span = getVoltSpan(volt);

    const header = voltTitle(volt);
    const voltDescription =
      volt === 1 ? (
        <span>
          Enhance returns on volatile assets with a covered call selling
          strategy. Algorithmic strike and expiry selection. Flexible risk
          levels. Earnings are auto-compounded weekly.
        </span>
      ) : volt === 2 ? (
        <span>
          Earn yields on stablecoins (USDC) with a cash secured put selling
          strategy. Algorithmic strike and expiry selection. Flexible risk
          levels. Earnings are auto-compounded weekly.
        </span>
      ) : volt === 3 ? (
        <span>
          Generate returns in range-bound markets with an automated
          delta-neutral volatility harvesting strategy using power-perpetuals.
          Earnings are auto-compounded weekly.
        </span>
      ) : volt === 4 ? (
        <span>
          Earn returns without taking directional price risk using an automated
          delta-hedged basis (long a perpetual and short spot). Monetize periods
          of negative funding rates. Epochs are resolved weekly, executing on
          Mango.
        </span>
      ) : (
        <span>
          Outperform in volatile markets with principal protection. Combines
          yields from lending (interest revenue) and tail risk protection from
          long volatility.
        </span>
      );

    return (
      <div
        {...rest}
        css={css`
          flex-direction: column;
        `}
      >
        <div
          css={css`
            padding: 40px 100px 0 32px;
            @media (max-width: 600px) {
              padding: 40px 40px 0 40px;
            }
          `}
        >
          <div
            css={css`
              display: flex;
              align-items: center;
              margin-bottom: 10px;
            `}
          >
            <Bolt
              css={css`
                width: 18px;
                height: 23px;
              `}
            />
            <Span
              css={css`
                margin-left: 8px;
                font-weight: bold;
                font-size: 18px;
                font-family: "Euclid Circular B";
                font-weight: 700;
              `}
            >
              Volt {volt}
            </Span>
          </div>
          <YieldProductCardDescriptionHeader>
            {header}
          </YieldProductCardDescriptionHeader>
          <p
            css={(theme) => css`
              font-size: 16px;
              font-family: "Euclid Circular B";
              color: ${theme.palette.mode === "dark"
                ? theme.palette.grey[300]
                : theme.palette.grey[700]};
            `}
          >
            {voltDescription}
          </p>
        </div>
        <div
          css={css`
            margin-top: 48px;
            padding: 0 100px 40px 32px;
            display: flex;
            align-items: center;
          `}
        >
          <Button
            css={css`
              padding: 12px 32px;
            `}
            voltNumber={volt}
            onClick={() => {
              navigate(voltPath, { replace: true });
            }}
          >
            <span
              css={(theme) => css`
                color: ${theme.palette.common.black} !important;
                font-family: "Euclid Circular B";
                font-weight: 500;
                font-size: 16px;
              `}
            >
              Explore
            </span>
          </Button>
        </div>
      </div>
    );
  }
)`
  flex: 1 1 0;
`;

interface YieldProductChartSectionProps {
  className?: string;
  cards: Card09Props[];
  volt: VoltNumber;
}
const YieldProductChartSection = styled(
  ({ cards, volt, ...rest }: YieldProductChartSectionProps) => {
    const headerText =
      volt === 1
        ? "STRATEGY FOR BEARISH MARKETS"
        : volt === 2
        ? "STRATEGY FOR BULLISH MARKETS"
        : volt === 3
        ? `STRATEGY FOR RANGE-BOUND “CRAB” MARKETS`
        : volt === 4
        ? "STRATEGY FOR NEGATIVE FUNDING RATE MARKETS"
        : "STRATEGY FOR VOLATILE MARKETS WITH RISING INTEREST RATES";

    return (
      <div
        {...rest}
        css={(theme) =>
          css`
            border-left: ${theme.palette.mode === "dark"
              ? "1px solid #323441"
              : "1px solid rgba(0, 0, 0, 0.1)"};
          `
        }
      >
        <YieldProductChartTop>
          <span
            css={(theme) => css`
              color: ${theme.palette[
                volt === 1
                  ? "sky"
                  : volt === 2
                  ? "electricity"
                  : volt === 3
                  ? "neon"
                  : volt === 4
                  ? "pink"
                  : "lavender"
              ][theme.palette.mode === "dark" ? 500 : 800]};
              font-weight: 500;
              font-size: 12px;
            `}
          >
            {headerText}
          </span>
        </YieldProductChartTop>
        <YieldProductChart volt={volt} />
        <YieldProductChartBottom cards={cards} volt={volt} />
      </div>
    );
  }
)`
  max-width: 50%;
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  font-family: "Euclid Circular B";

  @media only screen and (max-width: 900px) {
    max-width: initial;
    width: 100%;
    border-left: 0px;
    border-top: 1px solid rgba(206, 206, 216, 1);
  }
`;

const YieldProductChartTop = styled(
  ({
    children,
    ...rest
  }: {
    className?: string;
    children: React.ReactNode;
  }) => (
    <div {...rest}>
      <span
        css={css`
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          width: 100%;
        `}
      >
        {children}
      </span>
    </div>
  )
)`
  background: ${(props) =>
    props.theme.palette.mode === "dark"
      ? props.theme.palette.grey[900]
      : props.theme.palette.grey[100]};
  position: relative;
  height: 56px;
  border-radius: 0px 7px 0px 0px;

  @media only screen and (max-width: 900px) {
    border-radius: 0px;
  }
`;

interface YieldProductChartProps {
  volt: VoltNumber;
  className?: string;
}
const YieldProductChart = styled(
  ({ volt, ...rest }: YieldProductChartProps) => {
    const [wrapperRef, { width: wrapperWidth }] = useElementSize();
    return (
      <div ref={wrapperRef} {...rest}>
        {volt === 1 ? (
          <CoveredCallChart />
        ) : volt === 2 ? (
          wrapperWidth > 440 ? (
            <CashSecuredPutChart />
          ) : (
            <MobileCashSecuredPutChart />
          )
        ) : volt === 3 ? (
          wrapperWidth > 440 ? (
            <CrabChart />
          ) : (
            <MobileCrabChart />
          )
        ) : volt === 4 ? (
          <BasisChart />
        ) : (
          <Volt5OutcomesChart />
        )}
      </div>
    );
  }
)`
  display: flex;
  align-items: center;
  flex: 1 0 auto;
  margin: auto;
  min-height: 225px;

  @media (max-width: 550px) {
    padding: 24px;
  }
`;

interface YieldProductChartBottomProps {
  volt: VoltNumber;
  cards: Card09Props[];
  className?: string;
}
const YieldProductChartBottom = styled(
  ({ volt, cards, ...rest }: YieldProductChartBottomProps) => (
    <div {...rest}>
      <PerformanceSummary
        voltNumber={volt}
        css={(theme) =>
          css`
            background: transparent;
          `
        }
      />
    </div>
  )
)`
  display: row;
  justify-content: space-between;
  background: ${(props) =>
    props.theme.palette.mode === "dark"
      ? props.theme.palette.grey[900]
      : props.theme.palette.grey[100]};
  height: 56px;
  border-radius: 0px 0px 7px 0px;
  @media only screen and (max-width: 900px) {
    border-radius: 0px 0px 7px 7px;
  }
`;

interface YieldProductCardProps {
  volt: VoltNumber;
  className?: string;
  children: React.ReactNode;
}
const YieldProductCard = ({
  volt,
  children,
  ...rest
}: YieldProductCardProps) => {
  // eslint-disable-next-line
  const [_, colorB] = getVoltColorPair(volt);
  const GlowBG = getCardGlowBG(volt);
  const glowBGComponent = (
    <GlowBG
      css={css`
        z-index: -1;
      `}
      className="glowBG"
    />
  );

  return (
    <div
      css={(theme) => css`
        position: relative;
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        background: ${theme.palette.mode === "dark" ? "#000" : "#FFF"};
        border-radius: 8px;
        border: ${theme.palette.mode === "dark"
          ? "1px solid #323441"
          : "1px solid #EBEBF2"};

        margin-bottom: 40px;

        &:hover {
          border-color: ${colorB};
          & > .glowBG {
            opacity: 0.6;
          }
        }
      `}
      {...rest}
    >
      {children}
      {glowBGComponent}
      {glowBGComponent}
    </div>
  );
};

const YieldProductCardDescriptionHeader = styled.h2`
  font-family: "Recoleta";
  font-size: 30px;
  font-weight: 500;
  color: ${(props) => props.theme.palette.text.primary};
`;

const TVLCount = styled.div`
  font-family: "Euclid Circular B";
  font-weight: 400;
  font-size: 18px;
  z-index: 10000;
  color: white;
  @media only screen and (max-width: 570px) {
    font-size: 16px;
  }
`;

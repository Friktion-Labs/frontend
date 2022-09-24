// import { css } from "@emotion/react";
import React, { useMemo } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { VoltPerformanceAndTitle } from "../components/VoltPerformance/VoltPerformance";
import { AnalyticsTVLUSDGraph, VolumeGraph } from "./AnalyticsTVLUSD";
import { useAuctionResults } from "./AuctionResults";
import { formatUSDRoundDown } from "./format09";
import { EpochCountdown } from "./FormattedCountdown";
import { InlineDocMissingLink, InlineHoverDoc } from "./misc09";
import { SUBVOLT_LIST } from "./registry10";
import { autoCompoundingExplanation } from "./textForTooltipsOnly";
import { useTotalTVL } from "./useTotalTVL";

export const AnalyticsOverview: React.FC = (props) => {
  const totalTvl = useTotalTVL();
  const { auctionData, cumulativeVolume, cumulativePremium } =
    useAuctionResults();

  const numberOfAuctions: number | null = useMemo(() => {
    return auctionData === null
      ? null
      : auctionData.filter((def) => def.endEpoch * 1000 < Date.now()).length;
  }, [auctionData]);

  return (
    <Income>
      <TwoCol>
        <div>
          <NumberBox>
            <div>Total Volume</div>
            <data>
              {cumulativeVolume === null
                ? "..."
                : formatUSDRoundDown(cumulativeVolume)}
            </data>
          </NumberBox>
          <VolumeGraph />
        </div>
        <div>
          <NumberBox>
            <div>Total Value Locked</div>
            <data>{totalTvl ? formatUSDRoundDown(totalTvl) : "..."}</data>
          </NumberBox>

          <AnalyticsTVLUSDGraph
            css={css`
              z-index: 6;
            `}
          />
        </div>
      </TwoCol>

      <TwoCol>
        <div>
          <NumberBox>
            <div>
              <InlineHoverDoc
                content={
                  "USD amount is calculated using the spot price at the time of expiry. Does not include premiums from epochs with a loss"
                }
              >
                Total Premium Generated
              </InlineHoverDoc>
            </div>
            <data>
              {cumulativePremium === null
                ? "..."
                : formatUSDRoundDown(cumulativePremium)}
            </data>
          </NumberBox>
        </div>
        <div>
          <NumberBox>
            <div>
              <InlineDocMissingLink content={autoCompoundingExplanation}>
                Auto-compounding in
              </InlineDocMissingLink>
            </div>
            <data>
              <EpochCountdown />
            </data>
          </NumberBox>
        </div>
      </TwoCol>
      <TwoCol>
        <div>
          <NumberBox>
            <div># of products</div>
            <data>{SUBVOLT_LIST["mainnet-beta"].length}</data>
          </NumberBox>
        </div>
        <div>
          <NumberBox>
            <div># of auctions</div>
            <data>{numberOfAuctions ?? "..."}</data>
          </NumberBox>
        </div>
      </TwoCol>

      <VoltPerformanceAndTitle twenty={true} hideFirstColAt={1390} />
    </Income>
  );
};

const Income = styled.div`
  /* max-width: 980px; */
  margin: 0 auto;
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  padding-left: 20px;
  padding-right: 20px;
  .graphContainer {
    padding: 0;
  }
  @media only screen and (max-width: 640px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 0;
  }
`;

const NumberBox = styled.div`
  font-weight: bold;
  font-size: 16px;
  text-align: center;
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.9);

  background: hsla(230, 15%, 50%, 0.15);
  data {
    font-size: 26px;
    line-height: 1.15;
    font-weight: normal;
  }
  padding-top: 15px;
  padding-bottom: 15px;
  margin-bottom: 20px;

  @media print {
    outline: 2px solid hsla(230, 15%, 50%, 0.5);
  }
`;

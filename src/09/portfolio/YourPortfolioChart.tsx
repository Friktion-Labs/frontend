import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Theme } from "@nivo/core";
import { ResponsiveLine } from "@nivo/line";
import { BarDatum, ResponsiveBar } from "@nivo/bar";
import { AxisTickProps } from "@nivo/axes";
import moment from "moment";
import { loading, LoadingLabel } from "../AnalyticsGraphsCommon";
import { formatUSDCentsRoundNearest } from "../format09";
import { BlueA, GreenA, PinkA, VioletA, YellowA } from "../glow09";
import { GlobalId, STRONG_SUBVOLTS } from "../registry10";
import { AutoUniversalAssetLogo } from "../UniversalAssetLogo";
import { VoltNumber } from "../VoltNumber";
import { PortfolioGraphDataPoint } from "./PortfolioPage";
import { AsyncButton09Bolt } from "../Button09";
import Bolt from "../friktionLogos/bolt80.png";
import { useElementSize } from "usehooks-ts";

const noData = (
  <LoadingLabel className="loadingLabel">
    <AsyncButton09Bolt
      css={css`
        visibility: hidden;
        margin: 20px;
      `}
      src={Bolt}
    ></AsyncButton09Bolt>
    <span
      css={css`
        font-family: "Euclid Circular B";
      `}
    >
      Too new to show data
    </span>
    <AsyncButton09Bolt
      css={css`
        visibility: hidden;
        margin: 20px;
      `}
      src={Bolt}
      className="alternate"
    ></AsyncButton09Bolt>
  </LoadingLabel>
);

export const YourPortfolioChart: React.FC<{
  isLoading: boolean;
  graphData: PortfolioGraphDataPoint[];
  isStalkingAnotherWallet: boolean;
  isConnected: boolean;
  height: number;
  minYvalue?: number | "auto" | undefined;
}> = ({
  isLoading,
  graphData,
  isStalkingAnotherWallet,
  isConnected,
  height,
  minYvalue,
}) => {
  return (
    <Container>
      {!isStalkingAnotherWallet && !isConnected ? (
        <EmptyChart>Connect your wallet</EmptyChart>
      ) : (
        <YourPortfolioPlot
          isLoading={isLoading}
          graphData={graphData}
          height={height}
          minYvalue={minYvalue}
        />
      )}
    </Container>
  );
};

export const YourStackedReturnsBarChart: React.FC<{
  isLoading: boolean;
  graphData: BarDatum[];
  isStalkingAnotherWallet: boolean;
  isConnected: boolean;
}> = ({ isLoading, graphData, isStalkingAnotherWallet, isConnected }) => {
  return (
    <Container>
      {!isStalkingAnotherWallet && !isConnected ? (
        <EmptyChart></EmptyChart>
      ) : (
        <YourStackedReturnsBarPlot
          isLoading={isLoading}
          graphData={graphData}
        />
      )}
    </Container>
  );
};

const font = `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen","Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",sans-serif`;

const neutralTheme: Theme = {
  background: "transparent",
  textColor: "#000",
  fontSize: 11,
  fontFamily: font,
  axis: {
    domain: {},
    legend: {
      text: {
        // "fcBTC volt token price"
        fontSize: 18,
        fill: "#fff",
        fontWeight: 700,
        // opacity: 0.8,
        fontFamily: font,
      },
    },
    ticks: {
      line: {
        stroke: "#fff",
        strokeWidth: 1,
      },
      text: {
        // "Jan 20"
        // ""
        fill: "#fff",
        fontSize: 11,
        fontFamily: font,
      },
    },
  },
  grid: {
    line: {
      stroke: "white",
      strokeWidth: 2,
      strokeDasharray: "2 2",
      strokeOpacity: "20%",
    },
  },
  crosshair: {
    line: {
      stroke: "#fff",
      strokeWidth: 1,
      strokeOpacity: 1,
    },
  },
  legends: {
    title: {
      text: {
        fontSize: 11,
        fill: "green",
      },
    },
    text: {
      fontSize: 11,
      fill: "orange",
    },
    ticks: {
      line: {},
      text: {
        fontSize: 10,
        fill: "red",
      },
    },
  },
  annotations: {
    text: {
      fontSize: 13,
      fill: "#333333",
      outlineWidth: 2,
      outlineColor: "#ffffff",
      outlineOpacity: 1,
    },
    link: {
      stroke: "#000000",
      strokeWidth: 1,
      outlineWidth: 2,
      outlineColor: "#ffffff",
      outlineOpacity: 1,
    },
    outline: {
      stroke: "#000000",
      strokeWidth: 2,
      outlineWidth: 2,
      outlineColor: "#ffffff",
      outlineOpacity: 1,
    },
    symbol: {
      fill: "#000000",
      outlineWidth: 2,
      outlineColor: "#ffffff",
      outlineOpacity: 1,
    },
  },
  tooltip: {
    container: {
      background: "#ffffff",
      color: "#333333",
      fontSize: 12,
    },
    basic: {},
    chip: {},
    table: {},
    tableCell: {},
    tableCellValue: {},
  },
};

const YourPortfolioPlot: React.FC<{
  isLoading: boolean;
  graphData: PortfolioGraphDataPoint[];
  height: number;
  minYvalue: number | "auto" | undefined;
  className?: string;
}> = ({ isLoading, className, graphData, height, minYvalue }) => {
  if (isLoading) {
    return (
      <GraphContainer>
        <GraphWrapper
          className="loading"
          css={css({ height: `${height}px !important` })}
        >
          {loading}
        </GraphWrapper>
      </GraphContainer>
    );
  }

  if (graphData.length < 1 || graphData[0].data.length < 1) {
    return (
      <GraphContainer>
        <GraphWrapper
          className="loading"
          css={css({ height: `${height}px !important` })}
        >
          {noData}
        </GraphWrapper>
      </GraphContainer>
    );
  }

  return (
    <GraphContainer
      className={"graphContainer " + className}
      css={css`
        z-index: 100;
      `}
    >
      <GraphWrapper
        className="loaded tvlUsd"
        css={css({ height: `${height}px !important` })}
      >
        {loading}
        <ResponsiveLine
          data={graphData}
          yScale={{
            type: "linear",
            stacked: true,
            min: minYvalue,
          }}
          theme={neutralTheme}
          xScale={{
            type: "time",
            format: "%Y-%m-%d",
            useUTC: false,
          }}
          areaOpacity={1}
          axisLeft={{
            format: (v) => {
              return `$${v}`;
            },
            tickSize: 0,
            tickValues: 4,
          }}
          axisBottom={{
            format: "%b %d",
            tickSize: 0,
            tickPadding: 10,
            tickValues: 6,
          }}
          curve={"linear"}
          colors={(data) => {
            return data.color;
          }}
          enablePointLabel={false}
          crosshairType="cross"
          pointBorderColor={{
            from: "color",
            // modifiers: [["darker", 0.3]],
          }}
          enableSlices={"x"}
          // useMesh={true}
          enablePoints={false}
          enableGridX={false}
          enableGridY={true}
          gridYValues={4}
          pointLabelYOffset={-15}
          margin={{ top: 0, right: 0, bottom: 34, left: 55 }}
          layers={[
            "grid",
            "markers",
            "areas",
            "crosshair",
            "lines",
            "points",
            "slices",
            "mesh",
            "legends",
            "axes",
          ]}
          defs={[
            {
              id: "gradient5",
              type: "linearGradient",
              colors: [
                { offset: 2, color: VioletA },
                { offset: 5, color: VioletA },
              ],
            },
            {
              id: "gradient4",
              type: "linearGradient",
              colors: [
                { offset: 2, color: PinkA },
                { offset: 5, color: PinkA },
              ],
            },
            {
              id: "gradient3",
              type: "linearGradient",
              colors: [
                { offset: 2, color: YellowA },
                { offset: 5, color: YellowA },
              ],
            },
            {
              id: "gradient2",
              type: "linearGradient",
              colors: [
                { offset: 2, color: GreenA },
                { offset: 5, color: GreenA },
              ],
            },
            {
              id: "gradient1",
              type: "linearGradient",
              colors: [
                { offset: 0, color: BlueA },
                // { offset: 100, color: BlueB },
                { offset: 100, color: BlueA },
              ],
            },
          ]}
          fill={[
            // // match using function
            { match: (d) => d.id.includes("call"), id: "gradient1" },
            { match: (d) => d.id.includes("put"), id: "gradient2" },
            { match: (d) => d.id.includes("perp"), id: "gradient3" },
            { match: (d) => d.id.includes("basis"), id: "gradient4" },
            { match: (d) => d.id.includes("prot"), id: "gradient5" },
            // { match: (d) => d.id === "2", id: "gradient2" },
            // match all, will only affect 'elm', because once a rule match,
            // others are skipped, so now it acts as a fallback
            // { match: "*", id: "gradientC" },
          ]}
          motionConfig={"stiff"}
          sliceTooltip={(slice) => {
            const points = slice.slice.points;
            if (!points || points.length < 1) {
              return <div></div>;
            }
            const totalValue = points
              .flatMap((point) => parseFloat(point.data.y.toString()))
              .reduce(
                (previousValue, currentValue) => previousValue + currentValue,
                0
              );

            const time = points[0].data.x as Date;
            const filteredPoints = points
              .sort((a, b) => {
                const defA = STRONG_SUBVOLTS[a.serieId as GlobalId];
                const defB = STRONG_SUBVOLTS[b.serieId as GlobalId];
                return (
                  defA.volt - defB.volt ||
                  defA.globalId.localeCompare(defB.globalId)
                );
              })
              .filter((point) => Number(point.data.y) > 0);

            const result = (
              <div
                css={css`
                  background: hsla(230, 15%, 15%, 0.9);
                  backdrop-filter: blur(2px);
                  border-radius: 4px;
                  padding: 6px 12px;
                  color: #ffffff;
                  /* Theres weird artifacts due to backdrop filter. we need to scale to fix */
                  transform: translate(0%, 60px) scale(1.01);
                  transition: transform 0.1s !important;
                  z-index: 1000;
                  font-family: "Euclid Circular B";

                  .dolla {
                    min-width: 50px;
                    text-align: right;
                  }
                  -webkit-backface-visibility: hidden;
                  -moz-backface-visibility: hidden;
                  -webkit-transform: translate3d(0, 0, 0);
                  -moz-transform: translate3d(0, 0, 0);
                `}
              >
                <div
                  css={css({
                    minWidth: `${
                      filteredPoints.length > 6 ? "360px" : "150px"
                    }`,
                  })}
                >
                  {moment(time).format("ll LT")}
                  <div>Total: {formatUSDCentsRoundNearest(totalValue)}</div>
                  <Grid
                    css={css({
                      gridTemplateColumns:
                        filteredPoints.length > 6 ? "1fr 1fr" : "1fr",
                    })}
                  >
                    {filteredPoints.map((point) => {
                      const def = STRONG_SUBVOLTS[point.serieId as GlobalId];
                      return (
                        <GridItem key={point.serieId}>
                          <div
                            css={css`
                              display: flex;
                              flex-direction: row;
                              align-items: center;

                              .centeredVoltNumber {
                                align-self: center;
                              }
                            `}
                          >
                            <Shrink>
                              <VoltNumber
                                voltNum={def.volt}
                                className="centeredVoltNumber"
                              />
                              <AssetLogoWrapper>
                                <AutoUniversalAssetLogo def={def} />
                              </AssetLogoWrapper>
                            </Shrink>
                            <span className="dolla">
                              {formatUSDCentsRoundNearest(Number(point.data.y))}
                            </span>
                          </div>
                        </GridItem>
                      );
                    })}
                  </Grid>
                </div>
              </div>
            );

            return result;
          }}
        />
      </GraphWrapper>
    </GraphContainer>
  );
};

const YourStackedReturnsBarPlot: React.FC<{
  isLoading: boolean;
  graphData: BarDatum[];
  className?: string;
}> = ({ isLoading, className, graphData }) => {
  const [wrapperRef, { width: wrapperWidth }] = useElementSize();
  if (isLoading) {
    return (
      <GraphContainer>
        <GraphWrapper className="loading">{loading}</GraphWrapper>
      </GraphContainer>
    );
  }

  if (graphData.length < 1) {
    return (
      <GraphContainer>
        <GraphWrapper className="loading">{noData}</GraphWrapper>
      </GraphContainer>
    );
  }

  const globalIds = Object.keys(STRONG_SUBVOLTS);

  return (
    <GraphContainer
      className={"graphContainer " + className}
      css={css`
        z-index: 99;
      `}
      ref={wrapperRef}
    >
      <GraphWrapper className="loaded tvlUsd">
        {loading}
        <ResponsiveBar
          data={graphData}
          indexBy="formattedTime"
          keys={globalIds}
          theme={neutralTheme}
          axisLeft={{
            format: (v) => {
              return `$${v}`;
            },
            tickValues: 4,
          }}
          axisBottom={{
            tickSize: 0,
            tickPadding: 10,
            tickValues: 6,
            renderTick: (tick: AxisTickProps<string>) => {
              if (wrapperWidth < 760) {
                if (graphData.length > 9) {
                  if (tick.tickIndex % 3 !== 0) {
                    return <></>;
                  }
                }
                if (graphData.length > 6) {
                  if (tick.tickIndex % 2 !== 0) {
                    return <></>;
                  }
                }
              }
              return (
                <g transform={`translate(${tick.x},${tick.y + 22})`}>
                  <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                      fill: "#fff",
                      fontSize: 11,
                    }}
                    css={css({
                      transform:
                        wrapperWidth < 760 ? "rotate(0deg)" : "rotate(-30deg)",
                    })}
                  >
                    {tick.value}
                  </text>
                </g>
              );
            },
          }}
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          colors={({ id }) => {
            if (typeof id === "string" && id.includes("call")) {
              return BlueA;
            } else if (typeof id === "string" && id.includes("put")) {
              return GreenA;
            } else if (typeof id === "string" && id.includes("perp")) {
              return YellowA;
            } else if (typeof id === "string" && id.includes("basis")) {
              return PinkA;
            } else {
              return VioletA;
            }
          }}
          // useMesh={true}
          enableLabel={false}
          enableGridX={false}
          enableGridY={true}
          gridYValues={4}
          margin={{ top: 0, right: 0, bottom: 34, left: 55 }}
          // layers={["grid", "markers", "legends", "axes"]}
          defs={[
            {
              id: "gradient5",
              type: "linearGradient",
              colors: [
                { offset: 2, color: VioletA },
                { offset: 5, color: VioletA },
              ],
            },
            {
              id: "gradient4",
              type: "linearGradient",
              colors: [
                { offset: 2, color: PinkA },
                { offset: 5, color: PinkA },
              ],
            },
            {
              id: "gradient3",
              type: "linearGradient",
              colors: [
                { offset: 2, color: YellowA },
                { offset: 5, color: YellowA },
              ],
            },
            {
              id: "gradient2",
              type: "linearGradient",
              colors: [
                { offset: 2, color: GreenA },
                { offset: 5, color: GreenA },
              ],
            },
            {
              id: "gradient1",
              type: "linearGradient",
              colors: [
                { offset: 0, color: BlueA },
                // { offset: 100, color: BlueB },
                { offset: 100, color: BlueA },
              ],
            },
          ]}
          // fill={[
          //   // // match using function
          //   { match: (d) => d.id.includes("call"), id: "gradient1" },
          //   { match: (d) => d.id.includes("put"), id: "gradient2" },
          //   { match: (d) => d.id.includes("perp"), id: "gradient3" },
          //   { match: (d) => d.id.includes("basis"), id: "gradient4" },
          //   // { match: (d) => d.id === "2", id: "gradient2" },
          //   // match all, will only affect 'elm', because once a rule match,
          //   // others are skipped, so now it acts as a fallback
          //   // { match: "*", id: "gradientC" },
          // ]}
          motionConfig={"stiff"}
          tooltip={(bar) => {
            const time = bar.data["time"] as number;

            const newObjectWithoutRandomProperties: Record<string, number> = {};

            for (const [id, series] of Object.entries(bar.data ?? [])) {
              if (globalIds.includes(id) && typeof series === "number") {
                newObjectWithoutRandomProperties[id] = series;
              }
            }

            let totalValue = 0;
            for (const [, series] of Object.entries(
              newObjectWithoutRandomProperties ?? []
            )) {
              totalValue += series;
            }

            const result = (
              <StackedBarTooltipContainer
                css={css({
                  position: "absolute",
                  top: -100,
                  left: `${bar.index > graphData.length / 2 ? 30 : 0}`,
                  right: `${bar.index > graphData.length / 2 ? 0 : 30}`,
                })}
              >
                <div
                  css={css({
                    minWidth: `${
                      Object.entries(newObjectWithoutRandomProperties).length >
                      6
                        ? "360px"
                        : "150px"
                    }`,
                  })}
                >
                  {moment(time * 1000).format("ll LT")}
                  <div>Total: {formatUSDCentsRoundNearest(totalValue)}</div>
                  <Grid
                    css={css({
                      gridTemplateColumns:
                        Object.entries(newObjectWithoutRandomProperties)
                          .length > 6
                          ? "1fr 1fr"
                          : "1fr",
                    })}
                  >
                    {Object.entries(newObjectWithoutRandomProperties ?? [])
                      .sort(([a], [b]) => {
                        const defA = STRONG_SUBVOLTS[a as GlobalId];
                        const defB = STRONG_SUBVOLTS[b as GlobalId];
                        if (defA && defB) {
                          return (
                            defA.volt - defB.volt ||
                            defA.globalId.localeCompare(defB.globalId)
                          );
                        }
                        return 0;
                      })
                      .map(([globalId, pnl]) => {
                        const def = STRONG_SUBVOLTS[globalId as GlobalId];
                        return (
                          <GridItem key={globalId}>
                            <div
                              css={css`
                                display: flex;
                                flex-direction: row;
                                align-items: center;

                                .centeredVoltNumber {
                                  align-self: center;
                                }
                              `}
                            >
                              <Shrink>
                                <VoltNumber
                                  voltNum={def.volt}
                                  className="centeredVoltNumber"
                                />
                                <AssetLogoWrapper>
                                  <AutoUniversalAssetLogo def={def} />
                                </AssetLogoWrapper>
                              </Shrink>
                              <span className="dolla">
                                {typeof pnl === "number"
                                  ? formatUSDCentsRoundNearest(pnl)
                                  : "..."}
                              </span>
                            </div>
                          </GridItem>
                        );
                      })}
                  </Grid>
                </div>
              </StackedBarTooltipContainer>
            );

            return result;
          }}
        />
      </GraphWrapper>
    </GraphContainer>
  );
};

const GraphContainer = styled.div`
  padding-left: 5px;
  padding-right: 20px;
  margin-bottom: 20px;
  position: relative;
  z-index: 5;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: left;
  width: 100%;
`;

// 210px is the sweet spot due to the vertical line
const GraphWrapper = styled.div`
  backdrop-filter: blur(1px);
  width: 100%;
  height: 130px;
  color: #000;
  background: transparent;

  @media print {
    & {
      outline: 1px solid rgba(0, 0, 0, 0.2);
    }
  }
  transition: background 0.2s ease-in-out;
  border-radius: 4px;
  position: relative;
  &,
  div > svg {
    border-radius: 4px;
  }
  &.loading {
    .loadingLabel {
      opacity: 1;
    }
  }
  &.loaded {
    .loadingLabel {
      opacity: 0;
    }
  }
  svg {
    g {
      text {
        opacity: 0.9;
        transition: opacity 0.4s ease-in-out;
      }
    }
  }
  svg + div {
    /* transform: unset !important; */
    /* position: absolute;
  left: 0;
  right: 0; */
  }
  &.priceAndStrike {
    svg > g:first-of-type > path:first-of-type {
      stroke-dasharray: 1, 2;
    }
    svg > g:first-of-type > path:nth-of-type(2) {
      stroke-dasharray: 1, 2;
    }
  }
  &.tvlUsd {
    /* height: 210; */
    svg > g:first-of-type > g:first-of-type {
      opacity: 0.6;
    }
    text {
      @media print {
        fill: #333 !important;
      }
    }
  }
  &:hover {
    /* background: hsla(230, 15%, 50%, 0.2); */

    svg {
      g {
        text {
          opacity: 1;
        }
      }
    }
  }
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -webkit-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
`;

const AssetLogoWrapper = styled.div`
  display: flex;
`;

const EmptyChart = styled.div`
  display: flex;
  height: 230px;
  width: 100%;
  font-size: 18px;
  align-items: center;
  justify-content: center;
  font-family: "Euclid Circular B";
`;

const Grid = styled.div`
  display: grid;
  width: 100%;
`;

const GridItem = styled.div`
  /* width: 150px; */
`;
const Shrink = styled.div`
  display: flex;
  flex-direction: row;
  transform: scale(0.6);
  transform-origin: left;
`;

const StackedBarTooltipContainer = styled.div`
  background: hsla(230, 15%, 15%, 0.9);
  backdrop-filter: blur(2px);
  border-radius: 4px;
  padding: 6px 12px;
  color: #ffffff;
  /* Theres weird artifacts due to backdrop filter. we need to scale to fix */
  transform: translate(0%, 60px) scale(1.01);
  transition: transform 0.1s !important;
  z-index: 1000;
  font-family: "Euclid Circular B";

  .dolla {
    min-width: 50px;
    text-align: right;
  }
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -webkit-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
`;

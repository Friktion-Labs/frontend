import { Theme } from "@nivo/core";
import { GlobalId } from "./registry10";

import { ResponsiveLine } from "@nivo/line";

import {
  AlanGreenSpan,
  BlueA,
  BlueB,
  BlueSpan,
  GreenA,
  PinkA,
  PinkSpan,
  VioletA,
  VioletSpan,
  YellowA,
  YellowSpan,
} from "./glow09";
import { css, SerializedStyles } from "@emotion/react";
import {
  GraphContainer,
  GraphWrapper,
  AbsoluteLabel,
  loading,
} from "./AnalyticsGraphsCommon";
import moment from "moment";
import { formatUSDRoundDown } from "./format09";
import { useQuery } from "react-query";
import { useAuctionResults } from "./AuctionResults";
import { useMemo } from "react";
// hsl(230, 15%, 20%) #2b2e3b
// hsl(230, 15%, 80%) #c4c7d4
// let perf = 0;
// const font = `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen","Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",sans-serif`;

const neutralTheme: Theme = {
  background: "transparent",
  textColor: "#000",
  fontSize: 11,
  fontFamily: "Euclid Circular B",
  axis: {
    domain: {
      line: {
        stroke: "#fff",
        strokeWidth: 1,
      },
    },
    legend: {
      text: {
        // "fcBTC volt token price"
        fontSize: 18,
        fill: "#fff",
        fontWeight: 700,
        // opacity: 0.8,
        fontFamily: "Euclid Circular B",
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
        fontFamily: "Euclid Circular B",
      },
    },
  },
  // grid: {
  //   line: {
  //     stroke: hsl80,
  //     strokeWidth: 1,
  //   },
  // },
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

type NumberOrNull = number | null;
type Cell = [number, NumberOrNull[]];

export const AnalyticsTVLUSDGraph: React.FC<{
  className?: string;
  css?: SerializedStyles;
}> = ({ className }) => {
  const tvlAggQuery = useQuery<unknown, unknown, Array<string[] | Cell>>(
    "tvlAgg",
    () => {
      return fetch(
        `https://friktion-labs.github.io/mainnet-tvl-snapshots/derived_timeseries/tvl_usd_agg.json`
      ).then((res) => res.json());
    }
  );

  const title = `TVL by Volt`;

  if (tvlAggQuery.data === undefined) {
    return (
      <GraphContainer className={"graphContainer " + className}>
        <GraphWrapper className="loading">
          <AbsoluteLabel>{title}</AbsoluteLabel>
          {loading}
        </GraphWrapper>
      </GraphContainer>
    );
  }

  const voltSeries: Record<
    "1" | "2" | "3" | "4" | "5",
    {
      id: string;
      color: "red"; // will be replaced
      data: Array<{ x: Date; y: number }>;
    }
  > = {
    1: {
      id: "1",
      color: "red",
      data: [],
    },
    2: {
      id: "2",
      color: "red",
      data: [],
    },
    3: {
      id: "3",
      color: "red",
      data: [],
    },
    4: {
      id: "4",
      color: "red",
      data: [],
    },
    5: {
      id: "5",
      color: "red",
      data: [],
    },
  };

  const index = tvlAggQuery.data[0] as GlobalId[];
  const rawTimeseries = tvlAggQuery.data;
  let tvlATH = 0;
  rawTimeseries.forEach((entry) => {
    if (entry[0] && typeof entry[0] === "string") {
      return;
    }
    const [timestamp, tvlByIndex] = entry as Cell;
    const sumOfPricesByIndex = tvlByIndex.reduce(
      (acc: number, price) => acc + (price === null ? 0 : price),
      0
    );
    if (sumOfPricesByIndex > tvlATH) {
      tvlATH = sumOfPricesByIndex;
    }

    let volt1Tvl = 0;
    let volt2Tvl = 0;
    let volt3Tvl = 0;
    let volt4Tvl = 0;
    let volt5Tvl = 0;

    for (let i = 0; i < tvlByIndex.length; i++) {
      const tvl = tvlByIndex[i];
      const tvlNonNull = tvl === null ? 0 : tvl;
      if (index[i].includes("mainnet_income_call")) {
        volt1Tvl += tvlNonNull;
      } else if (index[i].includes("mainnet_income_put")) {
        volt2Tvl += tvlNonNull;
      } else if (index[i].includes("income_perp")) {
        volt3Tvl += tvlNonNull;
      } else if (index[i].includes("basis")) {
        volt4Tvl += tvlNonNull;
      } else if (index[i].includes("prot")) {
        volt5Tvl += tvlNonNull;
      }
    }
    voltSeries[1].data.push({ x: new Date(timestamp), y: volt1Tvl });
    voltSeries[2].data.push({ x: new Date(timestamp), y: volt2Tvl });
    voltSeries[3].data.push({ x: new Date(timestamp), y: volt3Tvl });
    voltSeries[4].data.push({ x: new Date(timestamp), y: volt4Tvl });
    voltSeries[5].data.push({ x: new Date(timestamp), y: volt5Tvl });
  });

  const sortedData = Object.values(voltSeries);

  return (
    <GraphContainer className={"graphContainer " + className}>
      <GraphWrapper className="loaded tvlUsd">
        <AbsoluteLabel>{title}</AbsoluteLabel>
        {loading}
        <ResponsiveLine
          data={sortedData}
          yScale={{
            type: "linear",
            stacked: true,
            min: 0,
            max: tvlATH * 1.3,
          }}
          theme={neutralTheme}
          xScale={{
            type: "time",
            format: "%Y-%m-%d",
            useUTC: false,
            precision: "hour",
            // min: rawTimeseries,
            min: new Date(1641157200000),
          }}
          enableArea={true}
          areaOpacity={1}
          // axisLeft={null}
          axisLeft={{
            format: (v) => `${v === 0 ? "$0M" : `$${v / 1000000}M`}`,
          }}
          // axisBottom={null}
          axisBottom={{
            format: "%b %d",
            tickValues: "every 28 days",
            // legend: `${def.shareTokenSymbol} volt token price`,
            // legendPosition: "middle",
            // legendOffset: -24,

            // format: function (value) {
            //   return moment.unix(value).format("MMMM Do YYYY, h:mm");
            // },
          }}
          curve={"linear"}
          colors={({ id }) => {
            if (id === "1") {
              return BlueA;
            } else if (id === "2") {
              return GreenA;
            } else if (id === "3") {
              return YellowA;
            } else if (id === "4") {
              return PinkA;
            } else {
              return VioletA;
            }
          }}
          enablePointLabel={false}
          // pointSymbol={CustomSymbol}
          // pointSize={16}
          // pointBorderWidth={1}
          crosshairType="cross"
          pointBorderColor={{
            from: "color",
            // modifiers: [["darker", 0.3]],
          }}
          enableSlices={"x"}
          // useMesh={true}
          enablePoints={false}
          // pointSize={0}
          enableGridX={false}
          enableGridY={false}
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
                { offset: 100, color: BlueB },
              ],
            },
          ]}
          fill={[
            // // match using function
            { match: (d) => d.id === "1", id: "gradient1" },
            // { match: (d) => d.id === "2", id: "gradient2" },
            // match all, will only affect 'elm', because once a rule match,
            // others are skipped, so now it acts as a fallback
            // { match: "*", id: "gradientC" },
          ]}
          motionConfig={"stiff"}
          sliceTooltip={(slice) => {
            const points = slice.slice.points;
            if (!points || points.length < 4) {
              return <div></div>;
            }
            const volt1Point =
              points.find((point) => point.serieId === "1") || points[0];
            const volt2Point =
              points.find((point) => point.serieId === "2") || points[0];
            const volt3Point =
              points.find((point) => point.serieId === "3") || points[0];
            const volt4Point =
              points.find((point) => point.serieId === "4") || points[0];
            const volt5Point =
              points.find((point) => point.serieId === "5") || points[0];

            let time = volt1Point.data.x as Date;

            // const start = performance.now();

            const result = (
              <div
                css={css`
                  background: hsla(230, 15%, 15%, 0.7);
                  backdrop-filter: blur(2px);
                  border-radius: 4px;
                  padding: 6px 12px;
                  line-height: 1.35;
                  font-size: 12px;
                  color: #ffffff;
                  text-align: center;
                  /* Theres weird artifacts due to backdrop filter. we need to scale to fix */
                  transform: translate(0%, 60px) scale(1.01);
                  transition: transform 0.1s !important;
                  z-index: 6;
                  -webkit-backface-visibility: hidden;
                  -moz-backface-visibility: hidden;
                  -webkit-transform: translate3d(0, 0, 0);
                  -moz-transform: translate3d(0, 0, 0);
                `}
              >
                <div>
                  {moment(time).format("ll LT")}
                  <table
                    css={css`
                      td:first-of-type {
                      }
                      .dolla {
                        padding-left: 4px;
                        text-align: right;
                      }
                    `}
                  >
                    <tbody>
                      <tr>
                        <td>Total</td>
                        <td className="dolla">
                          {formatUSDRoundDown(
                            Number(volt1Point.data.y) +
                              Number(volt2Point.data.y) +
                              Number(volt3Point.data.y) +
                              Number(volt4Point.data.y) +
                              Number(volt5Point.data.y)
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <BlueSpan>Volt #01</BlueSpan>
                        </td>
                        <td className="dolla">
                          {formatUSDRoundDown(Number(volt1Point.data.y))}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <AlanGreenSpan>Volt #02</AlanGreenSpan>
                        </td>
                        <td className="dolla">
                          {formatUSDRoundDown(Number(volt2Point.data.y))}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <YellowSpan>Volt #03</YellowSpan>
                        </td>
                        <td className="dolla">
                          {formatUSDRoundDown(Number(volt3Point.data.y))}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <PinkSpan>Volt #04</PinkSpan>
                        </td>
                        <td className="dolla">
                          {formatUSDRoundDown(Number(volt4Point.data.y))}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <VioletSpan>Volt #05</VioletSpan>
                        </td>
                        <td className="dolla">
                          {formatUSDRoundDown(Number(volt5Point.data.y))}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            );

            // perf += performance.now() - start;
            // console.log(perf);
            return result;
          }}
        />
      </GraphWrapper>
    </GraphContainer>
  );
};

// Creates ticks 100M in size, including 0, and one above if within 50M
function make200MTicks(allTimeHighValueInDollars: number) {
  const ticks = [];

  let current = 0;
  while (current * 200_000_000 < allTimeHighValueInDollars) {
    ticks.push(current * 200_000_000);
    current++;
  }
  return ticks;
}

export const VolumeGraph: React.FC<{
  className?: string;
  css?: SerializedStyles;
}> = ({ className }) => {
  const { auctionData } = useAuctionResults();
  const title = `Volume by Volt`;

  const reverseSortedMainnetData = useMemo(() => {
    return auctionData === null
      ? []
      : auctionData.slice().sort((a, b) => {
          return a.endEpoch - b.endEpoch;
        });
  }, [auctionData]);

  if (reverseSortedMainnetData.length === 0) {
    return (
      <GraphContainer className={"graphContainer " + className}>
        <GraphWrapper className="loading">
          <AbsoluteLabel>{title}</AbsoluteLabel>
          {loading}
        </GraphWrapper>
      </GraphContainer>
    );
  }

  const volt1Serie: {
    id: string;
    color: string;
    data: { x: Date; y: number }[];
  } = {
    id: "1",
    color: "red",
    data: [],
  };
  const volt2Serie: {
    id: string;
    color: string;
    data: { x: Date; y: number }[];
  } = {
    id: "2",
    color: "red",
    data: [],
  };
  const volt3Serie: {
    id: string;
    color: string;
    data: { x: Date; y: number }[];
  } = {
    id: "3",
    color: "red",
    data: [],
  };
  const volt4Serie: {
    id: string;
    color: string;
    data: { x: Date; y: number }[];
  } = {
    id: "4",
    color: "red",
    data: [],
  };
  const volt5Serie: {
    id: string;
    color: string;
    data: { x: Date; y: number }[];
  } = {
    id: "5",
    color: "red",
    data: [],
  };

  let volt1Cum = 0;
  let volt2Cum = 0;
  let volt3Cum = 0;
  let volt4Cum = 0;
  let volt5Cum = 0;

  if (reverseSortedMainnetData.length) {
    let currentTimestamp = reverseSortedMainnetData[0].endEpoch;
    reverseSortedMainnetData.forEach((row) => {
      const volt = row.globalId.includes("income_put")
        ? 2
        : row.globalId.includes("income_perp")
        ? 3
        : row.globalId.includes("basis")
        ? 4
        : row.globalId.includes("prot")
        ? 5
        : 1;
      const volumeForRow =
        volt === 2
          ? row.balanceStart
          : row.balanceStart * row.spotPriceAtAuctionEnd;
      if (volumeForRow > 26_000_000) {
        console.warn(`Abnormal volume $${volumeForRow}`);
        console.warn(row);
      }
      // console.log(new Date(row.endEpoch * 1000), row, volumeForRow);
      if (row.endEpoch === currentTimestamp) {
        if (volt === 1) {
          volt1Cum += volumeForRow;
        } else if (volt === 2) {
          volt2Cum += volumeForRow;
        } else if (volt === 3) {
          volt3Cum += volumeForRow;
        } else if (volt === 4) {
          volt4Cum += volumeForRow;
        } else {
          volt5Cum += volumeForRow;
        }
      } else {
        // Push the old data
        if (currentTimestamp * 1000 < Date.now()) {
          // We want to align TVL x axis with cumulative volume x axis
          const pushTimestamp =
            currentTimestamp * 1000 < 1641157200000
              ? 1641157200000
              : currentTimestamp * 1000;
          volt1Serie.data.push({
            x: new Date(pushTimestamp),
            y: volt1Cum,
          });
          volt2Serie.data.push({
            x: new Date(pushTimestamp),
            y: volt2Cum,
          });
          volt3Serie.data.push({
            x: new Date(pushTimestamp),
            y: volt3Cum,
          });
          volt4Serie.data.push({
            x: new Date(pushTimestamp),
            y: volt4Cum,
          });
          volt5Serie.data.push({
            x: new Date(pushTimestamp),
            y: volt5Cum,
          });
        }

        if (volt === 1) {
          volt1Cum += volumeForRow;
        } else if (volt === 2) {
          volt2Cum += volumeForRow;
        } else if (volt === 3) {
          volt3Cum += volumeForRow;
        } else if (volt === 4) {
          volt4Cum += volumeForRow;
        } else {
          volt5Cum += volumeForRow;
        }
        currentTimestamp = row.endEpoch;
      }
    });

    if (currentTimestamp * 1000 < Date.now()) {
      volt1Serie.data.push({
        x: new Date(currentTimestamp * 1000),
        y: volt1Cum,
      });
      volt2Serie.data.push({
        x: new Date(currentTimestamp * 1000),
        y: volt2Cum,
      });
      volt3Serie.data.push({
        x: new Date(currentTimestamp * 1000),
        y: volt3Cum,
      });
      volt4Serie.data.push({
        x: new Date(currentTimestamp * 1000),
        y: volt4Cum,
      });
      volt5Serie.data.push({
        x: new Date(currentTimestamp * 1000),
        y: volt5Cum,
      });
    }
  }

  let volt1Max = 0;
  let volt2Max = 0;
  let volt3Max = 0;
  let volt4Max = 0;
  let volt5Max = 0;

  if (volt1Serie.data.length) {
    volt1Serie.data.push({
      x: new Date(),
      y: volt1Serie.data[volt1Serie.data.length - 1].y,
    });
    volt1Max = volt1Serie.data[volt1Serie.data.length - 1].y;
  }
  if (volt2Serie.data.length) {
    volt2Serie.data.push({
      x: new Date(),
      y: volt2Serie.data[volt2Serie.data.length - 1].y,
    });
    volt2Max = volt2Serie.data[volt2Serie.data.length - 1].y;
  }
  if (volt3Serie.data.length) {
    volt3Serie.data.push({
      x: new Date(),
      y: volt3Serie.data[volt3Serie.data.length - 1].y,
    });
    volt3Max = volt3Serie.data[volt3Serie.data.length - 1].y;
  }
  if (volt4Serie.data.length) {
    volt4Serie.data.push({
      x: new Date(),
      y: volt4Serie.data[volt4Serie.data.length - 1].y,
    });
    volt4Max = volt4Serie.data[volt4Serie.data.length - 1].y;
  }
  if (volt5Serie.data.length) {
    volt5Serie.data.push({
      x: new Date(),
      y: volt5Serie.data[volt5Serie.data.length - 1].y,
    });
    volt5Max = volt5Serie.data[volt5Serie.data.length - 1].y;
  }

  return (
    <GraphContainer className={"graphContainer " + className}>
      <GraphWrapper className="loaded tvlUsd">
        <AbsoluteLabel>{title}</AbsoluteLabel>
        {loading}
        <ResponsiveLine
          data={[volt1Serie, volt2Serie, volt3Serie, volt4Serie, volt5Serie]}
          yScale={{
            type: "linear",
            stacked: true,
            min: 0,
            max: (volt1Max + volt2Max + volt3Max + volt4Max + volt5Max) * 1.12,
          }}
          theme={neutralTheme}
          xScale={{
            type: "time",
            format: "%Y-%m-%d",
            useUTC: false,
            precision: "hour",
            min: new Date(1641157200000),
          }}
          enableArea={true}
          areaOpacity={1}
          // axisLeft={null}
          axisLeft={{
            format: (v) => `${v === 0 ? "$0M" : `$${v / 1000000}M`}`,
            // tickValues: makeTicks(min, max),
            tickValues: make200MTicks(
              volt1Max + volt2Max + volt3Max + volt4Max + volt5Max
            ),
          }}
          // axisBottom={null}
          axisBottom={{
            format: "%b %d",
            tickValues: "every 28 days",
          }}
          curve={"stepAfter"}
          colors={({ id }) => {
            if (id === "1") {
              return BlueA;
            } else if (id === "2") {
              return GreenA;
            } else if (id === "3") {
              return YellowA;
            } else if (id === "4") {
              return PinkA;
            } else {
              return VioletA;
            }
          }}
          enablePointLabel={false}
          // pointSymbol={CustomSymbol}
          // pointSize={16}
          // pointBorderWidth={1}
          crosshairType="cross"
          pointBorderColor={{
            from: "color",
            // modifiers: [["darker", 0.3]],
          }}
          enableSlices={"x"}
          // useMesh={true}
          enablePoints={false}
          // pointSize={0}
          enableGridX={false}
          enableGridY={false}
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
                { offset: 100, color: BlueB },
              ],
            },
          ]}
          fill={[
            // // match using function
            { match: (d) => d.id === "1", id: "gradient1" },
            // { match: (d) => d.id === "2", id: "gradient2" },
            // match all, will only affect 'elm', because once a rule match,
            // others are skipped, so now it acts as a fallback
            // { match: "*", id: "gradientC" },
          ]}
          motionConfig={"stiff"}
          sliceTooltip={(slice) => {
            const points = slice.slice.points;
            if (!points || points.length < 5) {
              return <div></div>;
            }
            const volt1Point =
              points.find((point) => point.serieId === "1") || points[0];
            const volt2Point =
              points.find((point) => point.serieId === "2") || points[0];
            const volt3Point =
              points.find((point) => point.serieId === "3") || points[0];
            const volt4Point =
              points.find((point) => point.serieId === "4") || points[0];
            const volt5Point =
              points.find((point) => point.serieId === "5") || points[0];
            let time = volt1Point.data.x as Date;

            // const start = performance.now();

            const result = (
              <div
                css={css`
                  background: hsla(230, 15%, 15%, 0.7);
                  backdrop-filter: blur(2px);
                  border-radius: 4px;
                  padding: 6px 12px;
                  line-height: 1.35;
                  font-size: 12px;
                  color: #ffffff;
                  text-align: center;
                  /* Theres weird artifacts due to backdrop filter. we need to scale to fix */
                  transform: translate(0%, 60px) scale(1.01);
                  transition: transform 0.1s !important;
                  -webkit-backface-visibility: hidden;
                  -moz-backface-visibility: hidden;
                  -webkit-transform: translate3d(0, 0, 0);
                  -moz-transform: translate3d(0, 0, 0);
                `}
              >
                <div>
                  {moment(time).format("ll LT")}
                  <table
                    css={css`
                      td:first-of-type {
                      }
                      .dolla {
                        padding-left: 4px;
                        text-align: right;
                      }
                    `}
                  >
                    <tbody>
                      <tr>
                        <td>Total</td>
                        <td className="dolla">
                          {formatUSDRoundDown(
                            Number(volt1Point.data.y) +
                              Number(volt2Point.data.y) +
                              Number(volt3Point.data.y) +
                              Number(volt4Point.data.y)
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <VioletSpan>Volt #05</VioletSpan>
                        </td>
                        <td className="dolla">
                          {formatUSDRoundDown(Number(volt5Point.data.y))}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <PinkSpan>Volt #04</PinkSpan>
                        </td>
                        <td className="dolla">
                          {formatUSDRoundDown(Number(volt4Point.data.y))}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <YellowSpan>Volt #03</YellowSpan>
                        </td>
                        <td className="dolla">
                          {formatUSDRoundDown(Number(volt3Point.data.y))}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <AlanGreenSpan>Volt #02</AlanGreenSpan>
                        </td>
                        <td className="dolla">
                          {formatUSDRoundDown(Number(volt2Point.data.y))}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <BlueSpan>Volt #01</BlueSpan>
                        </td>
                        <td className="dolla">
                          {formatUSDRoundDown(Number(volt1Point.data.y))}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            );

            // perf += performance.now() - start;
            // console.log(perf);
            return result;
          }}
        />
      </GraphWrapper>
    </GraphContainer>
  );
};

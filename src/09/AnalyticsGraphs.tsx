import {
  EpochRow,
  formatOptionProductShort,
  parseOptionProduct,
  SubvoltDef10,
} from "./registry10";

import { ResponsiveLine } from "@nivo/line";
import { BarDatum, ResponsiveBar } from "@nivo/bar";

import { Theme } from "@nivo/core";
import moment from "moment";
import {
  AlanGreenSpan,
  BlueA,
  BlueB,
  BlueSpan,
  GreenA,
  GreenB,
  YellowA,
  YellowB,
  PinkA,
  PinkB,
  PinkSpan,
  YellowSpan,
  VioletSpan,
  VioletA,
  VioletB,
} from "./glow09";
import { css } from "@emotion/react";
import { useElementSize } from "usehooks-ts";
import { Card09Props } from "./Card10";
import { formatUSDForPrice } from "./format09";
import {
  GraphContainer,
  GraphWrapper,
  AbsoluteLabel,
  loading,
  noData,
  colorGain,
  colorLoss,
  generateIntervalBasedOnTimeRange,
} from "./AnalyticsGraphsCommon";
import { useEffect, useState } from "react";
import profitRangeFormula from "./voltPics/profitRangeFormula.png";
import { ProfitRangeDataPoint, profitRangeForEpochRow } from "./CrabAnalytics";
import { Popover } from "antd";
import { getFundingForUnderlying } from "./BasisAnalytics";
// const font = `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen","Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",sans-serif`;
const hsl80 = "#c4c7d4";
export const theme: Theme = {
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
        fontSize: 11,
        fill: hsl80,
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

// Creates ticks from min to max, in increments, with multiples that hit 0.00
// Result is not the absolute amount, but rather amount from min
function makeTicks(min: number, max: number, size: number) {
  const ticks = [];
  let current = Math.round(Math.ceil(min / size) * size * 1000) / 1000;
  while (current < max) {
    ticks.push(current - min);
    current = Math.round((current + size) * 1000) / 1000; // float epsilon
  }
  return ticks;
}

export const SharePricePlot: React.FC<{
  def: SubvoltDef10;
  timeseries: [number, number][] | undefined;
  card: Card09Props;
}> = ({ def, timeseries, card }) => {
  let ColorSpan: typeof BlueSpan;
  if (def.volt === 1) {
    ColorSpan = BlueSpan;
  } else if (def.volt === 2) {
    ColorSpan = AlanGreenSpan;
  } else if (def.volt === 3) {
    ColorSpan = YellowSpan;
  } else if (def.volt === 4) {
    ColorSpan = PinkSpan;
  } else if (def.volt === 5) {
    ColorSpan = VioletSpan;
  } else {
    ColorSpan = BlueSpan;
  }
  const [wrapperRef, { width: wrapperWidth }] = useElementSize();

  const colorA =
    def.volt === 1
      ? BlueA
      : def.volt === 2
      ? GreenA
      : def.volt === 3
      ? YellowA
      : def.volt === 4
      ? PinkA
      : VioletA;
  const colorB =
    def.volt === 1
      ? BlueB
      : def.volt === 2
      ? GreenB
      : def.volt === 3
      ? YellowB
      : def.volt === 4
      ? PinkB
      : VioletB;

  const patchedTheme = Object.assign({}, theme, {
    crosshair: {
      line: {
        stroke: colorA,
        strokeWidth: 1,
        strokeOpacity: 1,
      },
    },
    axis: {
      domain: {
        line: {
          stroke: colorA,
          strokeWidth: 1,
        },
      },
      legend: {
        text: {
          // "fcBTC volt token price"
          fontSize: 18,
          fill: colorA,
          fontWeight: 700,
          // opacity: 0.8,
          fontFamily: "Euclid Circular B",
        },
      },
      ticks: {
        line: {
          stroke: colorA,
          strokeWidth: 1,
        },
        text: {
          // "Jan 20"
          // ""
          fontSize: 11,
          fill: colorA,
          fontFamily: "Euclid Circular B",
        },
      },
    },
  });
  const basisGraphTheme = Object.assign({}, theme, {
    crosshair: {
      line: {
        stroke: colorB,
        strokeWidth: 1,
        strokeOpacity: 1,
      },
    },
    axis: {
      domain: {
        line: {
          stroke: colorB,
          strokeWidth: 1,
        },
      },
      legend: {
        text: {
          // "fcBTC volt token price"
          fontSize: 18,
          fill: colorB,
          fontWeight: 700,
          // opacity: 0.8,
          fontFamily: "Euclid Circular B",
        },
      },
      ticks: {
        line: {
          stroke: colorB,
          strokeWidth: 1,
        },
        text: {
          // "Jan 20"
          // ""
          fontSize: 11,
          fill: colorB,
          fontFamily: "Euclid Circular B",
        },
      },
    },
  });

  // for Volt 4 (Basis)
  const [basisFundingData, setBasisFundingData] = useState<[number, number][]>(
    []
  );

  useEffect(() => {
    if (def.volt !== 4) {
      return;
    }
    (async () => {
      if (def.volt === 4) {
        const result = await getFundingForUnderlying(def.underlying.symbol);
        setBasisFundingData(result);
      }
    })();
  }, [def.volt, def.underlying.symbol]);

  if (timeseries === undefined || !card.data) {
    return (
      <GraphContainer>
        <GraphWrapper className="loading">
          <AbsoluteLabel>
            <ColorSpan>Strategy Performance - {def.shareTokenSymbol}</ColorSpan>
          </AbsoluteLabel>
          {loading}
        </GraphWrapper>
      </GraphContainer>
    );
  }

  if (
    timeseries.length < 2 ||
    (def.volt === 4 && basisFundingData.length < 1)
  ) {
    return (
      <GraphContainer>
        <GraphWrapper className="loading">
          <AbsoluteLabel>
            <ColorSpan>Strategy Performance - {def.shareTokenSymbol}</ColorSpan>
          </AbsoluteLabel>
          {noData}
        </GraphWrapper>
      </GraphContainer>
    );
  }

  let min = 10;
  let max = 0;

  let filteredTimeseries: [number, number][] = [];
  const swings = 0.035;

  timeseries.forEach(([time, sharePrice]) => {
    if (filteredTimeseries.length === 0) {
      filteredTimeseries.push([time, sharePrice]);
    } else {
      const latest = filteredTimeseries[filteredTimeseries.length - 1];

      //Replace point every week UNLESS it's a potential erroneous data point (change > swing)
      if (
        time - latest[0] <
          (window.location.hash === "#nofilter" ? 0 : 60 * 60 * 24 * 1000) &&
        latest[1] - sharePrice < swings &&
        (def.volt === 1 || def.volt === 2)
      ) {
        filteredTimeseries[filteredTimeseries.length - 1][0] = time;
        filteredTimeseries[filteredTimeseries.length - 1][1] = sharePrice;
      } else {
        if (sharePrice > 0.5) filteredTimeseries.push([time, sharePrice]);
      }
    }
  });

  // filteredTimeseries = filteredTimeseries.filter(
  //   (item) => !remove_vals.includes(item[1])
  // );

  filteredTimeseries.forEach(([time, sharePrice]) => {
    if (sharePrice < min) {
      min = sharePrice;
    }
    if (sharePrice > max) {
      max = sharePrice;
    }
  });

  const minmaxDifference = Math.abs(max - min);

  // We want axis to have minimum of 0.05, otherwise small changes are exaggeraged
  const compensation =
    minmaxDifference < 0.05 ? (0.05 - minmaxDifference) / 2 : 0;

  const timeData = [
    {
      id: "sharePrice",
      color: "hsl(230,15%, 20%)",
      data: filteredTimeseries.map(([time, sharePrice]) => {
        return {
          x: new Date(time),
          y: sharePrice,
        };
      }),
    },
  ];

  const realMin =
    Math.floor((min - 0.05 * (max - min) - compensation) * 100) / 100;
  const realMax = max + 0.3 * (max - min) + compensation;

  timeData[0].data = timeData[0].data.map((realData) => {
    return {
      x: realData.x,
      y: realData.y - realMin,
    };
  });
  const tickSize =
    realMax - realMin > 0.3 ? 0.05 : realMax - realMin > 0.15 ? 0.02 : 0.01;

  let basisData: BarDatum[] = [];
  if (def.volt === 4) {
    const filteredBasisFundingData = basisFundingData.filter(([date, y]) => {
      return (
        date < filteredTimeseries[filteredTimeseries.length - 1][0] &&
        date > filteredTimeseries[0][0]
      );
    });

    basisData = filteredBasisFundingData.map(([time, funding]) => {
      return {
        time: time,
        apy: funding,
      };
    });
  }

  const tallerChart =
    def.volt === 4
      ? css`
          height: 280px !important;
        `
      : css``;

  return (
    <GraphContainer>
      <GraphWrapper className="loaded" ref={wrapperRef} css={tallerChart}>
        <AbsoluteLabel>
          <ColorSpan
            css={css`
              @media only screen and (max-width: 530px) {
                width: 200px;
              }
            `}
          >
            Strategy Performance - {def.shareTokenSymbol}{" "}
            {
              <Popover
                destroyTooltipOnHide
                placement="bottom"
                content={
                  <span
                    css={css`
                      display: block;
                      max-width: 250px;
                      font-size: 14px;
                      font-family: "Euclid Circular B";
                    `}
                  >
                    <p>
                      fTokens such as {def.shareTokenSymbol} represent your
                      ownership in a Friktion Volt, allowing the strategy PnL to
                      accrue to wherever the token is being held. Read more
                      about Friktion's fTokens{" "}
                      <a
                        href="https://docs.friktion.fi/volts/user-flow#friktions-ftokens"
                        target="_blank"
                        rel="noreferrer"
                      >
                        here
                      </a>
                      .
                    </p>
                    {def.volt === 4 && (
                      <p>
                        The average perpetual funding rate (APY) is also shown.
                        Long basis generates positive returns when funding rates
                        are negative!
                      </p>
                    )}
                  </span>
                }
              >
                <span
                  css={css`
                    &:after {
                      content: "ⓘ";
                      font-size: 12px;
                      font-weight: bold;
                      font-family: "Euclid Circular B";
                      cursor: pointer;
                    }
                  `}
                ></span>
              </Popover>
            }
          </ColorSpan>
        </AbsoluteLabel>
        {loading}
        {def.volt === 4 && (
          <div
            css={css`
              position: absolute;
              height: 280px;
              width: 100%;
              top: -22px;
            `}
          >
            (
            <ResponsiveBar
              data={basisData}
              keys={["apy"]}
              indexBy="time"
              theme={
                basisGraphTheme && {
                  axis: {
                    domain: {
                      line: {
                        stroke: colorB,
                        strokeWidth: 1,
                      },
                    },
                    legend: {
                      text: {
                        fontSize: 12,
                        fill: colorB,
                        fontWeight: 400,
                        fontFamily: "Euclid Circular B",
                      },
                    },
                    ticks: {
                      line: {
                        stroke: colorB,
                        strokeWidth: 1,
                      },
                      text: {
                        // "Jan 20"
                        // ""
                        fontSize: 11,
                        fill: colorB,
                        fontFamily: "Euclid Circular B",
                      },
                    },
                  },
                  grid: {
                    line: {
                      stroke: colorB,
                      strokeWidth: 2,
                      strokeOpacity: "80%",
                    },
                  },
                }
              }
              minValue={-130}
              maxValue={750}
              indexScale={{ round: false, type: "band" }}
              gridYValues={[0]}
              axisLeft={null}
              axisBottom={null}
              axisRight={{
                tickSize: 0,
                legend: "Funding Rate (APY)",
                legendOffset: 45,
                legendPosition: "middle",
              }}
              colors={() => {
                return colorB;
              }}
              enableGridX={false}
              enableGridY={true}
              enableLabel={false}
              margin={{
                top: 0,
                right: 65,
                bottom: 34,
                left: filteredTimeseries[0][1] > 10000 ? 55 : 45,
              }}
            />
            )
          </div>
        )}
        <div
          css={css`
            width: 100%;
            height: 100%;
            position: absolute;
          `}
        >
          <ResponsiveLine
            data={timeData}
            theme={patchedTheme}
            xScale={{
              type: "time",
              format: "%Y-%m-%d",
              useUTC: false,
              precision: "minute",
            }}
            yScale={{
              type: "linear",
              min: 0,
              max: realMax - realMin,
            }}
            enableArea={def.volt === 4 ? false : true}
            areaOpacity={0.5}
            axisLeft={{
              tickSize: tickSize,
              format: (v) => `${(v + realMin).toFixed(2)}`,
              tickValues: makeTicks(realMin, realMax, tickSize),
            }}
            axisBottom={{
              format: "%b %d",
              tickValues: generateIntervalBasedOnTimeRange(
                new Date(filteredTimeseries[0][0]),
                new Date(filteredTimeseries[filteredTimeseries.length - 1][0])
              ),
            }}
            curve={"linear"}
            colors={({ id, data }) => colorA}
            enablePointLabel={false}
            crosshairType="cross"
            pointBorderColor={{
              from: "color",
            }}
            useMesh={true}
            enablePoints={false}
            enableGridX={false}
            enableGridY={false}
            pointLabelYOffset={-15}
            margin={{
              top: 0,
              right: def.volt === 4 ? 65 : 0,
              bottom: 34,
              left: 45,
            }}
            defs={[
              {
                id: "gradientC",
                type: "linearGradient",
                colors: [
                  { offset: 20, color: colorA },
                  { offset: 100, color: colorB },
                ],
              },
            ]}
            fill={[
              // // match using function
              // { match: (d) => d.id === "vue", id: "gradientB" },
              // match all, will only affect 'elm', because once a rule match,
              // others are skipped, so now it acts as a fallback
              { match: "*", id: "gradientC" },
            ]}
            motionConfig={"stiff"}
            tooltip={({ point }) => {
              let time = point ? (point.data.x as Date) : null;

              const cumulativeYield = filteredTimeseries.length
                ? ((Number(point.data.y) + realMin) / filteredTimeseries[0][1] -
                    1 >=
                  0
                    ? "+"
                    : "") +
                  (
                    ((Number(point.data.y) + realMin) /
                      filteredTimeseries[0][1] -
                      1) *
                    100
                  ).toFixed(2) +
                  "%"
                : "";
              return (
                <div
                  css={css`
                    /* background: ${colorA}dd; */
                    background: hsla(230, 15%, 15%, 0.7);
                    backdrop-filter: blur(2px);
                    border-radius: 4px;
                    padding: 6px 12px;
                    line-height: 1.35;
                    font-size: 12px;
                    color: #ffffff;
                    text-align: center;
                    /* Theres weird artifacts due to backdrop filter. we need to scale to fix */
                    transform: translate(0%, 90px) scale(1.01);
                    /* border-radius: 80px; */
                    /* margin: 0 !important; */
                    /* padding: 0 !important; */
                    /* border: 2px solid red !important; */
                    transition: transform 0.1s !important;
                    /* position: absolute; */
                    /* top: 0; */
                    /* bottom: 0; */
                    /* left: 40px; */
                    ${wrapperWidth > 0 && point.x / wrapperWidth < 0.3
                      ? "transform: translate(50%, 90px) scale(1.01); left: 10px;"
                      : ""}
                    ${wrapperWidth > 0 && point.x / wrapperWidth > 0.7
                      ? "transform: translate(-50%, 90px) scale(1.01);right: 10px;"
                      : ""}
                              -webkit-backface-visibility: hidden;
                    -moz-backface-visibility: hidden;
                    -webkit-transform: translate3d(0, 0, 0);
                    -moz-transform: translate3d(0, 0, 0);
                  `}
                >
                  <div>
                    {moment(time).format("ll LT")}
                    {point ? (
                      <span>
                        <br />
                        {(Number(point.data.y) + realMin).toFixed(5)}{" "}
                        {def.depositToken.symbol}
                        <br />
                        Cumulative: {cumulativeYield}
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            }}
          />
        </div>
      </GraphWrapper>
    </GraphContainer>
  );
};

export const PriceAndStrikeChart: React.FC<{
  def: SubvoltDef10;
  timeseries: [number, number][] | undefined;
  epochRows: EpochRow[];
}> = ({ def, timeseries, epochRows }) => {
  let ColorSpan: typeof BlueSpan;
  if (def.volt === 1) {
    ColorSpan = BlueSpan;
  } else if (def.volt === 2) {
    ColorSpan = AlanGreenSpan;
  } else if (def.volt === 3) {
    ColorSpan = YellowSpan;
  } else if (def.volt === 4) {
    ColorSpan = PinkSpan;
  } else if (def.volt === 5) {
    ColorSpan = VioletSpan;
  } else {
    ColorSpan = BlueSpan;
  }

  const colorA =
    def.volt === 1
      ? BlueA
      : def.volt === 2
      ? GreenA
      : def.volt === 3
      ? YellowA
      : def.volt === 4
      ? PinkA
      : VioletA;
  const colorB =
    def.volt === 1
      ? BlueB
      : def.volt === 2
      ? GreenB
      : def.volt === 3
      ? YellowB
      : def.volt === 4
      ? PinkB
      : VioletB;

  const patchedTheme = Object.assign({}, theme, {
    crosshair: {
      line: {
        stroke: colorA,
        strokeWidth: 1,
        strokeOpacity: 1,
      },
    },
    axis: {
      domain: {
        line: {
          stroke: colorA,
          strokeWidth: 1,
        },
      },
      legend: {
        text: {
          // "fcBTC volt token price"
          fontSize: 18,
          fill: colorA,
          fontWeight: 700,
          // opacity: 0.8,
          fontFamily: "Euclid Circular B",
        },
      },
      ticks: {
        line: {
          stroke: colorA,
          strokeWidth: 1,
        },
        text: {
          // "Jan 20"
          // ""
          fontSize: 11,
          fill: colorA,
          fontFamily: "Euclid Circular B",
        },
      },
    },
  });

  const title = `${def.underlying.symbol} ${
    def.volt === 3
      ? "Profit Range"
      : def.volt === 4 || def.volt === 5
      ? "Price"
      : "Price & Strike"
  }`;

  // for Volt 3 (Crab)
  const [profitRangesForEpochRows, setProfitRangesForEpochRows] = useState<
    ProfitRangeDataPoint[][]
  >([]);

  useEffect(() => {
    if (def.volt !== 3) {
      return;
    }
    (async () => {
      if (def.volt === 3) {
        const results = await Promise.all(
          epochRows
            .slice()
            .reverse()
            .map((row, idx) => {
              return profitRangeForEpochRow(row);
            })
        );
        setProfitRangesForEpochRows(results);
      }
    })();
  }, [epochRows, def.volt]);

  const titleSection =
    def.volt !== 3 ? (
      <AbsoluteLabel>
        <ColorSpan>{title}</ColorSpan>
      </AbsoluteLabel>
    ) : (
      <AbsoluteLabel>
        <ColorSpan>
          {title}{" "}
          <Popover
            destroyTooltipOnHide
            placement="bottom"
            content={
              <span
                css={css`
                  display: block;
                  max-width: 330px;
                  font-size: 14px;
                  font-family: "Euclid Circular B";
                `}
              >
                The profit range (the dashed lines) is derived from funding
                collected on Entropy since the start of the Epoch. The range is
                centered on the <b>Rebalance Price</b>, or spot price at time of
                rebalance. Profit is maximized the closer the spot price is to
                this rebalance price.
                <img
                  height="68"
                  src={profitRangeFormula}
                  alt="Profit range calculation"
                />
              </span>
            }
          >
            <span
              css={css`
                &:after {
                  content: "ⓘ";
                  font-size: 12px;
                  font-weight: bold;
                  font-family: "Euclid Circular B";
                  cursor: pointer;
                }
              `}
            ></span>
          </Popover>
        </ColorSpan>
      </AbsoluteLabel>
    );

  if (timeseries === undefined) {
    return (
      <GraphContainer>
        <GraphWrapper className="loading">
          {titleSection}
          {loading}
        </GraphWrapper>
      </GraphContainer>
    );
  }

  if (timeseries.length === 0 || epochRows.length === 0) {
    return (
      <GraphContainer>
        <GraphWrapper className="loading">
          {titleSection}
          {noData}
        </GraphWrapper>
      </GraphContainer>
    );
  }

  let min = 99999;
  let max = 0;

  const earliestStartEpoch = Math.min(
    ...epochRows.map(({ startEpoch }) => startEpoch)
  );
  const filteredPriceTimeseries = timeseries.filter(([date]) => {
    return date >= earliestStartEpoch * 1000;
  });

  filteredPriceTimeseries.forEach(([, spotPrice]) => {
    if (spotPrice < min) {
      min = spotPrice;
    }
    if (spotPrice > max) {
      max = spotPrice;
    }
  });
  const minmaxDifference = Math.abs(max - min);

  // We want axis to have minimum of 0.05, otherwise small changes are exaggeraged
  const compensation =
    minmaxDifference < 0.05 ? (0.05 - minmaxDifference) / 2 : 0;

  const strikePrices: Array<{ x: Date; y: number | null }> = [];

  epochRows.forEach((row) => {
    const parsed = parseOptionProduct(row.product);
    if (
      typeof parsed !== "string" &&
      row.endEpoch * 1000 > filteredPriceTimeseries[0][0]
    ) {
      strikePrices.push({
        x: new Date(
          Math.max(filteredPriceTimeseries[0][0], row.startEpoch * 1000)
        ),
        y: parsed.strike,
      });
      strikePrices.push({
        x: new Date(
          Math.max(filteredPriceTimeseries[0][0], row.endEpoch * 1000)
        ),
        y: parsed.strike,
      });
      strikePrices.push({
        x: new Date(
          Math.max(filteredPriceTimeseries[0][0], row.endEpoch * 1000)
        ),
        y: null,
      });

      if (parsed.strike < min) {
        min = parsed.strike;
      }
      if (parsed.strike > max) {
        max = parsed.strike;
      }
    }
  });

  const strikeSeries = {
    id: "strikePrice",
    color: "red",
    data: def.volt === 3 ? [] : strikePrices,
  };

  const timeData = [
    {
      id: "coingeckoPrice",
      color: "hsl(230,15%, 20%)",
      data: filteredPriceTimeseries.map(([time, coingeckoPrice]) => {
        return {
          x: new Date(time),
          y: coingeckoPrice,
        };
      }),
    },
    strikeSeries,
  ];

  if (def.volt === 3) {
    const upperNumbers: Array<{ x: Date; y: number | null }> = [];
    const lowerNumbers: Array<{ x: Date; y: number | null }> = [];

    const endTimes: number[] = [];

    profitRangesForEpochRows.forEach((profitRangeForEpoch) => {
      const profitRangeDataPoint =
        profitRangeForEpoch[profitRangeForEpoch.length - 1];
      if (profitRangeDataPoint) {
        endTimes.push(profitRangeDataPoint.unixTime * 1000);
      }
    });
    profitRangesForEpochRows
      .flatMap((x) => x)
      .forEach((profitRangeForEpoch) => {
        upperNumbers.push({
          x: new Date(profitRangeForEpoch.unixTime * 1000),
          y: endTimes.includes(profitRangeForEpoch.unixTime * 1000)
            ? null
            : profitRangeForEpoch.profitRangeHigh,
        });
        lowerNumbers.push({
          x: new Date(profitRangeForEpoch.unixTime * 1000),
          y: endTimes.includes(profitRangeForEpoch.unixTime * 1000)
            ? null
            : profitRangeForEpoch.profitRangeLow,
        });
      });

    const upperProfitRange = {
      id: "upperProfitRange",
      color: "",
      data: upperNumbers,
    };
    timeData.push(upperProfitRange);

    const lowerProfitRange = {
      id: "lowerProfitRange",
      color: "",
      data: lowerNumbers,
    };
    timeData.push(lowerProfitRange);
  }

  return (
    <GraphContainer>
      <GraphWrapper className="loaded priceAndStrike">
        {titleSection}
        {loading}
        <ResponsiveLine
          data={timeData}
          theme={patchedTheme}
          xScale={{
            type: "time",
            format: "%Y-%m-%d",
            useUTC: false,
            precision:
              filteredPriceTimeseries.length > 1000 ? "hour" : "minute",

            min: new Date(filteredPriceTimeseries[0][0]),
          }}
          yScale={{
            type: "linear",
            min: min - 0.15 * (max - min) - compensation,
            max:
              max +
              0.4 * (max - min) +
              compensation +
              (def.optionType === undefined ? 0.2 * (max - min) : 0),
          }}
          areaOpacity={0.5}
          axisLeft={{
            format: (v) => {
              if (v < 10) {
                return v.toFixed(2);
              }
              return v;
            },
          }}
          axisBottom={{
            format: "%b %d",
            tickValues: generateIntervalBasedOnTimeRange(
              new Date(filteredPriceTimeseries[0][0]),
              new Date(
                filteredPriceTimeseries[filteredPriceTimeseries.length - 1][0]
              )
            ),
          }}
          curve={"linear"}
          colors={({ id }) => {
            if (id === "strikePrice") {
              return colorB;
            }
            return colorA;
          }}
          enablePointLabel={false}
          crosshairType="cross"
          pointBorderColor={{
            from: "color",
          }}
          enableSlices={"x"}
          enablePoints={false}
          enableGridX={false}
          enableGridY={false}
          pointLabelYOffset={-15}
          margin={{
            top: 0,
            right: 0,
            bottom: 34,
            left: filteredPriceTimeseries[0][1] > 10000 ? 55 : 45,
          }}
          // defs={[
          //   {
          //     id: "gradientC",
          //     type: "linearGradient",
          //     colors: [
          //       { offset: 2, color: colorA },
          //       { offset: 5, color: colorB },
          //     ],
          //   },
          // ]}
          // fill={[
          //   // // match using function
          //   // { match: (d) => d.id === "vue", id: "gradientB" },
          //   // match all, will only affect 'elm', because once a rule match,
          //   // others are skipped, so now it acts as a fallback
          //   { match: "*", id: "gradientC" },
          // ]}
          motionConfig={"stiff"}
          sliceTooltip={(slice) => {
            const firstPoint = slice.slice.points[0];
            if (!firstPoint) {
              return <div></div>;
            }
            let time = firstPoint ? (firstPoint.data.x as Date) : null;

            const price =
              slice.slice.points.length > 1 &&
              firstPoint.serieId === "coingeckoPrice"
                ? Number(firstPoint.data.y)
                : filteredPriceTimeseries[
                    filteredPriceTimeseries.length - 1
                  ][1];

            let crabHighRange: number | null = null;
            let crabLowRange: number | null = null;

            if (def.optionType === undefined) {
              const allProfitRangeDataFlattened =
                profitRangesForEpochRows.flatMap((x) => x);
              const found = allProfitRangeDataFlattened.find(
                (x) => x.unixTime * 1000 === time?.getTime()
              );
              if (found) {
                crabHighRange = found.profitRangeHigh;
                crabLowRange = found.profitRangeLow;
              }
            }

            let newestOptionInRange = epochRows[epochRows.length - 1];
            for (let r = epochRows.length - 1; r >= 0; r--) {
              const row = epochRows[r];
              if (time && row.startEpoch < time?.getTime() / 1000) {
                newestOptionInRange = row;
              }
            }

            const parsedOption = parseOptionProduct(
              newestOptionInRange.product
            );

            const lastTradedOptionShort =
              formatOptionProductShort(parsedOption);

            const premia =
              newestOptionInRange.balancePnl / newestOptionInRange.balanceStart;

            const breakevenPrice =
              newestOptionInRange && typeof parsedOption !== "string"
                ? def.volt === 1
                  ? parsedOption.strike * (1 + premia)
                  : parsedOption.strike * (1 - premia)
                : null;
            const breakevenDistance = breakevenPrice
              ? breakevenPrice / price - 1
              : null;
            const breakevenColor = breakevenDistance
              ? (def.volt === 1 ? breakevenDistance > 0 : breakevenDistance < 0)
                ? colorGain
                : colorLoss
              : undefined;

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
                  {def.optionType !== undefined ? (
                    <span>
                      <br />
                      {formatUSDForPrice(price)} Breakeven:{" "}
                      {breakevenDistance !== null ? (
                        <span css={breakevenColor}>
                          {breakevenDistance > 0 ? "+" : ""}
                          {(breakevenDistance * 100).toFixed(1)}%
                        </span>
                      ) : null}
                      <br />
                      {lastTradedOptionShort}{" "}
                      <span css={colorGain}>+{(premia * 100).toFixed(2)}%</span>
                    </span>
                  ) : (
                    <span>
                      <br />
                      High:{" "}
                      {crabHighRange ? formatUSDForPrice(crabHighRange) : "--"}
                      <br />
                      Price: {formatUSDForPrice(price)}
                      <br />
                      Low:{" "}
                      {crabLowRange ? formatUSDForPrice(crabLowRange) : "--"}
                      <br />
                    </span>
                  )}
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

export const LDOEmissionsPlot: React.FC = () => {
  const ColorSpan = BlueSpan;
  const colorA = BlueA;
  const colorB = BlueB;

  const patchedTheme = Object.assign({}, theme, {
    crosshair: {
      line: {
        stroke: colorA,
        strokeWidth: 1,
        strokeOpacity: 1,
      },
    },
    axis: {
      domain: {
        line: {
          stroke: colorA,
          strokeWidth: 1,
        },
      },
      legend: {
        text: {
          // "fcBTC volt token price"
          fontSize: 10,
          fill: colorA,
          fontWeight: 500,
          // opacity: 0.8,
          fontFamily: "Euclid Circular B",
        },
      },
      ticks: {
        line: {
          stroke: colorA,
          strokeWidth: 1,
        },
        text: {
          // "Jan 20"
          // ""
          fontSize: 11,
          fill: colorA,
          fontFamily: "Euclid Circular B",
        },
      },
    },
  });

  const timeData = [
    {
      id: "sharePrice",
      color: "hsl(230,15%, 20%)",
      data: [
        {
          x: 0,
          y: 0,
        },
        {
          x: 49,
          y: 0.2,
        },
        {
          x: 50,
          y: 0.7,
        },
        {
          x: 100,
          y: 1.4,
        },
      ],
    },
  ];

  return (
    <GraphContainer>
      <GraphWrapper
        className="loaded"
        css={css`
          height: 160px !important;
        `}
      >
        <AbsoluteLabel
          css={css`
            font-size: 14px !important;
          `}
        >
          <ColorSpan
            css={css`
              @media only screen and (max-width: 530px) {
                width: 200px;
              }
            `}
          >
            LDO Rewards
            {
              <Popover
                destroyTooltipOnHide
                placement="bottom"
                content={
                  <span
                    css={css`
                      display: block;
                      max-width: 250px;
                      font-size: 14px;
                      font-family: "Euclid Circular B";
                    `}
                  >
                    <p>
                      This chart shows the amount of LDO rewards you earn per
                      stSOL deposited, based on the number of days deposited.
                      Read more about LDO emissions{" "}
                      <a
                        href="https://docs.friktion.fi/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        here
                      </a>
                      .
                    </p>
                  </span>
                }
              >
                <span
                  css={css`
                    &:after {
                      content: "ⓘ";
                      font-size: 12px;
                      font-weight: bold;
                      font-family: "Euclid Circular B";
                      cursor: pointer;
                      margin-left: 4px;
                    }
                  `}
                ></span>
              </Popover>
            }
          </ColorSpan>
        </AbsoluteLabel>
        <div
          css={css`
            width: 100%;
            height: 100%;
            position: absolute;
          `}
        >
          <ResponsiveLine
            data={timeData}
            theme={patchedTheme}
            xScale={{
              type: "linear",
              min: 0,
              max: 100,
            }}
            yScale={{
              type: "linear",
              min: 0,
              max: 1.5,
            }}
            enableArea={false}
            areaOpacity={0.5}
            axisLeft={{
              tickSize: 0,
              format: (v) => `${v}`,
              tickValues: makeTicks(0, 1.4, 0.2),
              legend: "LDO rewards",
              legendOffset: -35,
              legendPosition: "middle",
            }}
            axisBottom={{
              tickSize: 0,
              format: (v) => `${v}`,
              tickValues: makeTicks(0, 100, 10),
              legend: "Days in volt",
              legendOffset: 30,
              legendPosition: "middle",
            }}
            curve={"linear"}
            colors={({ id, data }) => colorA}
            enablePointLabel={false}
            crosshairType="cross"
            pointBorderColor={{
              from: "color",
            }}
            useMesh={true}
            enablePoints={false}
            enableGridX={false}
            enableGridY={false}
            pointLabelYOffset={-15}
            margin={{
              top: 0,
              right: 0,
              bottom: 45,
              left: 45,
            }}
            defs={[
              {
                id: "gradientC",
                type: "linearGradient",
                colors: [
                  { offset: 20, color: colorA },
                  { offset: 100, color: colorB },
                ],
              },
            ]}
            fill={[
              // // match using function
              // { match: (d) => d.id === "vue", id: "gradientB" },
              // match all, will only affect 'elm', because once a rule match,
              // others are skipped, so now it acts as a fallback
              { match: "*", id: "gradientC" },
            ]}
            motionConfig={"stiff"}
            tooltip={({ point }) => {
              let days = point ? (point.data.x as Number) : null;
              let rewards = point ? (point.data.y as Number) : null;

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
                    transform: translate(0%, 90px) scale(1.01);
                    transition: transform 0.1s !important;
                    -webkit-backface-visibility: hidden;
                    -moz-backface-visibility: hidden;
                    -webkit-transform: translate3d(0, 0, 0);
                    -moz-transform: translate3d(0, 0, 0);
                  `}
                >
                  <div>
                    <>
                      Day: {days ?? "..."}
                      <br />
                      Rewards: {rewards ?? "..."}
                    </>
                  </div>
                </div>
              );

              return result;
            }}
          />
        </div>
      </GraphWrapper>
    </GraphContainer>
  );
};

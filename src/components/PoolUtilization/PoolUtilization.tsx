import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { Theme } from "@nivo/core";
import { ResponsiveLine } from "@nivo/line";

import { theme } from "../../09/AnalyticsGraphs";
import moment from "moment";
import { formatUSDForPrice } from "../../09/format09";
import { FunctionComponent, ReactNode } from "react";

const patchedTheme: Theme = Object.assign({}, theme, {
  crosshair: {
    line: {
      stroke: "#fff",
      strokeWidth: 1,
      strokeOpacity: 1,
    },
  },
  grid: {
    line: {
      stroke: "#FFFFFF33",
      strokeDasharray: 2.5,
    },
  },
  axis: {
    legend: {
      text: {
        fontSize: 18,
        fill: "#fff",
        fontWeight: 700,
      },
    },
    ticks: {
      line: {
        strokeWidth: 0,
      },
      text: {
        fontSize: 11,
        fill: "#fff",
      },
    },
  },
});

const renderDatetime = (e: Date) => {
  const datetime = moment(e).format("ll LT").split(" ");
  const date = datetime.slice(0, 3).join(" ");
  const time = datetime.slice(3).join("");
  return (
    <p>
      {date}
      <span
        css={(theme) => css`
          color: ${theme.palette.grey[500]};
        `}
      >
        {" "}
        {time}
      </span>
    </p>
  );
};

const TooltipRow: FunctionComponent<{ label: string; value: ReactNode }> = ({
  label,
  value,
}) => {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: row;
      `}
    >
      <p
        css={(theme) => css`
          margin-bottom: 0;
          color: ${theme.palette.grey[500]};
        `}
      >
        {label}
        <span
          css={(theme) => css`
            color: ${theme.palette.grey[1000]};
            font-weight: bold;
          `}
        >
          {value}
        </span>
      </p>
    </div>
  );
};

export const PoolUtilization = () => {
  return (
    <GraphContainer>
      <AbsoluteLabel>Pool Utilization</AbsoluteLabel>
      <ResponsiveLine
        theme={patchedTheme}
        data={[
          {
            id: "Total Borrowed",
            color: "red",
            data: [
              {
                x: "2022-05-15T00:00:00.000Z",
                y: -43646,
              },
              {
                x: "2022-05-16T00:00:00.000Z",
                y: 51517,
              },
              {
                x: "2022-05-17T00:00:00.000Z",
                y: 234615,
              },
              {
                x: "2022-05-18T00:00:00.000Z",
                y: 404686,
              },
              {
                x: "2022-05-19T00:00:00.000Z",
                y: 505355,
              },
              {
                x: "2022-05-20T00:00:00.000Z",
                y: 723863,
              },
              {
                x: "2022-05-21T00:00:00.000Z",
                y: 894917,
              },
              {
                x: "2022-05-22T00:00:00.000Z",
                y: 992360,
              },
              {
                x: "2022-05-23T00:00:00.000Z",
                y: 1169358,
              },
              {
                x: "2022-05-24T00:00:00.000Z",
                y: 1363297,
              },
              {
                x: "2022-05-25T00:00:00.000Z",
                y: 1506854,
              },
              {
                x: "2022-05-26T00:00:00.000Z",
                y: 1687562,
              },
              {
                x: "2022-05-27T00:00:00.000Z",
                y: 1890245,
              },
              {
                x: "2022-05-28T00:00:00.000Z",
                y: 1905744,
              },
              {
                x: "2022-05-29T00:00:00.000Z",
                y: 2193914,
              },
              {
                x: "2022-05-30T00:00:00.000Z",
                y: 2248920,
              },
              {
                x: "2022-05-31T00:00:00.000Z",
                y: 2407390,
              },
              {
                x: "2022-06-01T00:00:00.000Z",
                y: 2569474,
              },
              {
                x: "2022-06-02T00:00:00.000Z",
                y: 2657200,
              },
              {
                x: "2022-06-03T00:00:00.000Z",
                y: 2943498,
              },
              {
                x: "2022-06-04T00:00:00.000Z",
                y: 2987954,
              },
              {
                x: "2022-06-05T00:00:00.000Z",
                y: 3059420,
              },
              {
                x: "2022-06-06T00:00:00.000Z",
                y: 3380312,
              },
              {
                x: "2022-06-07T00:00:00.000Z",
                y: 3472738,
              },
              {
                x: "2022-06-08T00:00:00.000Z",
                y: 3625820,
              },
              {
                x: "2022-06-09T00:00:00.000Z",
                y: 3710537,
              },
              {
                x: "2022-06-10T00:00:00.000Z",
                y: 3981198,
              },
              {
                x: "2022-06-11T00:00:00.000Z",
                y: 4107089,
              },
              {
                x: "2022-06-12T00:00:00.000Z",
                y: 4207096,
              },
              {
                x: "2022-06-13T00:00:00.000Z",
                y: 4376804,
              },
              {
                x: "2022-06-14T00:00:00.000Z",
                y: 4419290,
              },
              {
                x: "2022-06-15T00:00:00.000Z",
                y: 4698612,
              },
              {
                x: "2022-06-16T00:00:00.000Z",
                y: 4794736,
              },
              {
                x: "2022-06-17T00:00:00.000Z",
                y: 4963843,
              },
              {
                x: "2022-06-18T00:00:00.000Z",
                y: 5149824,
              },
              {
                x: "2022-06-19T00:00:00.000Z",
                y: 5232659,
              },
              {
                x: "2022-06-20T00:00:00.000Z",
                y: 5340691,
              },
            ],
          },
          {
            id: "Total Supplied",
            color: "red",
            data: [
              {
                x: "2022-05-15T00:00:00.000Z",
                y: 108820,
              },
              {
                x: "2022-05-16T00:00:00.000Z",
                y: 183870,
              },
              {
                x: "2022-05-17T00:00:00.000Z",
                y: 266645,
              },
              {
                x: "2022-05-18T00:00:00.000Z",
                y: 560268,
              },
              {
                x: "2022-05-19T00:00:00.000Z",
                y: 351789,
              },
              {
                x: "2022-05-20T00:00:00.000Z",
                y: 844740,
              },
              {
                x: "2022-05-21T00:00:00.000Z",
                y: 1149179,
              },
              {
                x: "2022-05-22T00:00:00.000Z",
                y: 844089,
              },
              {
                x: "2022-05-23T00:00:00.000Z",
                y: 1410132,
              },
              {
                x: "2022-05-24T00:00:00.000Z",
                y: 1503079,
              },
              {
                x: "2022-05-25T00:00:00.000Z",
                y: 1205468,
              },
              {
                x: "2022-05-26T00:00:00.000Z",
                y: 1585143,
              },
              {
                x: "2022-05-27T00:00:00.000Z",
                y: 1503190,
              },
              {
                x: "2022-05-28T00:00:00.000Z",
                y: 1780936,
              },
              {
                x: "2022-05-29T00:00:00.000Z",
                y: 2014647,
              },
              {
                x: "2022-05-30T00:00:00.000Z",
                y: 2479359,
              },
              {
                x: "2022-05-31T00:00:00.000Z",
                y: 2398019,
              },
              {
                x: "2022-06-01T00:00:00.000Z",
                y: 2847126,
              },
              {
                x: "2022-06-02T00:00:00.000Z",
                y: 2718006,
              },
              {
                x: "2022-06-03T00:00:00.000Z",
                y: 3099082,
              },
              {
                x: "2022-06-04T00:00:00.000Z",
                y: 3279046,
              },
              {
                x: "2022-06-05T00:00:00.000Z",
                y: 3362991,
              },
              {
                x: "2022-06-06T00:00:00.000Z",
                y: 3325201,
              },
              {
                x: "2022-06-07T00:00:00.000Z",
                y: 3570202,
              },
              {
                x: "2022-06-08T00:00:00.000Z",
                y: 3792378,
              },
              {
                x: "2022-06-09T00:00:00.000Z",
                y: 3960588,
              },
              {
                x: "2022-06-10T00:00:00.000Z",
                y: 3671688,
              },
              {
                x: "2022-06-11T00:00:00.000Z",
                y: 4101227,
              },
              {
                x: "2022-06-12T00:00:00.000Z",
                y: 4268688,
              },
              {
                x: "2022-06-13T00:00:00.000Z",
                y: 4421184,
              },
              {
                x: "2022-06-14T00:00:00.000Z",
                y: 4265389,
              },
              {
                x: "2022-06-15T00:00:00.000Z",
                y: 4609852,
              },
              {
                x: "2022-06-16T00:00:00.000Z",
                y: 5008413,
              },
              {
                x: "2022-06-17T00:00:00.000Z",
                y: 5099232,
              },
              {
                x: "2022-06-18T00:00:00.000Z",
                y: 4974548,
              },
              {
                x: "2022-06-19T00:00:00.000Z",
                y: 5105233,
              },
              {
                x: "2022-06-20T00:00:00.000Z",
                y: 5311624,
              },
            ],
          },
        ]}
        margin={{ top: 60, right: 2, bottom: 50, left: 32 }}
        yScale={{
          type: "linear",
          min: 0,
          max: 6000000,
        }}
        xScale={{
          type: "time",
          format: "%Y-%m-%dT%H:%M:%S.%LZ",
          useUTC: false,
          precision: "day",
        }}
        axisLeft={{
          tickPadding: 10,
          tickValues: 4,
          format: (v) => `$${v / 1000000}M`,
        }}
        axisBottom={{
          tickValues: "every 7 days",
          format: "%b %d",
        }}
        lineWidth={3}
        colors={({ id }) => {
          if (id === "Total Supplied") return "#FFA190";
          return "#FF5199";
        }}
        enableSlices={"x"}
        enableGridX={false}
        useMesh={true}
        legends={[
          {
            itemHeight: 20,
            itemWidth: 100,
            anchor: "top-right",
            direction: "row",
            itemsSpacing: 20,
            translateY: -55,
            itemTextColor: "white",
            symbolShape: ({ x, y, size, fill, borderWidth, borderColor }) => (
              <rect
                x={x}
                y={y * 4}
                fill={fill}
                strokeWidth={borderWidth}
                stroke={borderColor}
                width={size}
                height={size / 4}
                style={{ pointerEvents: "none" }}
              />
            ),
          },
        ]}
        enablePoints={false}
        sliceTooltip={(slice) => {
          const points = slice.slice.points;
          if (!points || points.length < 2) return <></>;
          const totalBorrowed =
            points[0].serieId === "Total Borrowed" ? points[0] : points[1];
          const totalSupplied =
            points[0].serieId === "Total Supplied" ? points[0] : points[1];

          let time = totalBorrowed.data.x as Date;

          return (
            <div
              css={(theme) => css`
                background: #fff;
                width: 216px;
                border-radius: 4px;
                padding: 12px;
                font-size: 12px;
                color: ${theme.palette.grey[1000]};
              `}
            >
              <div
                css={css`
                  display: flex;
                  flex-direction: row;
                `}
              >
                {renderDatetime(time)}
              </div>
              <TooltipRow
                label="Total Supplied: "
                value={formatUSDForPrice(
                  parseInt(totalSupplied.data.yFormatted as string)
                )}
              />
              <TooltipRow
                label="Total Borrowed: "
                value={formatUSDForPrice(
                  parseInt(totalBorrowed.data.yFormatted as string)
                )}
              />
              <TooltipRow label="Utilization Rate: " value={"66.67%"} />
            </div>
          );
        }}
      />
    </GraphContainer>
  );
};

export const GraphContainer = styled.div`
  position: relative;

  width: 100%;
  height: 500px;

  @media screen and (max-width: 700px) {
    height: 300px;
  }
`;

export const AbsoluteLabel = styled.div`
  position: absolute;

  font-weight: bold;
  font-size: 18px;
  width: 100%;
  color: rgba(255, 255, 255, 0.9);

  /* TODO: this code will be replaced after the breakpoints can cover this case. */
  @media screen and (max-width: 700px) {
    position: relative;
  }
`;

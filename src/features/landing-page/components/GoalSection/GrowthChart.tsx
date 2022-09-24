import { Interpolation, Theme } from "@emotion/react";
import styled from "@emotion/styled";
import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { Typography } from "common/components/Typography";
import { getGrowthChartData } from "./getGrowthChartData";
import { MAX_MONTHLY_DEPOSIT } from "./maxMonthlyDeposit";
interface GrowthChartProps {
  monthlyDeposit: number;
  css?: Interpolation<Theme>;
}

const CHART_MAX_VALUE = getGrowthChartData(MAX_MONTHLY_DEPOSIT).reduce(
  (max, { friktionDisplay }) => Math.max(max, friktionDisplay),
  0
);

const GRID_Y_LINE_COUNT = 4;
const GRID_Y_VALUES = Array.from(
  { length: GRID_Y_LINE_COUNT },
  (_, i) => ((i + 1) * CHART_MAX_VALUE) / GRID_Y_LINE_COUNT
);

export const GrowthChart = ({ monthlyDeposit, ...rest }: GrowthChartProps) => {
  const theme = useTheme();
  const data = getGrowthChartData(monthlyDeposit);

  return (
    <GrowthChartContainer {...rest}>
      <ResponsiveBar
        maxValue={CHART_MAX_VALUE}
        gridYValues={GRID_Y_VALUES}
        colors={({ id }) =>
          id === "friktionDisplay"
            ? theme.palette.pink[600]
            : theme.palette.blue[600]
        }
        borderRadius={2}
        data={data}
        keys={["friktionDisplay", "savingsAccount"]}
        indexBy="year"
        padding={0.5}
        innerPadding={8}
        groupMode="grouped"
        valueScale={{ type: "linear" }}
        axisTop={null}
        axisRight={null}
        axisLeft={null}
        margin={{ bottom: 60 }}
        axisBottom={{
          tickValues: [0, 10],
          tickSize: 0,
          format: (value) => (value === 0 ? "Today" : "Year " + value),
        }}
        enableLabel={false}
        isInteractive={false}
        markers={[
          {
            axis: "y",
            value: 0,
            lineStyle: {
              stroke: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
              opacity: theme.palette.mode === "dark" ? "0.15" : "0.1",
              strokeWidth: 1,
            },
          },
        ]}
        theme={{
          grid: {
            line: {
              stroke: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
              opacity: theme.palette.mode === "dark" ? "0.15" : "0.1",
              strokeWidth: 1,
              strokeDasharray: "2",
            },
          },
          axis: {
            ticks: {
              text: {
                fill: theme.palette.grey[500],
                fontSize: 12,
                fontFamily: "Euclid Circular B",
              },
            },
          },
        }}
      />
      <LegendLayout>
        <LegendItem>
          <LegendSymbol color={theme.palette.pink[600]} />
          <LegendText variant="bodyXs">Volts Portfolio</LegendText>
        </LegendItem>
        <LegendItem>
          <LegendSymbol color={theme.palette.blue[600]} />
          <LegendText variant="bodyXs">1% Growth</LegendText>
        </LegendItem>
      </LegendLayout>
    </GrowthChartContainer>
  );
};

const GrowthChartContainer = styled.div`
  position: relative;
  padding: 24px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 12px;
  }
  background: ${({ theme }) =>
    theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.07)" : "#ffffff"};
  border: 1px solid
    rgba(
      255,
      255,
      255,
      ${({ theme }) => (theme.palette.mode === "dark" ? "0.1" : "0.5")}
    );
  border-radius: 12px;
`;

const LegendLayout = styled.div`
  position: absolute;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    gap: 0px;
    bottom: 12px;
    right: 12px;
    display: grid;
    grid-template-rows: repeat(2, auto);
  }
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LegendSymbol = styled.div<{ color: string }>`
  width: 14px;
  height: 4px;
  border-radius: 16px;
  background-color: ${({ color }) => color};
`;

const LegendText = styled(Typography)`
  font-weight: 700;
`;

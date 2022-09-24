import { css, Interpolation, Theme } from "@emotion/react";
import { useMemo } from "react";
import { InvestmentStyle } from "./InvestmentStyle";
import { STRATEGIES } from "./strategies";
import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";
import { PieChartFillDefs } from "./PieChartFillDefs";
import { usePieChartTooltips } from "./usePieChartTooltips";
import { PieChartTooltip } from "./PieChartTooltip";
import { useOnResize } from "common/hooks/useOnResize";
import { useForceUpdate } from "./useForceUpdate";
import _ from "lodash";
import React from "react";

interface PortfolioPieChartProps {
  investmentStyle: InvestmentStyle;
  css?: Interpolation<Theme>;
  className?: string;
}
export const PortfolioPieChart = ({
  investmentStyle,
  ...rest
}: PortfolioPieChartProps) => {
  const { VOLT_NUMBERS, pieRef, tooltipStyles /*onSliceClick*/ } =
    usePieChartTooltips(investmentStyle);

  // force pie to redraw on resize (thus allowing tooltips to be repositioned upon resize)
  const forceUpdate = useForceUpdate();
  const forceUpdateThrottled = useMemo(
    () => _.throttle(forceUpdate, 100),
    [forceUpdate]
  );
  const { listeningElementRef } = useOnResize(forceUpdateThrottled);

  return (
    <div
      css={css`
        position: relative;
      `}
      ref={listeningElementRef}
      {...rest}
    >
      <MemoizedPortfolioPieChartInner
        investmentStyle={investmentStyle}
        pieRef={pieRef}
      />
      {VOLT_NUMBERS.map((voltNumber) => (
        <PieChartTooltip
          key={voltNumber}
          voltNumber={voltNumber}
          style={tooltipStyles[voltNumber]}
          investmentStyle={investmentStyle}
        />
      ))}
    </div>
  );
};

interface PortfolioPieChartInnerProps {
  investmentStyle: InvestmentStyle;
  pieRef: (instance: Pie | null) => void;
}
const PortfolioPieChartInner = ({
  investmentStyle,
  pieRef,
}: PortfolioPieChartInnerProps) => {
  const data = useMemo(
    () =>
      STRATEGIES.map(({ id, allocation }) => {
        const value = allocation[investmentStyle];
        return {
          id,
          value,
        };
      }),
    [investmentStyle]
  );

  return (
    <ResponsiveContainer width="100%" aspect={1}>
      <PieChart margin={{ top: 0, left: 0, right: 0, bottom: 0 }}>
        <defs>
          <PieChartFillDefs />
        </defs>
        <Pie
          animationBegin={0}
          width="100%"
          height="100%"
          stroke="none"
          cornerRadius={12}
          data={data}
          innerRadius="64%"
          dataKey="value"
          // onClick={onSliceClick}
          paddingAngle={-1}
          startAngle={-170}
          endAngle={-630}
          ref={(pie: any) => {
            // use lambda function to force resetting of pie ref on resize
            pieRef(pie);
          }}
        >
          {data.map((entry, i) => (
            <Cell
              key={`cell-${i}`}
              fill={`url(#volt_${entry.id}_radial_gradient)`}
              // style={{ cursor: "pointer" }}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

const MemoizedPortfolioPieChartInner = React.memo(PortfolioPieChartInner);

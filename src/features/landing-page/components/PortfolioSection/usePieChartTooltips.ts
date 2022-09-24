import { VoltNumber } from "@friktion-labs/friktion-sdk";
import { useMediaQuery, useTheme } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pie } from "recharts";
import { InvestmentStyle } from "./InvestmentStyle";
import { TOOLTIP_WIDTH, TOOLTIP_WIDTH_MOBILE } from "./tooltipWidth";

const RADIAN = Math.PI / 180;
const VOLT_NUMBERS: VoltNumber[] = [1, 2, 3, 4];

const getSectorCenterCoordinates = (pieSectorDataItem: any) => {
  const { midAngle, outerRadius, innerRadius, cx, cy } = pieSectorDataItem;
  const midRadius = innerRadius + (outerRadius - innerRadius) / 2;

  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const x = cx + midRadius * cos;
  const y = cy + midRadius * sin;

  return [x, y];
};

/**
 * Get how much space that the tooltip exceeds the parent container
 * @param tooltipWidth
 * @param pieSectorDataItem
 * @param sectorCenterX
 * @returns
 */
const getTooltipXOverflow = (
  tooltipWidth: number,
  pieSectorDataItem: any,
  sectorCenterX: number
) => {
  const PIE_EXTRA_PADDING = 100;
  const pieWidth =
    pieSectorDataItem.cx + pieSectorDataItem.outerRadius + PIE_EXTRA_PADDING;
  const overflowX =
    sectorCenterX > tooltipWidth
      ? tooltipWidth
      : sectorCenterX + tooltipWidth > pieWidth
      ? tooltipWidth / 2
      : 0;

  return overflowX;
};

export const usePieChartTooltips = (investmentStyle: InvestmentStyle) => {
  const theme = useTheme();
  const isSmallViewPort = useMediaQuery(theme.breakpoints.down("md"));

  const [pie, setPie] = useState<Pie>();
  const pieRef = useCallback((instance: Pie | null) => {
    if (instance) {
      setPie(instance);
    }
  }, []);

  const transitionStyles = useMemo(
    () =>
      theme.transitions.create(["top", "left"], {
        duration:
          (pie?.props.animationDuration ?? 0) +
          (pie?.props.animationBegin ?? 0),
      }),
    [pie, theme]
  );
  const visibleStyles: React.CSSProperties = useMemo(
    () => ({
      opacity: 1,
      pointerEvents: "all",
      transition: transitionStyles,
    }),
    [transitionStyles]
  );
  const hiddenStyles: React.CSSProperties = useMemo(
    () => ({
      opacity: 0,
      pointerEvents: "none",
      transition: transitionStyles,
    }),
    [transitionStyles]
  );

  const [tooltipStyles, setTooltipStyles] = useState<
    Record<VoltNumber, React.CSSProperties>
  >(
    VOLT_NUMBERS.reduce(
      (acc, voltNumber) => ({
        ...acc,
        [voltNumber]: hiddenStyles,
      }),
      {} as Record<VoltNumber, React.CSSProperties>
    )
  );

  // show tooltip for volt 1 and 3
  const sectors = pie?.state.curSectors;
  const hasSectorsChanged = JSON.stringify(sectors !== pie?.state.prevSectors);
  const onSectorsChange = useCallback(() => {
    if (sectors && hasSectorsChanged) {
      setTooltipStyles(
        sectors.reduce((acc, pieSectorDataItem: any) => {
          const [left, top] = getSectorCenterCoordinates(pieSectorDataItem);

          const tooltipWidth = isSmallViewPort
            ? TOOLTIP_WIDTH_MOBILE
            : TOOLTIP_WIDTH;
          const translateX = getTooltipXOverflow(
            tooltipWidth,
            pieSectorDataItem,
            left
          );

          return {
            ...acc,
            [pieSectorDataItem.payload.id]: {
              ...(pieSectorDataItem.payload.id === 1
                ? {
                    ...visibleStyles,
                    left: left - translateX + "px",
                    top: top + "px",
                    transform: "translate(0, -100%)",
                  }
                : pieSectorDataItem.payload.id === 3
                ? {
                    ...visibleStyles,
                    left: left - translateX + "px",
                    top: top + "px",
                  }
                : hiddenStyles),
            },
          };
        }, {} as Record<VoltNumber, React.CSSProperties>)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    investmentStyle, // we want to animate the tooltips whenever the investment style changes
    hasSectorsChanged,
    hiddenStyles,
    sectors,
    visibleStyles,
    isSmallViewPort,
  ]);
  useEffect(onSectorsChange, [onSectorsChange]);

  const updateVoltStyles = useCallback(
    (
      voltToUpdate: VoltNumber,
      styles: (oldStyles: React.CSSProperties) => React.CSSProperties
    ) => {
      setTooltipStyles((prev) =>
        VOLT_NUMBERS.reduce(
          (acc, voltNumber) => ({
            ...acc,
            [voltNumber]:
              voltNumber === voltToUpdate
                ? styles(prev[voltNumber])
                : { ...prev[voltNumber], opacity: 0, pointerEvents: "none" }, // close all other tooltips while retaining their position
          }),
          {} as Record<VoltNumber, React.CSSProperties>
        )
      );
    },
    []
  );

  const onSliceClick = useCallback(
    (pieSectorDataItem: any) => {
      const [left, top] = getSectorCenterCoordinates(pieSectorDataItem);

      updateVoltStyles(pieSectorDataItem.payload.id, (oldStyles) => {
        const tooltipWidth = isSmallViewPort
          ? TOOLTIP_WIDTH_MOBILE
          : TOOLTIP_WIDTH;
        const translateX = getTooltipXOverflow(
          tooltipWidth,
          pieSectorDataItem,
          left
        );

        const wasVisible =
          oldStyles?.opacity !== undefined && oldStyles.opacity > 0;

        return {
          ...(wasVisible ? hiddenStyles : visibleStyles),
          left: wasVisible ? oldStyles.left : left + "px",
          top: wasVisible ? oldStyles.top : top + "px",
          transform: wasVisible
            ? oldStyles.transform
            : `translate(-${translateX}, -100%)`,
        };
      });
    },
    [isSmallViewPort, updateVoltStyles, hiddenStyles, visibleStyles]
  );

  return {
    pie,
    pieRef,
    tooltipStyles,
    onSliceClick,
    VOLT_NUMBERS,
  };
};

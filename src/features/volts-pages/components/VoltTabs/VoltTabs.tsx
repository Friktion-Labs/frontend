import { getCoolbarStyles, getVoltColorPair } from "09/glow09";
import { VoltNumber } from "09/registry10";
import { css, Interpolation, Theme } from "@emotion/react";
import { Tabs } from "common/components/Tabs";
import { useRouteMatch } from "common/hooks/useRouteMatch";
import { ROUTES } from "features/volts-pages/constants/routes";
import React from "react";
import { VoltTab } from "./VoltTab";

interface VoltTabsInnerProps {
  forwardedRef: React.ForwardedRef<HTMLDivElement>;
  className?: string;
  css?: Interpolation<Theme>;
}
const VoltTabsInner = ({ forwardedRef, ...rest }: VoltTabsInnerProps) => {
  const routeMatch = useRouteMatch(ROUTES);
  const currentTab = routeMatch?.pattern?.path;

  const voltNumber = ROUTES.findIndex((route) => route === currentTab) + 1;
  const [colorA, colorB] =
    voltNumber > 0 ? getVoltColorPair(voltNumber as VoltNumber) : [];
  const tabIndicatorStyles =
    colorA && colorB ? getCoolbarStyles(colorA, colorB) : undefined;

  return (
    <Tabs
      ref={forwardedRef}
      css={css`
        display: flex;
        gap: 24px;
        width: fit-content;
      `}
      TabIndicatorProps={{
        css: tabIndicatorStyles,
      }}
      value={currentTab}
      {...rest}
    >
      <VoltTab voltNumber={1} value="/income" to="/income">
        Generate Income
      </VoltTab>
      <VoltTab voltNumber={2} value="/stables" to="/stables">
        Sustainable Stables
      </VoltTab>
      <VoltTab voltNumber={3} value="/crab" to="/crab">
        Crab Strategy
      </VoltTab>
      <VoltTab voltNumber={4} value="/basis" to="/basis">
        Basis Yield
      </VoltTab>
      <VoltTab voltNumber={5} value="/protection" to="/protection">
        Capital Protection
      </VoltTab>
    </Tabs>
  );
};

export const VoltTabs = React.forwardRef<
  HTMLDivElement,
  Omit<VoltTabsInnerProps, "forwardedRef">
>((props, ref) => <VoltTabsInner forwardedRef={ref} {...props} />);

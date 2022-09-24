import { css } from "@emotion/react";
import { BasisChart as BasisChartBase } from "features/home-charts";
import { Card } from "./Card";

export const BasisChart = () => (
  <Card
    css={css`
      padding: 40px 24px;
    `}
  >
    <BasisChartBase />
  </Card>
);

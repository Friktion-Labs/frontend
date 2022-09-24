import { css } from "@emotion/react";
import { CrabChart, MobileCrabChart } from "features/home-charts";
import { useElementSize } from "usehooks-ts";
import { Card } from "./Card";

export const CrabChartCard = () => {
  const [wrapperRef, { width: wrapperWidth }] = useElementSize();
  return (
    <Card
      ref={wrapperRef}
      css={css`
        padding: 30px 20px;
      `}
    >
      {wrapperWidth > 440 ? <CrabChart /> : <MobileCrabChart />}
    </Card>
  );
};

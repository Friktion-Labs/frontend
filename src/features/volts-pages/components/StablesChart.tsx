import { css } from "@emotion/react";
import {
  CashSecuredPutChart,
  MobileCashSecuredPutChart,
} from "features/home-charts";
import { useElementSize } from "usehooks-ts";
import { Card } from "./Card";

export const StablesChart = () => {
  const [wrapperRef, { width: wrapperWidth }] = useElementSize();
  return (
    <Card
      ref={wrapperRef}
      css={css`
        padding: 30px 20px;
      `}
    >
      {wrapperWidth > 440 ? (
        <CashSecuredPutChart />
      ) : (
        <MobileCashSecuredPutChart />
      )}
    </Card>
  );
};

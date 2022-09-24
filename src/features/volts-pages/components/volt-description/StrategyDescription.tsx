import { css } from "@emotion/react";
import { Typography } from "common/components/Typography";
import { SmallHeader } from "../SmallHeader";

export const StrategyDescription = ({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) => (
  <div
    css={css`
      margin-bottom: 20px;
    `}
  >
    <SmallHeader
      css={css`
        font-weight: 500;
        margin-bottom: 12px;
      `}
    >
      {title ?? "STRATEGY"}
    </SmallHeader>
    <Typography variant="bodyM">{children}</Typography>
  </div>
);

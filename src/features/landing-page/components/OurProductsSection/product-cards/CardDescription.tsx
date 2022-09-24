import { VoltNumber } from "09/registry10";
import { css, Interpolation, Theme } from "@emotion/react";
import { Typography } from "common/components/Typography";

const DESCRIPTIONS: Partial<Record<VoltNumber, string>> = {
  1: "Automated call options selling strategy built to enhance returns on volatile assets with algorithmic strike and expiry.",
  2: "Automated put options selling strategy built to enhance returns on volatile assets with algorithmic strike and expiry.",
  3: "Automated delta-neutral volatility harvesting strategy. Generate returns in range-bound markets.",
  4: "Automated call options selling strategy built to enhance returns on volatile assets with algorithmic strike and expiry.",
  5: "Outperform in volatile markets with principal protection. Uses lending interest to hedge price falling drastically.",
};

interface CardDescriptionProps {
  voltNumber: VoltNumber;
  css?: Interpolation<Theme>;
}

export const CardDescription = ({
  voltNumber,
  ...rest
}: CardDescriptionProps) => (
  <Typography
    variant="bodyM"
    css={(theme) => css`
      color: ${theme.palette.mode === "dark"
        ? theme.palette.grey[300]
        : theme.palette.grey[700]};
      flex: 1 1 auto;
    `}
    {...rest}
  >
    {DESCRIPTIONS[voltNumber]}
  </Typography>
);

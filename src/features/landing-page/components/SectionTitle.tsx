import { css, Interpolation, Theme } from "@emotion/react";
import { Typography } from "common/components/Typography";
import React from "react";

export const SectionTitle = ({
  children,
  ...rest
}: {
  children: React.ReactNode;
  css?: Interpolation<Theme>;
  className?: string;
}) => (
  <Typography
    variant="bodyM"
    css={(theme) => css`
      color: ${theme.palette.pink[600]};
      font-weight: 700;
      margin-bottom: 32px;
    `}
    {...rest}
  >
    {children}
  </Typography>
);

import { css, Interpolation, Theme } from "@emotion/react";
import { Typography } from "common/components/Typography";

interface CardTitleProps {
  children: React.ReactNode;
  css?: Interpolation<Theme>;
}

export const CardTitle = ({ children, ...rest }: CardTitleProps) => (
  <Typography
    variant="h4"
    css={(theme) => css`
      font-weight: 600;
      color: ${theme.palette.mode === "dark"
        ? theme.palette.grey[0]
        : theme.palette.grey[950]};
    `}
    {...rest}
  >
    {children}
  </Typography>
);

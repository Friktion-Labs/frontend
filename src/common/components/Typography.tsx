import { Typography as MuiTypography, TypographyProps } from "@mui/material";
import React from "react";

export const Typography = ({
  variant,
  ...rest
}: TypographyProps & { component?: React.ElementType<any> }) => (
  <MuiTypography
    variantMapping={{
      bodyXl: "p",
      bodyL: "p",
      bodyM: "p",
      bodyS: "p",
      bodyXs: "p",
    }}
    variant={variant ?? "bodyXs"}
    {...rest}
  />
);

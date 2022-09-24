import { css, Interpolation, Theme } from "@emotion/react";

import { AppButton } from "common/components/Button";
import { useTheme } from "@mui/material";
import { Typography } from "common/components/Typography";
import { DescriptionText } from "../DescriptionText";
import { Link } from "react-router-dom";

interface OurGrowthContentProps {
  css?: Interpolation<Theme>;
}

export const OurGrowthContent = (props: OurGrowthContentProps) => {
  const theme = useTheme();

  return (
    <div {...props}>
      <Typography
        variant="h3"
        css={css`
          font-weight: 600;
          margin-bottom: 32px;
        `}
      >
        The numbers speak for themselves
      </Typography>
      <DescriptionText
        variant="bodyL"
        css={css`
          margin-bottom: 32px;
          max-width: 75%;
        `}
      >
        Access optimized portfolio management with a click of a button.
      </DescriptionText>
      <Link to={"/analytics"}>
        <AppButton color={theme.palette.friktion.radial} variant="outlined">
          Learn More
        </AppButton>
      </Link>
    </div>
  );
};

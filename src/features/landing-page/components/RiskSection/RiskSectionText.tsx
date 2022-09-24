import { css } from "@emotion/react";
import { Typography } from "common/components/Typography";
import { Link } from "react-router-dom";
import { DescriptionText } from "../DescriptionText";
import { FriktionGradientText } from "../FriktionGradientText";
import { AppButton } from "common/components/Button";
import { useTheme } from "@mui/material";

export const RiskSectionText = () => {
  const theme = useTheme();
  return (
    <div>
      <Typography
        variant="h3"
        css={css`
          font-weight: 600;
          margin: auto;
          margin-bottom: 16px;
          max-width: 590px;
        `}
      >
        Capture <FriktionGradientText>edge</FriktionGradientText>, fully
        automated
      </Typography>
      <DescriptionText
        variant="bodyM"
        css={css`
          margin: auto;
          margin-bottom: 32px;
          max-width: 540px;
        `}
      >
        Friktion is the first DeFi platform built with risk management as our
        main focus. Don't be scared by volatile markets - monetize them.
      </DescriptionText>
      <Link to={"/analytics"}>
        <AppButton color={theme.palette.friktion.radial} variant="outlined">
          Explore Analytics
        </AppButton>
      </Link>
    </div>
  );
};

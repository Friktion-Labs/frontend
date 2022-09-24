import { css, Theme, Interpolation } from "@emotion/react";
import { useTheme } from "@mui/material";
import { AppButton } from "common/components/Button";
import { Typography } from "common/components/Typography";
import { Link } from "react-router-dom";
import { DescriptionText } from "../DescriptionText";
import { FriktionGradientText } from "../FriktionGradientText";

interface GoalContentProps {
  css?: Interpolation<Theme>;
  className?: string;
}
export const GoalContent = (props: GoalContentProps) => {
  const theme = useTheme();

  return (
    <div {...props}>
      <Typography
        variant="h3"
        css={css`
          font-weight: 600;
          margin-bottom: 16px;
        `}
      >
        Build a <FriktionGradientText>diversified</FriktionGradientText>{" "}
        portfolio to outperform across market cycles
      </Typography>
      <DescriptionText
        variant="bodyL"
        css={css`
          margin-bottom: 40px;
        `}
      >
        Friktion makes it simple and safer to access leading quantitative
        strategies.
      </DescriptionText>
      <Link to={"/volts"}>
        <AppButton color={theme.palette.friktion.radial} variant="outlined">
          Explore Volts
        </AppButton>
      </Link>
    </div>
  );
};

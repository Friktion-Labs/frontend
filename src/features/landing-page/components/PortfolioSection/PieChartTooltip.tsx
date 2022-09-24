import styled from "@emotion/styled";
import { DescriptionText } from "../DescriptionText";
import React, { useMemo } from "react";
import { VoltNumber } from "@friktion-labs/friktion-sdk";
import { FriktionBolt } from "features/icons";
import { Typography } from "common/components/Typography";
import { STRATEGIES } from "./strategies";
import { InvestmentStyle } from "./InvestmentStyle";
import { css, useTheme } from "@emotion/react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Link } from "react-router-dom";
import { TOOLTIP_WIDTH, TOOLTIP_WIDTH_MOBILE } from "./tooltipWidth";
import { createCardGlowBG } from "09/glow09";

interface PieChartTooltipProps {
  investmentStyle: InvestmentStyle;
  voltNumber: VoltNumber;
  style?: React.CSSProperties;
}
export const PieChartTooltip = ({
  investmentStyle,
  voltNumber,
  ...rest
}: PieChartTooltipProps) => {
  const strategy = useMemo(
    () => STRATEGIES.find((strategy) => strategy.id === voltNumber),
    [voltNumber]
  );

  const theme = useTheme();
  const color = useMemo(
    () =>
      theme.palette[
        voltNumber === 1
          ? "blue"
          : voltNumber === 2
          ? "lavender"
          : voltNumber === 3
          ? "pink"
          : "pink"
      ],
    [theme, voltNumber]
  );

  const GlowBG = createCardGlowBG(color[400], color[500]);
  const glowBGComponent = (
    <GlowBG
      css={css`
        z-index: -1;
      `}
      className="glowBG"
    />
  );

  if (!strategy) {
    throw new Error("Strategy for voltNumber " + voltNumber + " not found");
  }

  return (
    <TooltipContainer to={strategy.path} {...rest}>
      <TooltipContent voltColor={color[600]}>
        <HeaderContainer
          css={css`
            background-color: ${color[600]};
          `}
        >
          <HeaderTitle>
            <HeaderText
              css={css`
                display: flex;
                align-items: center;
              `}
              variant="bodyM"
            >
              <FriktionBolt
                css={css`
                  margin-right: 4px;
                `}
                color={color[900]}
              />
              {voltNumber}
            </HeaderText>
            <HeaderText variant="bodyM">{strategy.label}</HeaderText>
          </HeaderTitle>
          <HeaderText variant="bodyM">
            {strategy.allocation[investmentStyle]}%
          </HeaderText>
        </HeaderContainer>
        <DescriptionText
          variant="bodyM"
          css={(theme) => css`
            ${theme.breakpoints.down("sm")} {
              font-size: 14px;
            }
          `}
        >
          {strategy.description}
        </DescriptionText>
        <ExploreLink>
          Explore Volt
          <ChevronRightIcon
            css={css`
              color: ${color[600]};
            `}
          />
        </ExploreLink>
      </TooltipContent>
      {glowBGComponent}
      {glowBGComponent}
    </TooltipContainer>
  );
};

const TooltipContainer = styled(Link, {
  shouldForwardProp: (prop) => prop !== "pathname",
})`
  opacity: 0;
  pointer-events: none;
  position: absolute;
  border-radius: 12px;
  &:focus {
    border-radius: 12px;
  }
  transition: ${({ theme }) =>
    theme.transitions.create("opacity", {
      duration: theme.transitions.duration.short,
    })};
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -webkit-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
`;

const TooltipContent = styled.div<{ voltColor: string }>(
  ({ theme, voltColor }) => `
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  background: ${
    theme.palette.mode === "dark"
      ? `linear-gradient(to right bottom, rgb(28,24, 48) 60%, ${voltColor})`
      : "#ffffff"
  };
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  box-shadow: 0px 4px 24px rgba(153, 153, 153, 0.1);
  width: ${TOOLTIP_WIDTH}px;
  ${theme.breakpoints.down("sm")} {
    padding: 16px;
    width: ${TOOLTIP_WIDTH_MOBILE}px;
    gap: 16px;
  }

  &:hover {
    & ~ .glowBG {
      opacity: 0.6;
    }
  }
`
);

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 14px 8px 10px;
  border-radius: 8px;
  align-items: center;
`;

const HeaderTitle = styled.div`
  display: flex;
  gap: 16px;
`;

const HeaderText = styled(Typography)`
  font-weight: 700;
  color: #ffffff;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 14px;
  }
`;

const ExploreLink = styled.div`
  display: flex;
  align-self: flex-start;
  gap: 4px;
  font-weight: 500;
  ${({ theme }) => theme.typography.bodyM};

  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 14px;
  }
`;

import { getCardGlowBG, getVoltBolt, getVoltChevronRight } from "09/glow09";
import { VoltNumber } from "09/registry10";
import { css, Interpolation, Theme } from "@emotion/react";
import styled from "@emotion/styled";
import { Typography } from "common/components/Typography";
import { Link } from "react-router-dom";
import { CardApy } from "./CardApy";
import { CardDescription } from "./CardDescription";
import { CardFooter } from "./CardFooter";
import { cardGlowStyles } from "./cardGlowStyles";
import { CardHeader } from "./CardHeader";
import { CardTitle } from "./CardTitle";
import { DesktopCardInner } from "./DesktopCardInner";
import { DesktopCardLayout } from "./DesktopCardLayout";
import { getVoltPath, getVoltTitle } from "./getVoltInfo";

interface DesktopCardProps {
  voltNumber: VoltNumber;
  css?: Interpolation<Theme>;
}

export const DesktopCard = ({ voltNumber, ...rest }: DesktopCardProps) => {
  const Bolt = getVoltBolt(voltNumber);
  const Chevron = getVoltChevronRight(voltNumber);

  const GlowBG = getCardGlowBG(voltNumber);
  const glowBGComponent = (
    <GlowBG
      css={css`
        ${cardGlowStyles}
      `}
      className="glowBG"
    />
  );

  return (
    <DesktopCardLayout>
      <StyledDesktopCardInner
        as={Link}
        to={getVoltPath(voltNumber) ?? "/volts"}
      >
        <CardHeader
          css={css`
            margin-bottom: 24px;
          `}
        >
          <Bolt
            css={css`
              width: 24px;
              height: 24px;
            `}
          />
          <Typography variant="bodyM">Volt {voltNumber}</Typography>
        </CardHeader>
        <CardTitle
          css={css`
            margin-bottom: 16px;
          `}
        >
          {getVoltTitle(voltNumber)}
        </CardTitle>
        <CardDescription
          css={css`
            margin-bottom: 32px;
          `}
          voltNumber={voltNumber}
        />
        <CardApy
          css={css`
            margin-bottom: 40px;
          `}
          voltNumber={voltNumber}
        />
        <CardFooter>
          Explore Volt
          <Chevron
            css={css`
              width: 6px;
              height: 12px;
            `}
          />
        </CardFooter>
      </StyledDesktopCardInner>
      {glowBGComponent}
      {glowBGComponent}
    </DesktopCardLayout>
  );
};

const StyledDesktopCardInner = styled(DesktopCardInner)`
  &:hover {
    & ~ .glowBG {
      opacity: 0.6;
    }
  }

  background: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? "linear-gradient(98.52deg, #191933 16.01%, #271B35 84.96%), #FFFFFF"
      : "#ffffff"};
`;

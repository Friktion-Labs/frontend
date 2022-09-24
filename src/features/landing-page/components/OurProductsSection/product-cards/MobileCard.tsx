import { getVoltBolt, getVoltChevronRight } from "09/glow09";
import { VoltNumber } from "09/registry10";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Typography } from "common/components/Typography";
import { Link } from "react-router-dom";
import { ApyScroll } from "./ApyScroll";
import { CardDescription } from "./CardDescription";
import { CardFooterLink } from "./CardFooter";
import { CardHeader } from "./CardHeader";
import { CardTitle } from "./CardTitle";
import { getVoltPath, getVoltTitle } from "./getVoltInfo";

interface MobileCardProps {
  voltNumber: VoltNumber;
}

export const MobileCard = ({ voltNumber }: MobileCardProps) => {
  const Bolt = getVoltBolt(voltNumber);
  const Chevron = getVoltChevronRight(voltNumber);

  return (
    <MobileCardContainer>
      <CardHeader
        css={css`
          margin-bottom: 16px;
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
          margin-bottom: 48px;
        `}
        voltNumber={voltNumber}
      />
      <CardFooterLink
        as={Link}
        to={getVoltPath(voltNumber)}
        css={css`
          margin-bottom: 24px;
        `}
      >
        Explore Volt
        <Chevron
          css={css`
            width: 6px;
            height: 12px;
          `}
        />
      </CardFooterLink>
      <ApyScroll
        css={css`
          margin: 0 -24px;
        `}
        voltNumber={voltNumber}
      />
    </MobileCardContainer>
  );
};

const MobileCardContainer = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0px 4px 24px rgba(68, 68, 68, 0.06);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${({ theme }) =>
    theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "#ffffff"};
`;

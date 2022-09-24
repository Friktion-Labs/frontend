import { FunctionComponent } from "react";
import styled from "@emotion/styled";
import { getCardGlowBG } from "../../../09/glow09";
import { VoltNumber } from "../../../09/registry10";

export interface CardProps {
  children?: React.ReactNode;
  glowDark?: boolean;
  className?: string;
  voltNumber?: VoltNumber;
  onClick?: () => void;
}

export const Card: FunctionComponent<CardProps> = ({
  children,
  glowDark,
  className,
  voltNumber = 5,
  onClick,
}) => {
  const GlowBG = getCardGlowBG(voltNumber);
  return (
    <CardWrapper onClick={onClick} className={className} glowDark={glowDark}>
      <CardContainer>{children}</CardContainer>
      <GlowBG className="glowBG" />
      <GlowBG className="glowBG" />
    </CardWrapper>
  );
};

const CardContainer = styled.div`
  font-family: "Euclid Circular B";
  font-weight: 400;
  font-style: normal;
  border-radius: 8px;
  width: 100%;
  height: 100%;
  cursor: pointer;
  padding: 24px;
  color: ${({ theme }) =>
    theme.palette.mode === "dark" ? "#ffffff" : theme.palette.grey[900]};
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 2;
  position: relative;

  ${({ theme }) => {
    if (theme.palette.mode === "dark") {
      return ` background: linear-gradient(180.27deg, #23242f 0.31%, #121317 99.84%);`;
    }
    return `
      background: rgba(255, 255, 255, 0.65);
      border-radius: 12px;
      box-shadow: 0px 4px 32px rgba(251, 241, 244, 0.38);
      border: 1px solid rgba(0, 0, 0, 0.05);
    `;
  }};
`;

const CardWrapper = styled.div<CardProps>`
  position: relative;
  &:hover > .glowBG {
    opacity: ${({ glowDark }) => (glowDark ? 1 : 0.6)};
  }
  &:hover > ${CardContainer} {
    ${({ theme }) => {
      if (theme.palette.mode === "light") {
        return `
          background: rgba(255, 255, 255, 1);
          box-shadow: none;
          `;
      }
    }};
  }
`;

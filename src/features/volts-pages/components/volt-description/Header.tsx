import { VoltNumber } from "09/registry10";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Typography } from "common/components/Typography";
import { VoltSelect } from "../VoltSelect";
import { mobileBreakpoint } from "../../constants/mobileBreakpoint";
import { HeaderTag } from "../HeaderTag";

interface HeaderProps {
  children: React.ReactNode;
  voltNumber: VoltNumber;
}

export const Header = ({ children, voltNumber }: HeaderProps) => (
  <HeaderContainer>
    <Typography
      variant="h3"
      css={css`
        margin-bottom: 0;
        margin-right: 16px;
        font-weight: 700;

        display: none;
        @media (min-width: ${mobileBreakpoint}) {
          display: block;
        }
      `}
    >
      {children}
    </Typography>
    <HeaderTag
      css={css`
        display: none;
        @media (min-width: ${mobileBreakpoint}) {
          display: block;
        }
      `}
      voltNumber={voltNumber}
    />
    <VoltSelect
      css={css`
        @media (min-width: ${mobileBreakpoint}) {
          display: none;
        }
      `}
    />
  </HeaderContainer>
);

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;

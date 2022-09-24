import { Tabs } from "common/components/Tabs";
import { Tab } from "common/components/Tab";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { InvestmentStyle } from "./InvestmentStyle";

interface PortfolioTabsProps {
  value: InvestmentStyle;
  onChange: (value: InvestmentStyle) => void;
}
export const PortfolioTabs = ({ value, onChange }: PortfolioTabsProps) => (
  <StyledTabs
    value={value}
    onChange={(value) => {
      onChange(value as InvestmentStyle);
    }}
    TabIndicatorProps={{
      css: (theme) => css`
        bottom: -1px;

        padding: 31px 0px;
        ${theme.breakpoints.down("sm")} {
          padding: 26px 0px;
        }

        &::before {
          content: "";
          border-radius: 12px;
          background: ${theme.palette.friktion.radial};
          position: absolute;
          inset: 0;
          padding: 2px;
          -webkit-mask: linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
        }
      `,
    }}
  >
    <StyledTab value="conservative">Conservative</StyledTab>
    <StyledTab value="moderate">Moderate</StyledTab>
    <StyledTab value="aggressive">Aggressive</StyledTab>
  </StyledTabs>
);

const StyledTabs = styled(Tabs)`
  max-width: 492px;
  width: 100%;
  background: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? "rgba(0, 0, 0, 0.7)"
      : "rgba(255, 255, 255, 0.7)"};
  border-radius: 12px;
  border: 1px solid rgba(141, 148, 160, 0.1);
  box-shadow: 0px 4px 24px rgba(153, 153, 153, 0.1);
  display: inline-flex;
`;

const StyledTab = styled(Tab)`
  font-weight: 500;
  flex: 1 1 calc(100% / 3);
  width: 164px;
  padding: 16px 0px;
  ${({ theme }) => theme.typography.bodyL};

  ${({ theme }) => theme.breakpoints.down("sm")} {
    ${({ theme }) => theme.typography.bodyXs};
  }

  color: ${({ theme, selected }) =>
    !selected
      ? theme.palette.grey[500]
      : theme.palette.mode === "dark"
      ? theme.palette.grey[50]
      : theme.palette.grey[950]} !important;
`;

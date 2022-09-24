import styled from "@emotion/styled";
import { PortfolioContent } from "./PortfolioContent";
import { SectionTitle } from "../SectionTitle";
import { useState } from "react";
import { InvestmentStyle } from "./InvestmentStyle";
import { css } from "@emotion/react";
import { LayoutContainer } from "common/components/LayoutContainer";
import { PortfolioPieChart } from "./PortfolioPieChart";

export const PortfolioSection = () => {
  const [investmentStyle, setInvestmentStyle] =
    useState<InvestmentStyle>("conservative");

  return (
    <LayoutContainer fixed>
      <PortfolioSectionContainer>
        <SectionTitle>PORTFOLIO</SectionTitle>
        <PortfolioSectionContent>
          <PortfolioContent
            investmentStyle={investmentStyle}
            setInvestmentStyle={setInvestmentStyle}
            css={(theme) => css`
              flex: 0 1 auto;
              width: 45%;

              ${theme.breakpoints.down("md")} {
                flex: 1 1 auto;
                width: 100%;
                margin-bottom: 200px;
              }
            `}
          />
          <PortfolioPieChart
            css={(theme) => css`
              flex: 0 1 auto;
              width: 45%;

              ${theme.breakpoints.down("md")} {
                flex: 1 1 auto;
                width: 100%;
              }
            `}
            investmentStyle={investmentStyle}
          />
        </PortfolioSectionContent>
      </PortfolioSectionContainer>
    </LayoutContainer>
  );
};

const PortfolioSectionContainer = styled.div`
  padding: 160px 22px;
  ${({ theme }) => theme.breakpoints.down("md")} {
    padding-top: 80px;
    padding-bottom: 80px;
  }
`;

const PortfolioSectionContent = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

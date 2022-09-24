import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { LayoutContainer } from "common/components/LayoutContainer";
import { SectionTitle } from "../SectionTitle";

import { GoalContent } from "./GoalContent";
import { GrowthCalculator } from "./GrowthCalculator";

export const GoalSection = () => {
  return (
    <LayoutContainer fixed>
      <GoalSectionContainer>
        <SectionTitle>GOAL</SectionTitle>
        <GoalSectionContent>
          <GoalContent
            css={(theme) => css`
              flex: 0 1 50%;

              ${theme.breakpoints.down("lg")} {
                flex: 1 1 100%;
              }
            `}
          />
          <GrowthCalculator
            css={(theme) => css`
              flex: 0 1 auto;
              width: 40%;

              ${theme.breakpoints.down("lg")} {
                flex: 1 1 auto;
                width: 100%;
                margin-top: 80px;
              }
            `}
          />
        </GoalSectionContent>
      </GoalSectionContainer>
    </LayoutContainer>
  );
};

const GoalSectionContainer = styled.div`
  padding: 160px 22px;
  ${({ theme }) => theme.breakpoints.down("md")} {
    padding-top: 80px;
    padding-bottom: 80px;
  }
`;

const GoalSectionContent = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

import styled from "@emotion/styled";

import { OurGrowthContent } from "./OurGrowthContent";
import { StatisticPart } from "./StatisticPart";
import { LayoutContainer } from "common/components/LayoutContainer";
import { SectionTitle } from "../SectionTitle";
import { css } from "@emotion/react";
import { OurGrowthSectionBackground } from "./OurGrowthSectionBackground";

export const OurGrowthSection = () => {
  return (
    <div
      css={css`
        position: relative;
      `}
    >
      <OurGrowthSectionBackground />
      <LayoutContainer fixed>
        <OurGrowthSectionContainer>
          <SectionTitle>OUR GROWTH</SectionTitle>
          <OurGrowthSectionContent>
            <OurGrowthContent
              css={css`
                flex: 0 1 auto;
              `}
            />
            <StatisticPart
              css={css`
                flex: 1 0 auto;
              `}
            />
          </OurGrowthSectionContent>
        </OurGrowthSectionContainer>
      </LayoutContainer>
    </div>
  );
};

const OurGrowthSectionContainer = styled.div`
  padding: 160px 22px;
  ${({ theme }) => theme.breakpoints.down("md")} {
    padding-top: 80px;
    padding-bottom: 80px;
  }
`;

const OurGrowthSectionContent = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 60px;
  ${({ theme }) => theme.breakpoints.down("md")} {
    flex-direction: column;
  }
`;

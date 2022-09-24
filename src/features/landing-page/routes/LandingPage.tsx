import { StatisticsSection } from "../components/StatisticsSection";
import { GoalSection } from "../components/GoalSection";
import { PortfolioSection } from "../components/PortfolioSection";
import { RiskSection } from "../components/RiskSection";
import { OurProductSection } from "../components/OurProductsSection";
import { OurGrowthSection } from "../components/OurGrowthSection";
import { LandingPageHero } from "../components/LandingPageHero";
import styled from "@emotion/styled";
import { TopSectionBackground } from "../components/TopSectionBackground";
import { MiddleSectionBackground } from "../components/MiddleSectionBackground";
// import { TheTeamSection } from "../components/the-team-section";
// import { InvestorsSection } from "../components/InvestorsSection";

export const LandingPage = () => {
  return (
    <>
      <TopSection>
        <TopSectionBackground />
        <LandingPageHero />
        <StatisticsSection />
      </TopSection>
      <MiddleSection>
        <MiddleSectionBackground />
        <GoalSection />
        <PortfolioSection />
        <RiskSection />
        <OurProductSection />
      </MiddleSection>
      {/* <InvestorsSection /> */}
      <OurGrowthSection />
      {/* <TheTeamSection /> */}
    </>
  );
};

const TopSection = styled.div`
  position: relative;
`;

const MiddleSection = styled.div`
  position: relative;
  overflow-x: clip;
`;

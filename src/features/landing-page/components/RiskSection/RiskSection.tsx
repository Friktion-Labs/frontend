import { FunctionComponent } from "react";
import styled from "@emotion/styled";

import { SectionTitle } from "../SectionTitle";
import { css } from "@emotion/react";
import { RiskSectionText } from "./RiskSectionText";
import { RiskChart } from "./RiskChart";
import { LayoutContainer } from "common/components/LayoutContainer";

interface RiskSectionProps {}

export const RiskSection: FunctionComponent<RiskSectionProps> = () => {
  return (
    <LayoutContainer fixed>
      <RiskSectionContainer>
        <SectionTitle
          css={css`
            width: 100%;
          `}
        >
          RISK-AWARE
        </SectionTitle>
        <RiskSectionContentLayout>
          <RiskSectionText />
          <RiskChart
            css={css`
              margin: auto;
              width: 100%;
            `}
          />
        </RiskSectionContentLayout>
      </RiskSectionContainer>
    </LayoutContainer>
  );
};

const RiskSectionContainer = styled.div`
  padding: 160px 22px;
  ${({ theme }) => theme.breakpoints.down("md")} {
    padding-top: 80px;
    padding-bottom: 80px;
  }
  text-align: center;
`;

const RiskSectionContentLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 60px;

  @media (max-width: 900px) {
    gap: 0px;
  }
`;

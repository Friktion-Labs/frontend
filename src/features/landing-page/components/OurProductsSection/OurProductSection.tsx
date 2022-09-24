import { FunctionComponent } from "react";
import styled from "@emotion/styled";

import { SectionTitle } from "../SectionTitle";
import { css } from "@emotion/react";
import { OurProductsSectionText } from "./OurProductsSectionText";
import { AllProducts } from "./AllProducts";

interface OurProductSectionProps {}

export const OurProductSection: FunctionComponent<
  OurProductSectionProps
> = () => {
  return (
    <OurProductsSectionContainer>
      <SectionTitle
        css={css`
          width: 100%;
          text-align: center;
        `}
      >
        OUR PRODUCTS
      </SectionTitle>
      <OurProductsSectionContentLayout>
        <OurProductsSectionText />
        <AllProducts />
      </OurProductsSectionContentLayout>
    </OurProductsSectionContainer>
  );
};

const OurProductsSectionContainer = styled.div`
  position: relative;
  padding: 160px 22px;
  max-width: 1200px;
  margin: auto;
  ${({ theme }) => theme.breakpoints.down("md")} {
    padding-top: 80px;
    padding-bottom: 80px;
  }
`;

const OurProductsSectionContentLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 80px;
`;

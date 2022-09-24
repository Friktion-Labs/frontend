import { css, Interpolation, Theme } from "@emotion/react";
import styled from "@emotion/styled";
import { Typography } from "common/components/Typography";
import { DescriptionText } from "../DescriptionText";
import { InvestmentStyle } from "./InvestmentStyle";
// import { STRATEGIES } from "./strategies";

interface InvestmentStyleBreakdownProps {
  investmentStyle: InvestmentStyle;
  css?: Interpolation<Theme>;
  className?: string;
}
export const InvestmentStyleBreakdown = ({
  investmentStyle,
  ...rest
}: InvestmentStyleBreakdownProps) => (
  <div {...rest}>
    <DescriptionText
      variant="bodyM"
      css={css`
        margin-bottom: 32px;
      `}
    >
      Build a portfolio based on your return targets and risk preferences.
    </DescriptionText>
    <ComingSoonBox>
      <Typography
        css={(theme) => css`
          color: ${theme.palette.mode === "dark"
            ? theme.palette.grey[400]
            : theme.palette.grey[900]};
          font-weight: 500;
        `}
        variant="bodyM"
      >
        Coming Soon!
      </Typography>
    </ComingSoonBox>
    {/* <DescriptionText
      css={css`
        font-weight: 700;
        margin-bottom: 8px;
      `}
      variant="bodyS"
    >
      Allocation
    </DescriptionText> */}
    {/* <AllocationContainer>
      {STRATEGIES.map(({ id, label, allocation }) => (
        <AllocationItem key={id}>
          <DescriptionText variant="bodyM">{`Volt ${id} ${label}`}</DescriptionText>
          <DescriptionText variant="bodyM">
            {allocation[investmentStyle]}%
          </DescriptionText>
        </AllocationItem>
      ))}
    </AllocationContainer> */}
  </div>
);

const ComingSoonBox = styled.div`
  display: flex;
  border: 2px solid
    ${({ theme }) =>
      theme.palette.mode === "dark"
        ? theme.palette.grey[800]
        : theme.palette.grey[200]};
  border-radius: 8px;
  padding: 12px 16px;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
`;

// const AllocationContainer = styled.div`
//   display: inline-grid;
//   grid-template-columns: repeat(2, auto);
//   grid-template-rows: repeat(3, auto);
//   grid-column-gap: 40px;
//   grid-row-gap: 16px;
//   grid-auto-flow: column;
// `;

// const AllocationItem = styled.div`
//   display: flex;
//   justify-content: space-between;
//   gap: 16px;
// `;

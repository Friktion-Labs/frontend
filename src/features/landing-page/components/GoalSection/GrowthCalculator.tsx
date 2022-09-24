import styled from "@emotion/styled";
import { Typography } from "common/components/Typography";
import { useState } from "react";
import { GrowthSlider } from "./GrowthSlider";
import { css, Theme, Interpolation } from "@emotion/react";
import { GrowthChart } from "./GrowthChart";
import { MAX_MONTHLY_DEPOSIT } from "./maxMonthlyDeposit";

interface GrowthCalculatorProps {
  css?: Interpolation<Theme>;
  className?: string;
}
export const GrowthCalculator = (props: GrowthCalculatorProps) => {
  const [monthlyDeposit, setMonthlyDeposit] = useState(500);
  const sliderProgressPercentage = (monthlyDeposit / MAX_MONTHLY_DEPOSIT) * 100;

  const handleChange = (_: Event, newValue: number | number[]) => {
    const newSliderProgressPercentage =
      (newValue as number) * (MAX_MONTHLY_DEPOSIT / 100);
    setMonthlyDeposit(newSliderProgressPercentage);
  };

  return (
    <div {...props}>
      <SliderContainer
        css={css`
          margin-bottom: 24px;
        `}
      >
        <DepositInfoLayout>
          <DepositInfoText>Monthly deposit</DepositInfoText>
          <DepositInfoCard
            css={css`
              text-align: center;
              min-width: 56px;
            `}
          >
            <DepositInfoText>${monthlyDeposit}</DepositInfoText>
          </DepositInfoCard>
        </DepositInfoLayout>
        <GrowthSlider
          value={sliderProgressPercentage}
          onChange={handleChange}
        />
      </SliderContainer>
      <GrowthChart
        css={css`
          height: 277px;
          width: 100%;
        `}
        monthlyDeposit={monthlyDeposit}
      />
    </div>
  );
};

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DepositInfoLayout = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DepositInfoCard = styled.div`
  border-radius: 8px;
  padding: 8px;
  background-color: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? theme.palette.grey[900]
      : theme.palette.grey[100]};
  border: 1px solid
    ${({ theme }) =>
      theme.palette.mode === "dark"
        ? "rgba(0, 0, 0, 0.3)"
        : "rgba(255, 255, 255, 0.3)"};
`;

const DepositInfoText = styled(Typography)`
  font-weight: 700;
`;

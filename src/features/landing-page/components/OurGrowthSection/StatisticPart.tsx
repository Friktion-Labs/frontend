import styled from "@emotion/styled";

import { Typography } from "common/components/Typography";
import { css, Interpolation, Theme } from "@emotion/react";
import { useTotalTVL } from "09/useTotalTVL";
import { formatUSDRoundDown } from "09/format09";

interface StatisticPartProps {
  css?: Interpolation<Theme>;
}

export const StatisticPart = (props: StatisticPartProps) => {
  const totalTvl = useTotalTVL();

  const statistics = [
    {
      label: "$2.7",
      suffix: "B+",
      description: "Total Traded Volume",
    },
    {
      label: totalTvl ? formatUSDRoundDown(totalTvl).substring(0, 3) : "...",
      suffix: "M+",
      description: "Total Value Locked",
    },
    {
      label: "17",
      suffix: "K+",
      description: "Users",
    },
    {
      label: "21.2",
      suffix: "%",
      description: "Average APY",
    },
  ];
  return (
    <StatisticPartContainerLayout {...props}>
      <StatisticPartContainer>
        {statistics.map(({ label, suffix, description }) => (
          <div key={label}>
            <StatisticNumber
              variant="h4"
              css={css`
                margin-bottom: 16px;
              `}
            >
              {label}
              <StatisticSuffix>{suffix}</StatisticSuffix>
            </StatisticNumber>
            <StatisticDescription variant="bodyS">
              {description}
            </StatisticDescription>
          </div>
        ))}
      </StatisticPartContainer>
    </StatisticPartContainerLayout>
  );
};

const StatisticPartContainerLayout = styled.div`
  display: flex;
  justify-content: end;
`;

const StatisticPartContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, min-content);
  grid-template-rows: repeat(2, min-content);
  grid-gap: 60px 100px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    grid-gap: 60px 0px;
    width: 100%;
    height: 100%;
    justify-content: space-between;
  }
`;

const StatisticDescription = styled(Typography)`
  color: ${({ theme }) => theme.palette.grey[500]};
  white-space: nowrap;
`;

const StatisticNumber = styled(Typography)`
  color: ${({ theme }) =>
    theme.palette.mode === "dark" ? "#ffffff" : "#000000"};
  font-size: 40px;
`;

const StatisticSuffix = styled.span`
  font-size: 24px;
`;

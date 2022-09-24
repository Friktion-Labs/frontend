import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { Typography } from "common/components/Typography";
import { LayoutContainer } from "common/components/LayoutContainer";
import { useTotalTVL } from "09/useTotalTVL";
import { formatUSDRoundDown } from "09/format09";

export const StatisticsSection: React.FC = () => {
  const totalTvl = useTotalTVL();

  const STATISTICS = [
    {
      label: "$2.7 billion",
      description: "Total Traded Volume",
    },
    {
      label: totalTvl
        ? `${formatUSDRoundDown(totalTvl).substring(0, 3)}M+`
        : "...",
      description: "Total Value Locked",
    },
    {
      label: "17K+",
      description: "Users",
    },
    {
      label: "21.2%",
      description: "Average APY",
    },
    {
      label: "$10.3M+",
      description: "Total Premium Generated",
    },
  ];

  return (
    <div
      css={(theme) => css`
        border: 1px solid rgba(255, 255, 255, 0.025);
        background: ${theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.025)"
          : "rgba(0, 0, 0, 0.025)"};
      `}
    >
      <LayoutContainer fixed>
        <StatisticSectionLayout>
          {STATISTICS.map((statistic) => (
            <StatisticContainer key={statistic.label + statistic.description}>
              <StatisticLabel variant="h5">{statistic.label}</StatisticLabel>
              <StatisticDescription variant="bodyS">
                {statistic.description}
              </StatisticDescription>
            </StatisticContainer>
          ))}
        </StatisticSectionLayout>
      </LayoutContainer>
    </div>
  );
};

const StatisticSectionLayout = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 0px 22px;
  position: relative;
  overflow: hidden;
  align-items: center;

  ${({ theme }) => theme.breakpoints.down("md")} {
    margin-top: 15px;
  }
`;

const StatisticContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 40px 30px;

  width: 20%;
  ${({ theme }) => theme.breakpoints.down("md")} {
    width: calc(100% / 3);
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 50%;
  }
`;

const StatisticLabel = styled(Typography)`
  text-align: center;
`;

const StatisticDescription = styled(Typography)`
  color: ${({ theme }) => theme.palette.grey[400]};
  text-align: center;
`;

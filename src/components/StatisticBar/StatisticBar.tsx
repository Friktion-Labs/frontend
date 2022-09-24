import styled from "@emotion/styled";

import { FunctionComponent } from "react";

import { StatisticCard } from "common/components/StatisticCard";

const VoltsStatisticContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100px;
  padding: 24px;

  background: linear-gradient(180.27deg, #23242f 0.31%, #121317 99.84%);
  border-radius: 8px;

  /* TODO: this code will be replaced after the breakpoints can cover this case. */
  @media screen and (max-width: 700px) {
    height: 100%;
    padding: 0;
    row-gap: 24px;
    flex-wrap: wrap;
    justify-content: flex-start;
    background: none;
    border: none;
  }
`;

export const StatisticBar: FunctionComponent<{
  data: { logo: JSX.Element; label: string; value: string }[];
  size?: "small" | "medium";
}> = ({ data, size = "medium" }) => {
  return (
    <VoltsStatisticContainer>
      {data.map(({ logo, label, value }, index) => (
        <StatisticCard
          key={index}
          logo={logo}
          label={label}
          value={value}
          size={size}
        />
      ))}
    </VoltsStatisticContainer>
  );
};

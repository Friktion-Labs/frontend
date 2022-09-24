import styled from "@emotion/styled";

import { FunctionComponent } from "react";
import { breakpoints } from "09/breakpoints09";

const VoltsStatisticCardContainer = styled.div<{ size?: "small" | "medium" }>`
  display: flex;
  width: 100%;
  height: ${({ size }) => (size === "small" ? "48px" : "60px")};

  flex-direction: row;
  align-items: center;

  ${breakpoints.medium} {
    width: fit-content;
    min-width: 180px;
  }
`;

const VoltsStatisticCardLogo = styled.div`
  margin-right: 16px;
`;

const VoltsStatisticContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const VoltsStatisticContentLabel = styled.div<{ size?: "small" | "medium" }>`
  font-size: ${({ size }) => (size === "small" ? "12px" : "14px")};
  line-height: ${({ size }) => (size === "small" ? "18px" : "21px")};

  color: ${(props) => props.theme.palette.grey[400]};
`;

const VoltsStatisticContentData = styled.div<{ size?: "small" | "medium" }>`
  font-weight: bold;
  font-size: ${({ size }) => (size === "small" ? "20px" : "30px")};
  line-height: ${({ size }) => (size === "small" ? "30px" : "40px")};

  color: #ffffff;
`;

export const StatisticCard: FunctionComponent<{
  logo: JSX.Element;
  label: string;
  value: string;
  size: "small" | "medium";
}> = ({ logo, label, value, size }) => {
  return (
    <VoltsStatisticCardContainer size={size}>
      <VoltsStatisticCardLogo>{logo}</VoltsStatisticCardLogo>
      <VoltsStatisticContent>
        <VoltsStatisticContentLabel size={size}>
          {label}
        </VoltsStatisticContentLabel>
        <VoltsStatisticContentData size={size}>
          {value}
        </VoltsStatisticContentData>
      </VoltsStatisticContent>
    </VoltsStatisticCardContainer>
  );
};

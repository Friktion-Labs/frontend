import { FunctionComponent } from "react";
import styled from "@emotion/styled";

interface TabSelectorProps {
  isActive: boolean;
  children: React.ReactNode;
  onClick: (e: React.SyntheticEvent | Event) => void;
  className?: string;
}

export const TabSelector: FunctionComponent<TabSelectorProps> = ({
  isActive,
  children,
  className,
  onClick,
}) => (
  <TabSelectorContainer
    className={className}
    isActive={isActive}
    onClick={onClick}
  >
    {children}
  </TabSelectorContainer>
);

const TabSelectorContainer = styled.div<{
  isActive: boolean;
}>`
  ${(props) => props.theme.typography.bodyM}
  padding-bottom: 21px;
  color: ${({ theme }) =>
    theme.palette.mode === "dark" ? "#ceced8" : "#5D5D64"};
  position: relative;
  cursor: pointer;

  ${({ isActive }) =>
    isActive &&
    `
    font-weight: 500;
    color: #FFFFFF;
    * {
      font-weight: 500;
    }
  `}
`;

export const PortfolioTabSelector: FunctionComponent<TabSelectorProps> = ({
  isActive,
  children,
  className,
  onClick,
}) => (
  <PortfolioTabSelectorContainer
    className={className}
    isActive={isActive}
    onClick={onClick}
  >
    {children}
  </PortfolioTabSelectorContainer>
);

const PortfolioTabSelectorContainer = styled.div<{
  isActive: boolean;
}>`
  font-family: "Euclid Circular B";
  font-style: normal;
  font-weight: ${({ isActive }) => (isActive ? "500" : "400")};
  font-size: 16px;
  line-height: 1.3;
  padding-bottom: 14px;
  color: ${({ isActive }) => (isActive ? "#ce56c2" : "#ceced8")};
  position: relative;
  cursor: pointer;
`;

import styled from "@emotion/styled";
import { Outlet } from "react-router";

export const LayoutContainer = styled.div<{ fixed?: boolean }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: auto;
  max-width: 1180px;

  ${({ fixed, theme }) =>
    fixed
      ? `max-width: ${theme.breakpoints.values.sm}px;
        ${theme.breakpoints.up("md")} {
          max-width: ${theme.breakpoints.values.md}px;
        }
        @media (min-width: 1300px) {
          max-width: ${theme.breakpoints.values.lg}px;
        }`
      : ""}
`;

export const RouterLayoutContainer = () => (
  <LayoutContainer>
    <Outlet />
  </LayoutContainer>
);

import styled from "@emotion/styled";
import { To } from "react-router-dom";

export const DesktopCardInner = styled.div<{ to?: To }>`
  box-shadow: 0px 4px 24px rgba(68, 68, 68, 0.06);
  border-radius: 12px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  min-height: 378px;
  height: 100%;
  background-color: ${({ theme }) =>
    theme.palette.mode === "dark" ? "#000000" : "#ffffff"};
`;

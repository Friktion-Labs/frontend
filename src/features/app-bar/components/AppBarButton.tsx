import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Theme } from "@mui/material";

export const appBarButtonStyles = (theme: Theme) => css`
  width: 45px;
  height: 45px;
  border: 0;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  background-color: ${theme.palette.mode === "dark"
    ? theme.palette.grey[900]
    : theme.palette.grey[100]};
  margin: 0;
  padding: 0;
  outline: none !important;

  &:hover svg {
    opacity: 0.8;
  }

  & svg {
    transition-duration: 0.15s;
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

    margin: auto;
    color: ${theme.palette.mode === "dark"
      ? "#FFFFFF"
      : theme.palette.pink[1000]};
  }
`;

export const AppBarButton = styled.button`
  ${(props) => appBarButtonStyles(props.theme)}
  background: hsla(230, 15%, 50%, 0.15) !important;
`;

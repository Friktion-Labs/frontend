import { Theme } from "@mui/material/styles";

export const getCommonStyles = (theme: Theme, noBorder?: boolean) => {
  return `
    background-color: ${
      theme.palette.mode === "dark"
        ? theme.palette.grey[800]
        : theme.palette.common.white
    };
    border: ${
      theme.palette.mode === "dark"
        ? theme.palette.grey[800]
        : `1px solid ${theme.palette.grey[200]}`
    };
    color: ${theme.palette.grey[500]} !important;
    ${
      noBorder &&
      `
        border: none !important;
        background-color: none !important;
        border-radius: 0px;
        height: auto;
      `
    }
  `;
};

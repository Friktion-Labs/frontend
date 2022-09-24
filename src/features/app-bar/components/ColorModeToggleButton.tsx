import { Interpolation, css, Theme } from "@emotion/react";
import { useTheme } from "@mui/material";
import { useToggleColorMode } from "app/theme";
import { AppBarButton } from "./AppBarButton";
import { DarkModeIcon } from "./DarkModeIcon";
import LightModeIcon from "@mui/icons-material/LightModeOutlined";

const iconStyles = css`
  margin: auto;
`;

interface ColorModeToggleButtonProps {
  css?: Interpolation<Theme>;
}
export const ColorModeToggleButton = (props: ColorModeToggleButtonProps) => {
  const { toggleColorMode } = useToggleColorMode();
  const theme = useTheme();

  return (
    <AppBarButton
      onClick={() => {
        toggleColorMode();
      }}
      {...props}
    >
      {theme.palette.mode === "dark" ? (
        <LightModeIcon css={iconStyles} />
      ) : (
        <DarkModeIcon color="#491056" css={iconStyles} />
      )}
    </AppBarButton>
  );
};

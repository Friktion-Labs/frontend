import React, { useContext, useMemo, useState } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";
import { getTheme } from "./theme";

const ColorModeContext = React.createContext({
  toggleColorMode: (mode?: PaletteMode | undefined) => {},
});
localStorage.setItem("needToSwitchThemeBack", "false");

export const AppThemeProvider = ({
  storedColorMode,
  switcher,
  children,
}: {
  storedColorMode: PaletteMode | null;
  switcher: (config: any) => void;
  children: React.ReactNode;
}) => {
  // no need to check user default preference for dark mode as we present dark mode by default
  const [mode, setMode] = useState<PaletteMode>(storedColorMode ?? "dark");
  const colorMode = useMemo(
    () => ({
      toggleColorMode: (mode?: PaletteMode | undefined) => {
        if (mode !== undefined) {
          setMode(mode);
          switcher({
            theme: mode,
          });
          if (mode === "dark") {
            localStorage.setItem("colorMode", "dark");
            return "dark";
          } else {
            localStorage.setItem("colorMode", "light");
            document.body.classList.remove("earlyDark");
            return "light";
          }
        } else {
          setMode((prevMode) => {
            switcher({
              theme: prevMode === "dark" ? "light" : "dark",
            });
            if (prevMode === "dark") {
              localStorage.setItem("colorMode", "light");
              document.body.classList.remove("earlyDark");
              return "light";
            } else {
              localStorage.setItem("colorMode", "dark");
              return "dark";
            }
          });
        }
      },
    }),
    [switcher]
  );

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      {/* We use MuiThemeProvider instead of emotion's native theme provider as Mui clashes with emotion theme provider */}
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ColorModeContext.Provider>
  );
};

export const useToggleColorMode = () => useContext(ColorModeContext);

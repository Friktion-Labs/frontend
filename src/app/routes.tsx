import {
  BrowserRouter,
  Route,
  Routes as ReactRouterRoutes,
} from "react-router-dom";
import { ZeroNineFaucet } from "../09/ZeroNineFaucet";
import { ZeroNineFourOhFour } from "../09/ZeroNineFourOhFour";
import "react-toastify/dist/ReactToastify.css";
import { ZeroNineCircuits } from "../09/ZeroNineCircuits";
import { AnalyticsPage } from "../09/AnalyticsPage";
import { AnalyticsInner } from "../09/AnalyticsInner";
import { AnalyticsOverview } from "../09/AnalyticsOverview";
import { PortfolioPage } from "../09/portfolio/PortfolioPage";
import { BaseLayout } from "./BaseLayout";
import { ZeroNineHomepageV2 } from "../09/ZeroNineHomePageV2";
import { AppThemeProvider, getTheme, themeSwitcher } from "./theme";
import {
  Income,
  Stables,
  NewCrab,
  Basis,
  CapitalProtection,
} from "../features/volts-pages";
import { LandingPage } from "features/landing-page";
import { VoltPageLayout } from "features/volts-pages/components/VoltPageLayout";
import { EllipseBg } from "./EllipseBg";
import { ZeroNineLayout } from "09/ZeroNineLayout";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";
import { RouterLayoutContainer } from "common/components/LayoutContainer";
import { ZeroNinePageTitleAndMiscMiddleware } from "09/ZeroNinePageTitleAndMiscMiddleware";
import { GlowClipPaths } from "./GlowClipPaths";
import { AppWalletModal } from "features/wallet";

const timestamp = new Date().getTime();
const { switcher } = themeSwitcher({
  themeMap: {
    dark: `/dark-theme.css?${timestamp}`,
    light: `/light-theme.css?${timestamp}`,
  },
});
const storedColorMode = localStorage.getItem("colorMode") as PaletteMode | null;
switcher({
  theme: storedColorMode ?? "dark",
});

export function Routes() {
  return (
    <BrowserRouter basename="/">
      <ReactRouterRoutes>
        {/* Routes with light theme support */}
        <Route
          element={
            <AppThemeProvider
              storedColorMode={storedColorMode}
              switcher={switcher}
            >
              <ZeroNinePageTitleAndMiscMiddleware />
              <GlowClipPaths />
              <BaseLayout />
              <AppWalletModal />
            </AppThemeProvider>
          }
        >
          <Route path="" element={<LandingPage />} />

          {/* With Layout container */}
          <Route
            element={
              <>
                <EllipseBg />
                <RouterLayoutContainer />
              </>
            }
          >
            <Route path="volts" element={<ZeroNineHomepageV2 />} />
            <Route element={<VoltPageLayout />}>
              <Route path="income" element={<Income />} />
              <Route path="stables" element={<Stables />} />
              <Route path="crab" element={<NewCrab />} />
              <Route path="basis" element={<Basis />} />
              <Route path="protection" element={<CapitalProtection />} />
            </Route>
          </Route>
        </Route>

        {/* Routes without light theme support */}
        <Route
          element={
            <MuiThemeProvider theme={getTheme("dark")}>
              {/* <EllipseBg /> */}
              <ZeroNineLayout switcher={switcher} />
              <AppWalletModal />
            </MuiThemeProvider>
          }
        >
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/portfolio/:walletFromUrl" element={<PortfolioPage />} />
          {/* <Route path="/explore" element={<ExplorePage />} /> */}
          <Route path="/analytics" element={<AnalyticsPage />}>
            <Route index element={<AnalyticsOverview />} />
            <Route path=":id" element={<AnalyticsInner />} />
          </Route>
          <Route path="/circuits" element={<ZeroNineCircuits />} />
          <Route path="/faucet" element={<ZeroNineFaucet />} />
          <Route path="/*" element={<ZeroNineFourOhFour />} />
        </Route>
      </ReactRouterRoutes>
    </BrowserRouter>
  );
}

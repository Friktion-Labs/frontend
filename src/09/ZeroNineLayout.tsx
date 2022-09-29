import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React, { PropsWithChildren, useState } from "react";
import { PaletteMode } from "@mui/material";
// import { breakpoints09 } from "./breakpoints09";
import { ZeroNinePageTitleAndMiscMiddleware } from "./ZeroNinePageTitleAndMiscMiddleware";
import { AppBar } from "../features/app-bar";
import { AnnouncementBar } from "./AnnouncementBar";
import { Outlet } from "react-router";
import { LayoutFooter } from "components/LayoutFooter";

const footerLinks = [
  {
    title: "Features",
    items: [
      { href: "https://friktion.fi/portfolio", label: "Portfolio" },
      { href: "https://friktion.fi/analytics", label: "Analytics" },
    ],
  },
  {
    title: "Documentation",
    items: [
      { href: "https://docs.friktion.finance", label: "Homepage" },
      {
        href: "https://docs.friktion.fi/products/new-user-start-here",
        label: "New user?",
      },
      {
        href: "https://docs.friktion.fi/products/what-are-volts",
        label: "What are Volts?",
      },
      {
        href: "https://docs.friktion.fi/products/friktion-glossary",
        label: "Glossary",
      },
    ],
  },
  {
    title: "Open Source",
    items: [
      { href: "https://github.com/Friktion-Labs", label: "Organization" },
      {
        href: "https://github.com/Friktion-Labs/frontend",
        label: "Friktion UI",
      },
      { href: "https://github.com/Friktion-Labs/sdk", label: "Friktion SDK" },
    ],
  },
  {
    title: "Community",
    items: [
      { href: "https://forum.friktion.fi", label: "Forum" },
      { href: "https://friktionlabs.medium.com", label: "Blogs" },
    ],
  },
  {
    title: "Strategies",
    items: [
      { href: "https://friktion.fi/income", label: "Covered Call" },
      { href: "https://friktion.fi/stables", label: "Stables" },
      { href: "https://friktion.fi/crab", label: "Crab" },
      { href: "https://friktion.fi/basis", label: "Basis Yield" },
      { href: "https://friktion.fi/protection", label: "Capital Protection" },
    ],
  },
];

const animationsDisabled =
  localStorage.getItem("animationsDisabled") === "true";
export const ZeroNineLayout = React.memo<
  PropsWithChildren<{ switcher: (config: any) => void }>
>(({ switcher }) => {
  const [checked, setChecked] = useState(!animationsDisabled);

  const storedColorMode = localStorage.getItem(
    "colorMode"
  ) as PaletteMode | null;

  if (storedColorMode === "light") {
    switcher({
      theme: "dark",
    });
    localStorage.setItem("needToSwitchThemeBack", "true");
  }

  return (
    <Layout className={!checked ? "animationsDisabled" : ""}>
      <ZeroNinePageTitleAndMiscMiddleware />
      <AnnouncementBar />
      <AppBar hideColorModeToggle={true} />
      <Body>
        <Outlet />
      </Body>
      <div
        css={css`
          position: absolute;
          height: 0;
          width: 0;
          pointer-events: none;
          opacity: 0;
          overflow: hidden;
        `}
      >
        <div
          css={css`
            position: absolute;
            left: -1000px;
            // This is necessary for the bolt in the Card09 to appear.
          `}
        >
          <svg
            width="89"
            height="115"
            viewBox="0 0 89 115"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <clipPath id="boltPath">
                <path
                  d="M78.6811 62.6111L20.7666 115L36.5029 74.6223L78.6811 62.6111Z"
                  fill="white"
                />
                <path d="M0 80.5L89 0L64.7507 62.1L0 80.5Z" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>

        {/* Relatively sized bolt path, width and height styles must be supplied to elements using this as clip */}
        <svg
          css={css`
            position: absolute;
            width: 0;
            height: 0;
          `}
        >
          <clipPath id="boltPathRelative" clipPathUnits="objectBoundingBox">
            <path d="M0.884,0.544 L0.233,1 L0.41,0.649 L0.884,0.544 M0,0.7 L1,0 L0.728,0.54 L0,0.7"></path>
          </clipPath>
        </svg>
      </div>

      <LayoutFooter
        links={footerLinks}
        isAnimationEnabled={checked}
        setIsAnimationEnabled={setChecked}
      />
    </Layout>
  );
});

const Layout = styled.div`
  // background: green;
  /* overflow-x: hidden; */
  &.animationsDisabled * {
    animation-play-state: paused !important;
  }
`;

// Each card is 300px wide. 20px padding on each side. Min width of site is 340px
// 20+300+20+300+20+300+20 = 980px. So we could get away with 980px.
const Body = styled.div`
  /* padding: 0 20px; */
`;

import styled from "@emotion/styled";
import { Outlet } from "react-router-dom";
import { breakpoints } from "../09/breakpoints09";
import { useState } from "react";
import { css } from "@emotion/react";
import { useToggleColorMode } from "./theme";
import { AnnouncementBar } from "09/AnnouncementBar";
import { AppBar } from "features/app-bar";
import { LayoutFooter } from "components/LayoutFooter";

// TODO: add this to parent component to include landing page
const animationsDisabled =
  localStorage.getItem("animationsDisabled") === "true";

export const BaseContainer = styled.div`
  &.animationsDisabled * {
    animation-play-state: paused !important;
  }
`;

// TODO: delete this
export const LayoutSection = styled.div`
  margin: 0 auto;
  padding: 20px 20px 0px 20px;
  width: 100%;
  display: flex;
  flex-flow: wrap;
  justify-content: center;

  /** breakpoint: mobile responsive to change flex-direction to column */
  ${breakpoints.medium} {
    padding-top: 20px;
  }
`;

// constants
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

export const BaseLayout = () => {
  const [checked, setChecked] = useState(!animationsDisabled);
  const { toggleColorMode } = useToggleColorMode();

  const needToSwitchThemeBack =
    localStorage.getItem("needToSwitchThemeBack") === "true";
  if (needToSwitchThemeBack) {
    toggleColorMode("light");
    localStorage.setItem("needToSwitchThemeBack", "false");
  }

  return (
    <div
      css={css`
        overflow: -webkit-paged-x;
      `}
    >
      <BaseContainer className={!checked ? "animationsDisabled" : ""}>
        <AnnouncementBar />
        <AppBar hideColorModeToggle={false} />
        <Outlet />
      </BaseContainer>
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
    </div>
  );
};

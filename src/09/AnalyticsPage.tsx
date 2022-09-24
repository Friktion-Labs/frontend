// import { css } from "@emotion/react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useElementSize } from "usehooks-ts";
import { Outlet, useMatch, useResolvedPath } from "react-router-dom";
import friktionBolt from "./friktionLogos/friktionBolt.png";
import {
  SORTED_VOLT1,
  SORTED_VOLT2,
  SORTED_VOLT3,
  SORTED_VOLT4,
} from "./registry10";
import { VoltNumber } from "./VoltNumber";
import { AutoUniversalAssetLogo } from "./UniversalAssetLogo";
import { Link } from "react-router-dom";
import { useCallback } from "react";
import { APP_BAR_HEIGHT, APP_BAR_MARGIN_BOTTOM } from "../features/app-bar";

export const SidebarItemLink: React.FC<{
  to: string;
  onClick?: () => void;
  children?: React.ReactNode;
}> = ({ to, children, onClick }) => {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  return (
    <Link
      css={sidebarItemLink}
      to={to}
      className={match ? " active" : ""}
      onClick={onClick}
    >
      <SidebarItemPill>{children}</SidebarItemPill>
    </Link>
  );
};

export const AnalyticsPage: React.FC = () => {
  const [sidebarRef, { height }] = useElementSize();

  const stickyAble =
    height > 0 &&
    height + (APP_BAR_HEIGHT + APP_BAR_MARGIN_BOTTOM) < window.innerHeight;

  // If more than 60% of then screen, then scroll for the user
  const itemClickScrollHandler = useCallback(() => {
    const SidebarContainer = document.getElementById("SidebarContainer");
    const content = document.getElementById("content");

    if (!SidebarContainer || !content) {
      return;
    }
    window.disableOneScrollTo = true;
    const headerHeight = 80;
    // console.log(
    //   headerHeight + SidebarContainer.offsetHeight,
    //   ">",
    //   window.outerHeight * 0.5
    // );
    if (
      headerHeight + SidebarContainer.offsetHeight > window.outerHeight * 0.5 &&
      window.outerHeight <= 660
    ) {
      const yOffset = -20;
      const y =
        content.getBoundingClientRect().top + window.pageYOffset + yOffset;
      console.log("SCKO");
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);
  return (
    <OutsideConatiner
      css={css`
        padding-bottom: 300px;
      `}
    >
      <Title>Analytics</Title>
      <Mainbar>
        <SidebarContainer id="SidebarContainer">
          <Sidebar ref={sidebarRef} className={stickyAble ? "stickyable" : ""}>
            <SidebarGroup>
              <SidebarItems>
                <SidebarItem>
                  <SidebarItemLink
                    to="/analytics"
                    onClick={itemClickScrollHandler}
                  >
                    <img
                      css={css`
                        margin-right: 10px;
                        user-select: none;
                      `}
                      height="18"
                      src={friktionBolt}
                      alt=""
                    />
                    Friktion Overview
                  </SidebarItemLink>
                </SidebarItem>
              </SidebarItems>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarTitle>Volt #01: Generate Income</SidebarTitle>
              <SidebarItems>
                {SORTED_VOLT1.map((def) => {
                  return (
                    <SidebarItem key={def.globalId}>
                      <SidebarItemLink
                        to={"/analytics/" + def.shareTokenSymbol}
                        onClick={itemClickScrollHandler}
                      >
                        <SidebarItemSymbologyWrapper>
                          <SidebarItemSymbology>
                            <VoltNumber voltNum={def.volt} />
                            <div>
                              <AutoUniversalAssetLogo def={def} />
                            </div>
                          </SidebarItemSymbology>
                        </SidebarItemSymbologyWrapper>
                        <div>
                          {def.globalId.toLowerCase().includes("high")
                            ? def.underlying.name + " High Voltage"
                            : def.underlying.name.includes("LIDO")
                            ? "LIDO SOL"
                            : def.underlying.name}
                        </div>
                      </SidebarItemLink>
                    </SidebarItem>
                  );
                })}
              </SidebarItems>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarTitle>Volt #02: Sustainable Stables</SidebarTitle>
              <SidebarItems>
                {SORTED_VOLT2.map((def) => {
                  return (
                    <SidebarItem key={def.globalId}>
                      <SidebarItemLink
                        to={"/analytics/" + def.shareTokenSymbol}
                        onClick={itemClickScrollHandler}
                      >
                        <SidebarItemSymbologyWrapper>
                          <SidebarItemSymbology>
                            <VoltNumber voltNum={def.volt} />
                            <div>
                              <AutoUniversalAssetLogo def={def} />
                            </div>
                          </SidebarItemSymbology>
                        </SidebarItemSymbologyWrapper>
                        <div>
                          {def.depositToken.symbol +
                            "-" +
                            def.underlying.symbol}
                          {def.globalId.toLowerCase().includes("high")
                            ? " High Voltage"
                            : ""}
                        </div>
                      </SidebarItemLink>
                    </SidebarItem>
                  );
                })}
              </SidebarItems>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarTitle>Volt #03: Crab Strategy</SidebarTitle>
              <SidebarItems>
                {SORTED_VOLT3.map((def) => {
                  return (
                    <SidebarItem key={def.globalId}>
                      <SidebarItemLink
                        to={"/analytics/" + def.shareTokenSymbol}
                        onClick={itemClickScrollHandler}
                      >
                        <SidebarItemSymbologyWrapper>
                          <SidebarItemSymbology>
                            <VoltNumber voltNum={def.volt} />
                            <div>
                              <AutoUniversalAssetLogo def={def} />
                            </div>
                          </SidebarItemSymbology>
                        </SidebarItemSymbologyWrapper>
                        <div>
                          {def.depositToken.symbol +
                            "-" +
                            def.underlying.symbol}
                          {def.globalId.toLowerCase().includes("high")
                            ? " High Voltage"
                            : ""}
                        </div>
                      </SidebarItemLink>
                    </SidebarItem>
                  );
                })}
              </SidebarItems>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarTitle>Volt #04: Basis Yield</SidebarTitle>
              <SidebarItems>
                {SORTED_VOLT4.reverse().map((def) => {
                  return (
                    <SidebarItem key={def.globalId}>
                      <SidebarItemLink
                        to={"/analytics/" + def.shareTokenSymbol}
                        onClick={itemClickScrollHandler}
                      >
                        <SidebarItemSymbologyWrapper>
                          <SidebarItemSymbology>
                            <VoltNumber voltNum={def.volt} />
                            <div>
                              <AutoUniversalAssetLogo def={def} />
                            </div>
                          </SidebarItemSymbology>
                        </SidebarItemSymbologyWrapper>
                        <div>
                          {def.depositToken.symbol +
                            "-" +
                            def.underlying.symbol}
                          {def.globalId.toLowerCase().includes("high")
                            ? " High Voltage"
                            : ""}
                        </div>
                      </SidebarItemLink>
                    </SidebarItem>
                  );
                })}
              </SidebarItems>
            </SidebarGroup>
          </Sidebar>
        </SidebarContainer>
        <MainbarActual id="content">
          <Outlet />
        </MainbarActual>
      </Mainbar>
      <Ellipse />
    </OutsideConatiner>
  );
};

// AnalyticsPage.whyDidYouRender = true;
// We make another component so that we can use useCallback to prevent unnecessary rerenders
const Ellipse = styled.div`
  position: absolute;
  /* width: 694px; */
  width: 150%;
  height: 694px;
  top: -353px;
  left: -300px;
  z-index: -1;

  background: linear-gradient(
    90.31deg,
    rgba(54, 121, 247, 0.2) -2.65%,
    rgba(219, 115, 222, 0.2) 98.9%
  );
  filter: blur(120px);
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -webkit-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
`;

const OutsideConatiner = styled.div`
  max-width: 980px;
  padding: 0 10px 0 10px;
  margin: 0 auto;
  /* display: flex; */
  /* position: static; */
  @media only screen and (max-width: 600px) {
    padding: 0;
  }
`;

const SidebarContainer = styled.div`
  z-index: 5;
  width: 0;
  flex-shrink: 0;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  float: left;
  left: -200px;
  padding-top: 100px;
  width: 200px;
  padding-left: 20px;

  @media only screen and (max-width: 1390px) {
    left: 0;
  }

  @media only screen and (max-width: 980px) {
    width: auto;
    position: static;
    float: none;
    padding-top: 0;
    padding-right: 20px;
  }

  @media only screen and (max-width: 560px) {
    padding-left: 10px;
    padding-right: 10px;
  }
`;

const Sidebar = styled.div`
  width: 200px;
  position: relative;

  &.stickyable {
    position: sticky;
    left: 0;
    top: ${APP_BAR_HEIGHT + APP_BAR_MARGIN_BOTTOM}px;
  }

  @media only screen and (max-width: 1390px) {
    left: 0;
  }

  @media only screen and (max-width: 980px) {
    width: auto;
    left: 0;
    position: static;
  }

  @media print {
    & {
      display: none;
    }
  }
`;
const SidebarGroup = styled.ul`
  list-style-type: none;
  padding-left: 0;
  margin-bottom: 12px;
`;
const SidebarTitle = styled.li`
  font-size: 11px;
  text-transform: uppercase;
  /* padding-left: 14px; */
  font-weight: bold;
  margin-bottom: 4px;
`;
const SidebarItems = styled.ul`
  list-style-type: none;
  padding-left: 0;

  @media only screen and (max-width: 980px) {
    /* display: flex;
    flex-wrap: wrap; */
    gap: 6px 8px;

    display: grid;
    /** Target min width 155px */

    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  @media only screen and (max-width: 890px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  @media only screen and (max-width: 730px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media only screen and (max-width: 560px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media only screen and (max-width: 359px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
`;
const SidebarItem = styled.li`
  /* margin-bottom: 2px; */
  margin-bottom: -1px;
`;

const SidebarItemPill = styled.div`
  padding: 6px 12px 6px 14px;
  min-height: 32px;
  line-height: 1.1;
  display: flex;
  align-items: center;
  font-size: 13px;
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  @media only screen and (max-width: 980px) {
    /* width: 155px; */
    /* we target 155px */
    flex-grow: 1;
    min-height: 42px;
  }

  @media only screen and (max-width: 359px) {
    min-height: unset;
  }
`;
const sidebarItemLink = css`
  display: block;
  padding-top: 2px;
  padding-bottom: 2px;
  margin: 0;

  &,
  &.active,
  &:active,
  &:hover {
    border-radius: 4px;
    ${SidebarItemPill} {
      border-radius: 4px;
    }
  }
  &.active {
    color: #fff;
    ${SidebarItemPill} {
      background: linear-gradient(hsl(230, 15%, 16%), hsl(230, 15%, 11%) 80%);
    }
  }
  :hover,
  &.active:hover {
    ${SidebarItemPill} {
      background: linear-gradient(hsl(230, 15%, 18%), hsl(230, 15%, 13%) 80%);
    }
    color: #fff;
  }
  :active,
  &.active:active {
    ${SidebarItemPill} {
      background: linear-gradient(hsl(230, 15%, 22%), hsl(230, 15%, 17%) 80%);
    }
    color: #fff;
  }

  @media only screen and (max-width: 980px) {
    ${SidebarItemPill} {
      background: linear-gradient(hsl(230, 15%, 14%), hsl(230, 15%, 9%) 80%);
    }
    &.active {
      ${SidebarItemPill} {
        background: linear-gradient(hsl(230, 15%, 20%), hsl(230, 15%, 15%) 80%);
      }
    }
    :hover,
    &.active:hover {
      ${SidebarItemPill} {
        background: linear-gradient(hsl(230, 15%, 22%), hsl(230, 15%, 17%) 80%);
      }
    }
    :active,
    &.active:active {
      ${SidebarItemPill} {
        background: linear-gradient(hsl(230, 15%, 22%), hsl(230, 15%, 17%) 80%);
      }
    }
  }
`;
export const SidebarItemSymbologyWrapper = styled.div`
  width: 62px;
  height: 20px;
`;
export const SidebarItemSymbology = styled.div`
  display: flex;
  align-items: center;
  transform-origin: left center;
  transform: scale(0.5);
  height: 20px;
`;

// We don't use flex because flex has implicit overflow: hidden;
const Mainbar = styled.div`
  z-index: 3;
  position: relative;
  font-family: "Euclid Circular B";
  /* background: green; */
  /* flex-shrink: 1; */
  /* min-width: 0; */
  /* overflow: auto; */
  /* flex-grow: 1; */

  /* padding-top: 80px;
  margin-top: -80px;
  padding-left: 140px;
  margin-left: -140px; */
  /* max-width: 900px; */
  margin-left: 0;

  @media only screen and (max-width: 980px) {
    margin-top: 10px;
  }
`;
// The reason for all the hacks is due to the overflowing stuff

// We don't use flex because flex has implicit overflow: hidden;
const MainbarActual = styled.div`
  overflow-x: hidden;
  padding-top: 100px;
  margin-top: -90px;
  margin-left: -200px;
  padding-left: 220px;

  @media only screen and (max-width: 1390px) {
    /* margin-left: 200px; */
    /* padding-left: 420px; */
    margin-left: 0;
    padding-left: 220px;
  }

  @media only screen and (max-width: 980px) {
    position: static;
    float: none;
    margin-top: 20px;
    padding-top: 0;
    margin-left: 0;
    padding-left: 0;
  }
`;

const Title = styled.span`
  padding-left: 42px;
  font-family: "Recoleta";
  font-size: 40px;
  font-weight: 500;
  color: white;
  width: 100%;
  z-index: 1;

  @media (max-width: 659px) {
    font-size: 30px;
  }

  @media only screen and (max-width: 1390px) {
    padding-left: 242px;
  }

  @media only screen and (max-width: 980px) {
    padding-left: 21px;
  }
`;

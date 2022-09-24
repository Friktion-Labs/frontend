import styled from "@emotion/styled";
import React, { useCallback, useEffect, useState } from "react";
import { css, useTheme } from "@emotion/react";
import { Link } from "react-router-dom";
import { Popover } from "antd";
import { VoltsDropdown } from "09/HeaderVoltsDropdown";
import { DialectNotificationsButton } from "./DialectNotificationsButton";
import { HeaderWallet } from "./HeaderWallet";
import { AppBarButton } from "./AppBarButton";
import MenuIcon from "@mui/icons-material/Menu";
import { FriktionTitle } from "./FriktionTitle";
// import { ColorModeToggleButton } from "./ColorModeToggleButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useRouteMatch } from "common/hooks/useRouteMatch";
import { CollapsedTabContent } from "../types/CollapsedTabContent";
import { AppBarItems, AppBarItem } from "./app-bar-items";
import { appBarMenuLinkStyle, SocialLinks } from "./MenuLinks";
import { useScrollPosition } from "hooks/useScrollPosition";
import { FriktionBolt } from "features/icons";

export const APP_BAR_HEIGHT = 70;
export const APP_BAR_MARGIN_BOTTOM = 10;

export const AppBar = ({
  hideColorModeToggle,
}: {
  hideColorModeToggle: boolean;
}) => {
  const theme = useTheme();
  const scrollPosition = useScrollPosition();
  const voltRoutes = [
    "/volts",
    "/income",
    "/stables",
    "/crab",
    "/basis",
    "/protection",
  ];
  const routes = ["/analytics/*", "/portfolio/*", "/circuits"];
  const routeMatch = useRouteMatch(routes.concat(voltRoutes));
  const currentTab = routeMatch?.pattern?.path;

  const isTabOnVolts = voltRoutes.includes(currentTab ?? "undefined");

  const [collapsedTabsContent, setCollapsedTabsContent] = useState<
    CollapsedTabContent[]
  >([]);

  const [communityPopdownOpen, setCommunityPopdownOpen] = useState(false);

  const [mobilePopdownOpen, setMobilePopdownOpen] = useState(false);

  // volts tab stuff
  const [voltsPopdownVisible, setVoltsPopdownVisible] = useState(false);
  const [isVoltTabCollapsed, setIsVoltTabCollapsed] = useState(false);
  const [isVoltTabClicked, setIsVoltTabClicked] = useState(false);
  const hideVoltsPopdown = useCallback(() => {
    setVoltsPopdownVisible(false);
  }, []);
  const onVoltPopdownVisibleChange = useCallback(
    (visible: boolean) => {
      if (visible) {
        setVoltsPopdownVisible(true);
      } else if (!isVoltTabClicked) {
        // prevent closing of popdown if volts tab was clicked
        setVoltsPopdownVisible(false);
      }
    },
    [isVoltTabClicked]
  );
  useEffect(() => {
    setVoltsPopdownVisible(isVoltTabClicked);
  }, [isVoltTabClicked]);
  useEffect(() => {
    if (voltsPopdownVisible) {
      setMobilePopdownOpen(false);
    } else {
      setIsVoltTabClicked(false);
    }
  }, [voltsPopdownVisible]);
  const VoltsDropdownMobile = ({ children }: { children: React.ReactNode }) => (
    <Popover
      destroyTooltipOnHide
      placement="bottom"
      arrowPointAtCenter
      trigger="click"
      content={
        <VoltsDropdown visible={voltsPopdownVisible} hide={hideVoltsPopdown} />
      }
      visible={voltsPopdownVisible}
      onVisibleChange={onVoltPopdownVisibleChange}
      overlayClassName={
        theme.palette.mode === "dark"
          ? "darkMediumOverlay"
          : "lightMediumOverlay"
      }
      ref={(node: any) => {
        if (node?.portalContainer) {
          // add padding to popover
          (node.portalContainer as HTMLDivElement).classList.add(
            "paddedOverlay"
          );
        }
      }}
    >
      {children}
    </Popover>
  );

  const [
    dialectNotificationsButtonContainer,
    setDialectNotificationsButtonContainer,
  ] = useState<HTMLDivElement>();

  return (
    <AppBarContainer scroll={scrollPosition}>
      <HeaderLogo className="headerLogo">
        <Link to="/">
          <FriktionBolt
            width="28"
            height="28"
            color={theme.palette.pink[600]}
          />
          <FriktionTitle height="18" />
        </Link>
      </HeaderLogo>
      <AppBarItems
        css={css`
          flex: 1 1 auto;
          min-width: 0;
          align-items: center;
        `}
        setCollapsedItemsContent={setCollapsedTabsContent}
        // value={currentTab}
        // showHighlight={collapsedTabsContent.length === 0}
      >
        <AppBarItem
          collapsedContent={
            <VoltsDropdownMobile>
              <span
                ref={(node) => {
                  if (node) {
                    setIsVoltTabCollapsed(true);
                  } else {
                    setIsVoltTabCollapsed(false);
                  }
                }}
                css={(theme) => css`
                  ${appBarMenuLinkStyle(theme)}
                  font-weight: ${isTabOnVolts ? 600 : "inherit"};
                `}
              >
                Volts
              </span>
            </VoltsDropdownMobile>
          }
          // value="/*"
        >
          {isVoltTabCollapsed ? (
            <VoltsDropdownMobile>
              <span className={"voltDropdown"}>Volts</span>
            </VoltsDropdownMobile>
          ) : (
            <Popover
              destroyTooltipOnHide
              mouseEnterDelay={0}
              placement="bottomLeft"
              arrowPointAtCenter
              trigger="hover"
              content={
                <VoltsDropdown
                  visible={voltsPopdownVisible}
                  hide={hideVoltsPopdown}
                  enableClickAwayListener
                />
              }
              visible={voltsPopdownVisible}
              onVisibleChange={onVoltPopdownVisibleChange}
              overlayClassName={
                theme.palette.mode === "dark"
                  ? "darkMediumOverlay"
                  : "lightMediumOverlay"
              }
              ref={(node: any) => {
                if (node?.portalContainer) {
                  // add padding to popover
                  (node.portalContainer as HTMLDivElement).classList.add(
                    "paddedOverlay"
                  );
                }
              }}
            >
              <div
                css={css`
                  display: flex;
                  flex-direction: row;
                  gap: 4px;
                `}
              >
                <span
                  onClick={() => {
                    setIsVoltTabClicked((oldValue) => !oldValue);
                  }}
                  className={"voltDropdown"}
                  css={css`
                    font-weight: ${isTabOnVolts ? "600 !important" : "inherit"};
                  `}
                >
                  Volts
                </span>
                <KeyboardArrowDownIcon
                  css={css`
                    width: 16px;
                    height: 16px;
                    margin-right: -8px;
                    align-self: center;
                  `}
                />
              </div>
            </Popover>
          )}
        </AppBarItem>

        <AppBarItem
          collapsedContent={
            <Link css={appBarMenuLinkStyle} to="/analytics">
              Analytics
            </Link>
          }
          // value="/analytics/*"
        >
          <Link
            to="/analytics"
            css={css`
              font-weight: ${currentTab === "/analytics/*"
                ? "600 !important"
                : "inherit"};
            `}
          >
            Analytics
          </Link>
        </AppBarItem>

        <AppBarItem
          collapsedContent={
            <Link css={appBarMenuLinkStyle} to="/portfolio">
              Portfolio
            </Link>
          }
          // value="/portfolio/*"
        >
          <Link
            to="/portfolio"
            css={css`
              font-weight: ${currentTab === "/portfolio/*"
                ? "600 !important"
                : "inherit"};
            `}
          >
            Portfolio
          </Link>
        </AppBarItem>

        <AppBarItem
          collapsedContent={
            <Link css={appBarMenuLinkStyle} to="/circuits">
              Circuits
            </Link>
          }
          // value="/circuits"
        >
          <Link
            to="/circuits"
            css={css`
              font-weight: ${currentTab === "/circuits"
                ? "600 !important"
                : "inherit"};
            `}
          >
            Circuits
          </Link>
        </AppBarItem>

        <AppBarItem
          collapsedContent={
            <a
              css={appBarMenuLinkStyle}
              href="https://docs.friktion.finance/"
              target="_blank"
              rel="noreferrer"
            >
              Docs
            </a>
          }
        >
          <a
            href="https://docs.friktion.finance/"
            target="_blank"
            rel="noreferrer"
          >
            Docs
          </a>
        </AppBarItem>

        <AppBarItem
          collapsedContent={
            <SocialLinks
              close={() => {
                setCommunityPopdownOpen(false);
              }}
            />
          }
        >
          <Popover
            destroyTooltipOnHide
            mouseEnterDelay={0}
            placement="bottom"
            content={
              <NavLinkPopdown>
                <SocialLinks
                  close={() => {
                    setCommunityPopdownOpen(false);
                  }}
                />
              </NavLinkPopdown>
            }
            visible={communityPopdownOpen}
            onVisibleChange={setCommunityPopdownOpen}
          >
            <div
              css={css`
                display: flex;
                flex-direction: row;
                gap: 4px;
              `}
            >
              <span>Community</span>
              <KeyboardArrowDownIcon
                css={css`
                  width: 16px;
                  height: 16px;
                  align-self: center;
                `}
              />
            </div>
          </Popover>
        </AppBarItem>
      </AppBarItems>
      <AppBarRightContainer>
        {collapsedTabsContent.length > 0 && (
          <Popover
            destroyTooltipOnHide
            mouseEnterDelay={0}
            placement="bottom"
            visible={mobilePopdownOpen}
            onVisibleChange={setMobilePopdownOpen}
            content={
              <NavLinkPopdown>
                {collapsedTabsContent.map(({ content }, i) => (
                  <React.Fragment key={`collapsed-item-${i}`}>
                    {React.isValidElement(content)
                      ? React.cloneElement(content, {
                          onClick: () => {
                            setMobilePopdownOpen(false);
                          },
                        })
                      : null}
                  </React.Fragment>
                ))}
              </NavLinkPopdown>
            }
          >
            <CollapsedTabsContentButton
              css={{
                visibility:
                  collapsedTabsContent.length > 0 ? "visible" : "hidden",
                marginRight: "8px",
              }}
            >
              <AppBarButton>
                <MenuIcon
                  css={css`
                    color: #ffffff;
                  `}
                />
              </AppBarButton>
            </CollapsedTabsContentButton>
          </Popover>
        )}
        {/* <ColorModeToggleButton
          css={css`
            margin-right: 8px;
            opacity: ${hideColorModeToggle ? 0 : 1};
          `}
        /> */}
        <div
          ref={(node) => {
            if (node) {
              setDialectNotificationsButtonContainer(node);
            }
          }}
          css={css`
            margin-right: 8px;
          `}
        >
          {dialectNotificationsButtonContainer && (
            <DialectNotificationsButton
              parentContainer={dialectNotificationsButtonContainer}
            />
          )}
        </div>
        <HeaderWallet />
      </AppBarRightContainer>
      <Blur />
    </AppBarContainer>
  );
};

const AppBarContainer = styled.div<{ scroll: number }>`
  height: ${APP_BAR_HEIGHT}px;
  background: ${({ scroll, theme }) => {
    const opacity = Math.min(scroll / 100, 0.6);
    return theme.palette.mode === "dark"
      ? `rgba(3, 3, 6, ${opacity})`
      : `rgba(255, 255, 255, ${opacity})`;
  }};
  overflow: hidden;
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 100000;
  display: flex;
  align-items: center;
  padding-right: 16px;
  margin-bottom: ${APP_BAR_MARGIN_BOTTOM}px;
`;

const HeaderLogo = styled.div`
  padding: 22px 24px;
  justify-content: center;
  align-items: center;
  height: 100%;
  white-space: nowrap;
  margin-left: -10px;
  display: flex;
  flex: 0 0 auto;
  a {
    padding-top: 5px;
    padding-bottom: 5px;
    display: block;
    padding-right: 10px;
    padding-left: 10px;
  }
  // a:hover {
  //   filter: brightness(0.5) sepia(1) saturate(10000%) hue-rotate(202deg)
  //     saturate(0.7) brightness(200%);
  // }
`;

const AppBarRightContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  flex: 0 0 auto;
`;

const NavLinkPopdown = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const CollapsedTabsContentButton = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;

  @media (max-width: 470px) {
    margin-right: 0px;
  }
`;

const Blur = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  backdrop-filter: blur(2px);
  z-index: -1;
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -webkit-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
`;

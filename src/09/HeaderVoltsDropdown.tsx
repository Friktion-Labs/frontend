import { css, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import React, { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import { breakpoints09 } from "./breakpoints09";
// import { darken } from "@mui/material";
import { FriktionBolt } from "features/icons";
import {
  AlanGreenSpan,
  BlueSpan,
  VerticalBlueBar,
  VerticalGreenBar,
  VerticalVioletBar,
  VerticalYellowBar,
  VioletSpan,
  YellowSpan,
} from "./glow09";
import {
  SORTED_VOLT1,
  SORTED_VOLT2,
  SORTED_VOLT3,
  SORTED_VOLT4,
  SORTED_VOLT5,
  VoltNumber,
} from "./registry10";
import { AutoUniversalAssetLogo } from "./UniversalAssetLogo";
import { useSubvoltLoader } from "./SubvoltLoader10";
import { apyFromData } from "./YieldTooltip";
import { VerticalPinkBar, PinkSpan } from "./glow09";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import volt1Icon from "./voltPics/Volt1Icon.png";
import volt2Icon from "./voltPics/Volt2Icon.png";
import volt3Icon from "./voltPics/Volt3Icon.png";
import volt4Icon from "./voltPics/Volt4Icon.png";
import volt5Icon from "./voltPics/Volt5Icon.png";
import { ButtonLink09 } from "./Button09";
import { useAuctionResults } from "./AuctionResults";

export const VoltsDropdown: React.FC<{
  hide: () => void;
  visible: boolean;
  enableClickAwayListener?: boolean;
}> = ({ hide: hideProp, enableClickAwayListener, visible }) => {
  const clickAwayCount = useRef(0);
  const theme = useTheme();
  const hide = useCallback(() => {
    clickAwayCount.current = 0;
    hideProp();
  }, [hideProp]);

  const [currentTab, setCurrentTab] = useState<VoltNumber>(1);
  const { loadedData } = useSubvoltLoader();
  const { yieldDataPerVolt } = useAuctionResults();

  let sideContents;
  if (currentTab === 1) {
    sideContents = (
      <Col>
        <TopSection>
          <TopSectionTitle>Generate Income</TopSectionTitle>
          <TopSectionSubtitle>
            Enhance returns on volatile assets with call option overwriting
          </TopSectionSubtitle>
        </TopSection>
        <VoltsGrid>
          {SORTED_VOLT1.map((def) => {
            const yieldData = def ? yieldDataPerVolt[def.globalId] : null;
            return (
              <Link
                onClick={() => {
                  hide();
                }}
                key={def.globalId}
                css={(theme) =>
                  css`
                    ${sidebarItemLink(theme)};
                  `
                }
                to={"/income#deposit_" + def.globalId}
                // className={match ? " active" : ""}
                // onClick={onClick}
              >
                <SidebarItemPill>
                  <SidebarItemSymbologyWrapper>
                    <SidebarItemSymbology>
                      <div>
                        <AutoUniversalAssetLogo def={def} />
                      </div>
                    </SidebarItemSymbology>
                  </SidebarItemSymbologyWrapper>
                  <div>
                    {def.underlying.symbol}
                    {def.globalId.toLowerCase().includes("high") ? "-hi" : ""}
                    {/* {def.globalId.toLowerCase().includes("high")
                    ? def.underlying.name + " (High)"
                    : def.underlying.name.includes("LIDO")
                    ? "LIDO SOL"
                    : def.underlying.name} */}{" "}
                    <ApyNumber>
                      <div>
                        <BlueSpan>
                          {apyFromData(
                            loadedData[def.globalId],
                            yieldData ? yieldData.averagedEpochYield : null,
                            0
                          )}
                        </BlueSpan>
                      </div>
                    </ApyNumber>
                  </div>
                </SidebarItemPill>
              </Link>
            );
          })}
        </VoltsGrid>
      </Col>
    );
  } else if (currentTab === 2) {
    sideContents = (
      <Col>
        <TopSection>
          <TopSectionTitle>Sustainable Stables</TopSectionTitle>
          <TopSectionSubtitle>
            Earn on stablecoins using automated cash secured puts
          </TopSectionSubtitle>
        </TopSection>
        <VoltsGrid className="maxTwo">
          {SORTED_VOLT2.map((def) => {
            const yieldData = def ? yieldDataPerVolt[def.globalId] : null;
            return (
              <Link
                onClick={() => {
                  hide();
                }}
                key={def.globalId}
                css={(theme) =>
                  css`
                    ${sidebarItemLink(theme)};
                  `
                }
                to={"/stables#deposit_" + def.globalId}
                // className={match ? " active" : ""}
                // onClick={onClick}
              >
                <SidebarItemPill>
                  {" "}
                  <SidebarItemSymbologyWrapper>
                    <SidebarItemSymbology>
                      <div>
                        <AutoUniversalAssetLogo def={def} />
                      </div>
                    </SidebarItemSymbology>
                  </SidebarItemSymbologyWrapper>
                  <div>
                    {def.depositToken.symbol + "-" + def.underlying.symbol}
                    {def.globalId.toLowerCase().includes("high") ? "-hi" : ""}
                    {/* {def.globalId.toLowerCase().includes("high")
                ? def.underlying.name + " (High)"
                : def.underlying.name.includes("LIDO")
                ? "LIDO SOL"
                : def.underlying.name} */}{" "}
                    <ApyNumber>
                      <div>
                        <AlanGreenSpan>
                          {apyFromData(
                            loadedData[def.globalId],
                            yieldData ? yieldData.averagedEpochYield : null,
                            0
                          )}
                        </AlanGreenSpan>
                      </div>
                    </ApyNumber>
                  </div>
                </SidebarItemPill>
              </Link>
            );
          })}
        </VoltsGrid>
      </Col>
    );
  } else if (currentTab === 3) {
    sideContents = (
      <Col>
        <TopSection>
          <TopSectionTitle>Crab Strategy</TopSectionTitle>
          <TopSectionSubtitle>
            Monetize range-bound "crab" markets
          </TopSectionSubtitle>
        </TopSection>
        <VoltsGrid className="maxTwo">
          {SORTED_VOLT3.map((def) => {
            const yieldData = def ? yieldDataPerVolt[def.globalId] : null;
            return (
              <Link
                onClick={() => {
                  hide();
                }}
                key={def.globalId}
                css={(theme) =>
                  css`
                    ${sidebarItemLink(theme)};
                  `
                }
                to={"/crab#deposit_" + def.globalId}
                // className={match ? " active" : ""}
                // onClick={onClick}
              >
                <SidebarItemPill>
                  {" "}
                  <SidebarItemSymbologyWrapper>
                    <SidebarItemSymbology>
                      <div>
                        <AutoUniversalAssetLogo def={def} />
                      </div>
                    </SidebarItemSymbology>
                  </SidebarItemSymbologyWrapper>
                  <div>
                    {def.underlying.symbol}
                    {def.globalId.toLowerCase().includes("high") ? "-hi" : ""}
                    {/* {def.globalId.toLowerCase().includes("high")
                ? def.underlying.name + " (High)"
                : def.underlying.name.includes("LIDO")
                ? "LIDO SOL"
                : def.underlying.name} */}{" "}
                    <ApyNumber>
                      <div>
                        <YellowSpan>
                          {apyFromData(
                            loadedData[def.globalId],
                            yieldData ? yieldData.averagedEpochYield : null,
                            0
                          )}
                        </YellowSpan>
                      </div>
                    </ApyNumber>
                  </div>
                </SidebarItemPill>
              </Link>
            );
          })}
        </VoltsGrid>
      </Col>
    );
  } else if (currentTab === 4) {
    sideContents = (
      <Col>
        <TopSection>
          <TopSectionTitle>Basis Yield</TopSectionTitle>
          <TopSectionSubtitle>
            Harvest basis yield via delta-neutral funding
          </TopSectionSubtitle>
        </TopSection>
        <VoltsGrid className="maxTwo">
          {SORTED_VOLT4.map((def) => {
            const yieldData = def ? yieldDataPerVolt[def.globalId] : null;
            return (
              <Link
                onClick={() => {
                  hide();
                }}
                key={def.globalId}
                css={(theme) =>
                  css`
                    ${sidebarItemLink(theme)};
                  `
                }
                to={"/basis#deposit_" + def.globalId}
              >
                <SidebarItemPill>
                  {" "}
                  <SidebarItemSymbologyWrapper>
                    <SidebarItemSymbology>
                      <div>
                        <AutoUniversalAssetLogo def={def} />
                      </div>
                    </SidebarItemSymbology>
                  </SidebarItemSymbologyWrapper>
                  <div>
                    {def.underlying.symbol}
                    {def.globalId.toLowerCase().includes("high") ? "-hi" : ""}
                    <ApyNumber>
                      <div>
                        <PinkSpan>
                          {apyFromData(
                            loadedData[def.globalId],
                            yieldData ? yieldData.averagedEpochYield : null,
                            0
                          )}
                        </PinkSpan>
                      </div>
                    </ApyNumber>
                  </div>
                </SidebarItemPill>
              </Link>
            );
          })}
        </VoltsGrid>
      </Col>
    );
  } else if (currentTab === 5) {
    sideContents = (
      <Col>
        <TopSection>
          <TopSectionTitle>Capital Protection</TopSectionTitle>
          <TopSectionSubtitle>
            Outperform in volatile markets with rising interest rates, Principal
            protected
          </TopSectionSubtitle>
        </TopSection>
        <VoltsGrid className="maxTwo">
          {SORTED_VOLT5.map((def) => {
            const yieldData = def ? yieldDataPerVolt[def.globalId] : null;
            return (
              <Link
                onClick={() => {
                  hide();
                }}
                key={def.globalId}
                css={(theme) =>
                  css`
                    ${sidebarItemLink(theme)};
                  `
                }
                to={"/protection#deposit_" + def.globalId}
              >
                <SidebarItemPill>
                  {" "}
                  <SidebarItemSymbologyWrapper>
                    <SidebarItemSymbology>
                      <div>
                        <AutoUniversalAssetLogo def={def} />
                      </div>
                    </SidebarItemSymbology>
                  </SidebarItemSymbologyWrapper>
                  <div>
                    {def.underlying.symbol}
                    {def.globalId.toLowerCase().includes("high") ? "-hi" : ""}
                    <ApyNumber>
                      <div>
                        <VioletSpan>
                          {apyFromData(
                            loadedData[def.globalId],
                            yieldData ? yieldData.averagedEpochYield : null,
                            0
                          )}
                        </VioletSpan>
                      </div>
                    </ApyNumber>
                  </div>
                </SidebarItemPill>
              </Link>
            );
          })}
        </VoltsGrid>
      </Col>
    );
  }

  const voltDropDownContent = (
    <OutsideContainer>
      <VoltsDropdownContainer>
        <VoltsDropdownVoltTabsAndCTAButton>
          <VoltsDropdownVoltTabs>
            <Link
              onClick={() => {
                hide();
              }}
              to="/income"
              css={(theme) =>
                css`
                  ${voltsDropdownVoltTab(theme)};
                `
              }
              className={
                currentTab === 1 ? "currentTab incomeLink" : "incomeLink"
              }
              onMouseOver={() => setCurrentTab(1)}
            >
              <VerticalBlueBar className="bar" />
              <VoltsDropdownTabContent>
                <IconAndTitleRow>
                  <IconBox src={volt1Icon} alt="Volt Icon" />
                  <TitleAndDesc>
                    <VoltsDropdownVoltName>
                      Generate Income
                    </VoltsDropdownVoltName>
                    <VoltsDropdownTabDescription>
                      Enhance returns on volatile assets with call option
                      overwriting
                    </VoltsDropdownTabDescription>
                  </TitleAndDesc>
                </IconAndTitleRow>
              </VoltsDropdownTabContent>
            </Link>
            <Link
              onClick={() => {
                hide();
              }}
              to="/stables"
              css={(theme) =>
                css`
                  ${voltsDropdownVoltTab(theme)};
                `
              }
              className={currentTab === 2 ? "currentTab" : ""}
              onMouseOver={() => setCurrentTab(2)}
            >
              <VerticalGreenBar className="bar" />
              <VoltsDropdownTabContent>
                <IconAndTitleRow>
                  <IconBox src={volt2Icon} alt="Volt Icon" />
                  <TitleAndDesc>
                    <VoltsDropdownVoltName>
                      Sustainable Stables
                    </VoltsDropdownVoltName>
                    <VoltsDropdownTabDescription>
                      Earn on stablecoins using automated cash secured puts
                    </VoltsDropdownTabDescription>
                  </TitleAndDesc>
                </IconAndTitleRow>
              </VoltsDropdownTabContent>
            </Link>
            <Link
              onClick={() => {
                hide();
              }}
              to="/crab"
              css={(theme) =>
                css`
                  ${voltsDropdownVoltTab(theme)};
                `
              }
              className={currentTab === 3 ? "currentTab" : ""}
              onMouseOver={() => setCurrentTab(3)}
            >
              <VerticalYellowBar className="bar" />
              <VoltsDropdownTabContent>
                <IconAndTitleRow>
                  <IconBox src={volt3Icon} alt="Volt Icon" />
                  <TitleAndDesc>
                    <VoltsDropdownVoltName>Crab Strategy</VoltsDropdownVoltName>
                    <VoltsDropdownTabDescription>
                      Monetize range-bound "crab" markets
                    </VoltsDropdownTabDescription>
                  </TitleAndDesc>
                </IconAndTitleRow>
              </VoltsDropdownTabContent>
            </Link>
            <Link
              onClick={() => {
                hide();
              }}
              to="/basis"
              css={(theme) =>
                css`
                  ${voltsDropdownVoltTab(theme)};
                `
              }
              className={currentTab === 4 ? "currentTab" : ""}
              onMouseOver={() => setCurrentTab(4)}
            >
              <VerticalPinkBar className="bar" />
              <VoltsDropdownTabContent>
                <IconAndTitleRow>
                  <IconBox src={volt4Icon} alt="Volt Icon" />
                  <TitleAndDesc>
                    <VoltsDropdownVoltName>Basis Yield</VoltsDropdownVoltName>
                    <VoltsDropdownTabDescription>
                      Harvest basis yield via delta-neutral funding
                    </VoltsDropdownTabDescription>
                  </TitleAndDesc>
                </IconAndTitleRow>
              </VoltsDropdownTabContent>
            </Link>
            <Link
              onClick={() => {
                hide();
              }}
              to="/protection"
              css={(theme) =>
                css`
                  ${voltsDropdownVoltTab(theme)};
                `
              }
              className={currentTab === 5 ? "currentTab" : ""}
              onMouseOver={() => setCurrentTab(5)}
            >
              <VerticalVioletBar className="bar" />
              <VoltsDropdownTabContent>
                <IconAndTitleRow>
                  <IconBox src={volt5Icon} alt="Volt Icon" />
                  <TitleAndDesc>
                    <VoltsDropdownVoltName>
                      Capital Protection
                    </VoltsDropdownVoltName>
                    <VoltsDropdownTabDescription>
                      Outperform in volatile markets with principal protection
                    </VoltsDropdownTabDescription>
                  </TitleAndDesc>
                </IconAndTitleRow>
              </VoltsDropdownTabContent>
            </Link>
          </VoltsDropdownVoltTabs>
          <ExploreButtonLinkContainer>
            <ButtonLink09
              to="/volts"
              css={pinkCTAStyles}
              onClick={() => {
                hide();
              }}
            >
              Explore all Volts
              <KeyboardArrowRightIcon
                css={css`
                  width: 28px;
                  height: 28px;
                  align-self: center;
                `}
              />
            </ButtonLink09>
          </ExploreButtonLinkContainer>
        </VoltsDropdownVoltTabsAndCTAButton>
        <GridAndLearnLink>
          <VoltsDropdownSideList>{sideContents}</VoltsDropdownSideList>
          <LearnLinkContainer
            href="https://docs.friktion.fi/products/covered-call"
            target="_blank"
            onClick={() => {
              hide();
            }}
          >
            <div
              css={css`
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 3px;
              `}
            >
              <FriktionBolt
                width="15"
                height="15"
                color={theme.palette.pink[600]}
              />
              <LearnTitle>Learn</LearnTitle>
            </div>
            <VerticalDivider />
            <LearnTitle>What is a covered call?</LearnTitle>
          </LearnLinkContainer>
        </GridAndLearnLink>
      </VoltsDropdownContainer>
    </OutsideContainer>
  );

  if (enableClickAwayListener) {
    return (
      <ClickAwayListener
        mouseEvent={!visible ? "onMouseDown" : undefined}
        onClickAway={() => {
          // do not hide on the first clickaway as the first clickaway is the click on the volt tab
          if (clickAwayCount.current > 0) {
            hide();
          } else {
            clickAwayCount.current += 1;
          }
        }}
      >
        {voltDropDownContent}
      </ClickAwayListener>
    );
  } else {
    return voltDropDownContent;
  }
};

const OutsideContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const VoltsDropdownContainer = styled.div`
  font-family: "Euclid Circular B";
  position: relative;
  z-index: 8;
  color: ${(props) => (props.theme.palette.mode === "dark" ? "#FFF" : "#000")};
  background: ${(props) =>
    props.theme.palette.mode === "dark"
      ? "linear-gradient(180.27deg, #23242F 0.31%, #121317 99.84%)"
      : "white"};
  /* background: #333; */
  border-radius: 12px;
  position: relative;
  /* z-index: 5; */
  width: 681px;
  @media (max-width: 780px) {
    width: 632px;
  }

  @media (max-width: 723px) {
    width: unset;
  }
  display: flex;
`;

const TitleAndDesc = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 4;
`;

const IconAndTitleRow = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  gap: 12px;
`;

const IconBox = styled.img`
  display: flex;
  user-select: none;
  margin: auto;
  width: 40px !important;
  height: 40px;
  border-radius: 4px;
  align-items: center;
  align-self: center;
`;

const VoltsDropdownVoltTabsAndCTAButton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 0 0 12px 0;
  justify-content: space-between;
`;

const GridAndLearnLink = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 0 0 0 12px;

  @media (max-width: 723px) {
    display: none;
  }
`;

const VerticalDivider = styled.div`
  display: flex;
  height: 20px;
  width: 1px;
  background: #b64dac;
`;

const LearnTitle = styled.div`
  font-family: "Euclid Circular B";
  font-size: 14px;
  font-weight: 500;
  line-height: 21px;
`;

const VoltsDropdownVoltTabs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: flex-start;

  a:first-of-type {
    border-radius: 12px 0 0 0 !important;
  }
  /* a:last-of-type {
    border-radius: 0 0 0 12px !important;
  } */
`;
const VoltsDropdownTabDescription = styled.div`
  font-size: 12px;
  line-height: 18px;
  color: ${(props) => (props.theme.palette.mode === "dark" ? "#FFF" : "#000")};
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  height: 81px;
  width: 401px;
  padding: 16px;

  @media (max-width: 780px) {
    width: 352px;
  }
`;

const TopSectionTitle = styled.div`
  font-family: "Euclid Circular B";
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: ${(props) => (props.theme.palette.mode === "dark" ? "#FFF" : "#000")};
`;

const TopSectionSubtitle = styled.div`
  font-family: "Euclid Circular B";
  font-weight: 400;
  font-size: 12px;
  line-height: 17px;
  color: ${(props) => (props.theme.palette.mode === "dark" ? "#FFF" : "#000")};
`;

const voltsDropdownVoltTab = (theme: Theme) => css`
  color: rgba(255, 255, 255, 0.95);
  width: 280px;
  font-size: 14px;
  border-radius: 0;
  overflow: hidden;

  .bar {
    flex-shrink: 0;
    width: 3px;
    opacity: 0;
  }
  &.currentTab {
    background: ${theme.palette.mode === "dark"
      ? "rgba(0, 0, 0, 0.3)"
      : theme.palette.grey[200]};
    .bar {
      opacity: 1;
    }
  }
  display: flex;
`;
const VoltsDropdownTabContent = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  padding: 8px 12px 8px 10px;
`;

const VoltsDropdownVoltName = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${(props) => (props.theme.palette.mode === "dark" ? "#FFF" : "#000")};
`;

const ExploreButtonLinkContainer = styled.div`
  display: flex;
  padding: 9px 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0 0 12px 0;
`;

const LearnLinkContainer = styled.a`
  display: flex;
  padding: 9px 12px;
  gap: 12px;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  height: 61px;
  color: ${(props) => (props.theme.palette.mode === "dark" ? "#FFF" : "#000")};
`;
export const pinkCTAStyles = (theme: any) => css`
  display: flex;
  align-items: center;
  font-family: "Euclid Circular B";
  font-weight: 500;
  font-size: 14px;
  padding: 0 16px;
  color: #ffffff;
  border-radius: 8px;
  background: ${theme.palette.pink[700]} !important;
  height: 40px;
  width: 100%;
  justify-content: space-between;
  &:focus {
    border-radius: 8px;
  }
`;

const VoltsDropdownSideList = styled.div`
  display: flex;
  align-self: stretch;
  flex-grow: 1;
  background: ${(props) =>
    props.theme.palette.mode === "dark"
      ? "rgba(0, 0, 0, 0.3)"
      : props.theme.palette.grey[200]};
  margin-bottom: -10px;
`;

const VoltsGrid = styled.div`
  width: 100%;
  padding: 6px 6px 6px 8px;
  display: grid;
  gap: 4px;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  @media (max-width: 780px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  &.maxTwo {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  grid-auto-rows: min-content;
`;

const SidebarItemPill = styled.div`
  padding: 6px 4px 6px 8px;
  min-height: 32px;
  line-height: 1.1;
  display: flex;
  align-items: center;
  font-size: 14px;
  margin: 0;
  color: ${(props) => (props.theme.palette.mode === "dark" ? "#FFF" : "#000")};
`;
const sidebarItemLink = (theme: Theme) => css`
  display: block;
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

  &:hover {
    ${SidebarItemPill} {
      background: ${theme.palette.mode === "dark"
        ? "linear-gradient(hsl(230, 15%, 24%), hsl(230, 15%, 22%) 80%)"
        : theme.palette.grey[400]};
    }
    color: #fff;
  }
`;
const SidebarItemSymbologyWrapper = styled.div`
  width: 24px;
  height: 20px;
`;
const SidebarItemSymbology = styled.div`
  display: flex;
  align-items: center;
  transform-origin: left center;
  transform: scale(0.5);
  height: 20px;
`;

const ApyNumber = styled.span`
  position: relative;
  margin-left: 2px;
  > div {
    display: inline-block;
    padding: 3px 5px;
    font-size: 12px;
    font-weight: bold;
    background: hsl(230, 15%, 12%);
    border-radius: 4px;
    line-height: 1;
  }
`;

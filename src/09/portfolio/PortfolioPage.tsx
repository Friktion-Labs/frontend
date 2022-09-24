import styled from "@emotion/styled";
import { useAppWallet } from "features/wallet";
import { useQuery } from "react-query";
import {
  YourPortfolioChart,
  YourStackedReturnsBarChart,
} from "./YourPortfolioChart";
import { GlobalId, newGlobalIdToNull, STRONG_SUBVOLTS } from "../registry10";
import { YourAssetsTable } from "./YourAssetsTable";
import { useQuarantineChristmas10VFACWarningOnlyWorksWithCoveredCalls } from "../useChristmasCard10";
import { FunBoxChart } from "./FunBoxChart";
import { matchPath, useLocation } from "react-router-dom";
import { useSearchedWalletForPortfolioPage } from "../useSearchedWalletForPortfolioPage";
import { PublicKey } from "@solana/web3.js";
import { useMarkPrices } from "../MarkPrices10";
import animatedLightningOG from "../friktionLogos/animatedLightningOG.svg";
import halfRealLightningOG from "../friktionLogos/halfRealLightningOG.png";
import copyIcon from "../friktionLogos/copyIcon.png";
import friktionBolt from "../friktionLogos/friktionBolt.png";
import {
  TabContainer,
  TabPanel,
  PortfolioTabSelector,
  useTabAnimation,
  useTabs,
} from "../../components/Tabs";
import { css } from "@emotion/react";
import useOwnedTokenAccounts from "../../hooks/useOwnedTokenAccounts";
import { YourActivityTable } from "./YourActivityTable";
import { BarDatum } from "@nivo/bar";
import { useCallback, useEffect } from "react";
import { BlueA, GreenA, PinkA, VioletA, YellowA } from "../glow09";
import { CopyToClipboard } from "react-copy-to-clipboard";

export type PortfolioGraphDataPoint = {
  id: string;
  color: string;
  data: {
    time: number;
    x: Date;
    y: number;
  }[];
};

// first number is token amount, second is usdc value, third is usdcPnlCum
export type NetReturnData = Record<
  GlobalId,
  [number | undefined, number | null, number | undefined] | null
>;
const TABS = ["Returns", "Value", "Activity"];

export function PortfolioPage() {
  const { publicKey } = useAppWallet();
  const vfac09 = useQuarantineChristmas10VFACWarningOnlyWorksWithCoveredCalls();
  const { pathname } = useLocation();
  const { setSearchedWalletForPortfolioPage } =
    useSearchedWalletForPortfolioPage();
  const { markPrices, markPricesDecimal } = useMarkPrices();
  const { selectedTab, setSelectedTab } = useTabs(TABS);
  const { handleSelectTab, currentWidth, transform, tabContainerRef } =
    useTabAnimation(57, 36, setSelectedTab);
  const { isLightningOGHolder, isSearchedWalletALightningOGHolder } =
    useOwnedTokenAccounts();

  const possibleMatch = matchPath("/portfolio/*", pathname);
  const walletFromUrl = possibleMatch ? possibleMatch.params["*"] : null;
  const isStalkingAnotherWallet = walletFromUrl ? true : false;
  const walletToUse = isStalkingAnotherWallet
    ? walletFromUrl
      ? walletFromUrl
      : null
    : publicKey
    ? publicKey.toString()
    : null;

  const userPortfolioQuery = useQuery<
    unknown,
    unknown,
    Record<GlobalId, [number, number, number, number, number, number, number][]>
  >(
    "userWallet",
    () => {
      if (!publicKey) {
        return {};
      }
      return fetch(
        `https://api.friktion.fi/portfolio?userAddress=${publicKey.toString()}`
      ).then((res) => res.json());
    },
    { staleTime: Infinity, retry: 3 }
  );

  const userPortfolioQueryForSearchedWallet = useQuery<
    unknown,
    unknown,
    Record<GlobalId, [number, number, number, number, number, number, number][]>
  >(
    "userWalletForSearchedWallet",
    () => {
      if (walletFromUrl) {
        setSearchedWalletForPortfolioPage(new PublicKey(walletFromUrl));
      } else {
        return {};
      }
      return fetch(
        `https://api.friktion.fi/portfolio?userAddress=${walletFromUrl}`
      ).then((res) => res.json());
    },
    { staleTime: Infinity, retry: 3 }
  );

  const winRateQuery = useQuery<
    unknown,
    unknown,
    Record<GlobalId, { win: number; count: number }>[]
  >(
    "winRateQuery",
    () => {
      return fetch("https://api.friktion.fi/win_rate").then((res) =>
        res.json()
      );
    },
    { staleTime: Infinity, retry: 3 }
  );

  const usdPnlPerWeekQuery = useQuery<
    unknown,
    unknown,
    Record<GlobalId, [number, number][]>
  >(
    "usdPnlPerWeekQuery",
    () => {
      if (!publicKey) {
        return {};
      }
      return fetch(
        `https://api.friktion.fi/weekly_pnl?userAddress=${publicKey.toString()}`
      ).then((res) => res.json());
    },
    { staleTime: Infinity, retry: 3 }
  );

  const usdPnlPerWeekQueryForSearchedWallet = useQuery<
    unknown,
    unknown,
    Record<GlobalId, [number, number][]>
  >(
    "usdPnlPerWeekQueryForSearchedWallet",
    () => {
      if (!walletFromUrl) {
        return {};
      }
      return fetch(
        `https://api.friktion.fi/weekly_pnl?userAddress=${walletFromUrl}`
      ).then((res) => res.json());
    },
    { staleTime: Infinity, retry: 3 }
  );

  const refreshQueriesIfNullValue = useCallback(() => {
    if (
      // eslint-disable-next-line eqeqeq
      userPortfolioQuery.data == null ||
      Object.entries(userPortfolioQuery.data).length < 1
    ) {
      userPortfolioQuery.refetch();
    }

    if (
      // eslint-disable-next-line eqeqeq
      userPortfolioQueryForSearchedWallet.data == null ||
      Object.entries(userPortfolioQueryForSearchedWallet.data).length < 1
    ) {
      userPortfolioQueryForSearchedWallet.refetch();
    }
    // eslint-disable-next-line eqeqeq
    if (winRateQuery.data == null || winRateQuery.data.length < 1) {
      winRateQuery.refetch();
    }

    if (
      // eslint-disable-next-line eqeqeq
      usdPnlPerWeekQuery.data == null ||
      Object.entries(usdPnlPerWeekQuery.data).length < 1
    ) {
      usdPnlPerWeekQuery.refetch();
    }

    if (
      // eslint-disable-next-line eqeqeq
      usdPnlPerWeekQueryForSearchedWallet.data == null ||
      Object.entries(usdPnlPerWeekQueryForSearchedWallet.data).length < 1
    ) {
      usdPnlPerWeekQueryForSearchedWallet.refetch();
    }
  }, [
    userPortfolioQuery,
    userPortfolioQueryForSearchedWallet,
    winRateQuery,
    usdPnlPerWeekQuery,
    usdPnlPerWeekQueryForSearchedWallet,
  ]);

  useEffect(() => {
    const interval = setInterval(async () => {
      refreshQueriesIfNullValue();
    }, 1500);
    return () => clearInterval(interval);
  }, [refreshQueriesIfNullValue]);

  const winRateMap: Record<GlobalId, string | null> = newGlobalIdToNull();
  if (winRateQuery.data) {
    winRateQuery.data.forEach((data) => {
      const entries = Object.entries(data);
      if (entries.length) {
        const reformattedData = entries[0];
        if (reformattedData.length > 1) {
          const id = reformattedData[0];
          const actualNumbers = reformattedData[1];
          if (actualNumbers) {
            winRateMap[
              id as GlobalId
            ] = `${actualNumbers.win}/${actualNumbers.count}`;
          }
        }
      }
    });
  }

  const cardsToLookAt = isStalkingAnotherWallet
    ? vfac09.cardsForSearchedWallet
    : vfac09.cards;

  const isLightningHolderToLookAt = isStalkingAnotherWallet
    ? isSearchedWalletALightningOGHolder
    : isLightningOGHolder;

  const portfolioDataToToUse = isStalkingAnotherWallet
    ? userPortfolioQueryForSearchedWallet.data
    : userPortfolioQuery.data;

  const weeklyUsdPnlDataToToUse = isStalkingAnotherWallet
    ? usdPnlPerWeekQueryForSearchedWallet.data
    : usdPnlPerWeekQuery.data;

  // Process portfolio data here in 1 For loop so children dont have to!!!
  const usdPositionGraphData: PortfolioGraphDataPoint[] = [];
  const usdPnlCumulativeGraphData: PortfolioGraphDataPoint[] = [];
  let netReturnData: NetReturnData = newGlobalIdToNull();
  let thisWeekData: Record<GlobalId, number | null> = newGlobalIdToNull();
  for (const [globalId, series] of Object.entries(portfolioDataToToUse ?? [])) {
    if (globalId === "null") continue;
    const def = STRONG_SUBVOLTS[globalId as GlobalId];
    if (!def) continue;
    if (series.length > 0) {
      const tokenAmount = series[series.length - 1][3];
      const usdcPnlCum = series[series.length - 1][6];
      const depositTokenSymbol = def.depositToken.symbol;
      const currentUsdcVal =
        markPrices && depositTokenSymbol
          ? markPrices[depositTokenSymbol] * tokenAmount
          : null;
      netReturnData[globalId as GlobalId] = [
        tokenAmount,
        currentUsdcVal,
        usdcPnlCum,
      ];
      thisWeekData[globalId as GlobalId] = series[series.length - 1][5];
    }

    const colorForGlobalId = (id: GlobalId): string => {
      if (id.includes("call")) {
        return BlueA;
      } else if (id.includes("put")) {
        return GreenA;
      } else if (id.includes("perp")) {
        return YellowA;
      } else if (id.includes("basis")) {
        return PinkA;
      } else {
        return VioletA;
      }
    };

    usdPositionGraphData.push({
      id: globalId,
      color: colorForGlobalId(globalId as GlobalId),
      data: series.map(
        (
          [
            time,
            tokenPosition,
            tokenPnl,
            tokenPnlCumulative,
            usdPosition,
            usdPnl,
            usdPnlCumulative,
          ],
          idx
        ) => {
          return {
            time,
            x: new Date(time * 1000),
            y: usdPosition,
          };
        }
      ),
    });
    usdPnlCumulativeGraphData.push({
      id: globalId,
      color: "transparent",
      data: series.map(
        (
          [
            time,
            tokenPosition,
            tokenPnl,
            tokenPnlCumulative,
            usdPosition,
            usdPnl,
            usdPnlCumulative,
          ],
          idx
        ) => {
          return {
            time,
            x: new Date(time * 1000),
            y: usdPnlCumulative,
          };
        }
      ),
    });
  }

  const barDatumPreprocessor: Record<number, BarDatum> = {};
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  for (const [globalId, series] of Object.entries(
    weeklyUsdPnlDataToToUse ?? []
  )) {
    if (globalId === "null") continue;

    series.forEach((serie) => {
      const time = serie[0];
      const pnl = serie[1];
      if (barDatumPreprocessor[time]) {
        barDatumPreprocessor[time][globalId] = pnl;
      } else {
        const day = new Date(time * 1000);

        barDatumPreprocessor[time] = {
          time,
          [globalId]: pnl,
          formattedTime: `${month[day.getUTCMonth()].slice(
            0,
            3
          )} ${day.getUTCDate()}`,
        };
      }
    });
  }

  const usdPnlPerWeekGraphData: BarDatum[] =
    Object.values(barDatumPreprocessor);

  // add fill in points in beginning
  const minPointsToHave = 8;
  if (
    usdPnlPerWeekGraphData.length > 1 &&
    usdPnlPerWeekGraphData.length < minPointsToHave
  ) {
    // calculate filler times
    // #TODO: this assumes first object is earliest data point (assume sorted)
    const firstTime = usdPnlPerWeekGraphData[0]["time"] as number;
    const numToEight = minPointsToHave - usdPnlPerWeekGraphData.length;
    const timesToAdd: number[] = [];
    for (let i = 0; i < numToEight; i++) {
      timesToAdd.push(firstTime - 604800 * (i + 1));
    }

    const missingBarDatum: BarDatum[] = timesToAdd.map((t) => {
      const day = new Date(t * 1000);
      return {
        time: t,
        formattedTime: `${month[day.getUTCMonth()].slice(
          0,
          3
        )} ${day.getUTCDate()}`,
      };
    });

    usdPnlPerWeekGraphData.unshift(...missingBarDatum.reverse());
  }

  usdPositionGraphData.sort((a, b) =>
    a.data.length && b.data.length
      ? a.data[0].time - b.data[0].time
      : a.data.length - b.data.length
  );

  usdPnlCumulativeGraphData.sort((a, b) =>
    a.data.length && b.data.length
      ? a.data[0].time - b.data[0].time
      : a.data.length - b.data.length
  );

  // last one of usdPnlCumulativeGraphData should be the only non-transparent color (were hiding the rest of em)
  if (usdPnlCumulativeGraphData.length > 0) {
    usdPnlCumulativeGraphData[usdPnlCumulativeGraphData.length - 1].color =
      "#CE56C2";
  }

  let totalReturnOnInvestment: number | null = null;
  let totalThisWeekUSDC: number | null = null;
  if (portfolioDataToToUse) {
    totalReturnOnInvestment = 0;
    totalThisWeekUSDC = 0;
    for (const [, data] of Object.entries(netReturnData)) {
      totalReturnOnInvestment += data ? data[2] ?? 0 : 0;
    }
    for (const [, data] of Object.entries(thisWeekData)) {
      // eslint-disable-next-line eqeqeq
      totalThisWeekUSDC += data != null ? data : 0;
    }
  }

  let totalPortfolioValue = null;
  let cardsAllLoaded = true;
  let volt1Total = null;
  let volt2Total = null;
  let volt3Total = null;
  let volt4Total = null;
  let volt5Total = null;

  if (cardsToLookAt && markPricesDecimal) {
    let deposited = 0;
    let volt1Amount = 0;
    let volt2Amount = 0;
    let volt3Amount = 0;
    let volt4Amount = 0;
    let volt5Amount = 0;
    cardsToLookAt.forEach((card) => {
      if (card.def && (!card.deposits || !card.deposits.totalDeposits)) {
        cardsAllLoaded = false;
      } else if (card.def && card.deposits) {
        const amount = markPricesDecimal[card.def.depositToken.symbol]
          .mul(card.deposits.totalDeposits)
          .toNumber();
        switch (card.volt) {
          case 1:
            volt1Amount += amount;
            break;
          case 2:
            volt2Amount += amount;
            break;
          case 3:
            volt3Amount += amount;
            break;
          case 4:
            volt4Amount += amount;
            break;
          case 5:
            volt5Amount += amount;
            break;
        }
        deposited += amount;
      }
    });
    if (cardsAllLoaded) {
      totalPortfolioValue = deposited;
      volt1Total = volt1Amount;
      volt2Total = volt2Amount;
      volt3Total = volt3Amount;
      volt4Total = volt4Amount;
      volt5Total = volt5Amount;
    }
  }

  const showStackedReturnsBarChart =
    (isStalkingAnotherWallet || publicKey) &&
    usdPnlPerWeekGraphData.length >= 1;

  return (
    <Container
      css={css`
        padding-bottom: 150px;
      `}
    >
      <CopyToClipboard text={walletToUse ?? ""}>
        <WalletSubtitle
          css={css`
            display: flex;
            align-items: center;
          `}
        >
          {walletToUse
            ? `${walletToUse.slice(0, 5)}...${walletToUse.slice(-5)}`
            : ""}
          {walletToUse && <img height="12" src={copyIcon} alt="" />}
        </WalletSubtitle>
      </CopyToClipboard>
      <Title>{isStalkingAnotherWallet ? "Portfolio" : "Your Portfolio"}</Title>
      <LayoutSection>
        <div
          css={css`
            display: flex;
            flex-direction: column;
            width: 100%;
          `}
        >
          <div
            css={css`
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              margin: 0 20px 35px 20px;
              border-bottom: solid 1px #5d5d64;
              z-index: 1;
              height: 36px;
            `}
            ref={tabContainerRef}
          >
            <TabContainer transform={transform} currentWidth={currentWidth}>
              {TABS.map((tab, idx) => (
                <PortfolioTabSelector
                  isActive={selectedTab === tab}
                  onClick={(e: React.SyntheticEvent | Event) => {
                    handleSelectTab(tab, idx, e);
                  }}
                  key={idx}
                >
                  {tab}
                </PortfolioTabSelector>
              ))}
            </TabContainer>
            <div
              css={css`
                flex: 1;
              `}
            />
            {isLightningHolderToLookAt ? (
              <div
                css={css`
                  position: relative;
                  user-select: none;
                  top: -60px;
                  right: -40px;

                  @media (max-width: 659px) {
                    display: none;
                  }
                `}
              >
                <img
                  height="170"
                  src={halfRealLightningOG}
                  alt=""
                  css={css`
                    user-select: none;
                  `}
                />
                <NftTextBubble
                  css={css`
                    right: -77px !important;
                    background: #ce56c2 !important;
                  `}
                >
                  <img
                    height="15"
                    src={friktionBolt}
                    alt=""
                    css={css`
                      user-select: none;
                    `}
                  />
                  <span>Lightning OG Holder</span>
                </NftTextBubble>
              </div>
            ) : (
              <div
                css={css`
                  position: relative;
                  user-select: none;
                  top: -60px;
                  right: 10px;

                  > img {
                    transition: opacity 0.3s;
                    opacity: 0.5;
                  }
                  &:hover {
                    > img {
                      opacity: 1;
                    }
                  }

                  @media (max-width: 659px) {
                    display: none;
                  }
                `}
              >
                <img height="170" src={animatedLightningOG} alt="" />
                <NftTextBubble>
                  <img height="15" src={friktionBolt} alt="" />
                  <a
                    href={"https://magiceden.io/marketplace/lightning_ogs"}
                    target="_blank"
                    rel="noreferrer"
                    css={css`
                      color: white;
                      &:hover {
                        color: #ce56c2;
                      }
                    `}
                  >
                    Get a Lightning OG
                  </a>
                </NftTextBubble>
              </div>
            )}
          </div>
          <div>
            <TabPanel hidden={selectedTab !== "Returns"}>
              <YourPortfolioChart
                isLoading={portfolioDataToToUse === undefined}
                graphData={usdPnlCumulativeGraphData}
                isStalkingAnotherWallet={isStalkingAnotherWallet}
                isConnected={publicKey ? true : false}
                height={showStackedReturnsBarChart ? 160 : 210}
                minYvalue={"auto"}
              />
              {showStackedReturnsBarChart && (
                <YourStackedReturnsBarChart
                  isLoading={weeklyUsdPnlDataToToUse === undefined}
                  graphData={usdPnlPerWeekGraphData}
                  isStalkingAnotherWallet={isStalkingAnotherWallet}
                  isConnected={publicKey ? true : false}
                />
              )}
            </TabPanel>
            <TabPanel hidden={selectedTab !== "Value"}>
              <YourPortfolioChart
                isLoading={portfolioDataToToUse === undefined}
                graphData={usdPositionGraphData}
                isStalkingAnotherWallet={isStalkingAnotherWallet}
                isConnected={publicKey ? true : false}
                height={210}
                minYvalue={0}
              />
            </TabPanel>
            <TabPanel hidden={selectedTab !== "Activity"}>
              <YourActivityTable
                walletAddy={walletToUse}
                isStalkingAnotherWallet={isStalkingAnotherWallet}
              />
            </TabPanel>
          </div>
        </div>
      </LayoutSection>
      {selectedTab !== "Activity" && (
        <>
          <FunBoxChart
            totalPortfolioValue={totalPortfolioValue}
            totalReturnOnInvestment={totalReturnOnInvestment}
            totalThisWeekUSDC={totalThisWeekUSDC}
            volt1Total={volt1Total}
            volt2Total={volt2Total}
            volt3Total={volt3Total}
            volt4Total={volt4Total}
            volt5Total={volt5Total}
            disabled={!isStalkingAnotherWallet && !publicKey}
          />
          <YourAssetsTable
            cards={cardsToLookAt}
            isLoading={vfac09.loading}
            disableClick={isStalkingAnotherWallet}
            netReturnData={netReturnData}
            winRateMap={winRateMap}
          />
        </>
      )}
      <Ellipse />
    </Container>
  );
}

export const LayoutSection = styled.div`
  margin: 0 auto;
  padding: 20px 20px 30px 20px;
  width: 100%;
  display: flex;
  flex-flow: wrap;
  justify-content: center;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 35px 20px 20px 20px;
  display: flex;
  flex-flow: wrap;
  justify-content: center;
`;

const Ellipse = styled.div`
  position: absolute;
  /* width: 694px; */
  width: 100%;
  height: 694px;
  top: -353px;

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

const Title = styled.span`
  padding: 0 40px;
  font-family: "Recoleta";
  font-size: 40px;
  font-weight: 500;
  color: white;
  width: 100%;
  z-index: 1;

  @media (max-width: 659px) {
    font-size: 30px;
  }
`;

const WalletSubtitle = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 14px;
  height: 18px;
  font-family: "Euclid Circular B";
  padding: 0 40px;
  width: 100%;
  text-align: left;
  line-height: 1.25;
  background: #ce56c2;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 9px;
  gap: 5px;
  z-index: 10;
  cursor: pointer;
`;

const NftTextBubble = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  position: relative;
  top: -5px;
  right: 17px;
  height: 30px;
  width: 150px;
  justify-content: center;
  align-items: center;
  font-family: "Euclid Circular B";
  font-size: 11px;

  @media (max-width: 659px) {
    display: none;
  }
  background: #404355;
  border-radius: 223px;
  padding: 10px;
  cursor: pointer;
`;

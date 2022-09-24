import Bolt from "./friktionLogos/bolt80.png";
// import { css } from "@emotion/react";
import { css, SerializedStyles } from "@emotion/react";
import styled from "@emotion/styled";
import {
  formatUSDRoundDown,
  floorLocale,
  greatFloorLocaleN,
  dontUseRoundLocaleN,
  formatUSDCentsSilly,
} from "./format09";
import {
  BlueA,
  BlueB,
  BlueBar,
  GreenA,
  GreenB,
  GreenBar,
  YellowBar,
  YellowA,
  YellowB,
  YellowCrabBar,
  PinkA,
  PinkB,
  PinkBar,
  VioletA,
  VioletB,
  VioletBar,
} from "./glow09";
import { Popover } from "antd";
import {
  AllSymbolsUnion,
  Subvolt1Data,
  Subvolt1UserDeposits,
  SubvoltDef10,
  voltTitleForCard,
  VoltNumber as VNumber,
  CrabCardData,
  AllProtectionVoltGlobalIdsUnion,
} from "./registry10";
import { GlowAPYNumber } from "./VoltNumber";
import ConstructionWorker from "../randomIcons/construction-worker-emoji.png";
import { apyFromDataNoPercentageSign, FullYieldTooltip } from "./YieldTooltip";
import { ManualUniversalAssetLogo } from "./UniversalAssetLogo";
import { useCondomOfEquality } from "./superCondom";
import { MainnetLUNAToken } from "./registry10";
import { DisabledButton09 } from "./Button09";
import { Button } from "common/components/Button";
import { useAppWallet } from "features/wallet";
import { useAppConnection } from "features/connection";
import { useAuctionResults } from "./AuctionResults";
import volt5RangeBar from "./voltPics/volt5RangeBar.png";
import { useMarkPrices } from "./MarkPrices10";
import { useProtectionData } from "./ProtectionData";
import { useQuery } from "react-query";
import { useQuarryData } from "./useQuarryData";
import { useCallback } from "react";

/**
 * def is null: asset is not yet launched
 * data or deposits is null: data not yet loaded
 */
export type Card09LaunchedInfo =
  | {
      def: null;
      data: null;
      deposits: null;
      highVoltageDef: null;
      highVoltageData: null;
      highVoltageDeposits: null;
      crabCardData?: CrabCardData | undefined; //independent fetch
    }
  | {
      def: SubvoltDef10;
      data: Subvolt1Data | null; // if data is not null, that means def is definitely not null
      deposits: Subvolt1UserDeposits | null; // if deposits is not null, that means def is definitely not null
      highVoltageDef: SubvoltDef10 | null;
      highVoltageData: Subvolt1Data | null;
      highVoltageDeposits: Subvolt1UserDeposits | null;
      crabCardData?: CrabCardData | undefined;
    };

export type QuarryInfo = {
  quarryPool: "HUG_ME_PLS";
};

export type Card09Props = {
  volt: VNumber;
  underlyingAssetSymbol: AllSymbolsUnion;
  quoteAssetSymbol: AllSymbolsUnion;
  className?: string;
  css?: SerializedStyles;
  walletConnected?: boolean;
  screenshotMode?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
  quarryInfo?: QuarryInfo;
} & Card09LaunchedInfo;

export const Card10 = (props: Card09Props) => {
  const wallet = useAppWallet();
  const { yieldDataPerVolt } = useAuctionResults();
  const { network } = useAppConnection();
  const { markPrices } = useMarkPrices();
  const { protectionVoltData } = useProtectionData();
  const { quarryData } = useQuarryData();

  const def = props.def;
  const data = props.data;
  const deposits = props.deposits;
  const crabCardData = props.crabCardData;

  // const highVoltageDef = props.highVoltageDef;
  const highVoltageData = props.highVoltageData;
  const highVoltageDeposits = props.highVoltageDeposits;

  // if high voltage exists then we need to add those numbers to totals

  const lidoRewardsApyQuery = useQuery<
    unknown,
    unknown,
    Record<string, number>
  >(
    "lidoRewardsApyQuery",
    () => {
      return fetch("https://api.friktion.fi/lido_volt_rewards").then((res) =>
        res.json()
      );
    },
    {
      staleTime: Infinity,
      retry: 3,
      enabled: def?.globalId === "mainnet_income_call_stsol",
    }
  );
  let additionalRewardsApy: string | null = null;
  let additionalRewards: number | null = null;

  if (def && def.isEmittingRewards()) {
    additionalRewardsApy = "...%";
    if (
      lidoRewardsApyQuery.data &&
      def?.globalId === "mainnet_income_call_stsol"
    ) {
      additionalRewardsApy = `${lidoRewardsApyQuery.data.apy.toFixed(1)}%`;
      additionalRewards = lidoRewardsApyQuery.data.apy;
    } else if (quarryData[def.globalId]) {
      const quarryDPR = quarryData[def.globalId];
      if (quarryDPR) {
        additionalRewards =
          quarryDPR * 365 < 1 && quarryDPR > 0
            ? Number(quarryDPR * 365)
            : Number(quarryDPR * 365);
        additionalRewardsApy = `${
          quarryDPR * 365 < 1 && quarryDPR > 0
            ? Number(quarryDPR * 365).toFixed(4)
            : Number(quarryDPR * 365).toFixed(1)
        }%`;
      }
    }
  }

  let capacityCard = <CardCapacityNumber>Coming soon</CardCapacityNumber>;
  if (def) {
    if (!data) {
      capacityCard = (
        <CardCapacityNumber
          css={css`
            opacity: 0.4;
          `}
        >
          Total: loading...
        </CardCapacityNumber>
      );
    } else {
      const totalDepositsUSD = highVoltageData
        ? highVoltageData.totalDepositsUSD.add(data.totalDepositsUSD)
        : data.totalDepositsUSD;
      const totalDeposits = highVoltageData
        ? highVoltageData.totalDeposits.add(data.totalDeposits)
        : data.totalDeposits;
      const capacity = highVoltageData
        ? highVoltageData.capacity.add(data.capacity)
        : data.capacity;
      // if (props.capacity === -1) {
      capacityCard = (
        <CardCapacityNumber>
          {def.depositToken === MainnetLUNAToken ||
          def.underlying.symbol === "LUNA" ? (
            <>
              <img
                css={css`
                  width: 16px;
                  height: 16px;
                  margin-right: 8px;
                  user-select: none;
                  filter: brightness(0.5) sepia(1) saturate(10000%)
                    hue-rotate(60deg) saturate(1) brightness(800%);
                `}
                src={Bolt}
                alt=""
              />
              <span
                css={css`
                  color: #ff0;
                `}
              >
                Withdrawals only
              </span>
              <img
                css={css`
                  width: 16px;
                  height: 16px;
                  margin-left: 8px;
                  user-select: none;
                  filter: brightness(0.5) sepia(1) saturate(10000%)
                    hue-rotate(60deg) saturate(1) brightness(800%);
                `}
                src={Bolt}
                alt=""
              />
            </>
          ) : additionalRewardsApy ? (
            <Popover
              destroyTooltipOnHide
              placement="bottom"
              content={
                <div
                  css={css`
                    max-width: 240px;
                  `}
                >
                  {def.globalId === "mainnet_income_call_stsol" ? (
                    <span>
                      <span
                        css={css`
                          font-weight: 600;
                        `}
                      >
                        Automatically
                      </span>{" "}
                      earn extra rewards from depositing into this stSOL volt.
                      You will receive LDO rewards monthly.
                    </span>
                  ) : (
                    <span>
                      Earn extra rewards from depositing into this{" "}
                      {def.depositToken.symbol} volt and staking the{" "}
                      {def.shareTokenSymbol} you receive!
                    </span>
                  )}
                </div>
              }
            >
              <div
                css={css`
                  pointer-events: auto;
                  display: flex;
                  align-items: center;
                `}
              >
                <img
                  css={css`
                    width: 16px;
                    height: 16px;
                    margin-right: 8px;
                    user-select: none;
                    filter: brightness(0.5) sepia(1) saturate(10000%)
                      hue-rotate(60deg) saturate(1) brightness(800%);
                  `}
                  src={Bolt}
                  alt=""
                />
                <span
                  css={css`
                    color: #ff0;
                  `}
                >
                  {`+${additionalRewardsApy} BOOST`}
                </span>
                <img
                  css={css`
                    width: 16px;
                    height: 16px;
                    margin-left: 8px;
                    user-select: none;
                    filter: brightness(0.5) sepia(1) saturate(10000%)
                      hue-rotate(60deg) saturate(1) brightness(800%);
                  `}
                  src={Bolt}
                  alt=""
                />
                <span
                  className="hoverShow"
                  css={css`
                    &:after {
                      display: inline-block;
                      content: "ⓘ";
                      font-size: 12px;
                      font-weight: bold;
                      margin-left: 4px;
                    }
                  `}
                ></span>
              </div>
            </Popover>
          ) : (
            <>
              Total:&nbsp;{" "}
              <div
                css={css`
                  white-space: nowrap;
                `}
              >
                <Popover
                  destroyTooltipOnHide
                  placement="bottom"
                  content={
                    <span
                      css={css`
                        font-size: 14px;
                        font-family: "Euclid Circular B";
                      `}
                    >
                      {greatFloorLocaleN(def, totalDeposits, 0).toString()} /{" "}
                      {floorLocale(capacity)} {def.depositToken.symbol} (
                      {dontUseRoundLocaleN(
                        totalDeposits.div(capacity).mul(100).clamp(0, 100),
                        1
                      )}
                      %)
                    </span>
                  }
                  trigger="hover"
                >
                  {formatUSDRoundDown(totalDepositsUSD)}
                  <span className="hoverShow">
                    &nbsp; (
                    {data
                      ? dontUseRoundLocaleN(
                          totalDeposits.div(capacity).mul(100).clamp(0, 100),
                          1
                        ) + "%"
                      : ""}
                    )
                  </span>
                </Popover>
              </div>
            </>
          )}
        </CardCapacityNumber>
      );
      // } else {
      //   capacityCard = (
      //     <CardCapacityNumber>
      //       {formatToKorM(props.tvlUSD)} / {formatToMRound(props.capacity)}
      //     </CardCapacityNumber>
      //   );
      // }
    }
  }
  let yourPosition;
  // console.log("card09160", def?.globalId, deposits?.totalDeposits.toString());

  if (!def || props.screenshotMode) {
    yourPosition = <YourPosition></YourPosition>;
  } else if (!wallet?.connected) {
    yourPosition = (
      <YourPosition
        css={css`
          opacity: 0.4;
        `}
      >
        Not connected to wallet
      </YourPosition>
    );
  } else {
    // console.log("deposits = ", deposits);
    if (!deposits) {
      yourPosition = (
        <YourPosition
          css={css`
            opacity: 0.4;
          `}
        >
          You: loading...
        </YourPosition>
      );
    } else {
      const yourTotalDeposits = highVoltageDeposits
        ? highVoltageDeposits.totalDeposits.add(deposits.totalDeposits)
        : deposits.totalDeposits;
      yourPosition = (
        <YourPosition>
          You:{" "}
          {yourTotalDeposits && def ? (
            <>
              {/* {def.depositToken.formatShort(yourTotalDeposits)} */}
              {def.externalLink ? (
                <PrettyLink
                  style={{
                    marginLeft: "5px",
                  }}
                >
                  <a href={def.externalLink} rel="noreferrer" target="_blank">
                    {def.depositToken.formatShort(yourTotalDeposits)}
                  </a>
                </PrettyLink>
              ) : (
                def.depositToken.formatShort(yourTotalDeposits)
              )}
              {data && !yourTotalDeposits.isZero() ? (
                <span className="hoverShow">
                  &nbsp;{" "}
                  {formatToDollarSignDKM(
                    yourTotalDeposits.mul(data.markPrice).toNumber()
                  )}
                </span>
              ) : null}
            </>
          ) : (
            "..."
          )}
        </YourPosition>
      );
    }
  }

  let crabLineGraph;

  const crabChartInfoText = (crabCardData: CrabCardData | undefined) => {
    return (
      <>
        <p
          css={css`
            max-width: 250px;
            font-family: "Euclid Circular B";
          `}
        >
          {crabCardData
            ? `Based on the current funding rate on Entropy, the crab strategy will be profitable if BTC remains in the profit threshold of approximately $${crabCardData.start} - $${crabCardData.end} until the next epoch (once a week).`
            : "Based on the current funding rate on Entropy, the crab strategy will be profitable if BTC remains in the profit threshold of approximately $Loading... - $Loading... until the next epoch (once a week)."}
        </p>
        <p
          css={css`
            max-width: 250px;
            font-family: "Euclid Circular B";
          `}
        >
          The profit range shown is for the current epoch.
        </p>
        <p
          css={css`
            max-width: 250px;
            font-family: "Euclid Circular B";
          `}
        >
          Can only get liquidated if BTC goes up, not down. Current Liquidation
          Threshold: 161.245%
        </p>
      </>
    );
  };

  if (def?.volt === 3) {
    // Align the downarrow based on where the underlying is on vs. the profit range.
    let percentLineGraph = crabCardData
      ? ((parseInt(crabCardData.markPrice) - parseInt(crabCardData.start)) /
          (parseInt(crabCardData.end) - parseInt(crabCardData.start))) *
        100
      : 50;
    // Multiply by 0.16 because that's where the yellow bar ends.
    let lineGraphAdjustmentFactor = (percentLineGraph - 50) * 0.3;
    let lineGraphFinalPlacement = Math.max(
      0,
      Math.min(percentLineGraph - lineGraphAdjustmentFactor, 100)
    );
    crabLineGraph = (
      <CrabLineGraph>
        <CrabRangeNumber style={{ left: "40px" }}>
          {crabCardData ? `$${crabCardData.start}` : "..."}
        </CrabRangeNumber>
        <CrabVerticalTick style={{ left: "40px" }} />
        <CrabDownArrow
          style={{
            left: crabCardData ? `${lineGraphFinalPlacement}%` : "49%",
          }}
        />
        <CrabSpotPriceNumber
          style={{
            left: crabCardData
              ? `${Math.max(Math.min(lineGraphFinalPlacement, 85), 15) - 1}%`
              : "49%",
          }}
        >
          {crabCardData ? `$${crabCardData.markPrice}` : "..."}
          <Popover
            destroyTooltipOnHide
            placement="bottom"
            content={crabChartInfoText(crabCardData)}
          >
            <div
              css={css`
                position: absolute;
                top: -1px;
                pointer-events: auto;
                left: 107%;
              `}
            >
              <span
                className="hoverShow"
                css={css`
                  &:after {
                    content: "ⓘ";
                    font-size: 12px;
                    font-weight: bold;
                  }
                `}
              ></span>
            </div>
          </Popover>
        </CrabSpotPriceNumber>
        <CrabMiddleRange>
          <YellowCrabBar
            css={css`
              left: -66px;
            `}
          />
        </CrabMiddleRange>
        <CrabRangeNumber style={{ left: "172px" }}>
          {crabCardData ? `$${crabCardData.end}` : "..."}
        </CrabRangeNumber>
        <CrabVerticalTick style={{ left: "170px" }} />
      </CrabLineGraph>
    );
  }

  let barWidth = "5px";
  let popoverCapacityText = "loading capacity...";

  if (data) {
    const totalDeposits = highVoltageData
      ? highVoltageData.totalDeposits.add(data.totalDeposits)
      : data.totalDeposits;
    const capacity = highVoltageData
      ? highVoltageData.capacity.add(data.capacity)
      : data.capacity;

    barWidth =
      Math.max(
        5,
        Math.min(
          216,
          (totalDeposits.toNumber() / capacity.toNumber()) ** 0.9 * 211 + 5
        )
      ) + "px";

    popoverCapacityText =
      dontUseRoundLocaleN(
        totalDeposits.div(capacity).mul(100).clamp(0, 100),
        1
      ) + "% of max capacity";
  }

  // console.log(
  //   "MAFFS ",
  //   def?.globalId,
  //   data?.totalDeposits.toNumber(),
  //   data?.capacity.toNumber(),
  //   data && (data?.totalDeposits.toNumber() / data?.capacity.toNumber()) ** 0.9,
  //   data &&
  //     (data?.totalDeposits.toNumber() / data?.capacity.toNumber()) ** 0.9 *
  //       175 +
  //       5
  // );

  const coloredBar =
    props.volt === 1 ? (
      <BlueBar className="phaseShiftable" />
    ) : props.volt === 2 ? (
      <GreenBar className="phaseShiftable" />
    ) : props.volt === 3 ? (
      <YellowBar className="phaseShiftable" />
    ) : props.volt === 4 ? (
      <PinkBar className="phaseShiftable" />
    ) : (
      <VioletBar className="phaseShiftable" />
    );
  const coloredGlowBg =
    props.volt === 1 ? (
      <BlueGlowBG className="glowBG" />
    ) : props.volt === 2 ? (
      <GreenGlowBG className="glowBG" />
    ) : props.volt === 3 ? (
      <YellowGlowBG className="glowBG" />
    ) : props.volt === 4 ? (
      <PinkGlowBG className="glowBG" />
    ) : (
      <VioletGlowBG className="glowBG" />
    );

  const yieldData = def ? yieldDataPerVolt[def.globalId] : null;
  const latestEpochYield = yieldData ? yieldData.latestEpochYield : null;
  const averagedEpochYield = yieldData ? yieldData.averagedEpochYield : null;

  const voltNumberPositioner = (
    <VoltNumberPositioner
      style={{
        top: def?.volt === 5 ? "0px" : "",
      }}
    >
      <GlowAPYNumber
        voltNum={props.volt}
        apy={apyFromDataNoPercentageSign(
          data,
          yieldData ? yieldData.averagedEpochYield : null,
          1,
          additionalRewards ?? undefined
        )}
      />
      {def ? (
        <APYPositioner
          style={{
            bottom: def?.volt === 3 ? "189px" : "",
          }}
        >
          <Popover
            destroyTooltipOnHide
            placement="bottom"
            content={FullYieldTooltip(
              data,
              averagedEpochYield,
              latestEpochYield,
              def?.volt === 5 && protectionVoltData
                ? protectionVoltData[
                    def.globalId as AllProtectionVoltGlobalIdsUnion
                  ]
                : null,
              additionalRewardsApy ?? undefined
            )}
          >
            <div
              css={css`
                pointer-events: auto;
              `}
            >
              <CardAPYLabel>
                APY{" "}
                <span
                  className="hoverShow"
                  css={css`
                    &:after {
                      display: inline-block;
                      content: "ⓘ";
                      font-size: 12px;
                      font-weight: bold;
                    }
                  `}
                ></span>
              </CardAPYLabel>
            </div>
          </Popover>
        </APYPositioner>
      ) : null}
    </VoltNumberPositioner>
  );

  let twentyFivePercentBelowSpot = null;
  let spot = null;

  if (markPrices && def) {
    spot = markPrices[def.underlying.symbol];
    twentyFivePercentBelowSpot = (spot - spot * 0.25).toFixed(2);
  }

  const volt5ProtectionAdditionalBox = (
    <div
      css={css`
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        user-select: none;
        z-index: 5;
        width: 100%;
        top: 54px;
      `}
    >
      <div
        css={css`
          display: flex;
          flex-direction: column;
          gap: 6px;
          align-items: center;
          width: 218px;
          height: 95px;
          background: #272932;
          border-radius: 8px;
          padding: 8px;
        `}
      >
        <Popover
          destroyTooltipOnHide
          placement="bottom"
          content={
            <div
              css={css`
                max-width: 230px;
              `}
            >
              {`Generates outsized returns from put options when the price of SOL
              moves below $${twentyFivePercentBelowSpot ?? "..."}`}
            </div>
          }
        >
          <div
            css={css`
              font-weight: 600;
              font-size: 12px;
              line-height: 12px;
              pointer-events: auto;
              margin-right: -17px;
            `}
          >
            Payoff Range{" "}
            <span
              className="hoverShow"
              css={css`
                &:after {
                  display: inline-block;
                  content: "ⓘ";
                  font-size: 12px;
                  font-weight: bold;
                  margin-left: 4px;
                }
              `}
            ></span>
          </div>
        </Popover>
        <div
          css={css`
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 58px;
          `}
        >
          <img
            css={css`
              margin-bottom: -2px;
              user-select: none;
            `}
            width="193"
            src={volt5RangeBar}
            alt=""
          />
          {spot !== null && (
            <div
              css={css`
                position: absolute;
                align-items: center;
                display: flex;
                flex-direction: column;
                font-size: 12px;
                bottom: 43px;
                right: 39px;
              `}
            >
              {`$${spot}`}
              <Volt5DownArrow />
            </div>
          )}
          <div
            css={css`
              position: absolute;
              display: flex;
              gap: 2px;
              font-size: 12px;
              bottom: 4px;
              left: 39px;
            `}
          >
            {twentyFivePercentBelowSpot
              ? `$${twentyFivePercentBelowSpot}`
              : "..."}
            {twentyFivePercentBelowSpot && (
              <div
                css={css`
                  font-weight: 700;
                `}
              >
                (-25%)
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <CardWrapper10
      className={
        (props.className ?? "") +
        " Card09 " +
        def?.globalId +
        (def?.globalId ? " card_" + def?.globalId + " " : "") +
        (props.screenshotMode ? " screenshotMode " : "")
      }
      style={{
        height: def?.volt === 3 ? "369px" : def?.volt === 5 ? "395px" : "",
      }}
    >
      <CardContainer10
        className={
          (deposits?.totalDeposits && deposits?.totalDeposits.greaterThan(0)
            ? "hasPosition"
            : "") + (props.screenshotMode ? " screenshotMode " : "")
        }
        onClick={props.onClick}
        style={{
          height: def?.volt === 3 ? "369px" : def?.volt === 5 ? "395px" : "",
        }}
      >
        <div
          className={def?.globalId ? " offset_" + def?.globalId + " " : ""}
          css={css`
            position: absolute;
            top: -30px;
            user-select: none;
            pointer-events: none;
          `}
        ></div>
        <CardTitle10>{voltTitleForCard(props.volt)}</CardTitle10>
        {def?.volt === 5 ? (
          <Volt5InfoContainer>
            {voltNumberPositioner}
            {volt5ProtectionAdditionalBox}
          </Volt5InfoContainer>
        ) : (
          voltNumberPositioner
        )}
        <CardBoltPositioner>
          <ShiningBolt
            className={
              highVoltageData
                ? props.volt === 1
                  ? "powerUpBlue"
                  : props.volt === 2
                  ? "powerUpGreen"
                  : "powerUpYellow"
                : "notPowerUp"
            }
          />
          <BlurryGlowBoltContainer>
            <BlurryGlowBolt />
          </BlurryGlowBoltContainer>
        </CardBoltPositioner>
        <div
          css={css`
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            top: 0;
          `}
        >
          <CardAssetLogo
            style={{
              bottom: def?.volt === 3 ? "168px" : "",
              left: def?.volt !== 1 ? "30px" : "20px",
            }}
          >
            <ManualUniversalAssetLogo
              mainSymbol={
                props.volt === 1
                  ? props.underlyingAssetSymbol
                  : props.quoteAssetSymbol
              }
              secondarySymbol={
                props.volt === 1 ? undefined : props.underlyingAssetSymbol
              }
            />
            <CardAssetName
              css={css`
                ${props.underlyingAssetSymbol.length > 5
                  ? "font-size: 18px;"
                  : ""}
                ${def?.globalId === "mainnet_income_call_stsol"
                  ? "width: 100%;top: 3px;"
                  : ""}
              `}
              style={{
                bottom: def?.volt === 3 ? "174px" : "",
                left:
                  def?.volt !== 1
                    ? "20px"
                    : def?.globalId === "mainnet_income_call_stsol"
                    ? "14px"
                    : "12px",
              }}
            >
              {def?.globalId === "mainnet_income_call_stsol" ? (
                <Popover
                  destroyTooltipOnHide
                  placement="bottom"
                  content={
                    <div
                      css={css`
                        max-width: 240px;
                      `}
                    >
                      <span>
                        Don't have stSOL? Create some with SOL and deposit in 1
                        step by{" "}
                        <span
                          onClick={props.onClick}
                          css={css`
                            font-weight: 500;
                            color: #ff00a8;
                            cursor: pointer;
                          `}
                        >
                          clicking on this card
                        </span>
                        !
                      </span>
                    </div>
                  }
                >
                  <div
                    css={css`
                      pointer-events: auto;
                      display: flex;
                      align-items: center;
                    `}
                  >
                    stSOL
                    <div
                      css={css`
                        width: 1px;
                        height: 30px;
                        margin: 0 7px;
                        background: #74747d;
                      `}
                    />
                    SOL
                    <span
                      className="hoverShow"
                      css={css`
                        &:after {
                          display: inline-block;
                          content: "ⓘ";
                          font-size: 12px;
                          font-weight: bold;
                          margin-left: 5px;
                          margin-bottom: 2px;
                        }
                      `}
                    ></span>
                  </div>
                </Popover>
              ) : (
                props.underlyingAssetSymbol
              )}
            </CardAssetName>
          </CardAssetLogo>

          {def?.volt === 3 && (
            <CrabLineGraphContainer>{crabLineGraph}</CrabLineGraphContainer>
          )}
          <YourPositionPositioner>{yourPosition}</YourPositionPositioner>

          <BarPositioner>
            {def ? (
              <Popover
                destroyTooltipOnHide
                placement="bottomLeft"
                content={
                  <span
                    css={css`
                      font-size: 14px;
                    `}
                  >
                    {popoverCapacityText}
                  </span>
                }
                trigger="hover"
              >
                <BarContainer style={{ width: barWidth }}>
                  <BarSharpCropper>{coloredBar}</BarSharpCropper>
                </BarContainer>
              </Popover>
            ) : (
              <BarContainer style={{ width: barWidth }}>
                <BarSharpCropper>{coloredBar}</BarSharpCropper>
              </BarContainer>
            )}
          </BarPositioner>
          <TVLPositioner className="capacity">{capacityCard} </TVLPositioner>
        </div>
        {network !== "mainnet-beta" ? <ConstructionWorkerPositioner /> : null}
        <BottomCardButton>
          {def?.volt !== 1 &&
          def?.volt !== 2 &&
          data?.extraVaultData?.turnOffDepositsAndWithdrawals ? (
            <DisabledButton09 reason="Volt is rebalancing.">
              Rebalancing...
            </DisabledButton09>
          ) : def ? (
            <Button
              css={css`
                padding: 12px 32px;
              `}
              voltNumber={def.volt}
              onClick={props.onClick}
              variant={
                deposits?.totalDeposits && deposits.totalDeposits.greaterThan(0)
                  ? "primary"
                  : "outline-primary"
              }
            >
              {deposits?.totalDeposits
                ? deposits.totalDeposits.greaterThan(0)
                  ? "Manage"
                  : "Deposit"
                : "Deposit"}
            </Button>
          ) : (
            <DisabledButton09 reason="Asset is not yet launched">
              Deposit
            </DisabledButton09>
          )}
        </BottomCardButton>
      </CardContainer10>
      {coloredGlowBg}
      {coloredGlowBg}
    </CardWrapper10>
  );
};

export const CondomWrappedCard10 = (props: Card09Props) => {
  const wrappedProps = useCondomOfEquality(props);
  return Card10(wrappedProps);
};

export const Card10GroupWrapped: React.FC<{
  card: Card09Props;
  openModal: (globalId: string) => void;
}> = ({ card, openModal }) => {
  const onClick = useCallback(() => {
    if (card.def) {
      openModal(card.def.globalId);
    }
  }, [card.def, openModal]);
  return (
    <CardGroup10>
      <CondomWrappedCard10
        {...card}
        css={card.def ? clickableStyle : undefined}
        onClick={onClick}
      />
    </CardGroup10>
  );
};

const clickableStyle = css`
  cursor: pointer;
`;

const CardGroup10 = styled.div`
  width: 256px;
  .Button09 {
    margin: 0 auto;
    width: 216px;
  }
  &:nth-of-type(2n) {
    .glowBG,
    .phaseShiftable {
      animation-delay: 0.75s;
    }
  }
`;

const BottomCardButton = styled.div`
  position: absolute;
  bottom: 20px;
  width: 100%;
`;

// Card09.whyDidYouRender = true;

// function formatToKorM(num: number) {
//   if (num > 1_000_000) {
//     return `${Math.round((num / 1_000_000) * 100) / 100}M`;
//   }
//   return `${Math.round((num / 1_000) * 10) / 10}K`;
// }

/**
 * Dollar sign with dollar, K, or M
 */
function formatToDollarSignDKM(num: number) {
  if (num > 100_000_000) {
    return `$${Math.floor((num / 1_000_000) * 1) / 1}M`;
  }
  if (num > 10_000_000) {
    return `$${Math.floor((num / 1_000_000) * 10) / 10}M`;
  }
  if (num > 1_000_000) {
    return `$${Math.floor((num / 1_000_000) * 100) / 100}M`;
  }
  if (num > 10_000) {
    return `$${Math.floor((num / 1_000) * 10) / 10}K`;
  }

  if (num > 1000) {
    return formatUSDRoundDown(num);
  }

  return formatUSDCentsSilly(num);
}

// function formatToMRound(num: number) {
//   return `${Math.round(num / 1000000)}M`;
// }

export const CardWrapper = styled.div`
  position: relative;
  width: 230px;
  height: 230px;
  border-radius: 8px;
  font-family: "Euclid Circular B";

  @media print {
    & {
      outline: 2px solid rgba(0, 0, 0, 0.4);
    }
  }
`;

export const CardWrapper10 = styled.div`
  position: relative;
  width: 256px;
  height: 285px;
  border-radius: 8px;

  @media print {
    & {
      outline: 2px solid rgba(0, 0, 0, 0.4);
    }
  }
`;

export const CardBoltPositioner = styled.div`
  position: absolute;
  z-index: 1;
  /* opacity: 0.05; */
  pointer-events: none;
  /* width: 50%; */
  height: 103.5px;
  top: -1px;
  right: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  /* svg {
    transform: scale(0.6);
  } */
  opacity: 0.5;
`;
export const CardContainer = styled.div`
  width: 230px;
  height: 230px;
  position: relative;
  background: linear-gradient(hsl(230, 15%, 19%), hsl(230, 15%, 13%) 80%);
  box-shadow: 0 0.66px 0 0 hsl(230, 15%, 21%) inset;
  border-radius: 8px;
  font-size: 15px;
  z-index: 2;
  &.hasPosition + .glowBG,
  &.hasPosition + .glowBG + .glowBG {
    opacity: 0.6;
  }
  &:hover + .glowBG,
  &:hover + .glowBG + .glowBG {
    opacity: 1;
  }
  &.screenshotMode + .glowBG,
  &.screenshotMode + .glowBG + .glowBG {
    opacity: 1;
  }
  color: #fff;

  .hoverShow {
    opacity: 0;
    user-select: none;
    transition: opacity 0.4s;
  }

  @keyframes halfFlash {
    0% {
      opacity: 0.5;
    }
    20% {
      opacity: 1;
    }
    25% {
      opacity: 1;
    }
    100% {
      opacity: 0.5;
    }
  }
  @keyframes ninetyFlash {
    0% {
      opacity: 0.9;
    }
    20% {
      opacity: 1;
    }
    25% {
      opacity: 1;
    }
    100% {
      opacity: 0.9;
    }
  }
  &:hover {
    .hoverShow {
      opacity: 0.5;
    }
    ${CardBoltPositioner}, .voltNumberContainer {
      animation: ninetyFlash 0.3s linear;
      animation-iteration-count: 1;
    }
    ${CardBoltPositioner}, .glowVoltNum {
      animation: halfFlash 0.3s linear;
      animation-iteration-count: 1;
    }
  }

  .powerUpBlue {
    background: linear-gradient(
      70deg,
      #637dff 10%,
      #17c9ff 40%,
      #17c9ff 60%,
      #637dff 90%
    );
    background-size: 200% auto;
    animation: scrollshine 1.5s linear infinite reverse;
    animation-timing-function: steps(60);
    @keyframes scrollshine {
      to {
        background-position: 200% center;
      }
    }
    transform: scale(0.5);
  }

  .powerUpGreen {
    background: linear-gradient(
      50deg,
      #28edbf 10%,
      #5ded39 40%,
      #5ded39 60%,
      #28edbf 90%
    );
    background-size: 200% auto;
    animation: scrollshine 1.5s linear infinite reverse;
    animation-timing-function: steps(60);
    @keyframes scrollshine {
      to {
        background-position: 200% center;
      }
    }
    transform: scale(0.5);
  }
  .powerUpYellow {
    background: linear-gradient(
      50deg,
      #ffc003 10%,
      #cfe600 40%,
      #cfe600 60%,
      #ffc003 90%
    );
    background-size: 200% auto;
    animation: scrollshine 1.5s linear infinite reverse;
    animation-timing-function: steps(60);
    @keyframes scrollshine {
      to {
        background-position: 200% center;
      }
    }
    transform: scale(0.5);
  }
`;

const CardTitle10 = styled.div`
  position: absolute;
  letter-spacing: 0.06em;
  top: 17px;
  left: 22px;
  font-size: 12px;
  color: #74747d;
  opacity: 1;
`;

export const CardContainer10 = styled.div`
  width: 256px;
  height: 285px;
  position: relative;
  background: linear-gradient(180.27deg, #23242f 0.31%, #121317 99.84%);
  box-shadow: 0 0.66px 0 0 hsl(230, 15%, 21%) inset;
  border-radius: 8px;
  font-size: 15px;
  z-index: 2;

  div {
    font-family: "Euclid Circular B";
  }

  &.hasPosition + .glowBG,
  &.hasPosition + .glowBG + .glowBG {
    opacity: 0.6;
  }
  &:hover + .glowBG,
  &:hover + .glowBG + .glowBG {
    opacity: 1;
  }
  &.screenshotMode + .glowBG,
  &.screenshotMode + .glowBG + .glowBG {
    opacity: 1;
  }
  color: #fff;

  .hoverShow {
    opacity: 0;
    user-select: none;
    transition: opacity 0.4s;
  }

  @keyframes halfFlash {
    0% {
      opacity: 0.5;
    }
    20% {
      opacity: 1;
    }
    25% {
      opacity: 1;
    }
    100% {
      opacity: 0.5;
    }
  }
  @keyframes ninetyFlash {
    0% {
      opacity: 0.9;
    }
    20% {
      opacity: 1;
    }
    25% {
      opacity: 1;
    }
    100% {
      opacity: 0.9;
    }
  }
  &:hover {
    .hoverShow {
      opacity: 0.5;
    }
    ${CardBoltPositioner}, .voltNumberContainer {
      animation: ninetyFlash 0.3s linear;
      animation-iteration-count: 1;
    }
    ${CardBoltPositioner}, .glowVoltNum {
      animation: halfFlash 0.3s linear;
      animation-iteration-count: 1;
    }
  }

  .powerUpBlue {
    background: linear-gradient(
      70deg,
      #637dff 10%,
      #17c9ff 40%,
      #17c9ff 60%,
      #637dff 90%
    );
    background-size: 200% auto;
    animation: scrollshine 1.5s linear infinite reverse;
    animation-timing-function: steps(60);
    @keyframes scrollshine {
      to {
        background-position: 200% center;
      }
    }
    transform: scale(0.5);
  }

  .powerUpGreen {
    background: linear-gradient(
      50deg,
      #28edbf 10%,
      #5ded39 40%,
      #5ded39 60%,
      #28edbf 90%
    );
    background-size: 200% auto;
    animation: scrollshine 1.5s linear infinite reverse;
    animation-timing-function: steps(60);
    @keyframes scrollshine {
      to {
        background-position: 200% center;
      }
    }
    transform: scale(0.5);
  }
  .powerUpYellow {
    background: linear-gradient(
      50deg,
      #ffc003 10%,
      #cfe600 40%,
      #cfe600 60%,
      #ffc003 90%
    );
    background-size: 200% auto;
    animation: scrollshine 1.5s linear infinite reverse;
    animation-timing-function: steps(60);
    @keyframes scrollshine {
      to {
        background-position: 200% center;
      }
    }
    transform: scale(0.5);
  }
`;

export const ShiningBolt = styled.div`
  -webkit-transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000;

  width: 90px;
  height: 32px;
  background: linear-gradient(
    70deg,
    hsla(230, 15%, 80%, 0.1) 16%,
    hsla(230, 15%, 80%, 0.16) 42%,
    hsla(230, 15%, 80%, 0.16) 58%,
    hsla(230, 15%, 80%, 0.1) 84%
  );
  opacity: 1;
  height: 115px;

  clip-path: url(#boltPath);

  /* clip-path: polygon(
    626px 463px,
    765px 236px,
    687px 31px,
    271px 100px,
    70px 10px,
    49px 250px,
    133px 406px,
    374px 462px,
    529px 393px
  ); */

  /* Optimization todo: use display:none so we dont have to blur when hidden */

  background-size: 200% auto;
  animation: scrollshine 1.5s linear infinite reverse;
  animation-timing-function: steps(60);
  @keyframes scrollshine {
    to {
      background-position: 200% center;
    }
  }
  transform: scale(0.5);
`;
const BlurryGlowBoltContainer = styled.div`
  position: absolute;
  filter: blur(3px);
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -webkit-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
`;
const BlurryGlowBolt = styled.div`
  -webkit-transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000;

  width: 90px;
  height: 32px;
  background: hsla(230, 15%, 80%, 0.04);
  height: 115px;

  clip-path: url(#boltPath);

  /* clip-path: polygon(
    626px 463px,
    765px 236px,
    687px 31px,
    271px 100px,
    70px 10px,
    49px 250px,
    133px 406px,
    374px 462px,
    529px 393px
  ); */

  /* Optimization todo: use display:none so we dont have to blur when hidden */

  background-size: 200% auto;
  animation: scrollshine 1.5s linear infinite reverse;
  animation-timing-function: steps(10);
  @keyframes scrollshine {
    to {
      background-position: 200% center;
    }
  }
  transform: scale(0.5);
`;

const CardAssetLogo = styled.div`
  pointer-events: none;
  position: absolute;
  z-index: 3;
  /* top: 0; */
  top: 48px;
  /* outline: 1px solid red; */
  display: flex;
  justify-content: center;
  /* align-items: center;
  // smooth the jaggies
  -webkit-backface-visibility: hidden;
  transform: scale(1.005);
  &::selection,
  img::selection {
    background: none;
  }
`;

const CardAssetName = styled.div`
  position: relative;
  line-height: 20px;
  font-size: 20px;
  font-weight: 500;
  width: 64px;
  text-align: left;
  top: 8px;
  /* outline: 1px solid red; */
`;

// const CardAPY = styled.div`
//   position: absolute;
//   height: 34px;
//   text-align: right;
//   width: 110px;
//   top: 40px;
//   right: 20px;
// `;
const CardAPYLabel = styled.div`
  /* text-transform: uppercase; */
  font-size: 20px;
  font-weight: 400;
  /* bottom: 116px; */
  /* position: absolute; */
  /* right: 20px; */
  bottom: 1px;
  position: relative;
  opacity: 1;
`;

const APYPositioner = styled.div`
  position: relative;
  height: 5px;
  top: -29px;
  left: 65px;
  text-align: right;
`;
const BarPositioner = styled.div`
  position: absolute;
  height: 5px;
  bottom: 97px;
  left: 20px;
  right: 20px;
  border-radius: 2px;
  background: hsl(230, 15%, 18%);
`;
const BarContainer = styled.div`
  width: 50px;
  transition: width 2s cubic-bezier(0.165, 0.84, 0.44, 1); // easeOutQuart
  position: relative;
  height: 55px;
`;
// If the bar only takes up a few pixels, there will be a mismatch in the gradient to the thing in the background.
const BarSharpCropper = styled.div`
  -webkit-transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000;

  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  border-radius: 2px;
  & > div {
    width: 216px;
  }
`;

const TVLPositioner = styled.div`
  position: absolute;
  height: 38px;
  bottom: 60px;
  left: 22px;
  right: 0px;
`;
const VoltNumberPositioner = styled.div`
  position: absolute;
  left: 21px;
  top: 105px;
  user-select: none;
  z-index: 5;
`;

const ConstructionWorkerPositioner = styled.div`
  position: absolute;
  height: 24px;
  width: 24px;
  bottom: 0;
  right: 15px;
  background: url(${ConstructionWorker}) no-repeat;
  background-size: 24px 24px;
  opacity: 0.9;
`;

const CardCapacityNumber = styled.div`
  /* position: absolute;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 38px;
  bottom: 0;
  left: 20px;
  right: 20px; */
  font-size: 14px;
  height: 30px;
  display: flex;
  align-items: center;
`;
const CrabMiddleRange = styled.div`
  position: absolute;
  width: 130px;
  left: 50%;
  top: 50%;
`;
const CrabRangeNumber = styled.div`
  position: absolute;
  font-size: 14px;
  top: 15px;
  transform: translateX(-50%);
  -ms-transform: translateX(-50%);
  -moz-transform: translateX(-50%);
  -webkit-transform: translateX(-50%);
  -o-transform: translateX(-50%);
`;
const CrabSpotPriceNumber = styled.div`
  position: absolute;
  font-size: 14px;
  top: -21px;
  transform: translateX(-50%);
  -ms-transform: translateX(-50%);
  -moz-transform: translateX(-50%);
  -webkit-transform: translateX(-50%);
  -o-transform: translateX(-50%);
`;
const CrabVerticalTick = styled.div`
  position: relative;
  height: 10px;
  top: 3px;
  width: 1px;
  border-radius: 2px;
  background: hsl(230, 15%, 90%);
`;
const CrabDownArrow = styled.div`
  position: absolute;
  width: 0;
  height: 0;
  border: 4px solid transparent;
  border-bottom: 0;
  border-top: 6px solid white;
  top: 1px;
  z-index: 10;
  transform: translateX(-50%);
  -ms-transform: translateX(-50%);
  -moz-transform: translateX(-50%);
  -webkit-transform: translateX(-50%);
  -o-transform: translateX(-50%);
`;
const Volt5DownArrow = styled.div`
  width: 0;
  height: 0;
  margin-right: -10px;
  border: 4px solid transparent;
  border-bottom: 0;
  border-top: 6px solid white;
  top: 1px;
  z-index: 10;
  transform: translateX(-50%);
  -ms-transform: translateX(-50%);
  -moz-transform: translateX(-50%);
  -webkit-transform: translateX(-50%);
  -o-transform: translateX(-50%);
`;
const CrabLineGraph = styled.div`
  display: flex;
  flex-direction: row;
  top: 50%;
  height: 14px;
  z-index: 0;
  transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  -moz-transform: translateY(-50%);
  -webkit-transform: translateY(-50%);
  -o-transform: translateY(-50%);
`;
const CrabLineGraphContainer = styled.div`
  position: absolute;
  height: 2px;
  bottom: 180px;
  left: 20px;
  right: 20px;
  border-radius: 2px;
  background: hsl(230, 15%, 90%);
`;
const YourPositionPositioner = styled.div`
  position: absolute;
  left: 20px;
  right: 0;
  bottom: 103px;
  font-size: 14px;
  line-height: 30px;
`;
const YourPosition = styled.div`
  font-size: 14px;
  line-height: 15px;
  height: 30px;
  display: flex;
  align-items: center;
`;
const createGlowBG = (colorA: string, colorB: string, height?: string) => {
  return styled.div`
    width: 258px;
    height: ${height ?? "287px"};
    position: absolute;
    z-index: 1;
    /* By making it 1px bigger, the blur looks nicer */
    top: -1px;
    left: -1px;
    background: linear-gradient(
      80deg,
      ${colorA} 10%,
      ${colorB} 40%,
      ${colorB} 60%,
      ${colorA} 90%
    );
    filter: blur(7px);
    opacity: 0;
    transition: opacity 0.2s;

    /* Optimization todo: use display:none so we dont have to blur when hidden */

    background-size: 200% auto;
    animation: scrollshine 1.5s linear infinite reverse;
    animation-timing-function: steps(20);
    @keyframes scrollshine {
      to {
        background-position: 200% center;
      }
    }
    ::selection {
      text-shadow: 0 0 0 #fff !important;
    }

    // Do NOT use this in Chrome. It causes flickering on Google Chrome 105.0.5195.125
    /* -webkit-transform: translate3d(0, 0, 0);
    -webkit-transform: translateZ(0);
    -moz-transform: translate3d(0, 0, 0);
    -webkit-backface-visibility: hidden;
    -webkit-perspective: 1000; */

    .AppleWebKit & {
      // This is necessary to prevent glitching in BOTH macOS Safari and iOS Safari
      // If this is used on Chrome (Blink), the glow will start blinking.
      // This one line is sufficient to fix the issue.
      transform: translate3d(0, 0, 0);
    }
  `;
};
const BlueGlowBG = createGlowBG(BlueA, BlueB);
const GreenGlowBG = createGlowBG(GreenA, GreenB);
const YellowGlowBG = createGlowBG(YellowA, YellowB, "369px");
const PinkGlowBG = createGlowBG(PinkA, PinkB);
const VioletGlowBG = createGlowBG(VioletA, VioletB, "395px");

const PrettyLink = styled.div`
  color: hsl(230, 15%, 90%);
  .greyed {
    color: hsl(230, 15%, 65%);
  }
  a {
    color: hsl(230, 15%, 90%);
    text-decoration: dotted underline;
    &:hover {
      text-decoration: solid underline;
    }
  }
  &.clickable {
    cursor: pointer;
    &:hover {
      text-decoration: dotted underline;
      text-decoration-thickness: 1px;
    }
  }
`;

const Volt5InfoContainer = styled.div`
  width: 100%;
  position: absolute;
  top: 100px;
`;

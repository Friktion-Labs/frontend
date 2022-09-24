import { Card09Props } from "09/Card10";
import { apyFromData } from "09/YieldTooltip";
import { ColumnsType } from "antd/lib/table";
import getCardStats, { getYourDeposits } from "common/utils/getCardStats";
import { formatUSDCentsRoundNearest, formatUSDRoundDown } from "09/format09";
import { Typography } from "common/components/Typography";
import { css } from "@emotion/react";
import { getVoltBar } from "09/glow09";
import { ProgressBar } from "components/ProgressBar";
import Decimal from "decimal.js";
import { ImportantAssetLogos } from "09/greatLogos/assetLogos";
import { AssetLogoPair } from "features/volts-pages/components/AssetLogoPair";
import { Button } from "common/components/Button";
import { GlobalId } from "09/registry10";
import { useAppWallet } from "features/wallet";
import { YieldDataForVolt } from "09/AuctionResults";

export const getVoltColumns: (
  winRateMap: Record<GlobalId, string | null>,
  yieldDataPerVolt: Record<GlobalId, YieldDataForVolt | null>
) => ColumnsType<Card09Props> = (winRateMap, yieldDataPerVolt) => [
  {
    title: "ASSET",
    key: "asset",
    render: (_, card) => {
      return (
        <div
          css={css`
            display: flex;
            gap: 12px;
            align-items: center;
          `}
        >
          <AssetLogo card={card} />
          <Typography
            variant="bodyM"
            css={css`
              font-weight: 600;
            `}
          >
            {card.underlyingAssetSymbol}
          </Typography>
        </div>
      );
    },
  },
  {
    title: "APY",
    key: "apy",
    render: (_, { def, data }) => {
      const yieldData = def ? yieldDataPerVolt[def.globalId] : null;
      return (
        <Typography variant="bodyM">
          {apyFromData(data, yieldData ? yieldData.averagedEpochYield : null)}
        </Typography>
      );
    },
  },
  {
    title: "CAPACITY",
    key: "capacity",
    render: (_, card) => <Capacity card={card} />,
  },
  {
    title: "WIN RATE",
    key: "winRate",
    render: (_, card) => {
      return (
        <Typography variant="bodyM">
          {card.def
            ? winRateMap[card.def.globalId] !== null
              ? winRateMap[card.def.globalId]
              : "-"
            : "-"}
        </Typography>
      );
    },
  },
  {
    title: "YOUR DEPOSITS",
    key: "yourDeposits",
    render: (_, card) => <YourDeposits card={card} />,
  },
  {
    title: "ACTION",
    key: "action",
    width: "175px",
    render: (_, card) => {
      const yourDeposits = getYourDeposits(card);

      return (
        <Button
          css={css`
            padding-top: 6px;
            padding-bottom: 6px;
            z-index: 2 !important;
            min-height: 30px;
          `}
          voltNumber={card.volt}
          // no longer do this bc click on anywhere on row to open modal
          // onClick={() => {
          //   if (card.def) {
          //     openModal(card.def.globalId);
          //   }
          // }}
          variant={
            !!yourDeposits && yourDeposits.greaterThan(new Decimal(0))
              ? "primary"
              : "outline-primary"
          }
        >
          {!!yourDeposits
            ? yourDeposits.greaterThan(new Decimal(0))
              ? "Manage"
              : "Deposit"
            : "Deposit"}
        </Button>
      );
    },
  },
];

interface WithCardProps {
  card: Card09Props;
}

const Capacity = ({ card }: WithCardProps) => {
  const { totalDepositsUSD, capacityFilledPercent } = getCardStats(card);
  const GlowBar = getVoltBar(card.volt);
  const totalContributions = totalDepositsUSD
    ? formatUSDRoundDown(totalDepositsUSD)
    : "";
  const percentage = capacityFilledPercent.toFixed() + "%";

  return (
    <div
      css={css`
        width: 180px;
      `}
    >
      <div
        css={css`
          display: flex;
          flex-direction: row;
          margin-bottom: 6px;
          visibility: ${totalDepositsUSD ? "visible" : "hidden"};
          justify-content: space-between;
        `}
      >
        <Typography
          css={css`
            font-size: 14px;
          `}
        >
          {totalContributions}
        </Typography>
        <Typography
          css={css`
            font-size: 14px;
          `}
        >{`(${percentage})`}</Typography>
      </div>

      <ProgressBar
        barComponent={<GlowBar />}
        currentProgress={capacityFilledPercent}
        progressHeight={4}
      />
    </div>
  );
};

const YourDeposits = ({ card }: WithCardProps) => {
  const wallet = useAppWallet();
  const yourDeposits = getYourDeposits(card);

  return (
    <Typography variant="bodyS">
      {!wallet
        ? "-"
        : yourDeposits
        ? formatUSDCentsRoundNearest(yourDeposits)
        : "..."}
    </Typography>
  );
};

const AssetLogo = ({ card }: WithCardProps) => {
  if (card.volt === 1) {
    return (
      <img
        src={ImportantAssetLogos[card.underlyingAssetSymbol]}
        alt={`${card.underlyingAssetSymbol} logo`}
        width="24px"
        height="24px"
      />
    );
  } else {
    return (
      <AssetLogoPair
        css={css`
          width: fit-content;
          display: flex;
        `}
        LeftImgProps={{
          width: "24px",
          height: "24px",
        }}
        RightImgProps={{
          width: "24px",
          height: "24px",
          css: css`
            margin-left: -6px;
          `,
        }}
        card={card}
      />
    );
  }
};

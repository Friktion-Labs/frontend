import { useAuctionResults } from "09/AuctionResults";
import { Card09Props } from "09/Card10";
import { ImportantAssetLogos } from "09/greatLogos/assetLogos";
import { AllSymbolsUnion, VoltNumber } from "09/registry10";
import { useQuarantineChristmas10VFACWarningOnlyWorksWithCoveredCalls } from "09/useChristmasCard10";
import { apyFromData } from "09/YieldTooltip";
import { voltageDefAdjustedCards } from "common/utils/voltageDefAdjustedCards";
import { useMemo } from "react";

const getNumberFromApyWithPercentSign = (apyWithPercentSign: string) =>
  +apyWithPercentSign.slice(0, apyWithPercentSign.length - 2);

export interface ValidIcon {
  src: string;
  card: Card09Props;
}

export const useVoltMeanApyAndIcons = (voltNumber: VoltNumber) => {
  const vfac09 = useQuarantineChristmas10VFACWarningOnlyWorksWithCoveredCalls();
  const { yieldDataPerVolt } = useAuctionResults();
  const cards = useMemo(
    () => voltageDefAdjustedCards(vfac09.cards, yieldDataPerVolt, voltNumber),
    [vfac09, voltNumber, yieldDataPerVolt]
  );

  const apyByAsset = cards.reduce((acc, card) => {
    const data = card.data;
    const yieldData = card.def ? yieldDataPerVolt[card.def.globalId] : null;
    acc[card.underlyingAssetSymbol] = !data
      ? undefined
      : apyFromData(data, yieldData ? yieldData.averagedEpochYield : null);
    return acc;
  }, {} as Record<AllSymbolsUnion, string | undefined>);

  const totalApy = useMemo(
    () =>
      cards.reduce<"..." | number>((acc, curr) => {
        const data = curr.data;
        if (acc === "..." || !data) {
          return "...";
        }
        const yieldData = curr.def ? yieldDataPerVolt[curr.def.globalId] : null;
        const apyWithPercentSign = apyFromData(
          data,
          yieldData ? yieldData.averagedEpochYield : null
        );
        const apyNumber = getNumberFromApyWithPercentSign(apyWithPercentSign);
        const highVoltageYieldData = curr.highVoltageDef
          ? yieldDataPerVolt[curr.highVoltageDef.globalId]
          : null;
        const highVoltageApy = curr.highVoltageData
          ? getNumberFromApyWithPercentSign(
              apyFromData(
                curr.highVoltageData,
                highVoltageYieldData
                  ? highVoltageYieldData.averagedEpochYield
                  : null
              )
            )
          : 0;
        return acc + apyNumber + highVoltageApy;
      }, 0),
    [cards, yieldDataPerVolt]
  );

  const voltsCount = useMemo(
    () =>
      cards.reduce<number>(
        (acc, curr) => acc + (curr.highVoltageData ? 2 : 1),
        0
      ),
    [cards]
  );
  const meanApy = useMemo(
    () => (totalApy === "..." ? totalApy : Math.floor(totalApy / voltsCount)),
    [totalApy, voltsCount]
  );

  const allValidIcons: ValidIcon[] = cards
    .filter(
      (card, i, cards) =>
        // remove duplicates and remove LUNA
        cards.findIndex(
          (c) => card.underlyingAssetSymbol === c.underlyingAssetSymbol
        ) === i && card.underlyingAssetSymbol !== "LUNA"
    )
    .map((card) => ({
      src: ImportantAssetLogos[card.underlyingAssetSymbol],
      card,
    }));

  return { allValidIcons, meanApy, cards, apyByAsset };
};

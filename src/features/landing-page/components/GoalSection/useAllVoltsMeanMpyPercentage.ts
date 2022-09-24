import { useAuctionResults } from "09/AuctionResults";
import { EpochYield } from "09/registry10";
import { useQuarantineChristmas10VFACWarningOnlyWorksWithCoveredCalls } from "09/useChristmasCard10";
import { voltageDefAdjustedCards } from "common/utils/voltageDefAdjustedCards";
import { useMemo } from "react";

const getMpy = (yieldForExtrapolation: EpochYield) =>
  (Math.pow(
    1 +
      (yieldForExtrapolation.epochYield / yieldForExtrapolation.epochLength) *
        (7 * 86400),
    4.3481428571
  ) -
    1) *
  100;

const getMpyFromApy = (apy: number) => {
  const epochYieldDividedByEpochLength = Math.pow(apy / 100 + 1, 7 / 365.2422);
  return (Math.pow(epochYieldDividedByEpochLength, 4.3481428571) - 1) * 100;
};

export const useAllVoltsMeanMpyPercentage = () => {
  const vfac09 = useQuarantineChristmas10VFACWarningOnlyWorksWithCoveredCalls();
  const { yieldDataPerVolt } = useAuctionResults();
  const cards = useMemo(
    () => voltageDefAdjustedCards(vfac09.cards, yieldDataPerVolt),
    [vfac09, yieldDataPerVolt]
  );
  const totalMpy = useMemo(
    () =>
      cards.reduce<undefined | number>((acc, curr) => {
        const data = curr.data;
        if (acc === undefined || !data) {
          return undefined;
        }

        const yieldData = yieldDataPerVolt[curr.def.globalId];
        const latestEpochYield = yieldData ? yieldData.latestEpochYield : null;
        const averagedEpochYield = yieldData
          ? yieldData.averagedEpochYield
          : null;

        const yieldForExtrapolation = averagedEpochYield ?? latestEpochYield;
        const mpy = !yieldForExtrapolation
          ? getMpyFromApy(data.apy)
          : getMpy(yieldForExtrapolation);

        let highVoltageCardYieldData = curr.highVoltageDef
          ? yieldDataPerVolt[curr.highVoltageDef.globalId]
          : null;
        const highVoltageLatestEpochYield = highVoltageCardYieldData
          ? highVoltageCardYieldData.latestEpochYield
          : null;
        const highVoltageAveragedEpochYield = highVoltageCardYieldData
          ? highVoltageCardYieldData.averagedEpochYield
          : null;
        const highVoltageYieldForExtraPolation = !curr.highVoltageData
          ? undefined
          : highVoltageAveragedEpochYield ?? highVoltageLatestEpochYield;
        const highVoltageMpy =
          highVoltageYieldForExtraPolation === undefined
            ? 0
            : highVoltageYieldForExtraPolation === null
            ? getMpyFromApy(curr.highVoltageData?.apy ?? 0)
            : getMpy(highVoltageYieldForExtraPolation);

        return acc + mpy + highVoltageMpy;
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

  const meanMpy = useMemo(
    () => (totalMpy === undefined ? totalMpy : totalMpy / voltsCount),
    [totalMpy, voltsCount]
  );

  return meanMpy;
};

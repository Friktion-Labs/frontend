import { useAppConnection } from "features/connection";
import React, { createContext, useContext, useMemo } from "react";
import {
  ALWAYS_GLOBALID_TO_NULL,
  GlobalId,
  newGlobalIdToNull,
  STRONG_SUBVOLTS,
} from "./registry10";
import { useMarkPrices } from "./MarkPrices10";
import { useAllQuarries } from "./quarryUtils";

export type QuarryDataType = {
  /**
   * Non-compounded Daily Percentage Rate in percent (1 day = 86400 seconds).
   * So 25.5% APR would be Number(0.0698630137)
   */
  quarryData: Record<GlobalId, number | null>;
};

export const QuarryDataContext = createContext<QuarryDataType>({
  quarryData: ALWAYS_GLOBALID_TO_NULL,
});

export const QuarryDataProvider: React.FC<{ children: any }> = ({
  children,
}) => {
  const { network } = useAppConnection();
  const { markPrices: markPricesImpreciseNumber } = useMarkPrices();

  const quarries = useAllQuarries();

  const loadedData = useMemo(() => {
    if (!markPricesImpreciseNumber || !quarries) {
      return;
    }

    const resultingLoadedData: Record<GlobalId, number | null> =
      newGlobalIdToNull();

    for (const def of Object.values(STRONG_SUBVOLTS)) {
      if (network === def.network) {
        let quarryDPR: number | null = null;
        const quarry = quarries[def.globalId];
        if (def.quarrySingleMine && quarry) {
          const normalizedDailyRewardRate = def.quarrySingleMine.realRewardToken
            .normalize(quarry.accountInfo.data.annualRewardsRate)
            .div(365)
            .toNumber();
          const normalizedTotalStaked = def.depositToken
            .normalize(quarry.accountInfo.data.totalTokensDeposited)
            .toNumber();
          const yieldUnitPrice =
            markPricesImpreciseNumber[
              def.quarrySingleMine.realRewardToken.symbol
            ];
          const stakedTokenUnitPrice =
            markPricesImpreciseNumber[def.depositToken.symbol];

          quarryDPR =
            ((yieldUnitPrice * normalizedDailyRewardRate) /
              (stakedTokenUnitPrice * normalizedTotalStaked)) *
            100;
        }

        resultingLoadedData[def.globalId] = quarryDPR;
      }
    }

    if (Object.values(resultingLoadedData).every((d) => d === null)) {
      return ALWAYS_GLOBALID_TO_NULL;
    }
    return resultingLoadedData;
  }, [markPricesImpreciseNumber, quarries, network]);

  const finalLoadedData = loadedData ?? ALWAYS_GLOBALID_TO_NULL;

  const contextResult = useMemo(() => {
    return {
      quarryData: finalLoadedData,
    };
  }, [finalLoadedData]);

  return (
    <QuarryDataContext.Provider value={contextResult}>
      {children}
    </QuarryDataContext.Provider>
  );
};
export const useQuarryData = () => useContext(QuarryDataContext);

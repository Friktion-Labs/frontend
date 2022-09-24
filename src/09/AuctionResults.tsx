import { useAppConnection } from "features/connection";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  ALWAYS_GLOBALID_TO_NULL,
  EpochRow,
  EpochYield,
  GlobalId,
  OptionProduct,
  newGlobalIdToNull,
  STRONG_SUBVOLTS,
  getLatestEpochYield,
  getAveragedEpochYield,
} from "./registry10";

export type YieldDataForVolt = {
  latestEpochYield: EpochYield | null;
  averagedEpochYield: EpochYield | null;
  lastTradedOption: { product: OptionProduct } | null;
};

type UseAuctionResultsType = {
  auctionData: EpochRow[] | null;
  yieldDataPerVolt: Record<GlobalId, YieldDataForVolt | null>;
  cumulativeVolume: number | null;
  cumulativePremium: number | null;
};
const AuctionResultsContext = createContext<UseAuctionResultsType>({
  auctionData: null,
  yieldDataPerVolt: ALWAYS_GLOBALID_TO_NULL,
  cumulativeVolume: null,
  cumulativePremium: null,
});

interface Props {
  children?: React.ReactNode;
}

const AuctionResultsProvider: React.FC<Props> = ({ children }) => {
  const { network } = useAppConnection();
  const [attempt, setAttempt] = useState(0);
  const [lastSuccess, setLastSuccess] = useState(0);
  const [auctionData, setAuctionData] = useState<EpochRow[] | null>(null);
  const [yieldDataPerVolt, setYieldDataPerVolt] = useState<
    Record<GlobalId, YieldDataForVolt | null>
  >(newGlobalIdToNull());
  const [cumulativeVolume, setCumulativeVolume] = useState<number | null>(null);
  const [cumulativePremium, setCumulativePremium] = useState<number | null>(
    null
  );

  useEffect(() => {
    const timer = setTimeout(
      async () => {
        if (attempt > 0) {
          console.log(`Fetching auction results data attempt #${attempt}`);
        }

        let success = false;

        try {
          const response = await fetch(
            "https://api.friktion.fi/auction_results",
            {
              mode: "cors",
            }
          );
          if (response.status === 200) {
            const data = await response.json();
            success = true;
            const resultData = data as EpochRow[];

            let cumulativeVolumeInternal = 0;
            let cumulativePremiumInternal = 0;
            // let cumulativeLossInternal = 0;
            resultData.forEach((row) => {
              const adjustment = row.globalId.includes("income_put")
                ? 1
                : 1 * row.spotPriceAtAuctionEnd;
              const volumeForRow = row.balanceStart * adjustment;
              if (row.endEpoch * 1000 < Date.now()) {
                cumulativeVolumeInternal += volumeForRow;
                if (row.realizedPnl > 0) {
                  cumulativePremiumInternal += row.balancePnl * adjustment;
                } else {
                  // cumulativeLossInternal -= row.realizedPnl * adjustment;
                }
              } else {
                // console.log(volumeForRow);
              }
            });

            /**
             * rounded down to whole number
             */
            setCumulativeVolume(Math.floor(cumulativeVolumeInternal));
            setCumulativePremium(Math.floor(cumulativePremiumInternal));

            setAuctionData(resultData);

            const newYieldDataPerVolt: Record<
              GlobalId,
              YieldDataForVolt | null
            > = newGlobalIdToNull();

            for (const def of Object.values(STRONG_SUBVOLTS)) {
              let yieldData = null;
              if (network === def.network) {
                const latestEpochYield = getLatestEpochYield(
                  resultData,
                  def.globalId
                );
                const averagedEpochYield = getAveragedEpochYield(
                  resultData,
                  def.globalId
                );
                const lastTradedOption = resultData.find(
                  (row) => row.globalId === def.globalId
                );

                yieldData = {
                  latestEpochYield,
                  averagedEpochYield,
                  lastTradedOption: lastTradedOption
                    ? {
                        product: lastTradedOption.product,
                      }
                    : null,
                };
              }

              newYieldDataPerVolt[def.globalId] = yieldData;
            }
            setYieldDataPerVolt(newYieldDataPerVolt);

            setLastSuccess(Date.now());
          }
        } catch (e) {
          console.log("Error fetching auction data: ", e);
        }

        if (!success) {
          setAttempt((oldAttempt) => (oldAttempt < 0 ? 0 : attempt + 1));
        }
      },
      attempt <= 1 ? 0 : attempt <= 8 ? 500 : 5000
    );
    return () => clearTimeout(timer);
  }, [attempt, network]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (lastSuccess !== 0) {
        setAttempt((oldAttempt) => {
          if (oldAttempt <= 0) {
            return oldAttempt - 2;
          } else {
            return 0;
          }
        });
      }
    }, 60_000);
    return () => clearTimeout(timer);
  }, [lastSuccess]);

  return (
    <AuctionResultsContext.Provider
      value={{
        auctionData,
        yieldDataPerVolt,
        cumulativeVolume,
        cumulativePremium,
      }}
    >
      {children}
    </AuctionResultsContext.Provider>
  );
};
const useAuctionResults = () => useContext(AuctionResultsContext);
export { AuctionResultsContext, AuctionResultsProvider, useAuctionResults };

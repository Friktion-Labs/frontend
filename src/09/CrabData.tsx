import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AllEntropySymbolsUnion, CrabVoltData } from "./registry10";
import { useCondomOfEquality } from "./superCondom";

export type PerpData = {
  group: string;
  market: string;
};

export type EntropyDataPoint = {
  delta: number;
  iv: number;
  refPrice: number;
  profitRangeLow: number;
  profitRangeHigh: number;
  funding24h: number;
};

export const entropyPerpsConversionReal: Record<
  AllEntropySymbolsUnion,
  PerpData
> = {
  BTC: {
    group: "mainnet.2",
    market: "BTC^2-PERP",
  },
} as const;

type UseCrabDataType = {
  crabVoltData: Record<AllEntropySymbolsUnion, CrabVoltData> | null;
};
const CrabDataContext = createContext<UseCrabDataType>({
  crabVoltData: null,
});

interface Props {
  children?: React.ReactNode;
}

const CrabDataProvider: React.FC<Props> = ({ children }) => {
  const [attempt, setAttempt] = useState(0);
  const [lastSuccess, setLastSuccess] = useState(0);

  const [entropyData, setEntropyData] = useState<Record<
    AllEntropySymbolsUnion,
    EntropyDataPoint
  > | null>();

  useEffect(() => {
    const timer = setTimeout(
      async () => {
        if (attempt > 0) {
          console.log(`Fetching entropy data attempt #${attempt}`);
        }

        let success = false;
        let newEntropyData = {} as Record<
          AllEntropySymbolsUnion,
          EntropyDataPoint
        >;

        for (const [key, value] of Object.entries(entropyPerpsConversionReal)) {
          try {
            const response = await fetch(
              `https://stats.entropy.trade/volt03?market=${key}`,
              {
                mode: "cors",
              }
            );
            if (response.status === 200) {
              const data = await response.json();
              success = true;
              const resultData = data as EntropyDataPoint;
              newEntropyData[key as AllEntropySymbolsUnion] = resultData;
              setLastSuccess(Date.now());
            }
          } catch (e) {
            console.log("Error fetching stats: ", e, value);
          }
        }
        setEntropyData(newEntropyData);

        if (!success) {
          setAttempt((oldAttempt) => (oldAttempt < 0 ? 0 : attempt + 1));
        }
      },
      attempt <= 1 ? 0 : attempt <= 8 ? 500 : 5000
    );
    return () => clearTimeout(timer);
  }, [attempt]);

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

  const filteredFullResult = useCondomOfEquality(
    useMemo(() => {
      let result = null;

      if (entropyData) {
        result = Object.fromEntries(
          Object.entries(entropyPerpsConversionReal).map(([key, value]) => {
            const data = entropyData[key as AllEntropySymbolsUnion];
            if (!data) {
              return [
                key,
                {
                  delta: null,
                  profitRangeLow: null,
                  profitRangeHigh: null,
                  dailyFundingRate: null,
                  impliedVolatility: null,
                  collateralRatio: 200,
                  liquidationThreshold: 161.245,
                  lastRebalanceTime: 0,
                },
              ];
            }

            // transform entropyData to crabVoltData
            const profitRangeLow = data.profitRangeLow;
            const profitRangeHigh = data.profitRangeHigh;
            const dailyFundingRate = data.funding24h * 100;
            const delta = data.delta * 100;
            const impliedVolatility = data.iv;

            return [
              key,
              {
                delta,
                profitRangeLow,
                profitRangeHigh,
                dailyFundingRate,
                impliedVolatility,
                collateralRatio: 200,
                liquidationThreshold: 161.245,
                lastRebalanceTime: 0,
              },
            ];
          })
        ) as Record<AllEntropySymbolsUnion, CrabVoltData>;
      }

      let fullResult: UseCrabDataType = {
        crabVoltData: null,
      };
      if (result) {
        fullResult = {
          crabVoltData: result,
        };
      }

      return fullResult;
    }, [entropyData])
  );
  return (
    <CrabDataContext.Provider value={filteredFullResult}>
      {children}
    </CrabDataContext.Provider>
  );
};
const useCrabData = () => useContext(CrabDataContext);
export { CrabDataContext, CrabDataProvider, useCrabData };

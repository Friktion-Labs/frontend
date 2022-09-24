import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AllBasisSymbols,
  AllBasisSymbolsUnion,
  BasisVoltData,
} from "./registry10";
import { useCondomOfEquality } from "./superCondom";

export type BasisDataPoint = {
  apy: number;
  leverageRatio: number;
  borrowInterest: number;
  supplyInterest: number;
  funding: number;
  millis: number;
};

type UseBasisDataType = {
  basisVoltData: Record<AllBasisSymbolsUnion, BasisVoltData> | null;
};
const BasisDataContext = createContext<UseBasisDataType>({
  basisVoltData: null,
});

interface Props {
  children?: React.ReactNode;
}

const BasisDataProvider: React.FC<Props> = ({ children }) => {
  const [attempt, setAttempt] = useState(0);
  const [lastSuccess, setLastSuccess] = useState(0);

  const [basisData, setBasisData] = useState<Record<
    AllBasisSymbolsUnion,
    BasisDataPoint
  > | null>();

  useEffect(() => {
    const timer = setTimeout(
      async () => {
        if (attempt > 0) {
          console.log(`Fetching entropy data attempt #${attempt}`);
        }

        let success = false;
        let newBasisData = {} as Record<AllBasisSymbolsUnion, BasisDataPoint>;

        for (const symbol of AllBasisSymbols) {
          try {
            const response = await fetch(
              `https://stats.entropy.trade/volt04?symbol=${symbol}`,
              {
                mode: "cors",
              }
            );
            if (response.status === 200) {
              const data = await response.json();
              success = true;
              const resultData = data as BasisDataPoint;
              newBasisData[symbol] = resultData;
              setLastSuccess(Date.now());
            }
          } catch (e) {
            console.log("Error fetching basis stats: ", e, symbol);
          }
        }
        setBasisData(newBasisData);

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

      if (basisData) {
        result = Object.fromEntries(
          AllBasisSymbols.map((symbol) => {
            const data = basisData[symbol as AllBasisSymbolsUnion];
            if (!data) {
              return [
                symbol,
                {
                  apy: null,
                  leverageRatio: null,
                  borrowInterest: null,
                  supplyInterest: null,
                  funding: null,
                },
              ];
            }

            // transform basisData to basisVoltData
            const apy = data.apy;
            const leverageRatio = data.leverageRatio;
            const borrowInterest = data.borrowInterest;
            const supplyInterest = data.supplyInterest;
            const funding = data.funding;

            return [
              symbol,
              {
                apy,
                leverageRatio,
                borrowInterest,
                supplyInterest,
                funding,
              },
            ];
          })
        ) as Record<AllBasisSymbolsUnion, BasisVoltData>;
      }

      let fullResult: UseBasisDataType = {
        basisVoltData: null,
      };
      if (result) {
        fullResult = {
          basisVoltData: result,
        };
      }

      return fullResult;
    }, [basisData])
  );
  return (
    <BasisDataContext.Provider value={filteredFullResult}>
      {children}
    </BasisDataContext.Provider>
  );
};
const useBasisData = () => useContext(BasisDataContext);
export { BasisDataContext, BasisDataProvider, useBasisData };

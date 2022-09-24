import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AllProtectionVoltGlobalIds,
  AllProtectionVoltGlobalIdsUnion,
} from "./registry10";
import { useCondomOfEquality } from "./superCondom";

export type ProtectionRawDataPoint = {
  apy: number;
  lending_apy: number;
  options_apy: number;
};

export type ProtectionDataPoint = {
  apy: number | null;
  lendingApy: number | null;
  optionsApy: number | null;
};

type UseProtectionDataType = {
  protectionVoltData: Record<
    AllProtectionVoltGlobalIdsUnion,
    ProtectionDataPoint
  > | null;
};
const ProtectionDataContext = createContext<UseProtectionDataType>({
  protectionVoltData: null,
});

interface Props {
  children?: React.ReactNode;
}

const ProtectionDataProvider: React.FC<Props> = ({ children }) => {
  const [attempt, setAttempt] = useState(0);
  const [lastSuccess, setLastSuccess] = useState(0);

  const [protectionData, setProtectionData] = useState<Record<
    AllProtectionVoltGlobalIdsUnion,
    ProtectionRawDataPoint
  > | null>();

  useEffect(() => {
    const timer = setTimeout(
      async () => {
        if (attempt > 0) {
          console.log(`Fetching entropy data attempt #${attempt}`);
        }

        let success = false;
        let newProtectionData = {} as Record<
          AllProtectionVoltGlobalIdsUnion,
          ProtectionRawDataPoint
        >;

        for (const globalId of AllProtectionVoltGlobalIds) {
          try {
            const response = await fetch(
              `https://api.friktion.fi/volt05?globalId=${globalId}`,
              {
                mode: "cors",
              }
            );
            if (response.status === 200) {
              const data = await response.json();
              success = true;
              const resultData = data as ProtectionRawDataPoint;
              newProtectionData[globalId] = resultData;
              setLastSuccess(Date.now());
            }
          } catch (e) {
            console.log("Error fetching protection volt stats: ", e, globalId);
          }
        }
        setProtectionData(newProtectionData);

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

      if (protectionData) {
        result = Object.fromEntries(
          AllProtectionVoltGlobalIds.map((globalId) => {
            const data =
              protectionData[globalId as AllProtectionVoltGlobalIdsUnion];
            if (!data) {
              return [
                globalId,
                {
                  apy: null,
                  lendingApy: null,
                  optionsApy: null,
                },
              ];
            }

            // transform protectionData to protectionVoltData
            const apy = data.apy;
            const lendingApy = data.lending_apy;
            const optionsApy = data.options_apy;

            return [
              globalId,
              {
                apy,
                lendingApy,
                optionsApy,
              },
            ];
          })
        ) as Record<AllProtectionVoltGlobalIdsUnion, ProtectionDataPoint>;
      }

      let fullResult: UseProtectionDataType = {
        protectionVoltData: null,
      };
      if (result) {
        fullResult = {
          protectionVoltData: result,
        };
      }

      return fullResult;
    }, [protectionData])
  );
  return (
    <ProtectionDataContext.Provider value={filteredFullResult}>
      {children}
    </ProtectionDataContext.Provider>
  );
};
const useProtectionData = () => useContext(ProtectionDataContext);
export { ProtectionDataContext, ProtectionDataProvider, useProtectionData };

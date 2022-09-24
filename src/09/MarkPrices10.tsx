import { Decimal } from "decimal.js";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AllSymbolsUnion, UltraToken } from "./registry10";
import { useCondomOfEquality } from "./superCondom";

export const coingeckoConversionReal: Record<AllSymbolsUnion, string> = {
  BTC: "bitcoin",
  SOL: "solana",
  ETH: "ethereum",
  mSOL: "msol",
  FTT: "ftx-token",
  SAMO: "samoyedcoin",
  NEAR: "near",
  SRM: "serum",
  USDC: "usd-coin",
  tsUSDC: "usd-coin",
  PAI: "usd-coin",
  UXD: "usd-coin",
  MNGO: "mango-markets",
  MNDE: "marinade",
  scnSOL: "socean-staked-sol",
  SBR: "saber",
  LUNA: "terra-luna",
  UST: "terrausd",
  RAY: "raydium",
  STEP: "step-finance",
  stSOL: "lido-staked-sol",
  AVAX: "avalanche-2",
} as const;

export const coingeckoConversionWithUsd = {
  ...coingeckoConversionReal,
  USDC: 1,
} as const;

export const isStablecoin = (symbol: AllSymbolsUnion | UltraToken) => {
  if (symbol instanceof UltraToken) {
    symbol = symbol.symbol;
  }
  if (coingeckoConversionWithUsd[symbol] === 1) {
    return true;
  }
};

// Check that coingeckoConversion is correct
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const coingeckoTypecheck: Record<AllSymbolsUnion, string | 1> =
  coingeckoConversionReal;

type UseMarkPricesType = {
  markPrices: Record<AllSymbolsUnion, number> | null;
  markPricesDecimal: Record<AllSymbolsUnion, Decimal> | null;
};
const MarkPrices10Context = createContext<UseMarkPricesType>({
  markPrices: null,
  markPricesDecimal: null,
});

type AllCoingeckoIds = Exclude<
  typeof coingeckoConversionWithUsd[keyof typeof coingeckoConversionWithUsd],
  1
>;

const coingeckoIds: AllCoingeckoIds[] = Object.values(
  coingeckoConversionWithUsd
).filter((id) => id !== 1) as AllCoingeckoIds[];

const coingeckoPath = `/api/v3/simple/price?ids=${coingeckoIds.join(
  "%2C"
)}&vs_currencies=usd&`;
const coingeckoUrl = `https://api.coingecko.com${coingeckoPath}`;
// https://github.com/Friktion-Labs/coingecko.friktion.workers.dev
// CNAME is not enough. You must also do Workers -> Trigger -> Add Route
const altCoingeckoUrl = `https://coingecko.friktion.fi${coingeckoPath}`;

// An example of coingeckoData
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const exampleCoingeckoData = {
  msol: { usd: 190.62 },
  solana: { usd: 187.02 },
  bitcoin: { usd: 49377 },
  ethereum: { usd: 4046.81 },
};

interface Props {
  children?: React.ReactNode;
}

/**
 * markPrices is a mapping from def.underlyingSymbol (which is of type AllSymbolsUnion) to JavaScript number.
 * markPricesDecimal is a mapping from def.underlyingSymbol (which is of type AllSymbolsUnion) to Decimal.
 */
const MarkPrices10Provider: React.FC<Props> = ({ children }) => {
  const [attempt, setAttempt] = useState(0);
  const [lastSuccess, setLastSuccess] = useState(0);

  const [coingeckoData, setCoingeckoData] = useState<Record<
    AllCoingeckoIds,
    { usd: number }
  > | null>();

  useEffect(() => {
    const timer = setTimeout(
      async () => {
        let url = coingeckoUrl;
        if (attempt % 2 === 1 && attempt > 0) {
          url = altCoingeckoUrl;
        }
        if (attempt > 0) {
          console.log(`Fetching coingecko attempt #${attempt}: ${url}`);
        }

        let success = false;
        try {
          const response = await fetch(url, { mode: "cors" });
          if (response.status === 200) {
            const data = await response.json();
            if (data && typeof data === "object") {
              for (const [key, value] of Object.entries(data)) {
                if (
                  !(
                    value &&
                    typeof value === "object" &&
                    value.hasOwnProperty("usd")
                  )
                ) {
                  throw new Error("Missing usd in " + key);
                }
              }
              success = true;
              const resultData = data as typeof coingeckoData;
              setCoingeckoData(resultData);

              setLastSuccess(Date.now());

              // console.log("Success!", resultData);
            }
          }
        } catch (e) {
          console.error(e);
        }

        if (!success) {
          setAttempt((oldAttempt) => (oldAttempt < 0 ? 0 : attempt + 1));
          // console.log("Setting attempt");
        }
      },
      attempt <= 1 ? 0 : attempt <= 8 ? 500 : 5000
    );
    return () => clearTimeout(timer);
  }, [attempt]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (lastSuccess !== 0) {
        // console.log("Setting attempt!");
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
      let resultDecimal = null;
      let result = null;

      if (coingeckoData) {
        result = Object.fromEntries(
          Object.entries(coingeckoConversionWithUsd).map(([key, value]) => {
            if (value === 1) {
              return [key, 1];
            }
            if (!coingeckoData[value]) {
              console.error(coingeckoData);
              throw new Error(
                "Missing coin " + key + " in coingecko data response"
              );
            }
            return [key, coingeckoData[value].usd];
          })
        ) as Record<AllSymbolsUnion, number>;
      }

      let fullResult: UseMarkPricesType = {
        markPrices: null,
        markPricesDecimal: null,
      };
      if (result) {
        resultDecimal = Object.fromEntries(
          Object.entries(result).map(([key, value]) => [
            key,
            new Decimal(value),
          ])
        ) as Record<AllSymbolsUnion, Decimal>;
        fullResult = {
          markPrices: result,
          markPricesDecimal: resultDecimal,
        };
      }

      return fullResult;
    }, [coingeckoData])
  );
  return (
    <MarkPrices10Context.Provider value={filteredFullResult}>
      {children}
    </MarkPrices10Context.Provider>
  );
};
const useMarkPrices = () => useContext(MarkPrices10Context);
export { MarkPrices10Context, MarkPrices10Provider, useMarkPrices };

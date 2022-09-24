import { useMarkPrices } from "09/MarkPrices10";
import { useQuarantineChristmas10VFACWarningOnlyWorksWithCoveredCalls } from "09/useChristmasCard10";
import { useEffect, useState } from "react";
import { formatUSDAdaptable } from "09/format09";

export const useTotalDepositedValue = () => {
  const vfac09 = useQuarantineChristmas10VFACWarningOnlyWorksWithCoveredCalls();
  const { markPricesDecimal } = useMarkPrices();

  const [totalDepositedValue, setTotalDepositedValue] = useState("...");

  useEffect(() => {
    if (vfac09.cards && vfac09 && markPricesDecimal) {
      const totalDepositedValue = vfac09.cards.reduce<number | undefined>(
        (acc, card) => {
          if (acc !== undefined && card.def && card.deposits) {
            return (
              acc +
              markPricesDecimal[card.def.depositToken.symbol]
                .mul(card.deposits.totalDeposits)
                .toNumber()
            );
          }

          return undefined;
        },
        0
      );

      if (totalDepositedValue !== undefined) {
        setTotalDepositedValue(formatUSDAdaptable(totalDepositedValue));
      }
    }
  }, [vfac09, markPricesDecimal]);

  return totalDepositedValue;
};

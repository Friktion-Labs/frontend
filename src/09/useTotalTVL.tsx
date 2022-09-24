import { useMemo } from "react";
import { useSubvoltLoader } from "./SubvoltLoader10";
import { Decimal } from "decimal.js";
import {
  DEVNET_PRE_CARD_REGISTRY_VOLT1,
  MAINNET_PRE_CARD_REGISTRY_VOLT1,
} from "./registry09";
import { useAppConnection } from "features/connection";

/**
 * useTotalTVLLocked will give us the Total TVL up in Friktion.
 *
 * That is, it gives us the value of total total value locked
 */
export const useTotalTVL = () => {
  const { loadedData } = useSubvoltLoader();
  const { network } = useAppConnection();

  const totalTVLNumber: Decimal | null = useMemo(() => {
    let result = new Decimal(0);
    for (const partialCard09 of network === "mainnet-beta"
      ? MAINNET_PRE_CARD_REGISTRY_VOLT1
      : DEVNET_PRE_CARD_REGISTRY_VOLT1) {
      const def = partialCard09.def;
      if (def) {
        result = result.plus(loadedData[def.globalId]?.totalDepositsUSD ?? 0);
      }
    }
    return result;
  }, [loadedData, network]);

  return totalTVLNumber?.toNumber();
};

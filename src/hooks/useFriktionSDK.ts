import { useProviders } from "./useProvider";
import { FriktionSDK } from "@friktion-labs/friktion-sdk";
import { useMemo } from "react";
import { useAppConnection } from "features/connection";

/**
 * Gets the Friktion SDK
 */
export const useFriktionSDK = (): FriktionSDK => {
  const { readonlyProvider } = useProviders();
  const { network } = useAppConnection();

  const sdk = useMemo(() => {
    return new FriktionSDK({
      provider: readonlyProvider,
      network: network,
    });
  }, [network, readonlyProvider]);

  return sdk;
};

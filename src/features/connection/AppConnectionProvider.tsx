import { useCallback, useState, ReactNode, useEffect } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { Connection } from "@solana/web3.js";
import { AppConnectionContext } from "./useAppConnection";
import { mainnetEndpointSetup } from "./mainnet-endpoint-setup";

// redirects
if (window.location.hostname === "beta.friktion.finance") {
  window.location.replace("https://friktion.fi");
}

if (window.location.hostname === "app.friktion.fi") {
  window.location.replace(`https://friktion.fi${window.location.pathname}`);
}

export const DEVNET_ENDPOINT = "https://devnet.genesysgo.net/";
const mainnetEndpoint = mainnetEndpointSetup();

interface AppConnectionProviderProps {
  children: ReactNode;
}

export const AppConnectionProvider = ({
  children,
}: AppConnectionProviderProps) => {
  const [defaultNetwork, setDefaultNetwork] = useState<WalletAdapterNetwork>(
    (localStorage.getItem("lastNetwork") as WalletAdapterNetwork) ??
      "mainnet-beta"
  );

  const [connection, setConnection] = useState<Connection>(
    new Connection(
      defaultNetwork === "devnet" ? DEVNET_ENDPOINT : mainnetEndpoint,
      { commitment: "processed" }
    )
  );
  const setRpc = useCallback(
    (url: string, isCustom?: boolean) => {
      localStorage.setItem("rpc", JSON.stringify({ url, custom: !!isCustom }));
      setConnection(new Connection(url, { commitment: "processed" }));
    },
    [setConnection]
  );

  const setNetwork = useCallback(
    (newNetwork: WalletAdapterNetwork) => {
      localStorage.setItem("lastNetwork", newNetwork);
      setDefaultNetwork(newNetwork);
    },
    [setDefaultNetwork]
  );

  // update connection when network changes
  useEffect(() => {
    if (
      defaultNetwork === "devnet" &&
      connection.rpcEndpoint !== DEVNET_ENDPOINT
    ) {
      setConnection(
        new Connection(DEVNET_ENDPOINT, { commitment: "processed" })
      );
    } else if (
      defaultNetwork === "mainnet-beta" &&
      connection.rpcEndpoint !== mainnetEndpoint
    ) {
      setConnection(
        new Connection(mainnetEndpoint, { commitment: "processed" })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultNetwork]);

  return (
    <AppConnectionContext.Provider
      value={{
        connection,
        setRpc,
        network: defaultNetwork,
        setNetwork,
      }}
    >
      {children}
    </AppConnectionContext.Provider>
  );
};

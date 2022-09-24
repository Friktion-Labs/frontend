import React, { useEffect } from "react";
import { useWeb3React, Web3ReactProvider } from "@web3-react/core";
import { connectors } from "../utils/evmConnectors";

export const EvmWalletProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <Web3ReactProvider connectors={connectors}>
    <Children>{children}</Children>
  </Web3ReactProvider>
);

const Children = ({ children }: { children: React.ReactNode }) => {
  const { connector, account } = useWeb3React();

  // attempt to connect on mount
  useEffect(() => {
    if (!account && connector.connectEagerly) {
      connector.connectEagerly();
    }
    // eslint-disable-next-line
  }, []);

  return <>{children}</>;
};

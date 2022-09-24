import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { SolanaProvider } from "@saberhq/use-solana";
import { SailProvider } from "@saberhq/sail";
import { DEVNET_ENDPOINT, useAppConnection } from "features/connection";

const queryClient = new QueryClient();
const sailInitialState = { refreshIntervalMs: 30_000, batchDurationMs: 200 };

export const AppSailProvider = ({ children }: { children: ReactNode }) => {
  const { connection, network } = useAppConnection();

  return (
    <QueryClientProvider client={queryClient}>
      <SolanaProvider
        defaultNetwork={network}
        networkConfigs={{
          "mainnet-beta": {
            endpoint: connection.rpcEndpoint,
          },
          devnet: {
            endpoint: DEVNET_ENDPOINT,
          },
        }}
      >
        <SailProvider initialState={sailInitialState}>{children}</SailProvider>
      </SolanaProvider>
    </QueryClientProvider>
  );
};

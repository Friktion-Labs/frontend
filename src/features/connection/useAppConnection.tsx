import { Connection } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { createContext, useContext } from "react";

export interface AppConnectionContextState {
  connection: Connection;
  setRpc: (url: string, isCustom?: boolean) => void;
  network: WalletAdapterNetwork;
  setNetwork: (newNetwork: WalletAdapterNetwork) => void;
}

export const AppConnectionContext = createContext<AppConnectionContextState>(
  {} as AppConnectionContextState
);

export function useAppConnection(): AppConnectionContextState {
  return useContext(AppConnectionContext);
}

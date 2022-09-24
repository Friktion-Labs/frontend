import { WalletReadyState } from "@solana/wallet-adapter-base";
import { useMemo } from "react";
import { useAppWallet } from "./useAppWallet";

export const useWalletSearch = (searchTerm: string) => {
  const { wallets } = useAppWallet();

  const searchResults = useMemo(() => {
    if (searchTerm.trim() === "") {
      return null;
    }

    const results = wallets.filter(
      (wallet) =>
        wallet.readyState !== WalletReadyState.Unsupported &&
        wallet.adapter.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // push detected wallets on top
    return results.sort((walletA, walletB) => {
      if (
        walletA.adapter.readyState === WalletReadyState.Installed &&
        walletB.adapter.readyState !== WalletReadyState.Installed
      ) {
        return -1;
      } else if (
        walletB.adapter.readyState === WalletReadyState.Installed &&
        walletA.adapter.readyState !== WalletReadyState.Installed
      ) {
        return 1;
      } else {
        return 0;
      }
    });
  }, [wallets, searchTerm]);

  return searchResults;
};

import { WalletReadyState } from "@solana/wallet-adapter-base";
import { useMemo } from "react";
import { AppWallet, useAppWallet } from "./useAppWallet";

export const useWalletList = () => {
  const { wallets } = useAppWallet();

  const [detectedWallets, otherWallets] = useMemo(() => {
    const detected: AppWallet[] = [];
    const others: AppWallet[] = [];

    for (const wallet of wallets) {
      if (wallet.readyState === WalletReadyState.Installed) {
        detected.push(wallet);
      } else if (
        wallet.readyState === WalletReadyState.NotDetected ||
        wallet.readyState === WalletReadyState.Loadable
      ) {
        others.push(wallet);
      }
    }

    return [detected, others];
  }, [wallets]);

  return [detectedWallets, otherWallets];
};

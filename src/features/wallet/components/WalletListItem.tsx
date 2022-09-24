import { WalletReadyState } from "@solana/wallet-adapter-base";
import { PhantomWalletName } from "@solana/wallet-adapter-wallets";
import { useCallback } from "react";
import { PHANTOM_UNIVERSAL_LINK_BASE_URL } from "../constants/phantomUniversalLinkBaseUrl";
import { AppWallet, useAppWallet } from "../hooks/useAppWallet";
import { useAppWalletModal } from "../hooks/useAppWalletModal";
import { getIsAndroidOrIos } from "../utils/getIsAndroidOrIOS";
import { openUrl } from "../utils/openUrl";
import { WalletButton } from "./WalletButton";

const isAndroidOrIOS = getIsAndroidOrIos();

export interface WalletListItemProps {
  wallet: AppWallet;
}

export const WalletListItem = ({ wallet }: WalletListItemProps) => {
  const { select } = useAppWallet();
  const { setVisible, setWalletToDownload } = useAppWalletModal();

  const handleWalletClick = useCallback(() => {
    if (
      wallet.readyState === WalletReadyState.Installed ||
      wallet.readyState === WalletReadyState.Loadable
    ) {
      select(wallet.adapter.name);
      setVisible(false);
    } else if (isAndroidOrIOS && wallet.adapter.name === PhantomWalletName) {
      // open phantom universal link on mobile
      openUrl(
        `${PHANTOM_UNIVERSAL_LINK_BASE_URL}/browse/${encodeURIComponent(
          `${window.location.href}`
        )}?ref=${encodeURIComponent("https://friktion.fi")}`
      );
    } else {
      setWalletToDownload(wallet);
    }
  }, [select, setVisible, setWalletToDownload, wallet]);

  return (
    <WalletButton
      solanaWallet={wallet}
      onClick={handleWalletClick}
      imgSrc={wallet.adapter.icon}
      walletName={wallet.adapter.name}
      detected={wallet.readyState === WalletReadyState.Installed}
    />
  );
};

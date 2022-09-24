import { PhantomWalletName } from "@solana/wallet-adapter-wallets";
import { useState, ReactNode, useCallback, useMemo } from "react";
import { AppWallet, useAppWallet } from "../hooks/useAppWallet";
import { AppWalletModalContext } from "../hooks/useAppWalletModal";
import { useSafe } from "@snowflake-so/safe-apps-provider";

export interface AppWalletModalProviderProps {
  children: ReactNode;
}

export const AppWalletModalProvider = ({
  children,
}: AppWalletModalProviderProps) => {
  const [visible, setVisible] = useState(false);
  const [walletToDownload, setWalletToDownload] = useState<AppWallet | null>(
    null
  );
  const { safe } = useSafe();
  const isSnowflakeSafe = useMemo(
    () =>
      safe.connected &&
      safe.safeInfo.vaultAddress &&
      safe.safeInfo.walletPublicKey,
    [safe]
  );

  const { select } = useAppWallet();
  const connect = useCallback(() => {
    if (isSnowflakeSafe) {
      select(PhantomWalletName);
    } else {
      setVisible(true);
    }
  }, [isSnowflakeSafe, select]);

  return (
    <AppWalletModalContext.Provider
      value={{
        visible,
        setVisible,
        connect,
        walletToDownload,
        setWalletToDownload,
      }}
    >
      {children}
    </AppWalletModalContext.Provider>
  );
};

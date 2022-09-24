import { createContext, useContext } from "react";
import { AppWallet } from "./useAppWallet";

interface AppWalletModalContextState {
  visible: boolean;
  connect: () => void;
  setVisible: (open: boolean) => void;
  walletToDownload: AppWallet | null;
  setWalletToDownload: (wallet: AppWallet | null) => void;
}

const DEFAULT_CONTEXT = {
  connect: () => {},
  setVisible: () => {},
  visible: false,
  walletToDownload: null,
  setWalletToDownload: () => {},
};

export const AppWalletModalContext =
  createContext<AppWalletModalContextState>(DEFAULT_CONTEXT);

export const useAppWalletModal = () => useContext(AppWalletModalContext);

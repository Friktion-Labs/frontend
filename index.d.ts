import WalletAdapter from "./src/utils/wallet/WalletAdapter";

interface SolongAdapter extends WalletAdapter {
  selectAccount: () => Promise<string>;
}

export interface MathOrPhantomAdapter extends WalletAdapter {
  isMathWallet: boolean;
  isPhantom: boolean;
  getAccount: () => Promise<string>;
  connect: ({ onlyIfTrusted: boolean }) => Promise<void>;
}

declare global {
  interface Window {
    solana?: MathOrPhantomAdapter;
    solong?: SolongAdapter;
  }
}

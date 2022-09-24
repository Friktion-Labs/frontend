import { WalletState } from "../types/WalletState";

export const initialState: WalletState = {
  wallet: null,
  adapter: null,
  publicKey: null,
  connected: false,
  isSafeApp: false,
  walletPublicKey: null,
};

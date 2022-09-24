import { PublicKey } from "@solana/web3.js";
import { AppWallet } from "../hooks/useAppWallet";
import type { Adapter } from "@solana/wallet-adapter-base";

export interface WalletState {
  wallet: AppWallet | null;
  adapter: Adapter | null;
  publicKey: PublicKey | null;
  walletPublicKey: PublicKey | null;
  connected: boolean;
  isSafeApp: boolean;
}

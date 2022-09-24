import styled from "@emotion/styled";
import { WalletName } from "@solana/wallet-adapter-base";
import {
  LedgerWalletName,
  MathWalletName,
} from "@solana/wallet-adapter-wallets";
import { AppWallet } from "../hooks/useAppWallet";

const WALLETS_WITH_WHITE_ICON: { [name: WalletName]: true } = {
  [LedgerWalletName]: true,
  [MathWalletName]: true,
};

export const WalletIconContainer = styled.i<{
  solanaWallet?: AppWallet | null;
}>`
  background-color: ${({ solanaWallet }) =>
    !solanaWallet
      ? "none"
      : solanaWallet.adapter.name in WALLETS_WITH_WHITE_ICON
      ? "#000000"
      : "none"};
  padding: 4px;
  border-radius: 8px;
`;

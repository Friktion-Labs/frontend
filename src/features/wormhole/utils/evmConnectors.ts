import { Web3ReactHooks } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { WalletConnect } from "@web3-react/walletconnect";
import {
  coinbaseWallet,
  hooks as coinbaseWalletHooks,
} from "./coinbaseWalletConnector";
import { hooks as metaMaskHooks, metaMask } from "./metaMaskConnector";
import {
  hooks as walletConnectHooks,
  walletConnect,
} from "./walletConnectConnector";
import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import type { Connector } from "@web3-react/types";

import coinbaseWalletLogo from "../assets/coinbasewallet.png";
import metaMaskWalletLogo from "../assets/metamask.png";
import walletConnectWalletLogo from "../assets/walletconnect.png";

interface EthereumWindow extends Window {
  ethereum?: any;
}
declare const window: EthereumWindow;

export function getName(connector: Connector) {
  if (connector instanceof MetaMask) {
    return "MetaMask";
  }
  if (connector instanceof WalletConnect) {
    return "WalletConnect";
  }
  if (connector instanceof CoinbaseWallet) {
    return "Coinbase Wallet";
  }
  return "Unknown";
}

export function getIcon(connector: Connector) {
  if (connector instanceof MetaMask) {
    return metaMaskWalletLogo;
  }
  if (connector instanceof WalletConnect) {
    return walletConnectWalletLogo;
  }
  if (connector instanceof CoinbaseWallet) {
    return coinbaseWalletLogo;
  }
  return "Unknown";
}

export const connectors: [
  MetaMask | WalletConnect | CoinbaseWallet,
  Web3ReactHooks
][] = [
  [metaMask, metaMaskHooks],
  [coinbaseWallet, coinbaseWalletHooks],
  [walletConnect, walletConnectHooks],
];

export const getIsInstalled = (connector: Connector): boolean => {
  if (connector instanceof MetaMask) {
    // exodus masquerades as metamask... smh
    return (
      (!!window.ethereum?.isMetaMask && !window.ethereum?.isExodus) ||
      !!window.ethereum?.providers?.some(
        (provider: any) => provider.isMetaMask && !provider.isExodus
      )
    );
  }
  if (connector instanceof WalletConnect) {
    return true;
  }
  if (connector instanceof CoinbaseWallet) {
    return (
      !!window.ethereum?.isCoinbaseWallet ||
      !!window.ethereum?.isCoinbaseBrowser ||
      !!window.ethereum?.providers?.some(
        (provider: any) =>
          provider.isCoinbaseWallet || provider.isCoinbaseBrowser
      )
    );
  }

  return false;
};

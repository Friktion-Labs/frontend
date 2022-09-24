import { Network } from "@saberhq/solana-contrib";
import { PublicKey } from "@solana/web3.js";
import {
  BTC_ICON_LINK,
  BTC_NAME,
  BTC_SYMBOL,
  DEVNET_BITCOIN_MINT,
  DEVNET_USDC_MINT,
  MAINNET_BITCOIN_MINT,
  MAINNET_USDC_MINT,
  USDC_ICON_LINK,
  USDC_NAME,
  USDC_SYMBOL,
} from "../friktionConstants";

export type TokenInfo = {
  name: string;
  mint: PublicKey;
  symbol: string;
  iconLink: string;
  decimals: number;
};
export type TokenForCluster = Record<Network, TokenInfo[]>;

export const tokens: TokenForCluster = {
  devnet: [
    {
      name: BTC_NAME,
      symbol: BTC_SYMBOL,
      mint: new PublicKey(DEVNET_BITCOIN_MINT),
      iconLink: BTC_ICON_LINK,
      decimals: 9,
    },
    {
      name: USDC_NAME,
      symbol: USDC_SYMBOL,
      mint: new PublicKey(DEVNET_USDC_MINT),
      iconLink: USDC_ICON_LINK,
      decimals: 2,
    },
  ],
  "mainnet-beta": [
    {
      name: BTC_NAME,
      symbol: BTC_SYMBOL,
      mint: new PublicKey(MAINNET_BITCOIN_MINT),
      iconLink: BTC_ICON_LINK,
      decimals: 6,
    },
    {
      name: USDC_NAME,
      symbol: USDC_SYMBOL,
      mint: new PublicKey(MAINNET_USDC_MINT),
      iconLink: USDC_ICON_LINK,
      decimals: 6,
    },
  ],
  testnet: [],
  localnet: [],
};

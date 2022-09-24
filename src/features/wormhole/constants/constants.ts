import {
  ChainId,
  CHAIN_ID_ETH,
  CHAIN_ID_SOLANA,
  CHAIN_ID_ETHEREUM_ROPSTEN,
  CHAIN_ID_AVAX,
} from "@certusone/wormhole-sdk";
import { Network } from "@saberhq/solana-contrib";

export const getDepositToastTitleBase = (wormholeAsset: AllAssetsUnion) =>
  `Cross Chain Deposit from ${getChainNetworkNameFromAsset(wormholeAsset)} `;

// Ethereum
export const ASSET_ETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
export const ASSET_ROPSTEN_ETH = "0xc778417e063141139fce010982780140aa0cd5ab";
export const NATIVE_ETH_DECIMALS = 18;

// AVAX
export const ASSET_AVAX = "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7";
export const NATIVE_AVAX_DECIMALS = 18;

export type EvmAsset =
  | typeof ASSET_ETH
  | typeof ASSET_ROPSTEN_ETH
  | typeof ASSET_AVAX;

export type AllAssetsUnion = EvmAsset;

export const ETH_NETWORK_CHAIN_ID = 1;
export const ROPSTEN_ETH_NETWORK_CHAIN_ID = 3;
export const AVAX_NETWORK_CHAIN_ID = 43114;
const EVM_CHAIN_MAPPING: {
  evmChainId: number;
  wormholeAsset: AllAssetsUnion;
}[] = [
  {
    evmChainId: ETH_NETWORK_CHAIN_ID,
    wormholeAsset: ASSET_ETH,
  },
  {
    evmChainId: ROPSTEN_ETH_NETWORK_CHAIN_ID,
    wormholeAsset: ASSET_ROPSTEN_ETH,
  },
  {
    evmChainId: AVAX_NETWORK_CHAIN_ID,
    wormholeAsset: ASSET_AVAX,
  },
];
export const getEvmChainIdFromWormholeChainId = (chainId: ChainId) =>
  EVM_CHAIN_MAPPING.find(
    (mapping) => getChainIdFromAsset(mapping.wormholeAsset) === chainId
  )?.evmChainId;

export const getAssetFromEvmChainId = (evmChainId: number) =>
  EVM_CHAIN_MAPPING.find((mapping) => mapping.evmChainId === evmChainId)
    ?.wormholeAsset;

export const getChainIdFromAsset = (wormholeAsset: AllAssetsUnion) => {
  switch (wormholeAsset) {
    case ASSET_ETH:
      return CHAIN_ID_ETH;
    case ASSET_ROPSTEN_ETH:
      return CHAIN_ID_ETHEREUM_ROPSTEN;
    case ASSET_AVAX:
      return CHAIN_ID_AVAX;
    default:
      throw new Error("Invalid wormholeAsset supplied!");
  }
};

export const getChainNetworkNameFromAsset = (wormholeAsset: AllAssetsUnion) => {
  switch (wormholeAsset) {
    case ASSET_ETH:
    case ASSET_ROPSTEN_ETH:
      return "Ethereum";
    case ASSET_AVAX:
      return "Avalanche";
    default:
      throw new Error("Invalid wormholeAsset supplied!");
  }
};

export const getTickerFromWormholeChainId = (chainId: ChainId) => {
  switch (chainId) {
    case CHAIN_ID_ETH:
    case CHAIN_ID_ETHEREUM_ROPSTEN:
      return "ETH";
    case CHAIN_ID_AVAX:
      return "AVAX";
    default:
      return "";
  }
};

const getSolTokenBridgeAddress = (network: Network) =>
  network === "mainnet-beta"
    ? "wormDTUJ6AWPNvk59vGQbDvGJmqbDTdgWgAqcLBCgUb"
    : network === "devnet"
    ? "DZnkkTmCiFWfYTfT41X3Rd1kDgozqzxWaHqsw6W4x2oe"
    : "B6RHG3mfcckmrYN1UhmJzyS1XX3fZKbkeUcpJe9Sy3FE";

const ETH_TOKEN_BRIDGE_ADDRESS = "0x3ee18B2214AFF97000D974cf647E7C347E8fa585";
const ROPSTEN_ETH_TOKEN_BRIDGE_ADDRESS =
  "0xF174F9A837536C449321df1Ca093Bb96948D5386";
const AVAX_TOKEN_BRIDGE_ADDRESS = "0x0e082F06FF657D94310cB8cE8B0D9a04541d8052";

export const getTokenBridgeAddressForChain = (
  chainId: ChainId,
  network: Network
) => {
  switch (chainId) {
    case CHAIN_ID_SOLANA:
      return getSolTokenBridgeAddress(network);
    case CHAIN_ID_ETH:
      return ETH_TOKEN_BRIDGE_ADDRESS;
    case CHAIN_ID_ETHEREUM_ROPSTEN:
      return ROPSTEN_ETH_TOKEN_BRIDGE_ADDRESS;
    case CHAIN_ID_AVAX:
      return AVAX_TOKEN_BRIDGE_ADDRESS;
    default:
      return "";
  }
};

const getSolBridgeAddress = (network: Network) =>
  network === "mainnet-beta"
    ? "worm2ZoG2kUd4vFXhvjh93UUH596ayRfgQ2MgjNMTth"
    : network === "devnet"
    ? "3u8hJUVTA4jH1wYAyUur7FFZVQ8H635K3tSHHF4ssjQ5"
    : "Bridge1p5gheXUvJ6jGWGeCsgPKgnE3YgdGKRVCMY9o";

const ETH_BRIDGE_ADDRESS = "0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B";
const ROPSTEN_ETH_BRIDGE_ADDRESS = "0x210c5F5e2AF958B4defFe715Dc621b7a3BA888c5";
const AVAX_BRIDGE_ADDRESS = "0x54a8e5f9c4CbA08F9943965859F6c34eAF03E26c";

export const getBridgeAddressForChain = (
  chainId: ChainId,
  network: Network
) => {
  switch (chainId) {
    case CHAIN_ID_SOLANA:
      return getSolBridgeAddress(network);
    case CHAIN_ID_ETH:
      return ETH_BRIDGE_ADDRESS;
    case CHAIN_ID_ETHEREUM_ROPSTEN:
      return ROPSTEN_ETH_BRIDGE_ADDRESS;
    case CHAIN_ID_AVAX:
      return AVAX_BRIDGE_ADDRESS;
    default:
      return "";
  }
};

export const getWormholeRpcHosts = (network: Network) =>
  network === "mainnet-beta"
    ? [
        "https://wormhole-v2-mainnet-api.certus.one",
        "https://wormhole.inotel.ro",
        "https://wormhole-v2-mainnet-api.mcf.rocks",
        "https://wormhole-v2-mainnet-api.chainlayer.network",
        "https://wormhole-v2-mainnet-api.staking.fund",
        "https://wormhole-v2-mainnet.01node.com",
      ]
    : ["https://wormhole-v2-testnet-api.certus.one"];

import {
  CHAIN_ID_AVAX,
  CHAIN_ID_ETH,
  CHAIN_ID_ETHEREUM_ROPSTEN,
} from "@certusone/wormhole-sdk";
import React from "react";
import { CrossChainConnectButtonProps } from "./CrossChainConnectButtonProps";
import { EvmConnectButton } from "./EvmConnectButton";

export const CrossChainConnectButton: React.VFC<
  CrossChainConnectButtonProps
> = (props) => {
  switch (props.chainId) {
    case CHAIN_ID_ETH:
    case CHAIN_ID_ETHEREUM_ROPSTEN:
    case CHAIN_ID_AVAX:
      return <EvmConnectButton {...props} />;

    default:
      return null;
  }
};

import { ChainId as WormholeChainId } from "@certusone/wormhole-sdk";
import { SerializedStyles } from "@emotion/react";
import { ReactNode } from "react";

export interface CrossChainConnectButtonProps {
  chainId: WormholeChainId;
  connectedComponent?: (...props: any) => ReactNode;
  className?: string;
  css?: SerializedStyles;
}

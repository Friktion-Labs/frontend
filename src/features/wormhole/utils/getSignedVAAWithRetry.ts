import { ChainId, getSignedVAA } from "@certusone/wormhole-sdk";
import { Network } from "@saberhq/solana-contrib";
import { getWormholeRpcHosts } from "../constants/constants";

export let CURRENT_WORMHOLE_RPC_HOST = -1;

export const getNextRpcHost = (wormholeRpcHosts: string[]) =>
  ++CURRENT_WORMHOLE_RPC_HOST % wormholeRpcHosts.length;

export async function getSignedVAAWithRetry(
  network: Network,
  emitterChain: ChainId,
  emitterAddress: string,
  sequence: string,
  retryAttempts?: number
) {
  const wormholeRpcHosts = getWormholeRpcHosts(network);
  let result;
  let attempts = 0;
  while (!result) {
    attempts++;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      result = await getSignedVAA(
        wormholeRpcHosts[getNextRpcHost(wormholeRpcHosts)],
        emitterChain,
        emitterAddress,
        sequence
      );
    } catch (e) {
      if (retryAttempts !== undefined && attempts > retryAttempts) {
        throw e;
      }
    }
  }
  return result;
}

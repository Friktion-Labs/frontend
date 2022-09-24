import {
  CHAIN_ID_SOLANA,
  isEVMChain,
  transferFromEthNative,
  ChainId,
} from "@certusone/wormhole-sdk";
import { Network, PublicKey } from "@saberhq/solana-contrib";
import { parseUnits, zeroPad } from "ethers/lib/utils";
import { useCallback, useMemo } from "react";
import {
  AllAssetsUnion,
  getChainIdFromAsset,
  getTokenBridgeAddressForChain,
  NATIVE_ETH_DECIMALS,
} from "../constants/constants";
import { useAppConnection } from "features/connection";
import { Signer } from "ethers";
import { useWeb3React } from "@web3-react/core";

async function evmSend(
  chainId: ChainId,
  signer: Signer,
  amount: string,
  targetAddress: Uint8Array,
  solanaNetwork: Network,
  setToastContent: React.Dispatch<React.SetStateAction<JSX.Element[]>>
) {
  const transferAmountParsed = parseUnits(amount, NATIVE_ETH_DECIMALS);

  setToastContent((content) => [
    ...content,
    <div>Transaction {content.length + 1}: [Transfer to Wormhole]</div>,
  ]);

  const receipt = await transferFromEthNative(
    getTokenBridgeAddressForChain(chainId, solanaNetwork),
    signer,
    transferAmountParsed,
    CHAIN_ID_SOLANA,
    targetAddress
  );

  return receipt.transactionHash;
}

interface UseHandleTransferProps {
  associatedTokenAccount: PublicKey | undefined;
  targetAsset: string | undefined;
}
export function useHandleTransfer({
  associatedTokenAccount,
  targetAsset,
}: UseHandleTransferProps) {
  const { network } = useAppConnection();

  const { provider } = useWeb3React();
  const signer = useMemo(() => provider?.getSigner(), [provider]);

  const handleTransfer = useCallback(
    async (
      wormholeAsset: AllAssetsUnion,
      amount: string,
      setToastContent: React.Dispatch<React.SetStateAction<JSX.Element[]>>
    ) => {
      if (associatedTokenAccount && targetAsset) {
        const sourceChain = getChainIdFromAsset(wormholeAsset);
        const targetAddress = zeroPad(associatedTokenAccount.toBytes(), 32);

        if (isEVMChain(sourceChain) && signer && amount) {
          return evmSend(
            sourceChain,
            signer,
            amount,
            targetAddress,
            network,
            setToastContent
          );
        } else {
          // do nothing if args don't match any chain
        }
      }
    },
    [network, associatedTokenAccount, targetAsset, signer]
  );

  if (!associatedTokenAccount || !targetAsset) {
    return null;
  }

  return handleTransfer;
}

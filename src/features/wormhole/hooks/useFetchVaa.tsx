import {
  isEVMChain,
  parseSequenceFromLogEth,
  getEmitterAddressEth,
  CHAIN_ID_AVAX,
  CHAIN_ID_ETH,
  ChainId,
} from "@certusone/wormhole-sdk";
import { Network } from "@saberhq/solana-contrib";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AllAssetsUnion,
  getChainIdFromAsset,
  getTokenBridgeAddressForChain,
  getBridgeAddressForChain,
} from "../constants/constants";
import { useAppConnection } from "features/connection";
import { getSignedVAAWithRetry } from "../utils/getSignedVAAWithRetry";
import { ContractReceipt, ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";

const getExplorerLink = (chainId: ChainId, txid: string) => {
  const AVAX_BASE = "https://snowtrace.io/tx/";
  const ETH_BASE = "https://etherscan.io/tx/";
  const ROPSTEN_BASE = "https://ropsten.etherscan.io/tx/";

  return (
    (chainId === CHAIN_ID_AVAX
      ? AVAX_BASE
      : chainId === CHAIN_ID_ETH
      ? ETH_BASE
      : ROPSTEN_BASE) + txid
  );
};

const useEvmTransactionProgress = (
  setToastContent: (value: React.SetStateAction<JSX.Element[]>) => void,
  chainId: ChainId
) => {
  const cancelled = useRef(false);
  const { provider } = useWeb3React();
  const [currentBlock, setCurrentBlock] = useState(0);

  const expectedBlocks = useRef<number>();
  const [receipt, setReceipt] = useState<ContractReceipt>();

  useEffect(() => {
    if (provider && expectedBlocks.current !== undefined && receipt) {
      (async () => {
        while (!cancelled.current) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          try {
            const newBlock = await provider.getBlockNumber();
            if (!cancelled.current) {
              setCurrentBlock(newBlock);
            }
          } catch (e) {
            console.error(e);
          }
        }
      })();

      return () => {
        cancelled.current = true;
      };
    }
  }, [provider, receipt]);

  const blockDiff = useMemo(
    () =>
      receipt?.blockNumber !== undefined &&
      expectedBlocks.current !== undefined &&
      currentBlock !== 0
        ? Math.min(
            currentBlock - receipt.blockNumber + 1,
            expectedBlocks.current
          )
        : 0,
    [receipt, currentBlock]
  );

  useEffect(() => {
    if (
      receipt &&
      expectedBlocks.current !== undefined &&
      blockDiff <= expectedBlocks.current
    ) {
      setToastContent((content) => {
        const newContent = [...content];
        const transactionIndex = 0;
        newContent[transactionIndex] = (
          <div>
            Transaction {transactionIndex + 1}:{" "}
            <a
              href={getExplorerLink(chainId, receipt.transactionHash)}
              target="_blank"
              rel="noreferrer"
            >
              {`[${blockDiff} / ${expectedBlocks.current} confirmations]`}
            </a>
          </div>
        );
        return newContent;
      });
    }
  }, [blockDiff, receipt, setToastContent, chainId]);

  return {
    startEvmTransactionProgress: (
      expectedBlocksParam: number,
      receipt: ContractReceipt
    ) => {
      expectedBlocks.current = expectedBlocksParam;
      setReceipt(receipt);
    },
    stopEvmTransactionProgress: () => {
      cancelled.current = true;
      setCurrentBlock(Number.MAX_SAFE_INTEGER);
    },
  };
};

async function evm(
  chainId: ChainId,
  provider: ethers.providers.Web3Provider,
  txid: string,
  solanaNetwork: Network,
  evmTransactionProgressUtils: ReturnType<typeof useEvmTransactionProgress>
) {
  const receipt = await provider.getTransactionReceipt(txid);
  const sequence = parseSequenceFromLogEth(
    receipt,
    getBridgeAddressForChain(chainId, solanaNetwork)
  );

  const emitterAddress = getEmitterAddressEth(
    getTokenBridgeAddressForChain(chainId, solanaNetwork)
  );

  evmTransactionProgressUtils.startEvmTransactionProgress(15, receipt);

  const { vaaBytes } = await getSignedVAAWithRetry(
    solanaNetwork,
    chainId,
    emitterAddress,
    sequence
  );

  evmTransactionProgressUtils.stopEvmTransactionProgress();

  return vaaBytes;
}

interface UseFetchVaaProps {
  wormholeAsset: AllAssetsUnion;
  setToastContent: React.Dispatch<React.SetStateAction<JSX.Element[]>>;
}
export function useFetchVaa({
  wormholeAsset,
  setToastContent,
}: UseFetchVaaProps) {
  const { network } = useAppConnection();

  const sourceChain = useMemo(
    () => getChainIdFromAsset(wormholeAsset),
    [wormholeAsset]
  );

  const evmTransactionProgressUtils = useEvmTransactionProgress(
    setToastContent,
    sourceChain
  );

  const { provider: evmProvider } = useWeb3React();

  const fetchVaa = useCallback(
    async (txid: string) => {
      if (isEVMChain(sourceChain) && evmProvider) {
        return evm(
          sourceChain,
          evmProvider,
          txid,
          network,
          evmTransactionProgressUtils
        );
      } else {
        // do nothing if args don't match any chain
      }
    },
    [sourceChain, network, evmTransactionProgressUtils, evmProvider]
  );

  return fetchVaa;
}

import {
  AllAssetsUnion,
  EvmAsset,
  getAssetFromEvmChainId,
  getChainIdFromAsset,
} from "../constants/constants";
import Decimal from "decimal.js";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { isEVMChain } from "@certusone/wormhole-sdk";
import { Web3Provider } from "@ethersproject/providers";
import { formatUnits } from "ethers/lib/utils";
import { useWeb3React } from "@web3-react/core";

type Balances = Partial<Record<EvmAsset, Decimal | null | undefined>>;

const getBalanceEvm = async (
  provider?: Web3Provider,
  walletAddress?: string
) => {
  if (!walletAddress || !provider) {
    return undefined;
  }

  return provider
    .getBalance(walletAddress)
    .then((result) => new Decimal(formatUnits(result, 18).toString()));
};

interface CrossChainBalancesType {
  loading: boolean;
  balances: Balances | undefined;
  refresh: () => Promise<void>;
}
const CrossChainBalancesContext = createContext<CrossChainBalancesType>({
  loading: true,
  balances: undefined,
  refresh: () => Promise.resolve(),
});
export const CrossChainBalancesProvider: React.FC<
  PropsWithChildren<unknown>
> = ({ children }) => {
  const {
    provider: evmProvider,
    account: evmWalletAddress,
    chainId: evmChainId,
  } = useWeb3React();

  const [loading, setLoading] = useState(true);
  const [balances, setBalances] = useState<Balances>({});

  const refresh = useCallback(async () => {
    const evmAsset = evmChainId
      ? getAssetFromEvmChainId(evmChainId)
      : undefined;
    const evmBalance = evmAsset
      ? {
          [evmAsset]: await getBalanceEvm(evmProvider, evmWalletAddress),
        }
      : {};

    setBalances((oldBalances) => ({
      ...oldBalances,
      ...evmBalance,
    }));
    setLoading(false);
  }, [evmProvider, evmWalletAddress, evmChainId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <CrossChainBalancesContext.Provider
      value={{
        loading,
        balances,
        refresh,
      }}
    >
      {children}
    </CrossChainBalancesContext.Provider>
  );
};

export const useCrossChainBalances = () => {
  return useContext(CrossChainBalancesContext);
};

const EVM_GAS_ESTIMATE = BigInt(140000);
const getEvmGasEstimate = async (provider: Web3Provider) => {
  const priceInWei = await provider.getGasPrice();
  return new Decimal(
    formatUnits(EVM_GAS_ESTIMATE * priceInWei.toBigInt(), "ether").toString()
  );
};

interface CrossChainTransactionFees {
  evm: Decimal | undefined;
}
export const useCrossChainTransactionFees = (
  deps?: React.DependencyList | undefined
) => {
  const { provider: evmProvider } = useWeb3React();
  const crossChainTransactionFees = useRef<CrossChainTransactionFees>({
    evm: undefined,
  });

  const depsString = JSON.stringify(deps);
  useEffect(() => {
    if (evmProvider) {
      (async () => {
        crossChainTransactionFees.current.evm = undefined;
        const evmGasEstimate = await getEvmGasEstimate(evmProvider);
        crossChainTransactionFees.current.evm = evmGasEstimate;
      })();
    }
  }, [evmProvider, depsString]);

  const getCrossChainTransactionFees = useCallback(
    (wormholeAsset?: AllAssetsUnion) => {
      if (wormholeAsset === undefined) {
        return undefined;
      } else if (isEVMChain(getChainIdFromAsset(wormholeAsset))) {
        return crossChainTransactionFees.current.evm;
      } else {
        throw new Error(`Unknown wormhole asset: ${wormholeAsset}`);
      }
    },
    []
  );

  return getCrossChainTransactionFees;
};

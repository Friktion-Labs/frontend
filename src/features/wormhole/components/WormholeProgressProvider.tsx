import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { GlobalId } from "../../../09/registry10";

const LOCAL_STORAGE_KEY = "voltToWormholeTxStore";

export interface Transaction {
  txid: string;
  amount: string;

  // these 2 fields can be undefined as they are new fields and users
  // might have old schema without these 2 fields in their local storage
  destinationSolAddress?: string;
  readableTargetAddress?: string;
}
type VoltToWormholeTxStore = Partial<Record<GlobalId, Transaction>>;
function getVoltToWormholeTxStore(): VoltToWormholeTxStore | null {
  const voltToWormholeTxStore = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (voltToWormholeTxStore === null) {
    return voltToWormholeTxStore;
  }

  return JSON.parse(voltToWormholeTxStore);
}

export const saveWormholeProgress = (
  globalId: GlobalId,
  txid?: string,
  amount?: string,
  destinationSolAddress?: string,
  readableTargetAddress?: string
) => {
  const voltToWormholeTxStore = getVoltToWormholeTxStore();
  localStorage.setItem(
    LOCAL_STORAGE_KEY,
    JSON.stringify({
      ...(voltToWormholeTxStore ? voltToWormholeTxStore : {}),
      [globalId]: {
        ...(voltToWormholeTxStore?.[globalId] ?? {}),
        ...(txid ? { txid } : {}),
        ...(amount ? { amount } : {}),
        ...(destinationSolAddress ? { destinationSolAddress } : {}),
        ...(readableTargetAddress ? { readableTargetAddress } : {}),
      },
    })
  );
};

export const removeWormholeProgress = (globalId: GlobalId) => {
  const voltToWormholeTxStore = getVoltToWormholeTxStore();

  if (voltToWormholeTxStore) {
    delete voltToWormholeTxStore[globalId];
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify(voltToWormholeTxStore)
    );
  }
};

interface WormholeProgressDataType {
  voltToWormholeTxStore: VoltToWormholeTxStore | undefined;
  refreshVoltToWormholeTxStore: () => void;
}
const WormholeProgressContext = createContext<WormholeProgressDataType>({
  refreshVoltToWormholeTxStore: () => {},
  voltToWormholeTxStore: undefined,
});

export const WormholeProgressProvider: React.FC<PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [voltToWormholeTxStore, setVoltToWormholeTxStore] =
    useState<VoltToWormholeTxStore>();

  const refreshVoltToWormholeTxStore = useCallback(() => {
    const fetchedVoltToWormholeTxStore = getVoltToWormholeTxStore();

    if (fetchedVoltToWormholeTxStore) {
      setVoltToWormholeTxStore(fetchedVoltToWormholeTxStore);
    }
  }, []);

  useEffect(() => {
    refreshVoltToWormholeTxStore();
  }, [refreshVoltToWormholeTxStore]);

  return (
    <WormholeProgressContext.Provider
      value={{
        refreshVoltToWormholeTxStore,
        voltToWormholeTxStore,
      }}
    >
      {children}
    </WormholeProgressContext.Provider>
  );
};

export type WormholeProgress = {
  wormholeTransactionInfo: Transaction | null;
  refreshVoltToWormholeTxStore: () => void;
};

export const useWormholeProgress = (globalId?: GlobalId) => {
  const { voltToWormholeTxStore, refreshVoltToWormholeTxStore } = useContext(
    WormholeProgressContext
  );

  const getProgress = useCallback(() => {
    const transaction: Transaction | undefined =
      voltToWormholeTxStore && globalId
        ? voltToWormholeTxStore?.[globalId]
        : undefined;
    if (transaction) {
      const { txid, amount, destinationSolAddress, readableTargetAddress } =
        transaction;
      return { txid, amount, destinationSolAddress, readableTargetAddress };
    } else {
      return undefined;
    }
  }, [voltToWormholeTxStore, globalId]);
  const progress = useMemo(getProgress, [getProgress]);

  const [txid, setTxid] = useState<string | undefined>(progress?.txid);
  const [amount, setAmount] = useState<string | undefined>(progress?.amount);
  const [destinationSolAddress, setDestinationSolAddress] = useState<
    string | undefined
  >(progress?.destinationSolAddress);
  const [readableTargetAddress, setReadableTargetAddress] = useState<
    string | undefined
  >(progress?.readableTargetAddress);

  useEffect(() => {
    const progress = getProgress();
    if (progress) {
      setTxid(progress.txid);
      setAmount(progress.amount);
      setDestinationSolAddress(progress.destinationSolAddress);
      setReadableTargetAddress(progress.readableTargetAddress);
    } else {
      setTxid(undefined);
      setAmount(undefined);
      setDestinationSolAddress(undefined);
      setReadableTargetAddress(undefined);
    }
  }, [getProgress]);

  const result: WormholeProgress = {
    wormholeTransactionInfo:
      !txid || !amount
        ? null
        : {
            txid,
            amount,
            destinationSolAddress,
            readableTargetAddress,
          },
    refreshVoltToWormholeTxStore,
  };

  return result;
};

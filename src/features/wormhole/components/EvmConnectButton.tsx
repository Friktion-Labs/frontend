import { useWeb3React } from "@web3-react/core";
import { hexlify, hexStripZeros } from "ethers/lib/utils";
import { ReactText, useEffect, useMemo, useRef, useState } from "react";
import { WalletConnect } from "@web3-react/walletconnect";
import { toast } from "react-toastify";
import { errorToast } from "../../../utils/yummyNotifications";
import {
  getEvmChainIdFromWormholeChainId,
  getTickerFromWormholeChainId,
} from "../constants/constants";
import { CrossChainConnectButtonBase } from "./CrossChainConnectButtonBase";
import { CrossChainConnectButtonProps } from "./CrossChainConnectButtonProps";
import { EvmWalletsDialog } from "./EvmWalletsDialog";

function usePrevious<T>(value: T) {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export const EvmConnectButton = ({
  chainId,
  connectedComponent,
  ...rest
}: CrossChainConnectButtonProps) => {
  const {
    account,
    error,
    chainId: connectedWalletEvmChainId,
    provider,
    connector,
    isActive,
  } = useWeb3React();
  const prevConnectedWalletEvmChainId = usePrevious(connectedWalletEvmChainId);
  const cardEvmChainId = useMemo(
    () => getEvmChainIdFromWormholeChainId(chainId),
    [chainId]
  );
  const [isOpen, setIsOpen] = useState(false);

  // use an object here to trigger useEffect on setState
  const [errorState, setErrorState] = useState<{
    message: string | undefined;
  }>({ message: undefined });

  const toastId = useRef<ReactText>();
  const isSwitchingWallets = useRef(false);

  useEffect(() => {
    setErrorState({ message: error?.message });
  }, [error]);

  useEffect(() => {
    (async () => {
      if (
        isActive &&
        !isSwitchingWallets.current &&
        connectedWalletEvmChainId &&
        cardEvmChainId &&
        connectedWalletEvmChainId !== cardEvmChainId &&
        provider
      ) {
        setErrorState({
          message: `Wallet is not connected to ${getTickerFromWormholeChainId(
            chainId
          )} network`,
        });

        if (!(connector instanceof WalletConnect)) {
          try {
            await provider.send("wallet_switchEthereumChain", [
              { chainId: hexStripZeros(hexlify(cardEvmChainId)) },
            ]);
          } finally {
            isSwitchingWallets.current = false;
          }
        }
      }
    })();
  }, [
    connectedWalletEvmChainId,
    cardEvmChainId,
    chainId,
    provider,
    connector,
    isActive,
  ]);

  useEffect(() => {
    if (
      typeof connectedWalletEvmChainId !== "undefined" &&
      typeof cardEvmChainId !== "undefined" &&
      connectedWalletEvmChainId === cardEvmChainId
    ) {
      setErrorState({ message: undefined });
    }
  }, [cardEvmChainId, connectedWalletEvmChainId]);

  // reconnect wallet whenever user changes evm chains,
  // see: https://github.com/ethers-io/ethers.js/discussions/1480
  useEffect(() => {
    (async () => {
      if (
        typeof prevConnectedWalletEvmChainId !== "undefined" &&
        typeof connectedWalletEvmChainId !== "undefined" &&
        connectedWalletEvmChainId !== prevConnectedWalletEvmChainId
      ) {
        await connector.deactivate();
        connector.connectEagerly!();
      }
    })();
  }, [connectedWalletEvmChainId, prevConnectedWalletEvmChainId, connector]);

  useEffect(() => {
    if (errorState?.message) {
      toast.dismiss(toastId.current);
      toastId.current = errorToast("Wallet error", errorState.message);
    }
  }, [errorState?.message]);

  return (
    <>
      <EvmWalletsDialog
        evmChainId={cardEvmChainId}
        isOpen={isOpen}
        onDismiss={() => {
          setIsOpen(false);
        }}
      />
      <CrossChainConnectButtonBase
        connectedComponent={connectedComponent}
        connected={!!account}
        connect={() => {
          setIsOpen(true);
        }}
        chainId={chainId}
        error={errorState.message}
        {...rest}
      />
    </>
  );
};

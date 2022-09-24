import {
  ChainId as WormholeChainId,
  CHAIN_ID_ETH,
  CHAIN_ID_SOLANA,
  getForeignAssetSolana,
  getIsTransferCompletedSolana,
  getOriginalAssetEth,
} from "@certusone/wormhole-sdk";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useAppWallet } from "features/wallet";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { useWeb3React } from "@web3-react/core";
import React from "react";
import { ReactText, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useProviders } from "hooks/useProvider";
import {
  ConfirmationSpinner,
  errorToast,
  infoToast,
  successToast,
  Title,
} from "utils/yummyNotifications";
import { AsyncButton09, AsyncButton09Props } from "09/Button09";
import { useAppConnection } from "features/connection";
import { GlobalId } from "09/registry10";
import { useCrossChainBalances } from "../utils/balancesAndFees";
import {
  AllAssetsUnion,
  getDepositToastTitleBase,
  getChainIdFromAsset,
  getTokenBridgeAddressForChain,
} from "../constants/constants";
import { CrossChainDepositError } from "../constants/CrossChainDepositError";
import { useFetchVaa } from "../hooks/useFetchVaa";
import { useHandleRedeem } from "../hooks/useHandleRedeem";
import { useHandleTransfer } from "../hooks/useHandleTransfer";
import { useSolanaCreateAssociatedAddress } from "../hooks/useSolanaCreateAssociatedAddress";
import {
  removeWormholeProgress,
  saveWormholeProgress,
  useWormholeProgress,
} from "./WormholeProgressProvider";
import { TOKEN_PROGRAM_ERRORS } from "common/constants/tokenProgramErrors";

export const shortenAddress = (address: string, chars = 4): string => {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const openGenericConfirmationToast = (
  toastTitle: string,
  toastContent: string | JSX.Element
) =>
  infoToast(toastTitle, toastContent, {
    autoClose: false,
    closeButton: false,
    icon: <ConfirmationSpinner />,
  });

const SLOW_CHAIN_WARNING_TEXT =
  "Deposits from ETH can take > 5 minutes to confirm";

const useToast = (wormholeAsset: AllAssetsUnion) => {
  const toastId = useRef<ReactText>();
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastContent, setToastContent] = useState<JSX.Element[]>([]);
  const [toastTitle, setToastTitle] = useState(
    getDepositToastTitleBase(wormholeAsset) + "(1 / 3)"
  );
  const wormholeChainId = useMemo(
    () => getChainIdFromAsset(wormholeAsset),
    [wormholeAsset]
  );

  useEffect(() => {
    if (isToastOpen) {
      toastId.current = openGenericConfirmationToast(
        toastTitle,
        <div>
          {wormholeChainId === CHAIN_ID_ETH && (
            <SlowChainWarning>{SLOW_CHAIN_WARNING_TEXT}</SlowChainWarning>
          )}
          {toastContent.map((content, i) => (
            <React.Fragment key={`toast-content-${i}`}>
              {content}
            </React.Fragment>
          ))}
          {INFO_TOAST_EXTRA_INFO}
        </div>
      );
    } else if (toastId.current !== undefined) {
      toast.dismiss(toastId.current);
      toastId.current = undefined;
      setToastContent([]);
      setToastTitle(getDepositToastTitleBase(wormholeAsset) + "(1 / 3)");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isToastOpen]);

  useEffect(() => {
    if (toastId.current !== undefined) {
      toast.update(toastId.current, {
        render: (
          <div>
            <Title>{toastTitle}</Title>
            <div>
              {wormholeChainId === CHAIN_ID_ETH && (
                <SlowChainWarning>{SLOW_CHAIN_WARNING_TEXT}</SlowChainWarning>
              )}
              {toastContent.map((content, i) => (
                <React.Fragment key={`toast-content-${i}`}>
                  {content}
                </React.Fragment>
              ))}
              {INFO_TOAST_EXTRA_INFO}
            </div>
          </div>
        ),
      });
    } else if (toastContent.length > 0) {
      // automatically open toast when the first content is pushed
      setIsToastOpen(true);
    }
  }, [toastContent, toastTitle, wormholeChainId]);

  return {
    close: async () => {
      setIsToastOpen(false);

      const MAX_POLL_ATTEMPTS = 10;
      for (let i = 0; i < MAX_POLL_ATTEMPTS; i++) {
        if (toastId.current === undefined) {
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, 10));
      }
    },
    setToastContent,
    setToastTitle,
  };
};

const useTargetAssetAndAddress = (
  chainId: WormholeChainId,
  wormholeAsset: AllAssetsUnion
) => {
  const { providerMut } = useProviders();
  const { network } = useAppConnection();
  const { publicKey } = useAppWallet();
  const { provider: evmProvider } = useWeb3React();

  const [targetAsset, setTargetAsset] = useState<string>();
  const [associatedTokenAccount, setAssociatedTokenAccount] =
    useState<PublicKey>();

  useEffect(() => {
    (async () => {
      if (providerMut && publicKey && evmProvider) {
        const { assetAddress: originAsset } = await getOriginalAssetEth(
          getTokenBridgeAddressForChain(chainId, network),
          evmProvider,
          wormholeAsset,
          chainId
        );

        const targetAsset = await getForeignAssetSolana(
          providerMut.connection,
          getTokenBridgeAddressForChain(CHAIN_ID_SOLANA, network),
          chainId,
          originAsset
        );

        if (!targetAsset) {
          throw new Error(`Target asset not found! ChainId: ${chainId}`);
        }

        const associatedTokenAccount = await Token.getAssociatedTokenAddress(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          new PublicKey(targetAsset),
          publicKey
        );

        setTargetAsset(targetAsset);
        setAssociatedTokenAccount(associatedTokenAccount);
      }
    })();
  }, [network, providerMut, publicKey, chainId, wormholeAsset, evmProvider]);

  return { targetAsset, associatedTokenAccount };
};

interface CrossChainDepositButtonProps extends AsyncButton09Props {
  wormholeAsset: AllAssetsUnion;
  globalId: GlobalId;
  refreshBalances: () => Promise<void>;
  setIsUsingCrossChainDeposit: React.Dispatch<React.SetStateAction<boolean>>;
  amount?: string;
  error?: string;
}
export const CrossChainDepositButton = ({
  amount,
  wormholeAsset,
  globalId,
  onClick,
  refreshBalances,
  label,
  setIsUsingCrossChainDeposit,
  error,
  ...rest
}: CrossChainDepositButtonProps) => {
  const { publicKey } = useAppWallet();
  const { refresh: refreshCrossChainBalances } = useCrossChainBalances();
  const { providerMut } = useProviders();
  const { network } = useAppConnection();

  const chainId = useMemo(
    () => getChainIdFromAsset(wormholeAsset),
    [wormholeAsset]
  );

  const { close, setToastContent, setToastTitle } = useToast(wormholeAsset);

  const { associatedTokenAccount, targetAsset } = useTargetAssetAndAddress(
    chainId,
    wormholeAsset
  );

  const { wormholeTransactionInfo, refreshVoltToWormholeTxStore } =
    useWormholeProgress(globalId);

  const handleTransfer = useHandleTransfer({
    associatedTokenAccount,
    targetAsset,
  });
  const fetchVaa = useFetchVaa({ setToastContent, wormholeAsset });

  const createAssociatedAddress = useSolanaCreateAssociatedAddress({
    targetAsset,
    readableTargetAddress: associatedTokenAccount?.toString(),
    wormholeTransactionInfo,
  });
  const handleRedeem = useHandleRedeem();

  const isWrongDestinationWallet =
    wormholeTransactionInfo &&
    publicKey &&
    wormholeTransactionInfo.destinationSolAddress &&
    wormholeTransactionInfo.destinationSolAddress !== publicKey.toBase58() ? (
      <span>
        Cannot continue with cross chain deposit as the wrong Solana wallet is
        connected. Connect to Friktion with wallet{" "}
        <span
          css={css`
            font-weight: bold;
          `}
        >
          {shortenAddress(wormholeTransactionInfo.destinationSolAddress)}
        </span>{" "}
        before trying again.
      </span>
    ) : (
      false
    );
  const disabled =
    error ||
    rest.disabled ||
    isWrongDestinationWallet ||
    !providerMut ||
    !amount ||
    !handleTransfer ||
    !createAssociatedAddress ||
    !handleRedeem ||
    !publicKey;

  return (
    <ConfirmButtonWrapper
      css={css`
        margin: 22px 0 20px 0;
      `}
      className="confirmButton"
    >
      <AsyncButton09
        {...rest}
        label={wormholeTransactionInfo ? "Continue Deposit" : label}
        disabled={disabled}
        onError={(e) => {
          if (e instanceof CrossChainDepositError) {
            errorToast(
              label + " error",
              <div>
                {e.info === undefined
                  ? e.message.includes("lower balance")
                    ? TOKEN_PROGRAM_ERRORS["0x1"]
                    : `Wormhole error: Click on the "Continue Deposit" button to resume your deposit.`
                  : e.info}
                <ExtraDetails>
                  <SingleLineContainer>{e.message}</SingleLineContainer>
                </ExtraDetails>
              </div>,
              { bodyClassName: "single-line-toast__body" }
            );
          }
        }}
        onClick={async (goodies) => {
          try {
            if (!disabled) {
              const txid = wormholeTransactionInfo
                ? wormholeTransactionInfo.txid
                : await handleTransfer(wormholeAsset, amount, setToastContent);

              if (!wormholeTransactionInfo) {
                await refreshCrossChainBalances();
              }

              const transferredAmount = wormholeTransactionInfo
                ? wormholeTransactionInfo.amount
                : amount;

              if (txid) {
                const readableTargetAddressToSave =
                  (wormholeTransactionInfo &&
                    wormholeTransactionInfo.readableTargetAddress) ||
                  associatedTokenAccount?.toString();
                const destinationSolAddressToSave =
                  (wormholeTransactionInfo &&
                    wormholeTransactionInfo.destinationSolAddress) ||
                  publicKey.toBase58();
                saveWormholeProgress(
                  globalId,
                  txid,
                  transferredAmount,
                  destinationSolAddressToSave,
                  readableTargetAddressToSave
                );

                const vaaBytes = await fetchVaa(txid);

                if (vaaBytes) {
                  const isTransferCompleted =
                    await getIsTransferCompletedSolana(
                      getTokenBridgeAddressForChain(CHAIN_ID_SOLANA, network),
                      vaaBytes,
                      providerMut.connection
                    );

                  if (isTransferCompleted) {
                    // wormhole funds have already been redeemed for some reason
                    await close();
                    removeWormholeProgress(globalId);
                    setIsUsingCrossChainDeposit(false);
                    throw new CrossChainDepositError({
                      message: "",
                      info: "Wormhole error: Funds have already been redeemed, please manually deposit the bridged assets via Solana",
                    });
                  }

                  await createAssociatedAddress();

                  setToastTitle(
                    getDepositToastTitleBase(wormholeAsset) + "(2 / 3)"
                  );

                  await handleRedeem(
                    wormholeAsset,
                    vaaBytes,
                    setToastContent,
                    setToastTitle
                  );

                  // refresh token balances after 1 second to prevent deposit errors
                  await sleep(1000);
                  await refreshBalances();

                  // wormhole transactions are done, close wormhole toasts
                  await close();
                  removeWormholeProgress(globalId);

                  successToast(
                    `Bridge to SOL successful`,
                    `The next transaction will deposit the bridged funds`
                  );

                  // deposit bridged funds into volt
                  const isSuccess = await onClick(goodies);
                  if (!isSuccess) {
                    setIsUsingCrossChainDeposit(false);
                  }
                } else {
                  console.error("vaaBytes not found");
                }
              } else {
                console.error("txid not found");
              }
            }
            return true;
          } catch (e) {
            if (e instanceof CrossChainDepositError) {
              throw e;
            } else if (e instanceof Error) {
              throw new CrossChainDepositError({ message: e.message });
            }
            return false;
          } finally {
            refreshBalances();
            refreshVoltToWormholeTxStore();
            close();
          }
        }}
      />
    </ConfirmButtonWrapper>
  );
};

const ExtraDetails = styled.div`
  font-size: 12px;
  opacity: 0.7;
`;

const SingleLineContainer = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SlowChainWarning = styled.div`
  color: #ff9800;
  font-size: 12px;
  opacity: 0.7;
  margin-bottom: 12px;
`;

const ConfirmButtonWrapper = styled.div`
  padding: 0 20px 22px 20px;
  .Button09 {
    width: 100%;
    margin: 0 auto;
  }
`;

const INFO_TOAST_EXTRA_INFO = (
  <ExtraDetails>
    <SingleLineContainer>
      There will be several transactions, do not close the browser
    </SingleLineContainer>
  </ExtraDetails>
);

import styled from "@emotion/styled";
import { useSafe } from "@snowflake-so/safe-apps-provider";
import { useCallback } from "react";
import { TransactionEnvelope } from "@saberhq/solana-contrib";
import { SailError, UseSail, useSail } from "@saberhq/sail";
import { FriktionSDK } from "@friktion-labs/friktion-sdk";
import {
  ConfirmationSpinner,
  errorToast,
  infoToast,
  successToast,
} from "../utils/yummyNotifications";
import { useEvilTwinSisterOfVFAC } from "../contexts/EvilTwinSisterOfVFAC";
import { useDeposits10 } from "../09/UserDeposits10";
import { toast } from "react-toastify";
import { useExplorerLink } from "./useExplorerLink";
import { useAppWallet } from "features/wallet";
import { TOKEN_PROGRAM_ERRORS } from "common/constants/tokenProgramErrors";

type OriginalSimError = {
  logs: string[] | undefined;
};
const extractLogs = (sailError: SailError): string[] | null => {
  if (
    sailError.originalError &&
    typeof sailError.originalError === "object" &&
    "logs" in sailError.originalError
  ) {
    const originalError: OriginalSimError =
      sailError.originalError as unknown as OriginalSimError;
    if (Array.isArray(originalError.logs)) {
      if (
        originalError.logs.length &&
        typeof originalError.logs[0] === "string"
      ) {
        // good enough
        return originalError.logs;
      }
    }
  }
  return null;
};

interface HandleTxWrappedResult {
  success: boolean;
  message?: string;
}
export type HandleTxWrapped = (
  actionTitle: string,
  txEnvelope: TransactionEnvelope
) => Promise<HandleTxWrappedResult>;

/**
 * uses sail's handleTX and then emits notifications.
 */
export const useHandleTXWrapped = (): {
  handleTXWrapped: HandleTxWrapped;
} => {
  const { createExplorerLink } = useExplorerLink();

  const sail = useSail();
  const { allowRefreshSoon } = useEvilTwinSisterOfVFAC();
  const deposits10 = useDeposits10();
  const { sdk } = useSafe();
  const wallet = useAppWallet();

  const handleTXWrapped = useCallback(
    async (
      actionTitle: string,
      txEnvelope: TransactionEnvelope
    ): Promise<HandleTxWrappedResult> => {
      if (wallet.isSafeApp) {
        const response = await sdk?.txs.createProposal({
          display: {
            proposalName: actionTitle,
          },
          executeInstructions: txEnvelope.instructions,
          signers: txEnvelope.signers,
        });
        if (response) {
          allowRefreshSoon();
          try {
            void deposits10.refresh();
          } catch (e) {}

          return { success: !!response?.success };
        } else {
          return { success: false };
        }
      } else {
        const result = await statelessHandleTX(
          sail,
          actionTitle,
          txEnvelope,
          createExplorerLink
        );
        allowRefreshSoon();

        try {
          void deposits10.refresh();
        } catch (e) {
        } finally {
          return result;
        }
      }
    },
    [
      sail,
      allowRefreshSoon,
      deposits10,
      createExplorerLink,
      sdk?.txs,
      wallet.isSafeApp,
    ]
  );

  return { handleTXWrapped };
};

const statelessHandleTX = async (
  sail: UseSail,
  actionTitle: string,
  txEnvelope: TransactionEnvelope,
  createExplorerLink: (publicKey: string) => string
): Promise<HandleTxWrappedResult> => {
  const response = await sail.handleTX(txEnvelope);

  if (!response.success || !response.pending) {
    const errors = response.errors;
    const firstError = errors && errors.length ? errors[0] : null;

    let detailedErrorMessage = "Transaction unknown error.";
    let extraDetails = "";

    if (firstError) {
      // use token program error if error comes from token program
      const tokenProgramErrorMessage = Object.entries(
        TOKEN_PROGRAM_ERRORS
      ).find(([index]) =>
        firstError.message.includes(`custom program error: ${index}`)
      )?.[1];
      detailedErrorMessage = tokenProgramErrorMessage ?? firstError.message;
      extraDetails = tokenProgramErrorMessage ? firstError.message : "";

      const extractedLogs = extractLogs(firstError);
      console.error(firstError);
      if (extractedLogs) {
        const parsedError = FriktionSDK.parseError(extractedLogs);
        if (parsedError) {
          detailedErrorMessage = parsedError.mainMessage;
          extraDetails = parsedError.extraDetails;
        }
      }
    }

    if (detailedErrorMessage.includes("Blockhash not found")) {
      extraDetails = detailedErrorMessage
        .replace("Transaction processing failed: ", "")
        .replace("failed to send transaction: ", "")
        .trim();
      detailedErrorMessage =
        "RPC node is congested. Please try again in a few seconds.";
    }

    handleTxWrappedErrorToast(
      actionTitle,
      <div>
        {detailedErrorMessage}{" "}
        {extraDetails ? <ExtraDetails>{extraDetails}</ExtraDetails> : null}
      </div>
    );

    if (errors) {
      return {
        success: false,
        message: JSON.stringify(errors.map((error) => error.message)),
      };
    } else {
      return { success: false };
    }
  }

  const toastId = handleTxWrappedConfirmationToast(
    actionTitle,
    response.pending?.signature,
    createExplorerLink
  );

  try {
    const { blockhash, lastValidBlockHeight } =
      await response.pending.connection.getLatestBlockhash();

    const txResult = await response.pending.connection.confirmTransaction(
      {
        signature: response.pending.signature,
        blockhash,
        lastValidBlockHeight,
      },
      "confirmed"
    );

    if (txResult.value.err) {
      throw txResult.value.err;
    }
  } catch (e) {
    console.error(e);

    toast.dismiss(toastId);

    if (e instanceof Error) {
      handleTxWrappedErrorToast(actionTitle, <div>{e.message}</div>);

      return { success: false, message: e.message };
    }

    return { success: false };
  }

  toast.dismiss(toastId);
  handleTxWrappedPendingSuccessToast(
    actionTitle,
    response.pending?.signature,
    createExplorerLink
  );

  return { success: true };
};

/**
 * When using external SDKs like jup-ag, we want to have a similar tx ux
 */
export const handleTxWrappedErrorToast = (
  actionTitle: string,
  body: string | JSX.Element
) => {
  errorToast(`${actionTitle} error`, body);
};
export const handleTxWrappedPendingSuccessToast = (
  actionTitle: string,
  signature: string | undefined,
  createExplorerLink: (publicKey: string) => string
) => {
  const viewInExplorer = signature ? (
    <div>
      View in explorer:{" "}
      <a href={createExplorerLink(signature)} target="_blank" rel="noreferrer">
        [{actionTitle}]
      </a>
    </div>
  ) : (
    <div>Success</div>
  );

  //explorer.solana.com/tx/2Mm8AxCT4sSMcr99NkASGT29xJiCR65me9VmhWw46ZU5Q1DqN72TeAMXvbfdBA4KPwtQ854JwsLzBVKubufLYUBs?cluster=devnet
  successToast(`${actionTitle} success`, viewInExplorer);
};

/**
 * Use this ONLY for external APIs
 *
 * @deprecated
 */
export const handleTxWrappedPendingInfoToast = (
  actionTitle: string,
  signature: string | undefined,
  createExplorerLink: (publicKey: string) => string
) => {
  const viewInExplorer = signature ? (
    <div>
      View in explorer:{" "}
      <a href={createExplorerLink(signature)} target="_blank" rel="noreferrer">
        [{actionTitle}]
      </a>
    </div>
  ) : (
    <div>Transaction confirmed</div>
  );

  //explorer.solana.com/tx/2Mm8AxCT4sSMcr99NkASGT29xJiCR65me9VmhWw46ZU5Q1DqN72TeAMXvbfdBA4KPwtQ854JwsLzBVKubufLYUBs?cluster=devnet
  infoToast(`${actionTitle} confirmed`, viewInExplorer);
};

export const handleTxWrappedConfirmationToast = (
  actionTitle: string,
  signature: string | undefined,
  createExplorerLink: (publicKey: string) => string
) => {
  const viewInExplorer = (
    <div>
      View in explorer:{" "}
      <a
        href={createExplorerLink(signature ?? "")}
        target="_blank"
        rel="noreferrer"
      >
        [{actionTitle}]
      </a>
    </div>
  );

  return infoToast(`Confirming Transaction`, viewInExplorer, {
    autoClose: false,
    closeButton: false,
    icon: <ConfirmationSpinner />,
  });
};

const ExtraDetails = styled.div`
  font-size: 12px;
  opacity: 0.7;
`;

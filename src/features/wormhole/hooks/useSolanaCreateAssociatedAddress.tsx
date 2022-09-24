import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { useCallback } from "react";
import { useProviders } from "../../../hooks/useProvider";
import { CrossChainDepositError } from "../constants/CrossChainDepositError";
import { Transaction as WormholeTransaction } from "../components/WormholeProgressProvider";
import { Wallet } from "@saberhq/solana-contrib";
import { useAppWallet } from "features/wallet";

const getIsAssociatedAccountExists = async (
  wallet: Wallet,
  connection: Connection,
  mintAddress: string,
  readableTargetAddress: string
) => {
  const mintPublicKey = new PublicKey(mintAddress);

  const associatedTokenAccount = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    mintPublicKey,
    wallet.publicKey
  );
  const match = associatedTokenAccount.toString() === readableTargetAddress;
  if (match) {
    const associatedAddressInfo = await connection.getAccountInfo(
      associatedTokenAccount
    );
    return {
      exists: !!associatedAddressInfo,
      associatedTokenAccount,
    };
  } else {
    // this code should never run as user should not be able to continue deposit if the connected wallet is different
    throw new CrossChainDepositError({
      message: "",
      info: "Derived address does not match the target address. Do you have the same Solana wallet connected?",
    });
  }
};

interface UseSolanaCreateAssociatedAddressProps {
  targetAsset: string | undefined;
  readableTargetAddress: string | undefined;
  wormholeTransactionInfo: WormholeTransaction | null;
}
export const useSolanaCreateAssociatedAddress = ({
  targetAsset,
  readableTargetAddress,
  wormholeTransactionInfo,
}: UseSolanaCreateAssociatedAddressProps) => {
  const { providerMut } = useProviders();
  const { sendTransaction } = useAppWallet();

  const createAssociatedAddress = useCallback(async () => {
    if (providerMut && targetAsset && readableTargetAddress) {
      const mintPublicKey = new PublicKey(targetAsset);
      const { exists, associatedTokenAccount } =
        await getIsAssociatedAccountExists(
          providerMut.wallet,
          providerMut.connection,
          targetAsset,
          (wormholeTransactionInfo &&
            wormholeTransactionInfo.readableTargetAddress) ||
            readableTargetAddress
        );

      if (!exists) {
        const transaction = new Transaction().add(
          Token.createAssociatedTokenAccountInstruction(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            mintPublicKey,
            associatedTokenAccount,
            providerMut.wallet.publicKey,
            providerMut.wallet.publicKey
          )
        );

        const { blockhash, lastValidBlockHeight } =
          await providerMut.connection.getLatestBlockhash();

        const txid = await sendTransaction(transaction, providerMut.connection);
        const txResult = await providerMut.connection.confirmTransaction({
          signature: txid,
          blockhash,
          lastValidBlockHeight,
        });
        if (txResult.value.err) {
          throw txResult.value.err;
        }
      }
    }
  }, [
    providerMut,
    targetAsset,
    readableTargetAddress,
    wormholeTransactionInfo,
    sendTransaction,
  ]);

  if (!providerMut || !targetAsset || !readableTargetAddress) {
    return null;
  }

  return createAssociatedAddress;
};

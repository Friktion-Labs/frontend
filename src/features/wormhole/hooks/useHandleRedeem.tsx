import { Wallet } from "@saberhq/solana-contrib";
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { useCallback, useMemo } from "react";
import { useAppConnection } from "features/connection";
import {
  CHAIN_ID_SOLANA,
  chunks,
  importCoreWasm,
  ixFromRust,
  redeemOnSolana,
} from "@certusone/wormhole-sdk";
import {
  getDepositToastTitleBase,
  getBridgeAddressForChain,
  getTokenBridgeAddressForChain,
  AllAssetsUnion,
} from "../constants/constants";
import { sendAndConfirmTransactionsWithRetry } from "../utils/sendAndConfirmTransactionsWithRetry";
import { useExplorerLink } from "hooks/useExplorerLink";
import { useProviders } from "hooks/useProvider";
import { useAppWallet } from "features/wallet";

async function createVerifySignaturesInstructions(
  connection: Connection,
  bridge_id: string,
  payer: string,
  vaa: Buffer,
  signature_set: Keypair
): Promise<TransactionInstruction[]> {
  const output: TransactionInstruction[] = [];
  const {
    guardian_set_address,
    parse_guardian_set,
    parse_vaa,
    verify_signatures_ix,
  } = await importCoreWasm();
  const { guardian_set_index } = parse_vaa(new Uint8Array(vaa));
  let guardian_addr = new PublicKey(
    guardian_set_address(bridge_id, guardian_set_index)
  );
  let acc = await connection.getAccountInfo(guardian_addr);
  if (acc?.data === undefined) {
    return output;
  }
  let guardian_data = parse_guardian_set(new Uint8Array(acc?.data));

  let txs = verify_signatures_ix(
    bridge_id,
    payer,
    guardian_set_index,
    guardian_data,
    signature_set.publicKey.toString(),
    vaa
  );
  // Add transfer instruction to transaction
  for (let tx of txs) {
    let ixs: Array<TransactionInstruction> = tx.map((v: any) => {
      return ixFromRust(v);
    });
    output.push(ixs[0], ixs[1]);
  }
  return output;
}

async function createPostVaaInstruction(
  bridge_id: string,
  payer: string,
  vaa: Buffer,
  signatureSetKeypair: Keypair
): Promise<TransactionInstruction> {
  const { post_vaa_ix } = await importCoreWasm();
  return ixFromRust(
    post_vaa_ix(bridge_id, payer, signatureSetKeypair.publicKey.toString(), vaa)
  );
}

async function postVaaWithRetry(
  connection: Connection,
  wallet: Wallet,
  createExplorerLink: (publicKey: string) => string,
  bridge_id: string,
  payer: string,
  vaa: Buffer,
  setToastContent: React.Dispatch<React.SetStateAction<JSX.Element[]>>
) {
  const unsignedTransactions: Transaction[] = [];
  const signature_set = Keypair.generate();
  const instructions = await createVerifySignaturesInstructions(
    connection,
    bridge_id,
    payer,
    vaa,
    signature_set
  );
  const finalInstruction = await createPostVaaInstruction(
    bridge_id,
    payer,
    vaa,
    signature_set
  );
  if (!finalInstruction) {
    return Promise.reject("Failed to construct the transaction.");
  }

  //The verify signatures instructions can be batched into groups of 2 safely,
  //reducing the total number of transactions.
  const batchableChunks = chunks(instructions, 2);
  batchableChunks.forEach((chunk) => {
    let transaction;
    if (chunk.length === 1) {
      transaction = new Transaction().add(chunk[0]);
    } else {
      transaction = new Transaction().add(chunk[0], chunk[1]);
    }
    unsignedTransactions.push(transaction);
  });

  await sendAndConfirmTransactionsWithRetry(
    connection,
    (transaction: Transaction) => {
      transaction.partialSign(signature_set);
      return wallet.signTransaction(transaction);
    },
    payer,
    unsignedTransactions,
    5,
    (txid, currentRetries, currentIndex) => {
      if (currentRetries === 0 && currentIndex === 0) {
        setToastContent((content) => [
          ...content,
          <div>
            Transaction {content.length + 1}:{" "}
            <a href={createExplorerLink(txid)} target="_blank" rel="noreferrer">
              [Verify Signatures]
            </a>
          </div>,
        ]);
      } else {
        setToastContent((content) => {
          const newContent = [...content];
          const transactionIndex = content.length - 1;
          newContent[transactionIndex] = (
            <div>
              Transaction {content.length}:{" "}
              <a
                href={createExplorerLink(txid)}
                target="_blank"
                rel="noreferrer"
              >
                [Verify Signatures]
              </a>
            </div>
          );
          return newContent;
        });
      }
    }
  );

  const transaction = new Transaction().add(finalInstruction);

  await sendAndConfirmTransactionsWithRetry(
    connection,
    (transaction: Transaction) => wallet.signTransaction(transaction),
    payer,
    [transaction],
    5,
    (txid) => {
      setToastContent((content) => {
        const newContent = [...content];
        const transactionIndex = content.length - 1;
        newContent[transactionIndex] = (
          <div>
            Transaction {content.length}:{" "}
            <a href={createExplorerLink(txid)} target="_blank" rel="noreferrer">
              [Verify Signatures]
            </a>
          </div>
        );
        return newContent;
      });
    }
  );
}

export const useHandleRedeem = () => {
  const { createExplorerLink } = useExplorerLink();
  const { providerMut } = useProviders();
  const { sendTransaction } = useAppWallet();

  const { network } = useAppConnection();
  const solBridgeAddress = useMemo(
    () => getBridgeAddressForChain(CHAIN_ID_SOLANA, network),
    [network]
  );
  const solTokenBridgeAddress = useMemo(
    () => getTokenBridgeAddressForChain(CHAIN_ID_SOLANA, network),
    [network]
  );

  const handleRedeem = useCallback(
    async (
      wormholeAsset: AllAssetsUnion,
      signedVAA: Uint8Array,
      setToastContent: React.Dispatch<React.SetStateAction<JSX.Element[]>>,
      setToastTitle: (value: React.SetStateAction<string>) => void
    ) => {
      if (providerMut) {
        await postVaaWithRetry(
          providerMut.connection,
          providerMut.wallet,
          createExplorerLink,
          solBridgeAddress,
          providerMut.wallet.publicKey.toString(),
          Buffer.from(signedVAA),
          setToastContent
        );

        setToastTitle(getDepositToastTitleBase(wormholeAsset) + "(3 / 3)");

        const transaction = await redeemOnSolana(
          providerMut.connection,
          solBridgeAddress,
          solTokenBridgeAddress,
          providerMut.wallet.publicKey.toString(),
          signedVAA
        );
        const { blockhash, lastValidBlockHeight } =
          await providerMut.connection.getLatestBlockhash();

        const txid = await sendTransaction(transaction, providerMut.connection);
        setToastContent((content) => [
          ...content,
          <div>
            Transaction {content.length + 1}:{" "}
            <a href={createExplorerLink(txid)} target="_blank" rel="noreferrer">
              [Redeem Tokens]
            </a>
          </div>,
        ]);
        const txResult = await providerMut.connection.confirmTransaction({
          signature: txid,
          blockhash,
          lastValidBlockHeight,
        });
        if (txResult.value.err) {
          throw txResult.value.err;
        }
      }
    },
    [
      providerMut,
      createExplorerLink,
      solBridgeAddress,
      solTokenBridgeAddress,
      sendTransaction,
    ]
  );

  if (!providerMut) {
    return null;
  }

  return handleRedeem;
};

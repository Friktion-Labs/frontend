import { Connection, PublicKey, Transaction } from "@solana/web3.js";

export async function sendAndConfirmTransactionsWithRetry(
  connection: Connection,
  signTransaction: (transaction: Transaction) => Promise<Transaction>,
  payer: string,
  unsignedTransactions: Transaction[],
  maxRetries: number = 0,
  onGetTxId?: (
    txid: string,
    currentRetries: number,
    currentIndex: number
  ) => void
) {
  if (!(unsignedTransactions && unsignedTransactions.length)) {
    throw new Error("No transactions provided to send.");
  }
  let currentRetries = 0;
  let currentIndex = 0;
  const transactionReceipts = [];
  while (
    !(currentIndex >= unsignedTransactions.length) &&
    !(currentRetries > maxRetries)
  ) {
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();
    let transaction = unsignedTransactions[currentIndex];
    transaction.feePayer = new PublicKey(payer);
    transaction.recentBlockhash = blockhash;

    let signed = null;

    signed = await signTransaction(transaction);

    const txid = await connection.sendRawTransaction(signed.serialize());

    try {
      if (onGetTxId) {
        onGetTxId(txid, currentRetries, currentIndex);
      }
      const receipt = await connection.confirmTransaction({
        signature: txid,
        blockhash,
        lastValidBlockHeight,
      });
      transactionReceipts.push(receipt);

      if (receipt.value.err) {
        throw receipt.value.err;
      }

      currentIndex++;
    } catch (e) {
      currentRetries++;
    }
  }

  if (currentRetries > maxRetries) {
    throw new Error("Reached the maximum number of retries.");
  } else {
    return transactionReceipts;
  }
}

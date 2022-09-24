import { CoinbaseWalletName } from "@solana/wallet-adapter-wallets";
import { Transaction } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { initialState } from "../constants/initialState";
import { WalletState } from "../types/WalletState";

interface CoinbaseWindow extends Window {
  coinbaseSolana?: any;
}
declare const window: CoinbaseWindow;

/**
 * Coinbase Wallet has broken methods that we will monkey patch here
 */
export const usePatchedWalletAdapter = (): [
  WalletState,
  React.Dispatch<React.SetStateAction<WalletState>>
] => {
  const [
    { wallet, adapter, publicKey, connected, isSafeApp, walletPublicKey },
    setState,
  ] = useState(initialState);

  useEffect(() => {
    if (
      adapter &&
      adapter.name === CoinbaseWalletName &&
      "signAllTransactions" in adapter
    ) {
      // base copied from https://github.com/coinbase/coinbase-wallet-sdk/blob/master/packages/wallet-sdk/src/provider/SolanaProvider.ts#L281
      // and edited to fix errors with signAllTransactions
      adapter.signAllTransactions = async (transactions: any[]) => {
        const coinbaseAdapter = window.coinbaseSolana!;
        const method = "signAllTransactions";
        coinbaseAdapter.checkWalletConnected(method);

        return new Promise((resolve, reject) => {
          try {
            const serializedTransactions = transactions.map((transaction) => {
              return [...transaction.serialize({ verifySignatures: false })];
            });
            coinbaseAdapter.request(
              {
                method,
                params: {
                  transactions: serializedTransactions,
                },
              },
              (
                signedTransactionsArray: number[][] | number[] | undefined,
                error: any
              ) => {
                if (!signedTransactionsArray) {
                  return reject(
                    new Error(
                      "An unexpected error has occurred. Please refresh the page and try again."
                    )
                  );
                }
                const signedTransactionsArrayParsed =
                  signedTransactionsArray.length > 0 &&
                  typeof signedTransactionsArray[0] === "number"
                    ? [signedTransactionsArray as number[]] // force create 2D array if passed array isn't 2D
                    : (signedTransactionsArray as number[][]);

                if (!error) {
                  try {
                    const parsedTransactions =
                      signedTransactionsArrayParsed.map((txArray: number[]) => {
                        return Transaction.from(txArray);
                      });
                    const allTransactionsAreSigned = parsedTransactions.every(
                      (tx) => tx.signature
                    );
                    if (allTransactionsAreSigned) {
                      resolve(parsedTransactions as any);
                    }
                  } catch (e) {
                    reject(e);
                  }
                }
                return reject(
                  error ??
                    coinbaseAdapter.getErrorResponse(
                      method,
                      "Could not sign transactions"
                    )
                );
              }
            );
          } catch (error) {
            reject(error);
          }
        });
      };
    }
  }, [adapter]);

  return [
    { wallet, adapter, publicKey, connected, isSafeApp, walletPublicKey },
    setState,
  ];
};

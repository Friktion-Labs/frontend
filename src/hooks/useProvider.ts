import { AnchorProvider } from "@project-serum/anchor";
import { useMemo } from "react";
import { ConfirmOptions, Keypair } from "@solana/web3.js";
import { SignerWallet, SolanaProvider } from "@saberhq/solana-contrib";
import { useAppWallet } from "features/wallet";
import { useAppConnection } from "features/connection";

const throwawayKeypair = new Keypair();
const throwawayWallet = new SignerWallet(throwawayKeypair);

const PROVIDER_OPTIONS: ConfirmOptions = {
  preflightCommitment: "processed",
  commitment: "processed",
};

/**
 * readonlyProvider is an Anchor Provider
 * providerMut is a SolanaProvider with the user wallet
 */
export const useProviders = () => {
  const { connection } = useAppConnection();
  const { publicKey, signAllTransactions, signTransaction } = useAppWallet();

  const providerMut = useMemo(() => {
    if (!publicKey || !signAllTransactions || !signTransaction) return null;

    return SolanaProvider.load({
      connection,
      sendConnection: connection,
      wallet: { publicKey, signAllTransactions, signTransaction },
      opts: PROVIDER_OPTIONS,
    });
  }, [publicKey, signAllTransactions, signTransaction, connection]);

  const rpcEndpoint = connection.rpcEndpoint;

  // When switching network, a reload is needed
  // Update connection when rpc endpoint is changed
  const frozenConnection = useMemo(() => {
    return connection;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rpcEndpoint]);

  const readonlyProvider = useMemo(() => {
    return new AnchorProvider(
      frozenConnection,
      throwawayWallet,
      PROVIDER_OPTIONS
    );
  }, [frozenConnection]);

  return { readonlyProvider, providerMut };
};

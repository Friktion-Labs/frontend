import { useAppConnection } from "features/connection";
import { Network } from "@saberhq/solana-contrib";
import bs58 from "bs58";

type LinkGenerator = (publicKey: string, network: Network) => string;

export const generateSolscanLink: LinkGenerator = (
  publicKey: string,
  network: Network
) => {
  const EXPLORER_BASE_URL = "https://solscan.io";

  let path = "tx";
  const trimmedPublicKey = publicKey.trim().replaceAll(/(\r\n|\r|\n|\t)/g, "");

  try {
    const decoded = bs58.decode(trimmedPublicKey);

    if (decoded.length === 32) {
      path = "account";
    } else if (decoded.length === 64) {
      path = "tx";
    } else {
      throw new Error();
    }
  } catch {
    // ignore base58 decoding errors or other parsing errors
    console.warn(
      `publicKey "${trimmedPublicKey}" is neither an account or transaction!`
    );
  }

  return `${EXPLORER_BASE_URL}/${path}/${trimmedPublicKey}${
    network !== "mainnet-beta" ? `?cluster=${network}` : ""
  }`;
};

export const generateSolanaFmLink: LinkGenerator = (
  publicKey: string,
  network: Network
) => {
  const EXPLORER_BASE_URL = "https://solana.fm";

  let path = "tx";
  const trimmedPublicKey = publicKey.trim().replaceAll(/(\r\n|\r|\n|\t)/g, "");

  try {
    const decoded = bs58.decode(trimmedPublicKey);

    if (decoded.length === 32) {
      path = "address";
    } else if (decoded.length === 64) {
      path = "tx";
    } else {
      throw new Error();
    }
  } catch {
    // ignore base58 decoding errors or other parsing errors
    console.warn(
      `publicKey "${trimmedPublicKey}" is neither an account or transaction!`
    );
  }

  return `${EXPLORER_BASE_URL}/${path}/${trimmedPublicKey}${
    network !== "mainnet-beta" ? `?cluster=${network}` : ""
  }`;
};

export const useExplorerLink = () => {
  const { network } = useAppConnection();

  return {
    createExplorerLink: (
      publicKey: string,
      linkGenerator: LinkGenerator = generateSolscanLink
    ) => linkGenerator(publicKey, network),
  };
};

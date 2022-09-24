import { Interpolation, Theme } from "@emotion/react";
import { Network } from "@saberhq/solana-contrib";
import {
  useExplorerLink,
  generateSolanaFmLink,
} from "../hooks/useExplorerLink";
import { UltraToken } from "./registry10";

export const TokenLink = ({
  network,
  token,
  useSolanaFm,
  ...rest
}: {
  network: Network;
  token: UltraToken;
  useSolanaFm?: boolean;
  css?: Interpolation<Theme>;
  className?: string;
}) => {
  const { createExplorerLink } = useExplorerLink();

  return token.mintAccount.toString() ===
    "So11111111111111111111111111111111111111112" ? (
    network === "mainnet-beta" ? (
      <>Native SOL</>
    ) : (
      <>Devnet SOL</>
    )
  ) : (
    <a
      {...rest}
      href={createExplorerLink(
        token.mintAccount.toBase58(),
        useSolanaFm ? generateSolanaFmLink : undefined
      )}
      target="_blank"
      rel="noreferrer"
    >
      {token.name}
    </a>
  );
};

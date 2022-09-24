import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAppWallet } from "features/wallet";
import { useProviders } from "../hooks/useProvider";
import {
  JupiterProvider,
  useJupiter as useJupiterReal,
} from "@jup-ag/react-hook";
import { getPlatformFeeAccounts, PlatformFeeAndAccounts } from "@jup-ag/core";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { Goodies } from "./Button09";
import { STRONG_SUBVOLTS } from "./registry10";
import { getOrCreateATA } from "@saberhq/token-utils";
import { useAppConnection } from "features/connection";
import { TransactionEnvelope } from "@saberhq/solana-contrib";

import { useFriktionSDK } from "../hooks/useFriktionSDK";
/**
 * TokenInfo.
 */
export interface SPLTokenInfo {
  readonly chainId: number;
  readonly address: string;
  readonly name: string;
  readonly decimals: number;
  readonly symbol: string;
  readonly logoURI?: string;
  readonly tags?: string[];
}

export type UseJupiterResult = ReturnType<typeof useJupiterReal>;
const TOKEN_LIST_URL = {
  devnet: "https://api.jup.ag/api/tokens/devnet",
  testnet: "https://api.jup.ag/api/markets/devnet",
  "mainnet-beta": "https://cache.jup.ag/tokens",
};
type JupiterProviderWrapperType = {
  tokenList: SPLTokenInfo[];
};
const EMPTY_LIST: SPLTokenInfo[] = [];
export const JupiterWrapperContext = createContext<JupiterProviderWrapperType>({
  tokenList: EMPTY_LIST,
});

const ALL_DEPOSIT_TOKEN_MINTS: string[] = [];
for (const [, def] of Object.entries(STRONG_SUBVOLTS)) {
  if (def.network === "mainnet-beta") {
    if (
      !ALL_DEPOSIT_TOKEN_MINTS.includes(def.depositToken.mintAccount.toString())
    ) {
      ALL_DEPOSIT_TOKEN_MINTS.push(def.depositToken.mintAccount.toString());
    }
  }
}

export const JupiterWrapperProvider: React.FC<PropsWithChildren<unknown>> = ({
  children,
}) => {
  const { network } = useAppConnection();
  const { publicKey } = useAppWallet();
  const { readonlyProvider } = useProviders();
  const sdk = useFriktionSDK();

  const [tokenList, setTokenList] = useState<SPLTokenInfo[]>(EMPTY_LIST);
  useEffect(() => {
    // Fetch token list from Jupiter API
    fetch(TOKEN_LIST_URL[network as "mainnet-beta" | "devnet"])
      .then((response) => response.json())
      .then((result) => setTokenList(result));
  }, [network]);

  const JUP_PLATFORM_FEE_ACCOUNTS: PlatformFeeAndAccounts =
    sdk.net.JUP_PLATFORM_FEE_ACCOUNTS;

  if (
    window.location.hostname === "localhost" &&
    JUP_PLATFORM_FEE_ACCOUNTS.feeAccounts.size !==
      ALL_DEPOSIT_TOKEN_MINTS.length
  ) {
    console.warn("Jup ag ATA fee accounts. Need to create more ATAs");
    console.warn("ALL_DEPOSIT_TOKEN_MINTS", ALL_DEPOSIT_TOKEN_MINTS);
    console.warn("JUP_PLATFORM_FEE_ACCOUNTS", JUP_PLATFORM_FEE_ACCOUNTS);
    console.warn(
      "DONT IGNORE THIS!!! This means you are launching a new token and need to ask someone to press a button and update something."
    );
    console.warn(
      "DONT IGNORE THIS!!! This means you are launching a new token and need to ask someone to press a button and update something."
    );
    console.warn(
      "DONT IGNORE THIS!!! This means you are launching a new token and need to ask someone to press a button and update something."
    );
    console.warn(
      "DONT IGNORE THIS!!! This means you are launching a new token and need to ask someone to press a button and update something."
    );
  }

  const providerResult = useMemo(() => {
    return {
      tokenList,
    };
  }, [tokenList]);

  return (
    <JupiterWrapperContext.Provider value={providerResult}>
      {/* @ts-ignore */}
      <JupiterProvider
        cluster={network as "mainnet-beta" | "devnet"}
        connection={readonlyProvider.connection}
        userPublicKey={publicKey ? publicKey : undefined}
        platformFeeAndAccounts={JUP_PLATFORM_FEE_ACCOUNTS}
      >
        {children}
      </JupiterProvider>
    </JupiterWrapperContext.Provider>
  );
};
export const useJupiterWrapper = () => useContext(JupiterWrapperContext);
export const useJupiter = useJupiterReal;

export const createSomeMorePlatformFeeATAs = async (goodies: Goodies) => {
  console.log(ALL_DEPOSIT_TOKEN_MINTS);
  console.log("Creating", goodies);

  let feeAccounts = await getPlatformFeeAccounts(
    goodies.providerMut.connection,
    new PublicKey("GE8NJKn3M6cWVytXomdqvqeUWKHBCwBqgSHPRRLNjGNc") // friktion
  );

  console.log(feeAccounts);

  const ixs: TransactionInstruction[] = [];

  for (const mintAccount of ALL_DEPOSIT_TOKEN_MINTS) {
    const found = feeAccounts.get(mintAccount);
    if (!found && ixs.length < 6) {
      const { instruction } = await getOrCreateATA({
        provider: goodies.providerMut,
        mint: new PublicKey(mintAccount),
        owner: new PublicKey("GE8NJKn3M6cWVytXomdqvqeUWKHBCwBqgSHPRRLNjGNc"), // friktion
      });
      if (instruction) {
        ixs.push(instruction);
      }
    }
  }
  if (ixs.length > 0) {
    const tx = new TransactionEnvelope(goodies.providerMut, ixs);
    goodies.handleTXWrapped("Create Platform Fee ATAs", tx);
  }

  feeAccounts = await getPlatformFeeAccounts(
    goodies.providerMut.connection,
    new PublicKey("GE8NJKn3M6cWVytXomdqvqeUWKHBCwBqgSHPRRLNjGNc") // friktion
  );
  console.log("feeAccounts is now", feeAccounts);

  const feeEntries = feeAccounts.entries();

  // sort the iterable feeEntries
  const sortedFeeEntries = [...feeEntries].sort((a, b) => {
    return a[0].localeCompare(b[0]);
  });

  let code = `  feeAccounts: new Map([
${sortedFeeEntries
  .map(([mintAccount, publicKey]) => {
    return `    [
      "${mintAccount}",
      new PublicKey("${publicKey.toString()}"),
    ],
`;
  })
  .join("")}  ]),`;
  console.log(code);
};

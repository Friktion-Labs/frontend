import {
  SystemProgram,
  Account,
  Connection,
  PublicKey,
  Signer,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  AccountLayout,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { EwwTokenAccount } from "../all_types";
import * as anchor from "@project-serum/anchor";
import { Decimal } from "decimal.js";

export const initializeTokenAccountTx = async ({
  connection,
  extraLamports = 0,
  payerKey,
  mintPublicKey,
  owner,
  rentBalance,
}: {
  connection: Connection;
  extraLamports?: number;
  payerKey: PublicKey;
  mintPublicKey: PublicKey;
  owner: PublicKey;
  rentBalance: number;
}): Promise<{
  instructions: TransactionInstruction[];
  newTokenAccount: Account;
}> => {
  const newAccount = new Account();
  const instructions: TransactionInstruction[] = [];

  let _rentBalance = rentBalance;
  if (!rentBalance) {
    _rentBalance = await connection.getMinimumBalanceForRentExemption(
      AccountLayout.span
    );
  }

  instructions.push(
    SystemProgram.createAccount({
      fromPubkey: payerKey,
      newAccountPubkey: newAccount.publicKey,
      lamports: _rentBalance + extraLamports,
      space: AccountLayout.span,
      programId: TOKEN_PROGRAM_ID,
    })
  );

  instructions.push(
    Token.createInitAccountInstruction(
      TOKEN_PROGRAM_ID,
      mintPublicKey,
      newAccount.publicKey,
      owner
    )
  );

  return { instructions, newTokenAccount: newAccount };
};

export const getHighestAccount = (
  accounts: EwwTokenAccount[]
): EwwTokenAccount | null => {
  if (!accounts) return null;
  if (accounts.length === 0) return null;
  if (accounts.length === 1) return accounts[0];
  return accounts.sort((a, b) => {
    if (b.amount.gt(a.amount)) {
      return 1;
    } else {
      return -1;
    }
  })[0];
};

const accountBalanceCache: Record<
  string,
  | {
      updated: number;
      balance: Decimal;
    }
  | undefined
> = {};

const mintSupplyBalanceCache: Record<
  string,
  | {
      updated: number;
      supply: Decimal;
    }
  | undefined
> = {};

let cacheHitCount = 0;
export const getAccountBalance = async (
  connection: Connection,
  mintAddress: PublicKey,
  tokenAccount: PublicKey
): Promise<Decimal> => {
  const token = new Token(
    connection,
    mintAddress,
    TOKEN_PROGRAM_ID,
    null as unknown as Signer
  );

  const cacheHit = accountBalanceCache[tokenAccount.toBase58()];
  if (cacheHit && Date.now() - cacheHit.updated < 10000) {
    cacheHitCount++;
    if (cacheHitCount % 10 === 0 && window.location.hostname === "localhost") {
      // console.log("Cache hit", cacheHitCount);
    }
    return cacheHit.balance;
  }

  try {
    const account = await token.getAccountInfo(tokenAccount);
    const balance = new Decimal(account.amount.toString());
    accountBalanceCache[tokenAccount.toBase58()] = {
      balance,
      updated: Date.now(),
    };

    return balance;
  } catch (e) {
    console.error("Please make ticket in Discord! And provide following info:");
    console.error("Token: ", token.publicKey.toString());
    console.error("TokenAccount: ", tokenAccount.toString());
    console.error(e);
    return new Decimal(0);
  }
};

export const getAccountBalanceOrZero = async (
  connection: Connection,
  mintAddress: PublicKey,
  tokenAccount: PublicKey
): Promise<Decimal> => {
  try {
    const balance = await getAccountBalance(
      connection,
      mintAddress,
      tokenAccount
    );

    return balance;
  } catch (err) {
    console.error(err);
    return new Decimal(0);
  }
};

export const getMintSupply = async (
  connection: Connection,
  vaultMint: PublicKey
): Promise<Decimal> => {
  const token = new Token(
    connection,
    vaultMint,
    TOKEN_PROGRAM_ID,
    null as unknown as Signer
  );

  const cacheHit = mintSupplyBalanceCache[vaultMint.toBase58()];
  if (cacheHit && Date.now() - cacheHit.updated < 10000) {
    cacheHitCount++;
    if (cacheHitCount % 10 === 0 && window.location.hostname === "localhost") {
      // console.log("Cache hit", cacheHitCount);
    }
    return cacheHit.supply;
  }

  try {
    const mintInfo = await token.getMintInfo();
    const supply = new Decimal(mintInfo.supply.toString());
    mintSupplyBalanceCache[vaultMint.toBase58()] = {
      supply,
      updated: Date.now(),
    };
    return supply;
  } catch (e) {
    console.error(e);
    return new Decimal(0);
  }
};

export const getMintSupplyOrZero = async (
  connection: Connection,
  vaultMint: PublicKey
): Promise<Decimal> => {
  try {
    return await getMintSupply(connection, vaultMint);
  } catch (err) {
    console.log(err);
    return new Decimal(0);
  }
};

/**
 * @deprecated use getOrCreateATA instead
 */
export const createAssociatedTokenAccountInstruction = async (
  mint: PublicKey,
  walletPubKey: PublicKey
): Promise<{
  tokenDest: PublicKey;
  createTokenAccountIx: anchor.web3.TransactionInstruction;
}> => {
  const tokenDest = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    mint,
    walletPubKey,
    true
  );

  const createTokenAccountIx = Token.createAssociatedTokenAccountInstruction(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    mint,
    tokenDest,
    walletPubKey,
    walletPubKey
  );

  return { tokenDest, createTokenAccountIx };
};

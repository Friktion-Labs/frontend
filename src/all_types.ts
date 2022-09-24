import { PublicKey, Signer, Transaction } from "@solana/web3.js";
import { Decimal } from "decimal.js";

export type EwwTokenAccount = {
  amount: Decimal;
  mint: PublicKey;
  // public key for the specific token account (NOT the wallet)
  pubKey: PublicKey;
};

export interface CreateNewTokenAccountResponse extends InstructionResponse {
  newTokenAccount: Signer;
}

export type InstructionResponse = {
  transaction: Transaction;
  signers: Signer[];
};

/**
 * This file is for pure functions only. They are to extract some of the
 * complexities out of the application code, while still allowing the application to
 * fetch and update data in their own manner.
 */

import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

/**
 * Create and initialize a Associated SPL Token account for the provided owner.
 *
 * TODO: refactor to use the SPL Token JS library (https://github.com/solana-labs/solana-program-library/blob/master/token/js/client/token.js#L2306)
 */
export const createAssociatedTokenAccountInstruction = async ({
  payer,
  owner,
  mintPublicKey,
}: {
  payer: PublicKey;
  owner: PublicKey;
  mintPublicKey: PublicKey;
}): Promise<[TransactionInstruction, PublicKey]> => {
  const [associatedTokenPublicKey] = await PublicKey.findProgramAddress(
    [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mintPublicKey.toBuffer()],
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  );
  const ix = new TransactionInstruction({
    keys: [
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: associatedTokenPublicKey, isSigner: false, isWritable: true },
      { pubkey: owner, isSigner: false, isWritable: false },
      { pubkey: mintPublicKey, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    ],
    programId: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  });

  return [ix, associatedTokenPublicKey];
};

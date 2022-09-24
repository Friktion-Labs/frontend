import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import BN from "bn.js";

const FAUCET_PROGRAM_ID = new PublicKey(
  "4bXpkKSV8swHSnwqtzuboGPaPDeEgAn4Vt8GfarV5rZt"
);
const getPDA = () =>
  PublicKey.findProgramAddress([Buffer.from("faucet")], FAUCET_PROGRAM_ID);

export const buildAirdropTokensIx = async (
  amount: BN,
  adminPubkey: PublicKey,
  tokenMintPublicKey: PublicKey,
  destinationAccountPubkey: PublicKey,
  faucetPubkey: PublicKey
): Promise<TransactionInstruction> => {
  const pubkeyNonce = await getPDA();

  const keys = [
    { pubkey: pubkeyNonce[0], isSigner: false, isWritable: false },
    {
      pubkey: tokenMintPublicKey,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: destinationAccountPubkey, isSigner: false, isWritable: true },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    { pubkey: faucetPubkey, isSigner: false, isWritable: false },
  ];

  if (adminPubkey) {
    keys.push({
      pubkey: adminPubkey,
      isSigner: true,
      isWritable: false,
    });
  }

  return new TransactionInstruction({
    programId: FAUCET_PROGRAM_ID,
    data: Buffer.from([1, ...amount.toArray("le", 8)]),
    keys,
  });
};

import { EwwTokenAccount as AllTypeTokenAccount } from "../all_types";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { TokenInfo } from "@solana/spl-token-registry";
import Decimal from "decimal.js";
import { getHighestAccount } from "./token";
import { FriktionSDK, RoundWithKey } from "@friktion-labs/friktion-sdk";
import { Token } from "@saberhq/token-utils";
import { EvilVaultForAsset } from "../contexts/EvilTwinSisterOfVFAC";
import { GlobalId } from "../09/registry10";

export type KnownTokenMap = Map<string, TokenInfo>;

/**
 * Still better to use:
 *  val?.thing ?? defaultValue
 * @deprecated Stop using this. Just use if (val) or use val?.thing ?? defaultValue
 */
export function isNullOrUndefined<T>(
  val: T | null | undefined
): val is null | undefined {
  return val === null || val === undefined;
}

/**
 * @deprecated Don't use this, it might not work
 */
export const getAssetBalanceNew = async (
  connection: Connection,
  walletPublicKey: PublicKey,
  ownedTokenAccounts: Record<string, AllTypeTokenAccount[]> | null,
  token: Token
): Promise<Decimal | null> => {
  let amount;

  if (
    token.mintAccount.toString() !==
    "So11111111111111111111111111111111111111112"
  ) {
    if (ownedTokenAccounts) {
      const assetAccount = getHighestAccount(
        ownedTokenAccounts[token.mintAccount.toString()] || []
      );
      const normFactor = 10 ** token.decimals;
      amount = assetAccount
        ? assetAccount.amount.div(normFactor)
        : new Decimal(0);
    } else {
      return null;
    }
    // console.log(amount.toString(), token.symbol, assetAccount);
  } else {
    const lamports = await connection.getBalance(walletPublicKey);
    amount = new Decimal(lamports / LAMPORTS_PER_SOL);
  }

  return amount;
};

/**
 * @deprecated We shouldn't be loading using .fetch()
 */
export const getRoundInfo = async (
  friktionSDK: FriktionSDK,
  vault: EvilVaultForAsset,
  roundNumber: BN
): Promise<RoundWithKey | null> => {
  if (isNullOrUndefined(vault) || isNullOrUndefined(roundNumber)) {
    return null;
  }

  let roundInfo: RoundWithKey | null;
  try {
    const voltSdk = friktionSDK.loadSimpleVoltSDK(
      vault.rawVoltInfo.key,
      vault.rawVoltInfo
    );
    roundInfo = await voltSdk.getRoundByNumber(roundNumber);
  } catch (err) {
    console.log(err);
    roundInfo = null;
  }

  // might have to normalize optionMarket.underlyingamountpercontract as well. normalizationafctor is just 10^(num decimals) in order to make
  // the output human readable (aka 1000000 btc token => 0.01 btc);
  return roundInfo;
};

export const isBigEnoughChange = (
  a: Record<GlobalId, Decimal | null> | null,
  b: Record<GlobalId, Decimal | null> | null
): boolean => {
  if ((a === null && b !== null) || (a !== null && b === null)) {
    return true;
  }
  if (a !== null && b !== null) {
    for (const [key, aDecimal] of Object.entries(a)) {
      const bDecimal = b[key as GlobalId];
      if (
        (bDecimal === null && aDecimal !== null) ||
        (bDecimal !== null && aDecimal === null)
      ) {
        return true;
      }
      if (bDecimal !== null && aDecimal !== null) {
        const diff = bDecimal.sub(aDecimal);
        if (diff.greaterThanOrEqualTo(1)) {
          return true;
        }
      }
    }
  }
  return false;
};

export const isBigEnoughChangeNumberVersion = (
  a: Record<GlobalId, number | null> | null,
  b: Record<GlobalId, number | null> | null
): boolean => {
  if ((a === null && b !== null) || (a !== null && b === null)) {
    return true;
  }
  if (a !== null && b !== null) {
    for (const [key, aNumber] of Object.entries(a)) {
      const bNumber = b[key as GlobalId];
      if (
        (bNumber === null && aNumber !== null) ||
        (bNumber !== null && aNumber === null)
      ) {
        return true;
      }
      if (bNumber !== null && aNumber !== null) {
        const diff = bNumber - aNumber;
        if (diff >= 1) {
          return true;
        }
      }
    }
  }
  return false;
};

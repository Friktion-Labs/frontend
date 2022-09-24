import { PublicKey } from "@solana/web3.js";
import { Decimal } from "decimal.js";
import moment from "moment";
import { VoltVaultWithKey } from "@friktion-labs/friktion-sdk";
import { GlobalId } from "../09/registry10";

export type Asset = {
  name: string;
  symbol: string;
  iconLink: string;
  mint: PublicKey;
  voltVaultId: PublicKey;
  spotSerumMarketId: PublicKey;
  expectedApy: number;
};

export type VoltInfo = {
  objective: string;
  strategy: string;
  benefits: string;
  risks: string;
};

export type VaultForAsset = {
  rawVoltInfo: VoltVaultWithKey;
  globalId: GlobalId;
  underlyingTokenBalance: Decimal | null;
  tokenSupply: Decimal | null;
  markPrice: Decimal | null;
  optionMarkPrice: Decimal | null;
  tvl: Decimal | null;
  expectedApy: number;
  totalPnl: Decimal | null;
  userPnl: Decimal | null;
  lastFetched: moment.Moment;
};

export type DepositedForAsset = {
  estimatedTotalUnderlyingWithoutPending: Decimal | null;
  mergedDepositedUnderlying: Decimal | null;
  totalUsdDeposited: Decimal | null;
  normalDepositedUnderlying: Decimal | null;
  pendingDepositInfo: PendingDepositedForAsset;
  pendingWithdrawalInfo: PendingWithdrawnForAsset;
  pendingDepositRoundAmountUnderlying: Decimal | null;
  pendingDepositRoundVoltTokens: Decimal | null;
  pendingWithdrawalRoundAmountVolt: Decimal | null;
  pendingWithdrawalRoundUnderlyingTokens: Decimal | null;
  normFactor: Decimal;
  totalPnl: Decimal | null;
  userPnl: Decimal | null;
};

export type PendingDepositedForAsset = {
  initialized: boolean;
  roundNumber: Decimal;
  pendingDepositedUnderlying: Decimal;
};

export type PendingWithdrawnForAsset = {
  initialized: boolean;
  roundNumber: Decimal;
  numVoltRedeemed: Decimal;
};

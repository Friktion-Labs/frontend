import { ExtraVoltData, VoltVault } from "@friktion-labs/friktion-sdk";
import { Token as SaberToken, TokenInfo } from "@saberhq/token-utils";
import { u64 } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import Decimal from "decimal.js";
import {
  decimalFloorN,
  goodLoadableFormatSymbol,
  goodLoadableFormatSymbolCustom,
  ultraLoadableFormatSymbol,
  ultraLoadableFormatSymbolCustom,
} from "./format09";
import { getDailyExpiration, getWeeklyExpiration } from "./FormattedCountdown";
import { ImportantAssetLogos } from "./greatLogos/assetLogos";
import { AllAssetsUnion, ASSET_AVAX, ASSET_ETH } from "../features/wormhole";

export const AllSymbols = [
  "BTC",
  "SOL",
  "ETH",
  "USDC",
  "tsUSDC",
  "PAI",
  "UXD",
  "mSOL",
  "FTT",
  "SAMO",
  "NEAR",
  "SRM",
  "MNGO",
  "scnSOL",
  "stSOL",
  "SBR",
  "LUNA",
  "UST",
  "RAY",
  "STEP",
  "AVAX",
  "MNDE",
] as const;
export type AllSymbolsUnion = typeof AllSymbols[number];
// #TODO: you currently have to add symbol when you add a Volt 3
export const AllEntropyPerpsSymbols = ["BTC"] as const;
export type AllEntropySymbolsUnion = typeof AllEntropyPerpsSymbols[number];

// #TODO: you currently have to add symbol when you add a Volt 4
export const AllBasisSymbols = ["SOL" /** , "BTC" */] as const;
export type AllBasisSymbolsUnion = typeof AllBasisSymbols[number];

// #TODO: you currently have to add symbol when you add a Volt 5
export const AllProtectionVoltGlobalIds = [
  "mainnet_protection_usdc_sol",
] as const;
export type AllProtectionVoltGlobalIdsUnion =
  typeof AllProtectionVoltGlobalIds[number];

export const newSymbolsToNull = (): Record<AllSymbolsUnion, null> => {
  return {
    BTC: null,
    SOL: null,
    ETH: null,
    USDC: null,
    tsUSDC: null,
    PAI: null,
    UXD: null,
    mSOL: null,
    stSOL: null,
    FTT: null,
    SAMO: null,
    NEAR: null,
    SRM: null,
    MNGO: null,
    scnSOL: null,
    SBR: null,
    LUNA: null,
    UST: null,
    RAY: null,
    STEP: null,
    AVAX: null,
    MNDE: null,
  };
};
export const ALWAYS_SYMBOLS_TO_NULL: Readonly<
  ReturnType<typeof newSymbolsToNull>
> = newSymbolsToNull();

export const VoltNumbers = [1, 2, 3, 4, 5, 6] as const;
export type VoltNumber = typeof VoltNumbers[number];

export type VolatilityVoltData = {
  mangoGroup: string;
  mangoMarket: string;
};

export type QuarrySingleMine = {
  /**
   * Usually the volt token mint
   */
  readonly stakedToken: PublicKey;
  /**
   * Key for quarry_mine::Quarry
   */
  readonly quarryMine: PublicKey;
  readonly rewarder: PublicKey;
  readonly iouToken: PublicKey;
  readonly realRewardToken: UltraToken;
  readonly redeemer: "special-marinade" | "non-marinade-not-yet-supported";
};

/**
 * All keys are lowercase. The convention is as follows:
 * - devnet_income_call_btc
 * - devnet_income_put_btc
 * - mainnet_income_put_btc
 * - mainnet_income_call_btc_v2 (we don't have v2 anywhere yet)
 *
 * Don't use this type.
 *
 * @deprecated Use SubvoltDefinition10 instead! That has stronger types for globalId
 */
interface WeakSubvoltDefinition10 {
  readonly globalId: string;
  readonly voltVaultId: PublicKey;
  readonly extraVaultDataId: PublicKey;
  readonly vaultAuthority: PublicKey;
  readonly shareTokenDecimals: number;
  readonly network: "mainnet-beta" | "devnet";
  /**
   * @deprecated use def.underlying.info.logoURI
   */
  readonly iconLink: string;
  readonly optionType?: "call" | "put";
  /**
   * @deprecated use `new PublicKey(def.underlying.info.address)`
   */
  readonly mint: PublicKey;
  readonly spotSerumMarketId?: PublicKey;
  /**
   * @deprecated DO NOT USE THIS. It may be rugged. Please use loaded subvolt data
   */
  readonly expectedApy: number;
  /**
   * @deprecated use def.underlying.shortDisplayDecimals
   */
  readonly shortDisplayDecimals: number;
  readonly fallbackIndividualDepositCap: number;
  readonly fallbackGlobalDepositCap: number;
  readonly abnormalEpochLength?: number;
  readonly shouldHideSwapTab?: boolean;

  readonly underlying: UltraToken;
  readonly quote: UltraToken;
  readonly depositToken: UltraToken;

  readonly volt: VoltNumber;

  // For better formatting
  readonly isStablecoin?: boolean;
  readonly externalLink?: string;

  readonly isVoltage?: boolean;
  readonly highVoltage?: string;

  readonly volatilityVoltData?: VolatilityVoltData;

  // Wormhole
  readonly wormholeAsset?: AllAssetsUnion;

  // Quarry Mine
  readonly quarrySingleMine?: QuarrySingleMine;

  // no Quarry Mine, but emissions supported
  readonly doesHaveAutomatedEmissions?: boolean;

  // for basis
  readonly basisAccount?: PublicKey;

  readonly isLendingOnMango?: boolean;
}

/**
 * UltraToken extends Saber's Token, but its ULTRAAAAAAAA!!!!!
 */
export class UltraToken extends SaberToken {
  readonly shortDisplayDecimals: number;
  readonly displayDecimals: number;
  readonly isStablecoin: boolean;

  constructor(
    readonly info: TokenInfo,
    shortDisplayDecimals: number,
    displayDecimals: number,
    isStablecoin = false
  ) {
    super(info);
    this.shortDisplayDecimals = shortDisplayDecimals;
    this.displayDecimals = displayDecimals;
    this.isStablecoin = isStablecoin;
    // this._mintAccount = new PublicKey(info.address);
  }

  /**
   * Formats with symbol.
   *
   * def.format(someDecimal)
   *
   * Output example:
   * Decimal(1.2345) => 1.2345 BTC
   * Decimal(1.2345678) => 1.234567 BTC
   * Decimal(1.2345678123456789) => 1.234567 BTC
   * undefined => ... BTC
   */
  format(
    amount: Decimal | number | null | undefined,
    symbolOverride?: string
  ): string {
    return ultraLoadableFormatSymbol(this, amount, symbolOverride);
  }
  /**
   * Like format, but shorter. And uses greatFloorN
   */
  formatShort(
    amount: Decimal | number | null | undefined,
    symbolOverride?: string
  ): string {
    if (!this.shortDisplayDecimals && this.shortDisplayDecimals !== 0) {
      throw new Error(
        "shortDisplayDecimals must be set. For some reason, it is not set in UltraToken"
      );
    }
    return ultraLoadableFormatSymbolCustom(
      this,
      amount,
      this.shortDisplayDecimals,
      symbolOverride
    );
  }

  /**
   * The symbol of the token.
   */
  get symbol(): AllSymbolsUnion {
    return this.info.symbol as AllSymbolsUnion;
  }

  /**
   * Formats max precision without symbol
   *
   * Only formatters with symbols take in undefined
   *
   * 0.123456789 => 0.12345678
   * 0.12345 => 0.12345
   */
  formatMaxWithoutSymbol(amount: Decimal | number): string {
    return decimalFloorN(new Decimal(amount), this.decimals).toString();
  }

  get normFactor(): Decimal {
    return new Decimal(10 ** this.info.decimals);
  }

  normalize(amount: Decimal | u64 | BN | number) {
    return new Decimal(amount.toString()).div(this.normFactor);
  }
}

export class SubvoltDef10 implements WeakSubvoltDefinition10 {
  readonly globalId: GlobalId;
  readonly voltVaultId: PublicKey;
  readonly extraVaultDataId: PublicKey;
  readonly vaultAuthority: PublicKey;
  readonly shareTokenDecimals: number;
  readonly network: "mainnet-beta" | "devnet";

  /**
   * @deprecated use def.underlying.info.logoURI
   */
  readonly iconLink: string;
  readonly optionType: "call" | "put" | undefined;
  readonly volt: VoltNumber;
  /**
   * @deprecated use `new PublicKey(def.underlying.info.address)`
   */
  readonly mint: PublicKey;
  readonly spotSerumMarketId: PublicKey | undefined;
  /**
   * @deprecated DO NOT USE THIS. It may be rugged. Please use loaded subvolt data
   */
  readonly expectedApy: number;
  /**
   * @deprecated use def.depositToken.info.decimals
   */
  readonly maxDecimals: number;
  /**
   * @deprecated use def.depositToken.displayDecimals
   */
  readonly displayDecimals: number;
  /**
   * @deprecated use def.underlying.shortDisplayDecimals
   */
  readonly shortDisplayDecimals: number;
  readonly fallbackIndividualDepositCap: number;
  readonly fallbackGlobalDepositCap: number;
  readonly abnormalEpochLength: number | undefined;
  readonly shouldHideSwapTab: boolean | undefined;

  // The tokens! We don't have "Token" in the property name since it is used so often
  readonly underlying: UltraToken;
  readonly quote: UltraToken;
  readonly depositToken: UltraToken; // except for this guy

  // Derived info (we don't want to make this an UltraToken because because UltraToken strongly types with AllSymbolsUnion)
  readonly shareTokenSymbol: string;

  readonly externalLink?: string;

  readonly isVoltage: boolean | undefined;
  readonly highVoltage: string | undefined;

  readonly volatilityVoltData: VolatilityVoltData | undefined;
  readonly quarrySingleMine?: QuarrySingleMine;
  readonly doesHaveAutomatedEmissions?: boolean;
  readonly basisAccount?: PublicKey | undefined;

  readonly isLendingOnMango: boolean;
  readonly wormholeAsset?: AllAssetsUnion;

  constructor(weak: WeakSubvoltDefinition10) {
    this.globalId = weak.globalId as GlobalId;
    this.voltVaultId = weak.voltVaultId;
    this.extraVaultDataId = weak.extraVaultDataId;
    this.vaultAuthority = weak.vaultAuthority;
    this.shareTokenDecimals = weak.shareTokenDecimals;
    this.network = weak.network;
    this.iconLink = weak.iconLink;
    this.optionType = weak.optionType;
    this.volt = weak.volt;
    this.mint = weak.mint;
    this.spotSerumMarketId = weak.spotSerumMarketId;
    this.expectedApy = weak.expectedApy;
    this.maxDecimals = weak.depositToken.info.decimals;
    this.displayDecimals = weak.depositToken.displayDecimals;
    this.shortDisplayDecimals = weak.shortDisplayDecimals;
    this.fallbackIndividualDepositCap = weak.fallbackIndividualDepositCap;
    this.fallbackGlobalDepositCap = weak.fallbackGlobalDepositCap;
    this.abnormalEpochLength = weak.abnormalEpochLength;
    this.shouldHideSwapTab = weak.shouldHideSwapTab;

    this.quote = weak.quote;
    this.underlying = weak.underlying;
    this.depositToken = weak.depositToken;

    if (
      this.volt === 2 &&
      this.depositToken.symbol !== "USDC" &&
      this.underlying.symbol !== "LUNA"
    ) {
      this.shareTokenSymbol = `f${weak.optionType === "call" ? "c" : "p"}${
        this.depositToken.symbol
      }${this.underlying.symbol}${
        this.globalId.endsWith("_high") ? "High" : ""
      }`;
    } else {
      this.shareTokenSymbol = `f${
        weak.optionType === "call"
          ? "c"
          : weak.optionType === "put"
          ? "p"
          : weak.volt === 3
          ? "crab"
          : weak.volt === 4
          ? "basis"
          : weak.volt === 5
          ? "prot"
          : "ooba gooba REPLACE THIS"
      }${this.underlying.symbol}${
        this.globalId.endsWith("_high") ? "High" : ""
      }`;
    }

    this.externalLink = weak.externalLink;

    this.isVoltage = weak.isVoltage;
    this.highVoltage = weak.highVoltage;
    this.volatilityVoltData = weak.volatilityVoltData;

    if (weak.wormholeAsset) {
      this.wormholeAsset = weak.wormholeAsset;
    }

    if (weak.quarrySingleMine) {
      this.quarrySingleMine = weak.quarrySingleMine;
    }
    if (weak.doesHaveAutomatedEmissions) {
      this.doesHaveAutomatedEmissions = weak.doesHaveAutomatedEmissions;
    }
    if (weak.basisAccount) {
      this.basisAccount = weak.basisAccount;
    }

    this.isLendingOnMango = weak.isLendingOnMango ?? false;
  }

  requiresExtraVoltData(): boolean {
    return (
      this.volt === 3 ||
      this.volt === 4 ||
      this.volt === 5 ||
      this.isLendingOnMango
    );
  }

  isEntropy(): boolean {
    return this.volt === 3 || this.volt === 4;
  }

  isEmittingRewards(): boolean {
    return (
      this.doesHaveAutomatedEmissions || this.quarrySingleMine !== undefined
    );
  }

  isShortOptions(): boolean {
    return this.volt === 1 || this.volt === 2;
  }

  canDepositsBeTurnedOff(): boolean {
    return this.volt === 3 || this.volt === 4 || this.volt === 5;
  }

  getNextAutocompoundingDate(): Date {
    const isEntropy = this.volt === 3 || this.volt === 4;
    const autocompoundingDate = isEntropy
      ? getDailyExpiration()
      : getWeeklyExpiration();
    return autocompoundingDate;
  }

  /**
   * Formats with symbol.
   *
   * def.format(someDecimal)
   *
   * Output example:
   * Decimal(1.2345) => 1.2345 BTC
   * Decimal(1.2345678) => 1.234567 BTC
   * Decimal(1.2345678123456789) => 1.234567 BTC
   * undefined => ... BTC
   */
  format(amount: Decimal | number | null | undefined): string {
    return goodLoadableFormatSymbol(this, amount);
  }

  /**
   * Like format, but shorter. And uses greatFloorN
   */
  formatShort(amount: Decimal | number | null | undefined): string {
    return goodLoadableFormatSymbolCustom(
      this,
      amount,
      this.shortDisplayDecimals
    );
  }

  /**
   * Formats max precision without symbol
   *
   * Only formatters with symbols take in undefined
   *
   * 0.123456789 => 0.12345678
   * 0.12345 => 0.12345
   */
  formatMaxWithoutSymbol(amount: Decimal | number): string {
    return decimalFloorN(new Decimal(amount), this.maxDecimals).toString();
  }
}

export type OptionProduct = string;
export type EpochRow = {
  globalId: GlobalId;
  product: OptionProduct;
  /**
   * Unix timestamp in seconds.
   */
  startEpoch: number;
  /**
   * Unix timestamp in seconds.
   */
  endEpoch: number;
  balanceStart: number;
  balancePnl: number;
  realizedPnl: number;
  spotPriceAtAuctionEnd: number;
  txid: string;
};

export type ParsedOptionProduct = {
  asset: string;
  strike: number;
  type: string;
  expiry: Date;
};

const parseCache: Record<string, ParsedOptionProduct | string> = {};

/**
 * Parses the option string into an `ParsedOptionProduct`.
 *
 * Returns the unparsed input if an error occurred
 */
export const parseOptionProduct = (
  product: string
): ParsedOptionProduct | string => {
  const cacheResult = parseCache[product];
  if (cacheResult) {
    return cacheResult;
  }
  try {
    const optionMatch = product.match(
      /([a-zA-Z-]*)-([\d.]*)-(CALL|PUT|CRAB|BASIS|PROTECT)-(\d{10})/
    );

    if (optionMatch && optionMatch.length > 4) {
      const expiry = new Date(parseInt(optionMatch[4]) * 1000);
      const result = {
        asset: optionMatch[1],
        strike: parseFloat(optionMatch[2]),
        type: optionMatch[3],
        expiry: expiry,
      };
      parseCache[product] = result;
      return result;
    }
    return product;
  } catch (e) {}
  return product;
};

const formatCache: Map<ParsedOptionProduct | string, string> = new Map();

/**
 * If parse failed, returns the input. Tries to be as short as possible.
 *
 * Asset is not included because ... you're obviously not selling options for USDC.
 *
 * Year not included, because this is short.
 *
 * Example output: $240 CALL Dec 31
 */
export const formatOptionProductShort = (
  product: ParsedOptionProduct | OptionProduct
): string => {
  const cacheResult = formatCache.get(product);
  if (cacheResult) {
    return cacheResult;
  }

  let parsed: ParsedOptionProduct | string;
  if (typeof product === "string") {
    parsed = parseOptionProduct(product);
  } else {
    parsed = product;
  }
  if (typeof parsed === "string") {
    return parsed;
  }

  const result = `$${parsed.strike} ${
    parsed.type
  } ${parsed.expiry.toLocaleString("en-US", {
    month: "short",
  })} ${parsed.expiry.getDate()}`;
  formatCache.set(product, result);
  return result;
};

export type EpochYield = {
  epochYield: number;
  epochLength: number;
  windowSize: number;
  hadLoss: boolean;
};

/**
 * epochLength is seconds
 *
 * Assumes that epochRows is sorted
 */
export const getLatestEpochYield = (
  epochRows: EpochRow[],
  globalId: GlobalId
): EpochYield | null => {
  const row = epochRows.find((row) => row.globalId === globalId);

  if (row) {
    return {
      epochYield: row.balancePnl / row.balanceStart,
      epochLength: row.endEpoch - row.startEpoch,
      windowSize: 1,
      hadLoss: row.realizedPnl < 0,
    };
  }
  return null;
};

/**
 * epochLength is seconds
 *
 * When the realizedPnl is negative, the balancePnl is treated as 0
 */
export const getAveragedEpochYield = (
  epochRows: EpochRow[],
  globalId: GlobalId,
  alreadyFiltered?: boolean
): EpochYield | null => {
  const rows = alreadyFiltered
    ? epochRows
    : epochRows.filter((row) => row.globalId === globalId);
  let hadLoss = false;
  if (rows.length) {
    let sumEpochYield = 0;
    let sumEpochLength = 0;

    rows.forEach((row) => {
      if (
        row.realizedPnl < 0 &&
        !(
          row.globalId === "mainnet_basis_usdc_sol" ||
          row.globalId === "mainnet_basis_usdc_btc" ||
          row.globalId === "mainnet_income_perp_btc" ||
          row.globalId === "mainnet_protection_usdc_sol"
        )
      ) {
        sumEpochYield += 0;
        sumEpochLength += row.endEpoch - row.startEpoch;
        hadLoss = true;
      } else {
        sumEpochYield += row.realizedPnl / row.balanceStart;
        sumEpochLength += row.endEpoch - row.startEpoch;
      }
    });

    return {
      epochYield: sumEpochYield / rows.length,
      epochLength: sumEpochLength / rows.length,
      windowSize: rows.length,
      hadLoss,
    };
  }

  // console.error("Unknown yield");
  return null;
};

export const voltTitle = (voltNum: VoltNumber) => {
  if (voltNum === 1) {
    return "Generate Income";
  } else if (voltNum === 2) {
    return "Sustainable Stables";
  } else if (voltNum === 3) {
    return "Crab Strategy";
  } else if (voltNum === 4) {
    return "Basis Yield";
  } else if (voltNum === 5) {
    return "Capital Protection";
  }
};

export const voltTitleForCard = (voltNum: VoltNumber) => {
  if (voltNum === 1) {
    return "#01 GENERATE INCOME";
  } else if (voltNum === 2) {
    return "#02 SUSTAINABLE STABLES";
  } else if (voltNum === 3) {
    return "#03 CRAB STRATEGY";
  } else if (voltNum === 4) {
    return "#04 BASIS YIELD";
  } else if (voltNum === 5) {
    return "#05 CAPITAL PROTECTION";
  }
};

export const ChainId = {
  "mainnet-beta": 101,
  testnet: 102,
  devnet: 103,
  localnet: 104,
};

const DevnetSOLToken = new UltraToken(
  {
    chainId: ChainId.devnet,
    address: "So11111111111111111111111111111111111111112",
    name: "Solana", //
    decimals: 9, // SOL always has 9 decimals
    symbol: "SOL",
    logoURI: ImportantAssetLogos.SOL,
  },
  2,
  5
);

export const MainnetSOLToken = new UltraToken(
  {
    chainId: ChainId["mainnet-beta"],
    address: "So11111111111111111111111111111111111111112",
    name: "Solana", //
    decimals: 9, // SOL always has 9 decimals
    symbol: "SOL",
    logoURI: ImportantAssetLogos.SOL,
  },
  2,
  6
);

export const MainnettsUSDCToken = new UltraToken(
  {
    chainId: ChainId["mainnet-beta"],
    address: "Cvvh8nsKZet59nsDDo3orMa3rZnPWQhpgrMCVcRDRgip",
    name: "Tulip USDC V2", //
    decimals: 6, // SOL always has 9 decimals
    symbol: "tsUSDC",
    logoURI: ImportantAssetLogos.tsUSDC,
  },
  0,
  2
);

export const MainnetPAIToken = new UltraToken(
  {
    chainId: ChainId["mainnet-beta"],
    address: "Ea5SjE2Y6yvCeW5dYTn7PYMuW5ikXkvbGdcmSnXeaLjS",
    name: "PAI",
    decimals: 6,
    symbol: "PAI",
    logoURI: ImportantAssetLogos.PAI,
  },
  0,
  2
);

export const MainnetUXDToken = new UltraToken(
  {
    chainId: ChainId["mainnet-beta"],
    address: "7kbnvuGBxxj8AG9qp8Scn56muWGaRaFqxg1FsRp3PaFT",
    name: "UXD",
    decimals: 6,
    symbol: "UXD",
    logoURI: ImportantAssetLogos.UXD,
  },
  0,
  2
);

const DevnetBTCToken = new UltraToken(
  {
    chainId: ChainId.devnet,
    address: "C6kYXcaRUMqeBF5fhg165RWU7AnpT9z92fvKNoMqjmz6",
    name: "Devnet BTC",
    decimals: 9, // Decimal info at: https://solscan.io/token/C6kYXcaRUMqeBF5fhg165RWU7AnpT9z92fvKNoMqjmz6?cluster=devnet
    symbol: "BTC",
    logoURI: ImportantAssetLogos.BTC,
  },
  4,
  6
);

const MainnetBTCToken = new UltraToken(
  {
    chainId: ChainId["mainnet-beta"],
    address: "9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E",
    name: "Bitcoin (Sollet)",
    decimals: 6, // Decimal info at: https://solscan.io/token/9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E
    symbol: "BTC",
    logoURI: ImportantAssetLogos.BTC,
  },
  4,
  6
);
export const DevnetUSDCToken = new UltraToken(
  {
    chainId: ChainId.devnet,
    address: "E6Z6zLzk8MWY3TY8E87mr88FhGowEPJTeMWzkqtL6qkF",
    name: "Devnet USDC",
    decimals: 2, // Decimal info at: https://solscan.io/token/E6Z6zLzk8MWY3TY8E87mr88FhGowEPJTeMWzkqtL6qkF?cluster=devnet
    symbol: "USDC",
    logoURI: ImportantAssetLogos.USDC,
  },
  0,
  2
);
export const DevnetMangoUSDCToken = new UltraToken(
  {
    chainId: ChainId.devnet,
    address: "8FRFC6MoGGkMFQwngccyu69VnYbzykGeez7ignHVAFSN",
    name: "Devnet Mango USDC",
    decimals: 6, // Decimal info at: https://solscan.io/token/E6Z6zLzk8MWY3TY8E87mr88FhGowEPJTeMWzkqtL6qkF?cluster=devnet
    symbol: "USDC",
    logoURI: ImportantAssetLogos.USDC,
  },
  0,
  2
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const MainnetUSDCToken = new UltraToken(
  {
    chainId: ChainId["mainnet-beta"],
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    name: "USD Coin",
    decimals: 6, // Decimal info at: https://solscan.io/token/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
    symbol: "USDC",
    logoURI: ImportantAssetLogos.USDC,
  },
  0,
  2
);

const MainnetETHToken = new UltraToken(
  {
    chainId: ChainId["mainnet-beta"],
    address: "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs",
    name: "Ethereum (Wormhole)",
    decimals: 8, // Decimal info at: https://solscan.io/token/7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs
    symbol: "ETH",
    logoURI: ImportantAssetLogos.ETH,
  },
  4,
  6
);

const MainnetMarinadeToken = new UltraToken(
  {
    chainId: ChainId["mainnet-beta"],
    address: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
    name: "Marinade SOL",
    decimals: 9, // Decimal info at: https://solscan.io/token/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So
    symbol: "mSOL",
    logoURI: ImportantAssetLogos.mSOL,
  },
  4,
  9
);

const MainnetMNDEToken = new UltraToken(
  {
    chainId: ChainId["mainnet-beta"],
    address: "MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey",
    name: "Marinade",
    decimals: 9, // Decimal info at: https://solscan.io/token/MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey
    symbol: "MNDE",
    logoURI: ImportantAssetLogos.MNDE, // TODO: Change logo
  },
  1,
  2
);

const MainnetSamoToken = new UltraToken(
  {
    chainId: ChainId["mainnet-beta"],
    address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    name: "Samoyed Coin",
    decimals: 9, // Decimal info at: https://solscan.io/token/7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
    symbol: "SAMO",
    logoURI: ImportantAssetLogos.SAMO,
  },
  1,
  2
);

const MainnetNearToken = new UltraToken(
  {
    chainId: ChainId["mainnet-beta"],
    address: "BYPsjxa3YuZESQz1dKuBw1QSFCSpecsm8nCQhY5xbU1Z",
    name: "Near (Allbridge)",
    decimals: 9, // Decimal info at: https://solscan.io/token/7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
    symbol: "NEAR",
    logoURI: ImportantAssetLogos.NEAR,
  },
  1,
  2
);

const MainnetFTTToken = new UltraToken(
  {
    chainId: ChainId["mainnet-beta"],
    address: "EzfgjvkSwthhgHaceR3LnKXUoRkP6NUhfghdaHAj1tUv",
    name: "FTT (Wormhole)",
    decimals: 8, // Decimal info at: https://solscan.io/token/EzfgjvkSwthhgHaceR3LnKXUoRkP6NUhfghdaHAj1tUv
    symbol: "FTT",
    logoURI: ImportantAssetLogos.FTT,
  },
  4,
  6
);

const MainnetSRMToken = new UltraToken(
  {
    chainId: ChainId["mainnet-beta"],
    address: "SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt",
    name: "Serum",
    decimals: 6, // Decimal info at: https://solscan.io/token/SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt
    symbol: "SRM",
    logoURI: ImportantAssetLogos.SRM,
  },
  2,
  3
);

const MainnetMNGOToken = new UltraToken(
  {
    chainId: ChainId["mainnet-beta"],
    address: "MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac",
    name: "Mango",
    decimals: 6, // Decimal info at: https://solscan.io/token/MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac
    symbol: "MNGO",
    logoURI: ImportantAssetLogos.MNGO,
  },
  1,
  2
);

const MainnetSCNSOLToken = new UltraToken(
  {
    chainId: ChainId["mainnet-beta"],
    address: "5oVNBeEEQvYi1cX3ir8Dx5n1P7pdxydbGF2X4TxVusJm",
    name: "Socean SOL",
    decimals: 9, // Decimal info at: https://solscan.io/token/5oVNBeEEQvYi1cX3ir8Dx5n1P7pdxydbGF2X4TxVusJm
    symbol: "scnSOL",
    logoURI: ImportantAssetLogos.scnSOL,
  },
  1,
  2
);

const MainnetSBRToken = new UltraToken(
  {
    chainId: ChainId["mainnet-beta"],
    address: "Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1",
    name: "Saber",
    decimals: 6, // Decimal info at: https://solscan.io/token/Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1
    symbol: "SBR",
    logoURI: ImportantAssetLogos.SBR,
  },
  1,
  2
);

export const MainnetLUNAToken = new UltraToken(
  {
    chainId: ChainId["mainnet-beta"],
    address: "F6v4wfAdJB8D8p77bMXZgYt8TDKsYxLYxH5AFhUkYx9W",
    name: "LUNA (Wormhole)",
    decimals: 6, // Decimal info at: https://solscan.io/token/F6v4wfAdJB8D8p77bMXZgYt8TDKsYxLYxH5AFhUkYx9W
    symbol: "LUNA",
    logoURI: ImportantAssetLogos.LUNA,
  },
  1,
  2
);

export const MainnetUSTToken = new UltraToken(
  {
    chainId: ChainId["mainnet-beta"],
    address: "9vMJfxuKxXBoEa7rM12mYLMwTacLMLDJqHozw96WQL8i",
    name: "UST (Wormhole)",
    decimals: 6, // Decimal info at: https://solscan.io/token/9vMJfxuKxXBoEa7rM12mYLMwTacLMLDJqHozw96WQL8i
    symbol: "UST",
    logoURI: ImportantAssetLogos.UST,
  },
  1,
  2
);

const MainnetRAYToken = new UltraToken(
  {
    chainId: ChainId["mainnet-beta"],
    address: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
    name: "Raydium",
    decimals: 6, // Decimal info at: https://solscan.io/token/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R
    symbol: "RAY",
    logoURI: ImportantAssetLogos.RAY,
  },
  1,
  2
);

const MainnetSTEPToken = new UltraToken(
  {
    chainId: ChainId["mainnet-beta"],
    address: "StepAscQoEioFxxWGnh2sLBDFp9d8rvKz2Yp39iDpyT",
    name: "Step",
    decimals: 9, // Decimal info at: https://solscan.io/token/StepAscQoEioFxxWGnh2sLBDFp9d8rvKz2Yp39iDpyT
    symbol: "STEP",
    logoURI: ImportantAssetLogos.STEP,
  },
  1,
  2
);

const MainnetAVAXToken = new UltraToken(
  {
    chainId: ChainId["mainnet-beta"],
    address: "KgV1GvrHQmRBY8sHQQeUKwTm2r2h8t4C8qt12Cw1HVE",
    name: "AVAX (Wormhole)",
    decimals: 8, // Decimal info at: https://solscan.io/token/KgV1GvrHQmRBY8sHQQeUKwTm2r2h8t4C8qt12Cw1HVE
    symbol: "AVAX",
    logoURI: ImportantAssetLogos.AVAX,
  },
  1,
  2
);

export const MainnetLIDOSTSOLToken = new UltraToken(
  {
    chainId: ChainId["mainnet-beta"],
    address: "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj",
    name: "LIDO Staked SOL",
    decimals: 9, // Decimal info at: https://solscan.io/token/7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj
    symbol: "stSOL",
    logoURI: ImportantAssetLogos.stSOL,
  },
  1,
  2
);

/**
 * Use STRONG_SUBVOLTS instead! This exists because we need to generate GlobalId
 * but can't do it in one step due to circular references
 *
 * @deprecated use STRONG_SUBVOLTS or WEAK_SUBVOLTS instead
 */
const INTERNAL_SPECIFICALLY_TYPED_SUBVOLT_INFO = {
  devnet_income_perp_btc: new SubvoltDef10({
    globalId: "devnet_income_perp_btc",
    network: "devnet",
    iconLink: ImportantAssetLogos.BTC,
    volt: 3,
    mint: new PublicKey(DevnetMangoUSDCToken.address),
    voltVaultId: new PublicKey("EePxJTxCF41pwW2T2rpAi9C2WeyCKAK5fZMzcEVY6QZR"),
    extraVaultDataId: new PublicKey(
      "4WAjVtBKhuS7eg9Qn2rwqm4bMHgoUnTuQaEm6rDGSSGu"
    ),
    vaultAuthority: new PublicKey(
      "EyVYGnhF8hUT6k5jHUYU89Ngu6KQoAkeKC6NBYQXVEGY"
    ),
    shareTokenDecimals: DevnetMangoUSDCToken.decimals,
    spotSerumMarketId: new PublicKey(
      "ACGrX5qQXSyPhAWvBNF5NQwnjbMoyStyJn1cvz136xbW"
    ),
    expectedApy: 35.8,
    shortDisplayDecimals: 4,
    fallbackIndividualDepositCap: -1,
    fallbackGlobalDepositCap: -1,
    underlying: DevnetBTCToken,
    quote: DevnetMangoUSDCToken,
    depositToken: DevnetMangoUSDCToken,
  }),
  devnet_income_call_sol: new SubvoltDef10({
    globalId: "devnet_income_call_sol",
    network: "devnet",
    iconLink: ImportantAssetLogos.SOL,
    optionType: "call",
    volt: 1,
    mint: new PublicKey("So11111111111111111111111111111111111111112"),
    voltVaultId: new PublicKey("GmcfZeaRGmXjx91KWLjWMQo6rE4d2PocCtk46crqWmhm"),
    // this extraVaultDataId is incorrect for this devnet volt
    extraVaultDataId: new PublicKey(
      "HvjLon9T8Zi5cPF2aY6297RyDGUE2dSsRzNFHgbnELGq"
    ),
    // this vaultAuthority is incorrect for this devnet volt
    vaultAuthority: new PublicKey(
      "BQpvz38j6Apwg1QrEpiWZJ9vzbFZJdNudbUuAvbbdQK5"
    ),
    // this shareTokenDecimals is incorrect for this devnet volt
    shareTokenDecimals: DevnetSOLToken.decimals,
    spotSerumMarketId: new PublicKey(
      "3FsvhBXnfchS8EXfgeF765R5KX7z7eniNSQcjKNeoeE9"
    ),
    expectedApy: 34.3,
    shortDisplayDecimals: 2,
    fallbackIndividualDepositCap: 150,
    fallbackGlobalDepositCap: 8050,
    underlying: DevnetSOLToken,
    quote: DevnetUSDCToken,
    depositToken: DevnetSOLToken,
  }),
  mainnet_income_call_eth: new SubvoltDef10({
    globalId: "mainnet_income_call_eth",
    network: "mainnet-beta",
    iconLink: ImportantAssetLogos.ETH,
    optionType: "call",
    volt: 1,
    mint: new PublicKey("7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs"),
    voltVaultId: new PublicKey("A2jbvwftkAzU5hLUmBePdfqZQsop7jydZirLS5NsRVtx"),
    extraVaultDataId: new PublicKey(
      "8fdEXEywMGXPx9T8iv8PGdd2KGX9ez3U1TTzapk8xhYR"
    ),
    vaultAuthority: new PublicKey(
      "FThcy5XXvab5u3jbA6NjWKdMNiCSV3oY5AAkvEvpa8wp"
    ),
    shareTokenDecimals: 6,
    spotSerumMarketId: new PublicKey(
      "DsWLLr4QQpXpMzQ8Y4p68Sj6Ei3fGGwA6c672dtyDhAA"
    ),
    expectedApy: 18.2,
    shortDisplayDecimals: 4,
    fallbackIndividualDepositCap: -1,
    fallbackGlobalDepositCap: -1,
    underlying: MainnetETHToken,
    quote: MainnetUSDCToken,
    depositToken: MainnetETHToken,
    wormholeAsset: ASSET_ETH,
  }),
  mainnet_income_put_eth: new SubvoltDef10({
    globalId: "mainnet_income_put_eth",
    network: "mainnet-beta",
    iconLink: ImportantAssetLogos.ETH,
    optionType: "put",
    volt: 2,
    mint: new PublicKey("7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs"),
    voltVaultId: new PublicKey("2QRujUdQwz5p7XNQWh48KbyZ9AMEbG7WbkuqMMS9KdE5"),
    extraVaultDataId: new PublicKey(
      "B6jqwLkq4F5e5YbVvNcEra6T5tQ2D5GSjK7sfkJR9N5S"
    ),
    vaultAuthority: new PublicKey(
      "EA29Xf3HGMtYziw7UKZDUKby7gkoCbXwmiNKwc7z54Ax"
    ),
    shareTokenDecimals: MainnetUSDCToken.decimals,
    spotSerumMarketId: new PublicKey(
      "dg4cpuXc6nWq7L7b7UkKJKFEMGBrUKAjLBGWeLFSnXW"
    ),
    expectedApy: 29.3,
    shortDisplayDecimals: 2,
    fallbackIndividualDepositCap: -1,
    fallbackGlobalDepositCap: -1,
    underlying: MainnetETHToken,
    quote: MainnetUSDCToken,
    depositToken: MainnetUSDCToken,
  }),
  mainnet_income_call_sol: new SubvoltDef10({
    globalId: "mainnet_income_call_sol",
    network: "mainnet-beta",
    iconLink: ImportantAssetLogos.SOL,
    optionType: "call",
    volt: 1,
    mint: new PublicKey("So11111111111111111111111111111111111111112"),
    voltVaultId: new PublicKey("CbPemKEEe7Y7YgBmYtFaZiECrVTP5sGrYzrrrviSewKY"),
    extraVaultDataId: new PublicKey(
      "HDQFvghwrjCZjVcKiFZD3amopbW5WX97juPvKsV3WGv2"
    ),
    vaultAuthority: new PublicKey(
      "Hxtb6APfNtf9m8jJjh7uYp8fCTGr9aeHxBSfiPqCrV6G"
    ),
    shareTokenDecimals: MainnetSOLToken.decimals,
    spotSerumMarketId: new PublicKey(
      "Aj3bg9mGwGyDAkxtWKhHVsJV8X2fhKsZ3tpN1NfYbjWd"
    ),
    expectedApy: 29.1,
    shortDisplayDecimals: 2,
    fallbackIndividualDepositCap: -1,
    fallbackGlobalDepositCap: -1,
    underlying: MainnetSOLToken,
    quote: MainnetUSDCToken,
    depositToken: MainnetSOLToken,
    highVoltage: "mainnet_income_call_sol_high",
  }),
  mainnet_income_call_sol_high: new SubvoltDef10({
    globalId: "mainnet_income_call_sol_high",
    isVoltage: true,
    network: "mainnet-beta",
    iconLink: ImportantAssetLogos.SOL,
    optionType: "call",
    volt: 1,
    mint: new PublicKey("So11111111111111111111111111111111111111112"),
    voltVaultId: new PublicKey("6ESYJXX4tqSTZrTRQbHodQZEwU7jd4fKWvStBpttRB4c"),
    extraVaultDataId: new PublicKey(
      "9iuExpjrxkLda7FRhgfWAUZX4EFUaLnewGYZXaZYpow4"
    ),
    vaultAuthority: new PublicKey(
      "wJAoeEG2sfQ1xgXUNVVkJ5mCTCw4SLc6oJafDwf6jTf"
    ),
    shareTokenDecimals: MainnetSOLToken.decimals,
    spotSerumMarketId: new PublicKey(
      "Aj3bg9mGwGyDAkxtWKhHVsJV8X2fhKsZ3tpN1NfYbjWd"
    ),
    expectedApy: 42.2,
    shortDisplayDecimals: 2,
    fallbackIndividualDepositCap: -1,
    fallbackGlobalDepositCap: -1,
    underlying: MainnetSOLToken,
    quote: MainnetUSDCToken,
    depositToken: MainnetSOLToken,
  }),
  mainnet_income_put_sol_high: new SubvoltDef10({
    globalId: "mainnet_income_put_sol_high",
    isVoltage: true,
    network: "mainnet-beta",
    iconLink: ImportantAssetLogos.SOL,
    optionType: "put",
    volt: 2,
    mint: new PublicKey("So11111111111111111111111111111111111111112"),
    voltVaultId: new PublicKey("BTuiZkgodmKKJtNDhVQGvAzqW1fdSNWasQADDTTyoAxN"),
    extraVaultDataId: new PublicKey(
      "2WizZuJuh1adXkAYMhHPF15zDUY2dBwMeUpSLCZ9MLYK"
    ),
    vaultAuthority: new PublicKey(
      "BThMeTgWZBoBbAzp9sK9T7gQzpQDQdRQUVLtVQ3781q1"
    ),
    shareTokenDecimals: MainnetUSDCToken.decimals,
    spotSerumMarketId: new PublicKey(
      "C6z5k5fQmdeu7QNnXH1rSYYm22D5dqsMfqEaWgqSUdhM"
    ),
    expectedApy: 52.5,
    shortDisplayDecimals: 2,
    fallbackIndividualDepositCap: -1,
    fallbackGlobalDepositCap: -1,
    underlying: MainnetSOLToken,
    quote: MainnetUSDCToken,
    depositToken: MainnetUSDCToken,
  }),
  mainnet_income_put_sol: new SubvoltDef10({
    globalId: "mainnet_income_put_sol",
    network: "mainnet-beta",
    iconLink: ImportantAssetLogos.SOL,
    optionType: "put",
    volt: 2,
    mint: new PublicKey("So11111111111111111111111111111111111111112"),
    voltVaultId: new PublicKey("2evPXRLaTZj92DM93sdryeszwqoC9C6DoWa1TKHn1AzU"),
    extraVaultDataId: new PublicKey(
      "GeMAASzD2phRTzvC2HMDtU2zx4typNrYZhJRzKWQih1Y"
    ),
    vaultAuthority: new PublicKey(
      "6Nkc8MEiz3WLz1xthYitmSuy3NGwn7782upRHo2iFmXK"
    ),
    shareTokenDecimals: MainnetUSDCToken.decimals,
    spotSerumMarketId: new PublicKey(
      "C6z5k5fQmdeu7QNnXH1rSYYm22D5dqsMfqEaWgqSUdhM"
    ),
    expectedApy: 33.1,
    shortDisplayDecimals: 2,
    fallbackIndividualDepositCap: -1,
    fallbackGlobalDepositCap: -1,
    underlying: MainnetSOLToken,
    quote: MainnetUSDCToken,
    depositToken: MainnetUSDCToken,
    highVoltage: "mainnet_income_put_sol_high",
  }),
  mainnet_income_put_tsUSDC: new SubvoltDef10({
    globalId: "mainnet_income_put_tsUSDC",
    network: "mainnet-beta",
    iconLink: ImportantAssetLogos.tsUSDC,
    optionType: "put",
    volt: 2,
    mint: new PublicKey("Cvvh8nsKZet59nsDDo3orMa3rZnPWQhpgrMCVcRDRgip"),
    voltVaultId: new PublicKey("FFhHmdwHS9myqQPQUMTu8hX56zQETNPC4Bu95ZGb1j5P"),
    extraVaultDataId: new PublicKey(
      "2ZQCtSBFAuq6hveRtZ7QiNbKL6v85c7rxEFvs1cdKhSX"
    ),
    vaultAuthority: new PublicKey(
      "AQRGh6PU7LzDHvvoPNS7wVVQaCBeftw9kVDAnvuEjbs8"
    ),
    shareTokenDecimals: MainnettsUSDCToken.decimals,
    spotSerumMarketId: new PublicKey(
      "9ikXcd2mGY2dAtvfEx5vhVSzU28SYv7nMk2cg59bzFeD"
    ),
    expectedApy: 25.4,
    shortDisplayDecimals: 2,
    fallbackIndividualDepositCap: -1,
    fallbackGlobalDepositCap: -1,
    underlying: MainnetSOLToken,
    quote: MainnetUSDCToken, // This is intentional. Please see "changed" 😂: https://github.com/Friktion-Labs/dapp/commit/7c82fb6702e0ef85ca0cc2947b65b040671ce62a
    depositToken: MainnettsUSDCToken,
    externalLink: "https://tulip.garden/strategy",
    shouldHideSwapTab: true,
  }),
  mainnet_income_put_pai: new SubvoltDef10({
    globalId: "mainnet_income_put_pai",
    network: "mainnet-beta",
    iconLink: ImportantAssetLogos.PAI,
    optionType: "put",
    volt: 2,
    mint: new PublicKey("Ea5SjE2Y6yvCeW5dYTn7PYMuW5ikXkvbGdcmSnXeaLjS"),
    voltVaultId: new PublicKey("5EU8ykqwFczHa2m8RLFWusRQkBW58kWYCTdCY6mAdMce"),
    extraVaultDataId: new PublicKey(
      "9GCaueg1Qv6HixopaGJ2JaSvqnsdfkKexqieyfjCTNfu"
    ),
    vaultAuthority: new PublicKey(
      "7Nvs437r3waBgBoFpgsqBjouy5PLP7h2wUFbsF1FD2AK"
    ),
    shareTokenDecimals: MainnetPAIToken.decimals,
    spotSerumMarketId: new PublicKey(
      "Fze6inVkgQtJod6sPfhuTeG1GYAkdRCujjF7FxyYuywk"
    ),
    expectedApy: 31.8,
    shortDisplayDecimals: 2,
    fallbackIndividualDepositCap: -1,
    fallbackGlobalDepositCap: -1,
    underlying: MainnetSOLToken,
    quote: MainnetUSDCToken, // This is intentional. Please see "changed" 😂: https://github.com/Friktion-Labs/dapp/commit/7c82fb6702e0ef85ca0cc2947b65b040671ce62a
    depositToken: MainnetPAIToken,
    externalLink: "https://parrot.fi/mint/",
    shouldHideSwapTab: true,
  }),
  mainnet_income_call_marinade: new SubvoltDef10({
    globalId: "mainnet_income_call_marinade",
    network: "mainnet-beta",
    iconLink: ImportantAssetLogos.mSOL,
    optionType: "call",
    volt: 1,
    mint: new PublicKey("mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So"),
    voltVaultId: new PublicKey("9RcdLHX8rkfjo4ze2uyvhfQGjX6wAZtbvmBf3aK6wqrG"),
    extraVaultDataId: new PublicKey(
      "2SN4oJJp8B3bVuQHkrHzMGuo7ibdFPdU7SqdSK7SuTBA"
    ),
    vaultAuthority: new PublicKey(
      "6asST5hurmxJ8uFvh7ZRWkrMfSEzjEAJ4DNR1is3G6eH"
    ),
    shareTokenDecimals: MainnetMarinadeToken.decimals,
    spotSerumMarketId: new PublicKey(
      "9NxokJVFWiEXz5nrwfTDPoKXj46Nz6MxL1KLvxtGMT5m"
    ),
    expectedApy: 23.4,
    shortDisplayDecimals: 2,
    fallbackIndividualDepositCap: -1,
    fallbackGlobalDepositCap: -1,
    underlying: MainnetMarinadeToken,
    quote: MainnetUSDCToken,
    depositToken: MainnetMarinadeToken,
    quarrySingleMine: {
      stakedToken: new PublicKey(
        "6UA3yn28XecAHLTwoCtjfzy3WcyQj1x13bxnH8urUiKt"
      ),
      quarryMine: new PublicKey("6reWgQvR2U5TErw9ZDTdgoqpogH3iPKdTQkEtMjrRMPT"),
      rewarder: new PublicKey("J829VB5Fi7DMoMLK7bsVGFM82cRU61BKtiPz9PNFdL7b"),
      iouToken: new PublicKey("CNxb8WdKv55ep89YgFx6s384xLbEvnWTPgMaf8yisG3j"),
      realRewardToken: MainnetMNDEToken,
      redeemer: "special-marinade",
    },
  }),
  mainnet_income_call_stsol: new SubvoltDef10({
    globalId: "mainnet_income_call_stsol",
    network: "mainnet-beta",
    iconLink: ImportantAssetLogos.stSOL,
    optionType: "call",
    volt: 1,
    mint: new PublicKey("7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj"),
    voltVaultId: new PublicKey("9q5kEMkY28NXjxovpr1ssLLCAHgmyYzNmgAksp6voeJ8"),
    extraVaultDataId: new PublicKey(
      "H5kRu6xZ2yZw86VuyfvkVbRq2Ac4LTM2arWLG3QKtC1o"
    ),
    vaultAuthority: new PublicKey(
      "2Ahpeqc1bo7Y4dVknvZUVfZPhHhym7JN6az2XMbUA6QA"
    ),
    shareTokenDecimals: MainnetLIDOSTSOLToken.decimals,
    spotSerumMarketId: new PublicKey(
      "CKxf35g1CDGSdF6uXFvxAzjEK7iy7G6PZQqcCJFCjqDm"
    ),
    expectedApy: 21.0,
    shortDisplayDecimals: 4,
    fallbackIndividualDepositCap: -1,
    fallbackGlobalDepositCap: -1,
    underlying: MainnetLIDOSTSOLToken,
    quote: MainnetUSDCToken,
    depositToken: MainnetLIDOSTSOLToken,
    doesHaveAutomatedEmissions: true,
  }),
  mainnet_income_call_socean: new SubvoltDef10({
    globalId: "mainnet_income_call_socean",
    network: "mainnet-beta",
    iconLink: ImportantAssetLogos.scnSOL,
    optionType: "call",
    volt: 1,
    mint: new PublicKey("5oVNBeEEQvYi1cX3ir8Dx5n1P7pdxydbGF2X4TxVusJm"),
    voltVaultId: new PublicKey("3ZYabzsHY2XGuVBBbAgrxitPhmHSKLDCKqEp3vpX9Jb1"),
    extraVaultDataId: new PublicKey(
      "5J3MHJAkHG3otVPhFAxgAcNV6cURk2CFyTLpHPKAbYeu"
    ),
    vaultAuthority: new PublicKey(
      "A5MpyajTy6hdsg3S2em5ukcgY1ZBhxTxEKv8BgHajv1A"
    ),
    shareTokenDecimals: MainnetSCNSOLToken.decimals,
    spotSerumMarketId: new PublicKey(
      "4ge6UnhomusubG4S5bYGBYk2JFskvQ9axLf9FB1fGpLY"
    ),
    expectedApy: 22.4,
    shortDisplayDecimals: 4,
    fallbackIndividualDepositCap: -1,
    fallbackGlobalDepositCap: -1,
    underlying: MainnetSCNSOLToken,
    quote: MainnetUSDCToken,
    depositToken: MainnetSCNSOLToken,
  }),
  mainnet_income_call_btc: new SubvoltDef10({
    globalId: "mainnet_income_call_btc",
    network: "mainnet-beta",
    iconLink: ImportantAssetLogos.BTC,
    optionType: "call",
    volt: 1,
    mint: new PublicKey("9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E"),
    voltVaultId: new PublicKey("CdZ1Mgo3927bsYdKK5rnzGtwek3NLWdvoTSSm2TJjdqW"),
    extraVaultDataId: new PublicKey(
      "6MpBDp3TCFTYrokZaGSpm5k5Wq9GT1P3SKx15eMvtNnh"
    ),
    vaultAuthority: new PublicKey(
      "DA1M8mw7GnPNKU9ReANtHPQyuVzKZtsuuSbCyc2uX2du"
    ),
    shareTokenDecimals: MainnetBTCToken.decimals,
    spotSerumMarketId: new PublicKey(
      "2NksTwSCzD2XERcZN5FHgTWhCVPePWt59mBKmsKGhbhP"
    ),
    expectedApy: 16.6,
    shortDisplayDecimals: 4,
    fallbackIndividualDepositCap: 5.5,
    fallbackGlobalDepositCap: 11,
    underlying: MainnetBTCToken,
    quote: MainnetUSDCToken,
    depositToken: MainnetBTCToken,
  }),
  mainnet_income_put_btc: new SubvoltDef10({
    globalId: "mainnet_income_put_btc",
    network: "mainnet-beta",
    iconLink: ImportantAssetLogos.BTC,
    optionType: "put",
    volt: 2,
    mint: new PublicKey("9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E"),
    voltVaultId: new PublicKey("CzFUVBXaAxWRQ3JeJwsZHqDQUxBbUJLZtdoBQ3KPtsuB"),
    extraVaultDataId: new PublicKey(
      "ByJbHcLvbgEAbo9sMetMFeZhHko6SNFR1vPX8FnEvYAu"
    ),
    vaultAuthority: new PublicKey(
      "GrB6vbG2WP7eEnbwgxUbBGRMeXYq139jo2o9oW8cNK8f"
    ),
    shareTokenDecimals: MainnetUSDCToken.decimals,
    spotSerumMarketId: new PublicKey(
      "52Uwi5LjZEox2h9jT3TfQemz15d887FQLbn69RR7hDgF"
    ),
    expectedApy: 23.7,
    shortDisplayDecimals: 4,
    fallbackIndividualDepositCap: 5.5,
    fallbackGlobalDepositCap: 11,
    underlying: MainnetBTCToken,
    quote: MainnetUSDCToken,
    depositToken: MainnetUSDCToken,
  }),
  mainnet_income_call_srm: new SubvoltDef10({
    globalId: "mainnet_income_call_srm",
    network: "mainnet-beta",
    iconLink: ImportantAssetLogos.SRM,
    optionType: "call",
    volt: 1,
    mint: new PublicKey("SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt"),
    voltVaultId: new PublicKey("Ef2CD9yhQE7BvReQXct68uuYFW8GLKj62u2YPfmua3JY"),
    extraVaultDataId: new PublicKey(
      "9e7XC1K2sPbDALCA7ZD8oxockHLe6KtXjEKhjEzqEGuj"
    ),
    vaultAuthority: new PublicKey(
      "2P427N5sYcEXvZAZwqNzjXEHsBMESQoLyjNquTSmGPMb"
    ),
    shareTokenDecimals: MainnetSRMToken.decimals,
    spotSerumMarketId: new PublicKey(
      "DaTyog7M78LnH69yowfVKRAnETPEeJPjyeh1BpKDuQeD"
    ),
    expectedApy: 25.9,
    shortDisplayDecimals: 4,
    fallbackIndividualDepositCap: -1,
    fallbackGlobalDepositCap: -1,
    underlying: MainnetSRMToken,
    quote: MainnetUSDCToken,
    depositToken: MainnetSRMToken,
  }),
  mainnet_income_call_ftt: new SubvoltDef10({
    globalId: "mainnet_income_call_ftt",
    network: "mainnet-beta",
    iconLink: ImportantAssetLogos.FTT,
    optionType: "call",
    volt: 1,
    mint: new PublicKey("EzfgjvkSwthhgHaceR3LnKXUoRkP6NUhfghdaHAj1tUv"),
    voltVaultId: new PublicKey("8qjBanq5cxc3FzsaEznKfpsbPwfMVoB6AxLXY7pe3fEX"),
    extraVaultDataId: new PublicKey(
      "ATkNEzFX7ZygpzGMLRphSgfiK512nBBZHcKjjJdFgMdq"
    ),
    vaultAuthority: new PublicKey(
      "7KqHFuUksvNhrWgoacKkqyp2RwfBNdypCYgK9nxD1d6K"
    ),
    shareTokenDecimals: 6,
    spotSerumMarketId: new PublicKey(
      "GWjUq2xcTVzaWbpJ3quTSeJnFbicWamcFZREyyNHCHJe"
    ),
    expectedApy: 21.3,
    shortDisplayDecimals: 4,
    fallbackIndividualDepositCap: -1,
    fallbackGlobalDepositCap: -1,
    underlying: MainnetFTTToken,
    quote: MainnetUSDCToken,
    depositToken: MainnetFTTToken,
  }),
  mainnet_income_call_step: new SubvoltDef10({
    globalId: "mainnet_income_call_step",
    network: "mainnet-beta",
    iconLink: ImportantAssetLogos.STEP,
    optionType: "call",
    volt: 1,
    mint: new PublicKey("StepAscQoEioFxxWGnh2sLBDFp9d8rvKz2Yp39iDpyT"),
    voltVaultId: new PublicKey("8YtJU58RUbvrdqCyTK7zJBSmCafVvZfysdXYq3W7YDai"),
    extraVaultDataId: new PublicKey(
      "6hSjQYdLAwVvBAnf9ye5XjbhDx8dky31BWr6jq34MAfu"
    ),
    vaultAuthority: new PublicKey(
      "FiEHDTKT6X7VFwGaUmsm1XXYr8vvkoSR5EqcY4znpefq"
    ),
    shareTokenDecimals: MainnetSTEPToken.decimals,
    spotSerumMarketId: new PublicKey(
      "Di8cexymBtunKZb8CQC9g6188k98NeZEhoscED9oExWM"
    ),
    expectedApy: 17.5,
    shortDisplayDecimals: 4,
    fallbackIndividualDepositCap: -1,
    fallbackGlobalDepositCap: -1,
    underlying: MainnetSTEPToken,
    quote: MainnetUSDCToken,
    depositToken: MainnetSTEPToken,
  }),
  mainnet_income_call_avax: new SubvoltDef10({
    globalId: "mainnet_income_call_avax",
    network: "mainnet-beta",
    iconLink: ImportantAssetLogos.AVAX,
    optionType: "call",
    volt: 1,
    mint: new PublicKey("KgV1GvrHQmRBY8sHQQeUKwTm2r2h8t4C8qt12Cw1HVE"),
    voltVaultId: new PublicKey("7mzbtntRJL7QPw2rtAcFhqVM7iBvCa6McaatZ5RPPhag"),
    extraVaultDataId: new PublicKey(
      "7MDpCGNLKJyUaXhbFe6WqkQHvLKELLwibYj1H5FknkmA"
    ),
    vaultAuthority: new PublicKey(
      "5LrULR5w9N1dfnJ9vHnzRkQi9uBL3CkSRWkDGTG6dP1e"
    ),
    shareTokenDecimals: MainnetAVAXToken.decimals,
    spotSerumMarketId: new PublicKey(
      "A5z6Fmd5oHJaehJrDcm7i1kNN8hz1NQLmqpaWoNtFspo"
    ),
    expectedApy: 29.1,
    shortDisplayDecimals: 4,
    fallbackIndividualDepositCap: -1,
    fallbackGlobalDepositCap: -1,
    underlying: MainnetAVAXToken,
    quote: MainnetUSDCToken,
    depositToken: MainnetAVAXToken,
    wormholeAsset: ASSET_AVAX,
  }),
  mainnet_income_call_ray: new SubvoltDef10({
    globalId: "mainnet_income_call_ray",
    network: "mainnet-beta",
    iconLink: ImportantAssetLogos.RAY,
    optionType: "call",
    volt: 1,
    mint: new PublicKey("4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R"),
    voltVaultId: new PublicKey("4LtxyBUH8PsRea21s7CaaYWtq7KutcZ4x8r6PTmUCcvs"),
    extraVaultDataId: new PublicKey(
      "EhH6Vw3DwvGNPKYDDVgZAjP63dBXw8Eg3EHb1ixz8WpX"
    ),
    vaultAuthority: new PublicKey(
      "A6XsYxGj9wpqUZG81XwgQJ2zJ3efCbuWSQfnkHqUSmdM"
    ),
    shareTokenDecimals: MainnetRAYToken.decimals,
    spotSerumMarketId: new PublicKey(
      "9XUVkBf8K38iXJPos77wsMnJoniX7YNH17Rbzw1qmh9K"
    ),
    expectedApy: 26.0,
    shortDisplayDecimals: 4,
    fallbackIndividualDepositCap: -1,
    fallbackGlobalDepositCap: -1,
    underlying: MainnetRAYToken,
    quote: MainnetUSDCToken,
    depositToken: MainnetRAYToken,
    abnormalEpochLength: 14,
  }),
  mainnet_income_call_sbr: new SubvoltDef10({
    globalId: "mainnet_income_call_sbr",
    network: "mainnet-beta",
    iconLink: ImportantAssetLogos.SBR,
    optionType: "call",
    volt: 1,
    mint: new PublicKey("Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1"),
    voltVaultId: new PublicKey("5b2VBmdZAmnFpmWD6hi5xWFeaf4equVwNp25q1UWC9FP"),
    extraVaultDataId: new PublicKey(
      "FyxL7QKDXqcNgtVZ9uAXEvaQbz5t6cRLTsj4krmUYo6C"
    ),
    vaultAuthority: new PublicKey(
      "BH7Jg3f97FyeGxsPR7FFskvfqGiaLeUnJ9Ksda53Jj8h"
    ),
    shareTokenDecimals: MainnetSBRToken.decimals,
    spotSerumMarketId: new PublicKey(
      "APRoymKQLaXf68LxzGAJTYR3VVe9nTXmDZKJWNfmabg2"
    ),
    expectedApy: 36.3,
    shortDisplayDecimals: 4,
    fallbackIndividualDepositCap: -1,
    fallbackGlobalDepositCap: -1,
    underlying: MainnetSBRToken,
    quote: MainnetUSDCToken,
    depositToken: MainnetSBRToken,
    abnormalEpochLength: 14,
  }),
  mainnet_income_call_mngo: new SubvoltDef10({
    globalId: "mainnet_income_call_mngo",
    network: "mainnet-beta",
    iconLink: ImportantAssetLogos.MNGO,
    optionType: "call",
    volt: 1,
    mint: new PublicKey("MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac"),
    voltVaultId: new PublicKey("DxSADpEUR8xULRdWwb37pN8mjPHHC5D8aRnyUAvVSYHa"),
    extraVaultDataId: new PublicKey(
      "xwQiKPudYRonxSF6JUUfQHyhWXD2DUrME9cjiva6gd8"
    ),
    vaultAuthority: new PublicKey(
      "B3yakZxwomkmnCxRr8ZmQtiWgtxtVBuCREDFDdAvcCVQ"
    ),
    shareTokenDecimals: MainnetMNGOToken.decimals,
    spotSerumMarketId: new PublicKey(
      "3zb9bvQ5jeY9wFyr9MSeNqkFf5Ch3DTvY49Q6476E4HF"
    ),
    expectedApy: 12.8,
    shortDisplayDecimals: 4,
    fallbackIndividualDepositCap: -1,
    fallbackGlobalDepositCap: -1,
    underlying: MainnetMNGOToken,
    quote: MainnetUSDCToken,
    depositToken: MainnetMNGOToken,
    abnormalEpochLength: 14,
  }),
  mainnet_income_put_mngo: new SubvoltDef10({
    globalId: "mainnet_income_put_mngo",
    network: "mainnet-beta",
    iconLink: ImportantAssetLogos.MNGO,
    optionType: "put",
    volt: 2,
    mint: new PublicKey("MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac"),
    voltVaultId: new PublicKey("9SPz2yjNc9V4FmdHrkYF1GfikGbe5rfwg6VPzhQJpPyt"),
    extraVaultDataId: new PublicKey(
      "DEg4dUewDBdgGDMGLt1XBsrucsUJSphGf5Rn4ezX3EtC"
    ),
    vaultAuthority: new PublicKey(
      "CVrRw6VtxSjokm2tKmaS5RCuoc9EFjN4wEoov6f2PST6"
    ),
    shareTokenDecimals: MainnetUSDCToken.decimals,
    spotSerumMarketId: new PublicKey(
      "F7kZsKPJQAMT6BgruKfEU2jpu91Jj2iTjNeSpUZstMmd"
    ),
    expectedApy: 26.4,
    shortDisplayDecimals: 2,
    fallbackIndividualDepositCap: -1,
    fallbackGlobalDepositCap: -1,
    underlying: MainnetMNGOToken,
    quote: MainnetUSDCToken,
    depositToken: MainnetUSDCToken,
    abnormalEpochLength: 14,
  }),
  mainnet_income_put_uxd: new SubvoltDef10({
    globalId: "mainnet_income_put_uxd",
    network: "mainnet-beta",
    iconLink: ImportantAssetLogos.UXD,
    optionType: "put",
    volt: 2,
    mint: new PublicKey("7kbnvuGBxxj8AG9qp8Scn56muWGaRaFqxg1FsRp3PaFT"),
    voltVaultId: new PublicKey("czeyfQ3tZdfnPwLeRMRCYVHNjhViBR1fUd7giLBNKHA"),
    extraVaultDataId: new PublicKey(
      "3jFRqBprZfo8ZmN2kHcCZYv2CQQzkD3oBLjWv6KdQGiV"
    ),
    vaultAuthority: new PublicKey(
      "3f6W66hpeW7eLivRgVghFEqgz4NRngWravPh3maDanVb"
    ),
    shareTokenDecimals: MainnetUXDToken.decimals,
    spotSerumMarketId: new PublicKey(
      "Fze6inVkgQtJod6sPfhuTeG1GYAkdRCujjF7FxyYuywk"
    ),
    expectedApy: 25.6,
    shortDisplayDecimals: 2,
    fallbackIndividualDepositCap: -1,
    fallbackGlobalDepositCap: -1,
    underlying: MainnetSOLToken,
    quote: MainnetUSDCToken, // This is intentional. Please see "changed" 😂: https://github.com/Friktion-Labs/dapp/commit/7c82fb6702e0ef85ca0cc2947b65b040671ce62a
    depositToken: MainnetUXDToken,
    externalLink: "https://app.uxd.fi/",
    shouldHideSwapTab: true,
  }),
  mainnet_income_call_samo: new SubvoltDef10({
    globalId: "mainnet_income_call_samo",
    network: "mainnet-beta",
    iconLink: ImportantAssetLogos.SAMO,
    optionType: "call",
    volt: 1,
    mint: new PublicKey("7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"),
    voltVaultId: new PublicKey("CMVV4kfSdJRufiTNrrhr6PsvYY8SFhNs3TVjsWS3rJvP"),
    extraVaultDataId: new PublicKey(
      "2BU1z1e1h3adbsLYpnARMa4JCsZYMhrFC16jGPqb9ZYq"
    ),
    vaultAuthority: new PublicKey(
      "7zev38J4jebnpACswV8iqjhDK9jsC1MGHtuAE2SPvqeZ"
    ),
    shareTokenDecimals: MainnetSamoToken.decimals,
    spotSerumMarketId: new PublicKey(
      "E6LmqE7JS7dbFFpsYFrNx27xsBLTZQKFbEJTzo363Un2"
    ),
    expectedApy: 24.0,
    shortDisplayDecimals: 2,
    fallbackIndividualDepositCap: -1,
    fallbackGlobalDepositCap: -1,
    underlying: MainnetSamoToken,
    quote: MainnetUSDCToken,
    depositToken: MainnetSamoToken,
    // abnormalEpochLength: 14,
  }),
  mainnet_income_call_near: new SubvoltDef10({
    globalId: "mainnet_income_call_near",
    network: "mainnet-beta",
    iconLink: ImportantAssetLogos.NEAR,
    optionType: "call",
    volt: 1,
    mint: new PublicKey("BYPsjxa3YuZESQz1dKuBw1QSFCSpecsm8nCQhY5xbU1Z"),
    voltVaultId: new PublicKey("7P7oU1dTxXVU1Pked1DnEnr4GrrQb549zMAY4VmjChDo"),
    extraVaultDataId: new PublicKey(
      "37tASwXheKJTLPD6HHLniT5GsU8e4v755mVox5faAn83"
    ),
    vaultAuthority: new PublicKey(
      "8XfzVjDJU2ZekawjA7fhUHQt2KNGVYv8qq1AzuGZ7iyK"
    ),
    shareTokenDecimals: MainnetNearToken.decimals,
    spotSerumMarketId: new PublicKey(
      "77UaXUjEJ9GeWw2WNabymtZy7ezKmwGfCG8C7edsW7xD"
    ),
    expectedApy: 23.7,
    shortDisplayDecimals: 2,
    fallbackIndividualDepositCap: -1,
    fallbackGlobalDepositCap: -1,
    underlying: MainnetNearToken,
    quote: MainnetUSDCToken,
    depositToken: MainnetNearToken,
    abnormalEpochLength: 28,
  }),
  mainnet_income_call_luna: new SubvoltDef10({
    globalId: "mainnet_income_call_luna",
    network: "mainnet-beta",
    iconLink: ImportantAssetLogos.LUNA,
    optionType: "call",
    volt: 1,
    mint: new PublicKey("F6v4wfAdJB8D8p77bMXZgYt8TDKsYxLYxH5AFhUkYx9W"),
    voltVaultId: new PublicKey("4jx7Fec8kmwvabqTYp9M7C2zPfhivFgiqqzajn9Ns2ba"),
    extraVaultDataId: new PublicKey(
      "DH6aU2HP6f7hhiamxWWB6kF52gARbMhE11jT6WCANc6K"
    ),
    vaultAuthority: new PublicKey(
      "5oV1Yf8q1oQgPYuHjepjmKFuaG2Wng9dzTqbSWhU5W2X"
    ),
    shareTokenDecimals: MainnetLUNAToken.decimals,
    spotSerumMarketId: new PublicKey(
      "6oxqAenMejUcgcnY43L4PuBhKwjpMRESZyP2MpKQEedR"
    ),
    expectedApy: 12.0,
    shortDisplayDecimals: 4,
    fallbackIndividualDepositCap: -1,
    fallbackGlobalDepositCap: -1,
    underlying: MainnetLUNAToken,
    quote: MainnetUSDCToken,
    depositToken: MainnetLUNAToken,
  }),
  mainnet_income_put_luna: new SubvoltDef10({
    globalId: "mainnet_income_put_luna",
    network: "mainnet-beta",
    iconLink: ImportantAssetLogos.LUNA,
    optionType: "put",
    volt: 2,
    mint: new PublicKey("F6v4wfAdJB8D8p77bMXZgYt8TDKsYxLYxH5AFhUkYx9W"),
    voltVaultId: new PublicKey("3aL9h1PVt2rbUPo11QZpRbpLJhWHrHCpizsirWhMXiXB"),
    extraVaultDataId: new PublicKey(
      "7a6MCYkAUb3iQU7hU8v5kfqkBpLGadGyuqUe64x5FMTC"
    ),
    vaultAuthority: new PublicKey(
      "5kA7FPiB3t2X5s65dK1AoEu5asDjC5d7f5vaB4iY2yrj"
    ),
    shareTokenDecimals: MainnetUSTToken.decimals,
    spotSerumMarketId: new PublicKey(
      "F7kZsKPJQAMT6BgruKfEU2jpu91Jj2iTjNeSpUZstMmd"
    ),
    expectedApy: 12.0,
    shortDisplayDecimals: 2,
    fallbackIndividualDepositCap: -1,
    fallbackGlobalDepositCap: -1,
    underlying: MainnetLUNAToken,
    quote: MainnetUSTToken,
    depositToken: MainnetUSTToken,
  }),
  mainnet_income_perp_btc: new SubvoltDef10({
    globalId: "mainnet_income_perp_btc",
    network: "mainnet-beta",
    iconLink: ImportantAssetLogos.BTC,
    volt: 3,
    mint: new PublicKey("9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E"),
    voltVaultId: new PublicKey("JPmAHJBocDi1539s2wfqiGzVTZd4quYJgx5dg6Ysq2k"),
    extraVaultDataId: new PublicKey(
      "6b7YMVAkdx1mZqTGA4fpCHt3dRCcVLRd8N5oN8zk2ej2"
    ),
    vaultAuthority: new PublicKey(
      "3A9M3rMmAg6SZmNgMuZ1sinriFaTdS9Fmj6c54w1vDG4"
    ),
    shareTokenDecimals: MainnetUSDCToken.decimals,
    spotSerumMarketId: new PublicKey(
      "52Uwi5LjZEox2h9jT3TfQemz15d887FQLbn69RR7hDgF"
    ),
    expectedApy: 19.5,
    shortDisplayDecimals: 4,
    fallbackIndividualDepositCap: -1,
    fallbackGlobalDepositCap: -1,
    underlying: MainnetBTCToken,
    quote: MainnetUSDCToken,
    depositToken: MainnetUSDCToken,
  }),
  mainnet_basis_usdc_sol: new SubvoltDef10({
    globalId: "mainnet_basis_usdc_sol",
    network: "mainnet-beta",
    iconLink: ImportantAssetLogos.SOL,
    volt: 4,
    mint: new PublicKey("So11111111111111111111111111111111111111112"),
    basisAccount: new PublicKey("7DmQrnAF9xpnwy58UpzmNz39PFyszJgCbL9nDguRcWJp"),
    voltVaultId: new PublicKey("2yPs4YTdMzuKmYeubfNqH2xxgdEkXMxVcFWnAFbsojS2"),
    extraVaultDataId: new PublicKey(
      "FKJEQzbZ42cQNFyTHLCeLWqpLnB4XDP9vbWjaXtZtQuS"
    ),
    vaultAuthority: new PublicKey(
      "C2k7bZg3iBaqGM4xXzJiX4VADa2GJ6ZUhdQV76A5dB3Z"
    ),
    shareTokenDecimals: MainnetUSDCToken.decimals,
    spotSerumMarketId: new PublicKey(
      "52Uwi5LjZEox2h9jT3TfQemz15d887FQLbn69RR7hDgF"
    ),
    expectedApy: 2.3,
    shortDisplayDecimals: 4,
    fallbackIndividualDepositCap: -1,
    fallbackGlobalDepositCap: -1,
    underlying: MainnetSOLToken,
    quote: MainnetUSDCToken,
    depositToken: MainnetUSDCToken,
  }),
  mainnet_basis_usdc_btc: new SubvoltDef10({
    globalId: "mainnet_basis_usdc_btc",
    network: "mainnet-beta",
    iconLink: ImportantAssetLogos.BTC,
    volt: 4,
    mint: new PublicKey("9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E"),
    voltVaultId: new PublicKey("5UothAuhBvRgmR3pEEppLUFoCexcuDshgbS1fb1Ad5WR"),
    extraVaultDataId: new PublicKey(
      "8s9pomGR273mSmcWFf9nWqh2mzrfEcGNnR79NXWHgbvY"
    ),
    vaultAuthority: new PublicKey(
      "Epomtk2m1vF6J74wXxYjRmkZPismCAtriCUxBSR3D1AV"
    ),
    shareTokenDecimals: MainnetUSDCToken.decimals,
    spotSerumMarketId: new PublicKey(
      "52Uwi5LjZEox2h9jT3TfQemz15d887FQLbn69RR7hDgF"
    ),
    expectedApy: 3.9,
    shortDisplayDecimals: 4,
    fallbackIndividualDepositCap: -1,
    fallbackGlobalDepositCap: -1,
    underlying: MainnetBTCToken,
    quote: MainnetUSDCToken,
    depositToken: MainnetUSDCToken,
  }),
  mainnet_protection_usdc_sol: new SubvoltDef10({
    globalId: "mainnet_protection_usdc_sol",
    network: "mainnet-beta",
    iconLink: ImportantAssetLogos.SOL,
    volt: 5,
    mint: new PublicKey("So11111111111111111111111111111111111111112"),
    voltVaultId: new PublicKey("APmqy4yUm3f9Vnv53fcKB788yWEXgMrBxwZZ8XQXKwUr"),
    extraVaultDataId: new PublicKey(
      "J8ZKvJqvnLUe6ybvcrRGWzqfvA4WDL1VGXTp7x1WenEb"
    ),
    vaultAuthority: new PublicKey(
      "46g4nzkBxZzdb3hURJHXSUSwGGzbyGKtHijqdjbhozJC"
    ),
    shareTokenDecimals: MainnetUSDCToken.decimals,
    spotSerumMarketId: new PublicKey(
      "52Uwi5LjZEox2h9jT3TfQemz15d887FQLbn69RR7hDgF"
    ),
    expectedApy: 3.2,
    shortDisplayDecimals: 4,
    fallbackIndividualDepositCap: -1,
    fallbackGlobalDepositCap: -1,
    underlying: MainnetSOLToken,
    quote: MainnetUSDCToken,
    depositToken: MainnetUSDCToken,
  }),
};

Object.entries(INTERNAL_SPECIFICALLY_TYPED_SUBVOLT_INFO).forEach((v) => {
  const volt = v[1];
  if (volt.extraVaultDataId === undefined) {
    if (volt.volt === 3 || volt.volt === 4)
      throw new Error(
        "volt =" + v[0].toString() + " 3 and 4 must define extra volt data"
      );
  }
});

/**
 * A union of all the subvolts
 */
export type GlobalId = keyof typeof INTERNAL_SPECIFICALLY_TYPED_SUBVOLT_INFO;

/**
 * All of the Subvolt info for assets launched. Includes both mainnet and devnet.
 *
 * Access the subvoltsUse this if you are hardcoding the globalId
 */
export const STRONG_SUBVOLTS: Readonly<Record<GlobalId, SubvoltDef10>> =
  INTERNAL_SPECIFICALLY_TYPED_SUBVOLT_INFO as unknown as Record<
    GlobalId,
    SubvoltDef10
  >;

/**
 * Mainnet only
 */
export const SORTED_VOLT1 = Object.values(STRONG_SUBVOLTS)
  .filter((def) => def.volt === 1 && !def.globalId.includes("luna"))
  .filter((def) => def.network === "mainnet-beta")
  .sort((a, b) => a.underlying.name.localeCompare(b.underlying.name));

/**
 * Mainnet only
 */
export const SORTED_VOLT2 = Object.values(STRONG_SUBVOLTS)
  .filter((def) => def.volt === 2 && !def.globalId.includes("luna"))
  .filter((def) => def.network === "mainnet-beta")
  .sort((a, b) => {
    const fullA = `${a.depositToken.symbol} ${a.underlying.symbol}`;
    const fullB = `${b.depositToken.symbol} ${b.underlying.symbol}`;
    const quoteSort = fullA.localeCompare(fullB);
    return quoteSort;
  });

/**
 * Mainnet only
 */
export const SORTED_VOLT3 = Object.values(STRONG_SUBVOLTS)
  .filter((def) => def.volt === 3)
  .filter((def) => def.network === "mainnet-beta")
  .sort((a, b) => a.underlying.name.localeCompare(b.underlying.name));

/**
 * Mainnet only
 */
export const SORTED_VOLT4 = Object.values(STRONG_SUBVOLTS)
  .filter((def) => def.volt === 4)
  .filter((def) => def.network === "mainnet-beta")
  .sort((a, b) => a.underlying.name.localeCompare(b.underlying.name));

/**
 * Mainnet only
 */
export const SORTED_VOLT5 = Object.values(STRONG_SUBVOLTS)
  .filter((def) => def.volt === 5)
  .filter((def) => def.network === "mainnet-beta")
  .sort((a, b) => a.underlying.name.localeCompare(b.underlying.name));

/**
 * Use this if you are dynamically using a globalId
 */
export const WEAK_SUBVOLTS: Readonly<Record<string, SubvoltDef10>> =
  STRONG_SUBVOLTS;

/**
 * A list of subvolts by Cluster. Can be iterated over.
 */
export const SUBVOLT_LIST: Record<
  "devnet" | "testnet" | "mainnet-beta" | "localnet",
  SubvoltDef10[]
> = {
  devnet: [
    STRONG_SUBVOLTS["devnet_income_call_sol"],
    STRONG_SUBVOLTS["devnet_income_perp_btc"],
  ],
  "mainnet-beta": [
    STRONG_SUBVOLTS["mainnet_income_call_btc"],
    STRONG_SUBVOLTS["mainnet_income_call_sol"],
    STRONG_SUBVOLTS["mainnet_income_call_sol_high"],
    STRONG_SUBVOLTS["mainnet_income_call_marinade"],
    STRONG_SUBVOLTS["mainnet_income_call_samo"],
    STRONG_SUBVOLTS["mainnet_income_call_near"],
    STRONG_SUBVOLTS["mainnet_income_call_eth"],
    STRONG_SUBVOLTS["mainnet_income_call_ftt"],
    STRONG_SUBVOLTS["mainnet_income_call_srm"],
    STRONG_SUBVOLTS["mainnet_income_call_mngo"],
    STRONG_SUBVOLTS["mainnet_income_call_socean"],
    STRONG_SUBVOLTS["mainnet_income_call_sbr"],
    STRONG_SUBVOLTS["mainnet_income_call_luna"],
    STRONG_SUBVOLTS["mainnet_income_call_ray"],
    STRONG_SUBVOLTS["mainnet_income_call_step"],
    STRONG_SUBVOLTS["mainnet_income_call_stsol"],
    STRONG_SUBVOLTS["mainnet_income_call_avax"],
    STRONG_SUBVOLTS["mainnet_income_put_luna"],
    STRONG_SUBVOLTS["mainnet_income_put_sol"],
    STRONG_SUBVOLTS["mainnet_income_put_sol_high"],
    STRONG_SUBVOLTS["mainnet_income_put_mngo"],
    STRONG_SUBVOLTS["mainnet_income_put_btc"],
    STRONG_SUBVOLTS["mainnet_income_put_tsUSDC"],
    STRONG_SUBVOLTS["mainnet_income_put_pai"],
    STRONG_SUBVOLTS["mainnet_income_put_uxd"],
    STRONG_SUBVOLTS["mainnet_income_put_eth"],
    STRONG_SUBVOLTS["mainnet_income_perp_btc"],
    STRONG_SUBVOLTS["mainnet_basis_usdc_sol"],
    STRONG_SUBVOLTS["mainnet_basis_usdc_btc"],
    STRONG_SUBVOLTS["mainnet_protection_usdc_sol"],
  ],
  testnet: [],
  localnet: [],
};

export const newGlobalIdToNull = () => {
  return {
    devnet_income_call_sol: null,
    devnet_income_perp_btc: null,
    mainnet_income_call_btc: null,
    mainnet_income_call_sol: null,
    mainnet_income_call_sol_high: null,
    mainnet_income_call_marinade: null,
    mainnet_income_call_samo: null,
    mainnet_income_call_near: null,
    mainnet_income_call_eth: null,
    mainnet_income_call_ftt: null,
    mainnet_income_call_srm: null,
    mainnet_income_call_mngo: null,
    mainnet_income_call_socean: null,
    mainnet_income_call_sbr: null,
    mainnet_income_call_luna: null,
    mainnet_income_call_ray: null,
    mainnet_income_put_sol: null,
    mainnet_income_put_sol_high: null,
    mainnet_income_put_mngo: null,
    mainnet_income_put_btc: null,
    mainnet_income_put_luna: null,
    mainnet_income_put_tsUSDC: null,
    mainnet_income_put_pai: null,
    mainnet_income_put_uxd: null,
    mainnet_income_put_eth: null,
    mainnet_income_call_step: null,
    mainnet_income_call_stsol: null,
    mainnet_income_call_avax: null,
    mainnet_income_perp_btc: null,
    mainnet_basis_usdc_sol: null,
    mainnet_basis_usdc_btc: null,
    mainnet_protection_usdc_sol: null,
  };
};

export const ALWAYS_GLOBALID_TO_NULL: Readonly<
  ReturnType<typeof newGlobalIdToNull>
> = newGlobalIdToNull();

function safetyCheck() {
  // check that globalId of the object is the same as the key in STRONG_SUBVOLTS
  for (const [globalId, subvolt] of Object.entries(STRONG_SUBVOLTS)) {
    if (globalId !== subvolt.globalId) {
      throw new Error(
        `globalId of subvolt ${globalId} does not match key in STRONG_SUBVOLTS`
      );
    }
  }
}
safetyCheck();

/**
 * Dynamically loaded data for a subvolt of Volt #01
 *
 * This is global information, not specific to a user.
 */
export type Subvolt1Data = {
  /**
   * Used for determining the type
   */
  volt: VoltNumber;
  globalId: GlobalId;

  /***
   * Warning. Don't abuse this... you shouldn't be getting data out of this.
   */
  voltVaultData: VoltVault;

  /***
   * extra metadata about target volt
   */
  extraVaultData: ExtraVoltData | null;

  /***
   * AUM fee, if volt has one (Volt 4 should)
   */
  aumFee: number | null;

  /**
   * Currently just returns expectedApy from the subvoltDefinition.
   *
   * markPrice can be undefined. This is good in the case of a network error
   */
  apy: number;

  /**
   * Underlying asset amount.
   *
   * Loaded from the subvoltdef, but overwritten by onchain data if nonzero.
   */
  capacity: Decimal;
  /**
   * Underlying asset amount.
   *
   * Loaded from the subvoltdef, but overwritten by onchain data if nonzero.
   */
  individualCapacity: Decimal;

  /**
   * Underlying asset amount
   */
  totalDeposits: Decimal;

  /**
   * markPrice is critical to the app experience, so don't show anything until
   * we have fetched markPrice
   */
  markPrice: Decimal;
  /**
   * Convenience value
   */
  totalDepositsUSD: Decimal;
  /**
   * Convenience value
   */
  capacityUSD: Decimal;

  /**
   * The value of 1 share to 1 of the deposit asset
   */
  sharePrice: Decimal;

  /**
   * Mint address of vault's SPL volt token
   */
  shareMint: PublicKey;

  /**
   * Mint address of vault's current option token (if Volt 1 or 2)
   */
  optionMint: PublicKey | undefined;
};

export type CrabVoltData = {
  delta: number | null;
  profitRangeLow: number | null;
  profitRangeHigh: number | null;
  dailyFundingRate: number | null;
  impliedVolatility: number | null;
  collateralRatio: number;
  liquidationThreshold: number;
  lastRebalanceTime: number;
};

export type BasisVoltData = {
  apy: number | null;
  leverageRatio: number | null;
  borrowInterest: number | null;
  supplyInterest: number | null;
  funding: number | null;
};

export type CrabCardData = {
  start: string;
  end: string;
  markPrice: string;
};

/**
 * Information about a user's deposit in a specific subvolt of Volt #01
 */
export type Subvolt1UserDeposits = {
  volt: VoltNumber;
  globalId: GlobalId;

  /**
   * Total underlying asset amount in the users' wallet
   */
  depositTokenWalletBalance: Decimal;

  /**
   * Total underlying asset amount earning yield.
   *
   * Includes balance staked in Quarry
   *
   * Does NOT include pending amounts
   */
  deposits: Decimal;

  /**
   * Total underlying asset amount earning yield.
   *
   * Does NOT include pending amounts
   */
  pendingDeposits: Decimal;

  /**
   * Human amount of pending withdrawal.
   *
   * Can be undefined, because it depends on mark price which may not be fetched yet.
   *
   * When displayed, this should be rounded.
   */
  pendingWithdrawals: Decimal;

  /**
   * After a penidng withdrawal is claimable, the user will then be able to claim.
   */
  claimableWithdrawals: Decimal;

  /**
   * How many volt tokens the user can mint immediately
   */
  mintableShares: Decimal;
  /**
   * Human amount of max withdrawable. Useful for button. to click max.
   *
   * Full precision. You should use def.formatMaxWithoutSymbol
   */
  maxWithdrawableAmount: Decimal;

  estimatedTotalUnderlyingWithoutPending: Decimal;
  /**
   * Round info for
   */
  // pendingDepositRoundAmountUnderlying: Decimal;

  // pendingDepositRoundVoltTokens: Decimal;

  // pendingWithdrawalRoundAmountVolt: Decimal;

  // pendingWithdrawalRoundUnderlyingTokens: Decimal;
  /**
   * Actually all deposits belonging to the user. Used for display purposes mainly.
   *
   * Includes Quarry
   *
   * Convenience value
   */
  totalDeposits: Decimal;

  /**
   * How many volt tokens are in the user's wallet. Denominated in volt tokens
   */
  sharesInWallet: Decimal;

  /**
   * The normalized amount of volt tokens deposited in the user's personal quarry_mine
   * (not using Merge Mine)
   *
   * Null means the user doesn't have a miner
   */
  singleQuarryDeposits: Decimal | null;
};

/**

# Spec for waterfall style data flow


Context: MarkPrices10
  Fetches the mark price for all assets in the registry
  Dependencies: none


Context: SubvoltLoader10
  Loads all subvolt data for all subvolts
  Returns {
    allLoaded: boolean,
    subvoltData: Record<GlobalId, Subvolt1Data | null>
  }
  Soft dependencies:
   - MarkPrices10: If markPrices10 is loaded, will calculate and return the info in Subvolt1Data


Context: Deposits10
  Loads deposit information for all subvolts for the connected user
  Returns {
    allLoaded: boolean,
    depositsForUser: Record<GlobalId, Subvolt1Data | null>
  }
  Dependencies:
    - SubvoltLoader10 (the dependency is due to voltVaultData being loaded)
    - useConnectedWallet

MarkPrices10
↳ SubvoltLoader10
  ↳ Deposits10
    ↳ useCards
      ↳ React components


In practice how the loading flow results in the app state

SubvoltLoader10 -> Components
  State: Shows cards without price data

SubvoltLoader10 -> Deposits10 -> Components
  State: Shows information

MarkPrices10 -> Deposits10
  State: Shows cards without price data


Roundtrip 1:
  SubvoltLoader  fetches volt vault info
  MarkPrice     fetches price

Roundtrip 2:
  SubvoltLoader  fetches all info needed to calculate totalDeposits
  Deposits10     Fetches some info for the user


## Example of waterfall loading within a context

```js
const { loading: loadingA; data: dataA } = useParsedAccounts(voltVaultId)

const accountsB = loadingA ? [] : figureOutWhatAccountsToLoad(dataA)
const { loading: loadingB; data: dataB } = useParsedAccounts(accountsB)

const accountsC = loadingB ? [] : figureOutWhatAccountsToLoad(dataB)
const { loading: loadingC; data: dataC } = useParsedAccounts(accountsC)

if (!loadingA && !loadingB && !loadingC) {
  // Process data
  const loadedData: Subvolt1Data = {...}
}
```
*/
const SPEC_FOR_WATERFALL = "gm";

console.log(SPEC_FOR_WATERFALL);

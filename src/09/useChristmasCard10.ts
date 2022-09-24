import { Asset } from "../types/volts.type";
import { useFriktionSDK } from "../hooks/useFriktionSDK";
import { VaultForAsset } from "../types/volts.type";
import {
  FriktionSnapshot,
  RoundWithKey,
  VoltSDK,
  VoltSnapshot,
} from "@friktion-labs/friktion-sdk";
import { Card09Props } from "./Card10";
import {
  CARDS_FOR_NETWORK,
  MAINNET_PRE_CARD_REGISTRY_VOLT1,
} from "./registry09";
import {
  GlobalId,
  Subvolt1Data,
  SubvoltDef10,
  SUBVOLT_LIST,
} from "./registry10";
import { useSubvoltLoader } from "./SubvoltLoader10";
import { EvilDepositedForAsset } from "../contexts/EvilTwinSisterOfVFAC";
import { useDeposits10 } from "./UserDeposits10";
import {
  coingeckoConversionReal,
  coingeckoConversionWithUsd,
  useMarkPrices,
} from "./MarkPrices10";
import {
  DEFAULT_WITHDRAWAL_FEE_BPS,
  DEFAULT_PERFORMANCE_FEE_BPS,
} from "@friktion-labs/friktion-sdk";
import { useMemo } from "react";
import { useCondomOfEquality } from "./superCondom";
import Decimal from "decimal.js";
import { crunchYieldExtrapolations } from "./YieldTooltip";
import { SystemProgram } from "@solana/web3.js";
import { useAuctionResults, YieldDataForVolt } from "./AuctionResults";
/**
 * VFAC is quarantined. The new parts of the app (09) is NOT allowed to touch
 * any internals of VFAC. It ALL has to pass through this hook.
 */
export const useQuarantineChristmas10VFACWarningOnlyWorksWithCoveredCalls =
  (): QuarantineChristmas => {
    const sdk = useFriktionSDK();
    const { markPrices } = useMarkPrices();

    const { allLoaded, loadedData } = useSubvoltLoader();
    const { depositsForUser, depositsForSearchedWallet } = useDeposits10();
    const { yieldDataPerVolt } = useAuctionResults();

    // whatChangedDeeply("christmas cards", {
    //   depositsForUser,
    //   depositsForSearchedWallet,
    //   loadedData,
    //   yieldDataPerVolt,
    //   "sdk.net.id": sdk.net.id,
    // });

    const cards = useCondomOfEquality(
      useMemo(() => {
        let cards = CARDS_FOR_NETWORK[sdk.net.id];

        // This is pretty cool. lets keep it
        // CHRISTMAS:
        cards = cards.map((card) => {
          if (card.def) {
            return {
              ...card,
              data: loadedData[card.def.globalId],
              deposits: depositsForUser[card.def.globalId], // This is nice because we don't do any processing
            };
          } else {
            return card;
          }
        });
        return cards;
      }, [depositsForUser, loadedData, sdk.net.id])
    );

    const cardsForSearchedWallet = useCondomOfEquality(
      useMemo(() => {
        let cards = CARDS_FOR_NETWORK[sdk.net.id];

        // This is pretty cool. lets keep it
        // CHRISTMAS:
        cards = cards.map((card) => {
          if (card.def) {
            return {
              ...card,
              data: loadedData[card.def.globalId],
              deposits: depositsForSearchedWallet[card.def.globalId], // This is nice because we don't do any processing
            };
          } else {
            return card;
          }
        });
        return cards;
      }, [depositsForSearchedWallet, loadedData, sdk.net.id])
    );

    // totalTvl does not belong in christmascards.
    // Make a new function that takes in a cards from the christmas cards and
    // returns the total tvl for the entire Friktion ecosystem.
    // totalTvl: loading ? undefined : totalTVLNumber,

    // As a side effect, we save tvl info into window
    saveDataIntoWindowForPuppeteer(markPrices, loadedData, yieldDataPerVolt);
    // console.log("THISTHING");
    // whatChangedDeeply("this christmas", { cards });
    return {
      loading: !allLoaded,
      cards: cards,
      cardsForSearchedWallet: cardsForSearchedWallet,
    };
  };

export type QuarantineChristmas = {
  loading: boolean;
  cards: Card09Props[];
  cardsForSearchedWallet: Card09Props[];
};

export type VFACDeposit = {
  globalId: string;
  subvoltDef: SubvoltDef10;
  info: EvilDepositedForAsset;
  apy: number | undefined;
  volt: VaultForAsset;
  voltSDK: VoltSDK;
};

export type VFACRound = {
  globalId: string;
  asset: Asset;
  info: RoundWithKey;
  volt: VaultForAsset;
  voltSDK: VoltSDK;
};

class MissingFieldError extends Error {}

declare global {
  interface Window {
    friktionSnapshot: FriktionSnapshot | null;
  }
}

const generateRegistry = (
  subvoltList: SubvoltDef10[],
  globalIdToVolt: Record<GlobalId, Subvolt1Data | null>,
  yieldDataPerVolt: Record<GlobalId, YieldDataForVolt | null>
) => {
  const registry: VoltSnapshot | {}[] = [];
  for (var i = 0; i < subvoltList.length; i++) {
    const def = subvoltList[i];
    const subVoltData: Subvolt1Data | null = globalIdToVolt[def.globalId];

    const vv = globalIdToVolt[def.globalId]?.voltVaultData;

    if (!vv) {
      throw new MissingFieldError();
    }

    if (!subVoltData) throw new MissingFieldError();

    const averagedEpochYield =
      yieldDataPerVolt[def.globalId]?.averagedEpochYield;
    const latestEpochYield = yieldDataPerVolt[def.globalId]?.latestEpochYield;

    const crunchedAverageYield = averagedEpochYield
      ? crunchYieldExtrapolations(averagedEpochYield)
      : undefined;
    const crunchedLatestYield = latestEpochYield
      ? crunchYieldExtrapolations(latestEpochYield)
      : undefined;
    const volt: VoltSnapshot = {
      globalId: def.globalId,
      voltVaultId: def.voltVaultId.toString(),
      extraVaultDataId: def.extraVaultDataId.toString(),
      vaultAuthority: def.vaultAuthority.toString(),
      quoteMint: def.quote.mintAccount.toString(),
      underlyingMint: def.underlying.mintAccount.toString(),
      depositTokenMint: def.depositToken.mintAccount.toString(),
      shareTokenMint: (vv?.vaultMint || "").toString(),
      shareTokenSymbol: def.shareTokenSymbol,
      shareTokenDecimals: def.shareTokenDecimals,
      depositPool: (vv?.depositPool || "").toString(),
      premiumPool: (vv?.premiumPool || "").toString(),
      spotSerumMarketId: (def.spotSerumMarketId || "").toString(),
      depositTokenSymbol: def.depositToken.symbol,
      depositTokenCoingeckoId: coingeckoConversionReal[def.depositToken.symbol],
      underlyingTokenSymbol: def.underlying.symbol,
      underlyingTokenCoingeckoId:
        coingeckoConversionReal[def.underlying.symbol],
      voltType: def.volt,
      apy:
        crunchedAverageYield !== undefined
          ? parseFloat(crunchedAverageYield?.APYBeforeFees)
          : def.expectedApy,
      abnormalEpochLength: def.abnormalEpochLength,
      isVoltage: def.isVoltage ? def.isVoltage : false,
      isInCircuits: false,
      highVoltage: def.highVoltage ? def.highVoltage : "",
      shareTokenPrice: subVoltData.sharePrice.toNumber(),
      depositTokenPrice: subVoltData.markPrice.toNumber(),
      tvlUsd: subVoltData.totalDepositsUSD.toNumber(),
      tvlDepositToken: subVoltData.totalDeposits.toNumber(),
      capacityUsd: subVoltData.capacityUSD.toNumber(),
      capacityDepositToken: subVoltData.capacity.toNumber(),
      latestEpochYield: parseFloat(crunchedLatestYield?.["7day"] ?? "0"),
      weeklyPy: parseFloat(crunchedAverageYield?.WPY ?? "0"),
      monthlyPy: parseFloat(crunchedAverageYield?.MPY ?? "0"),
      apr: parseFloat(crunchedAverageYield?.APR ?? "0"),
      apyAfterFees: parseFloat(crunchedAverageYield?.APYAfterFees ?? "0"),
      performanceFeeRate: DEFAULT_PERFORMANCE_FEE_BPS / 10000,
      withdrawalFeeRate: DEFAULT_WITHDRAWAL_FEE_BPS / 10000,
      aumFeeRateAnnualized:
        (def.requiresExtraVoltData()
          ? // NOTE: this will be loaded
            subVoltData.extraVaultData!.aumFeeBps.toNumber()
          : 0) / 10_000,
      nextAutocompoundingTime: def.getNextAutocompoundingDate().getTime(),
      lastTradedOption:
        vv.optionsContract.toString() !== SystemProgram.programId.toString()
          ? vv.optionsContract.toString()
          : "N/A",
    };
    registry.push(volt);
  }

  return registry;
};

const saveDataIntoWindowForPuppeteer = (
  markPrices: Record<string, number> | null,
  loadedData: Record<GlobalId, Subvolt1Data | null>,
  yieldDataPerVolt: Record<GlobalId, YieldDataForVolt | null>
) => {
  // #TODO: change yieldDataPerVolt check to check that not ALL are null (some can be)?
  if (
    !loadedData ||
    !markPrices ||
    !yieldDataPerVolt["mainnet_income_call_sol"]?.averagedEpochYield
  ) {
    return;
  }

  if (window.friktionSnapshot) {
    return;
  }

  let totalTvlUSD = 0;
  let coinsByCoingeckoId: Record<string, number> = {};
  let sharePricesByGlobalId: Record<string, number> = {};
  let depositTokenByGlobalId: Record<string, number> = {};
  let usdValueByGlobalId: Record<string, number> = {};
  let globalIdToDepositTokenCoingeckoId: Record<string, string> = {};
  let apyByGlobalId: Record<string, number> = {};

  for (const partialCard09 of MAINNET_PRE_CARD_REGISTRY_VOLT1) {
    const def = partialCard09.def;
    if (!def || def?.globalId === null) {
      // Cards that havent been launched yet but are in a card
      // console.log("Continuing: ", partialCard09.title);
      continue;
    }
    const data = loadedData[def.globalId];

    if (!def || !data) {
      // console.log("Returning", def?.globalId, def);
      return;
    }
    totalTvlUSD = totalTvlUSD + (data.totalDepositsUSD.toNumber() ?? 0);
    const coingeckoId = coingeckoConversionReal[def.depositToken.symbol];
    const isStablecoin =
      coingeckoConversionWithUsd[def.depositToken.symbol] === 1;
    let existingTvl = coinsByCoingeckoId[coingeckoId] ?? 0;
    existingTvl += data.totalDeposits.toNumber() ?? 0;
    coinsByCoingeckoId[coingeckoId] = existingTvl;
    sharePricesByGlobalId[def.globalId] = Number(data.sharePrice.toFixed(5));
    depositTokenByGlobalId[def.globalId] = Number(
      data.totalDeposits.toFixed(isStablecoin ? 2 : def.depositToken.decimals)
    );
    usdValueByGlobalId[def.globalId] = Number(data.totalDepositsUSD.toFixed(2));
    globalIdToDepositTokenCoingeckoId[def.globalId] = coingeckoId;

    const averagedEpochYield =
      yieldDataPerVolt[def.globalId]?.averagedEpochYield;

    const apy = averagedEpochYield
      ? new Decimal(1.0 + (averagedEpochYield.epochYield ?? 0))
          .pow((365 * 24 * 60 * 60) / averagedEpochYield.epochLength)
          .sub(1)
          .mul(100)
          .toNumber()
      : def.expectedApy;
    apyByGlobalId[def.globalId] = apy;
  }

  // let devnetRegistry: VoltSnapshot | {}[];
  let mainnetRegistry: VoltSnapshot | {}[] = [];
  try {
    // devnetRegistry = generateRegistry(SUBVOLT_LIST["devnet"], loadedData);
    mainnetRegistry = generateRegistry(
      SUBVOLT_LIST["mainnet-beta"],
      loadedData,
      yieldDataPerVolt
    );
  } catch (e) {
    console.log("Snapshot failed", e);
    if (e instanceof MissingFieldError) return;
    throw e;
  }

  const friktionSnapshot: FriktionSnapshot = {
    updateTime: Math.floor(Date.now() / 1000),
    totalTvlUSD: Number(totalTvlUSD.toFixed(2)),
    coinsByCoingeckoId,
    pricesByCoingeckoId: markPrices,
    sharePricesByGlobalId,
    depositTokenByGlobalId,
    usdValueByGlobalId,
    globalIdToDepositTokenCoingeckoId,
    apyByGlobalId,
    allMainnetVolts: mainnetRegistry,
    allDevnetVolts: [],
  };

  if (totalTvlUSD > 5000000 && Object.keys(coinsByCoingeckoId).length > 4) {
    window.friktionSnapshot = friktionSnapshot;
    console.log(friktionSnapshot);
  }
};

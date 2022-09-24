import {
  EntropyRoundWithKey,
  EntropyVoltSDK,
  ExtraVoltData,
  FRIKTION_IDLS,
  Round,
  VoltSDK,
  VoltType,
  VoltVault,
} from "@friktion-labs/friktion-sdk";
import {
  MINT_PARSER,
  TOKEN_ACCOUNT_PARSER,
  useParsedAccountsData,
} from "@saberhq/sail";
import { useAppConnection } from "features/connection";
import { KeyedAccountInfo, PublicKey } from "@solana/web3.js";
import { Decimal } from "decimal.js";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import invariant from "tiny-invariant";
import {
  AllBasisSymbolsUnion,
  AllProtectionVoltGlobalIdsUnion,
  ALWAYS_GLOBALID_TO_NULL,
  GlobalId,
  newGlobalIdToNull,
  STRONG_SUBVOLTS,
  Subvolt1Data,
} from "./registry10";
import { useFriktionSDK } from "../hooks/useFriktionSDK";
import { useMarkPrices } from "./MarkPrices10";
import { whatChangedDeeply, useCondomOfEquality } from "./superCondom";
import equal from "fast-deep-equal/es6/react";
import { BorshCoder } from "@project-serum/anchor";
import {
  isBigEnoughChange,
  isBigEnoughChangeNumberVersion,
} from "../utils/utils";
import { useBasisData } from "./BasisData";
import { useProtectionData } from "./ProtectionData";

export type SubvoltLoader10Type = {
  // allLoaded: loadedData.every(e !== null)
  /**
   * All stuff on current network is loaded
   */
  allLoaded: boolean;

  /**
   * Some will be null. For example, the devnet ones
   */
  loadedData: Record<GlobalId, Subvolt1Data | null>;

  /**
   * For Deposits10 to access voltVaultData without waiting for everything else
   * so we can do things in parallel
   */
  incompleteData: Record<GlobalId, IncompleteData1 | null>;
};

export type IncompleteData1 = Pick<
  Subvolt1Data,
  | "volt"
  | "globalId"
  | "voltVaultData"
  | "extraVaultData"
  | "apy"
  | "capacity"
  | "individualCapacity"
>;

export const SubvoltLoader10Context = createContext<SubvoltLoader10Type>({
  allLoaded: false,
  loadedData: ALWAYS_GLOBALID_TO_NULL,
  incompleteData: ALWAYS_GLOBALID_TO_NULL,
});

// TODO: add coder, parser, loading context for anchor account PrincipalProtectionVaultV1

const Volt1Coder = new BorshCoder(FRIKTION_IDLS.Volt);
const Volt1Parser = (info: KeyedAccountInfo): VoltVault => {
  return Volt1Coder.accounts.decode<VoltVault>(
    "VoltVault",
    info.accountInfo.data
  );
};

// do we need to create a new borsch coder??
const ExtraVoltCoder = new BorshCoder(FRIKTION_IDLS.Volt);
const ExtraVoltParser = (info: KeyedAccountInfo): ExtraVoltData => {
  return ExtraVoltCoder.accounts.decode<ExtraVoltData>(
    "ExtraVoltData",
    info.accountInfo.data
  );
};

const Volt1RoundCoder = new BorshCoder(FRIKTION_IDLS.Volt);
const Volt1RoundParser = (info: KeyedAccountInfo): Round => {
  return Volt1RoundCoder.accounts.decode<Round>("Round", info.accountInfo.data);
};

// TOKEN_ACCOUNT_PARSER
interface Props {
  children?: React.ReactNode;
}

export const SubvoltLoader10Provider: React.FC<Props> = ({ children }) => {
  const sdk = useFriktionSDK();
  const { network } = useAppConnection();
  const { markPricesDecimal } = useMarkPrices();
  const { basisVoltData } = useBasisData();
  const { protectionVoltData } = useProtectionData();

  // Update #0
  const volt1Keys = useMemo(() => {
    const result = [];
    for (const def of Object.values(STRONG_SUBVOLTS)) {
      if (network === def.network) {
        result.push(def.voltVaultId);
      }
    }

    return result;
  }, [network]);

  const extraVolt1Keys = useMemo(() => {
    const result = [];
    for (const def of Object.values(STRONG_SUBVOLTS)) {
      // NOTE: this logic may not be correct, may be subject to revision if whitelisting usage is extended
      if (
        network === def.network &&
        def.extraVaultDataId &&
        def.requiresExtraVoltData()
      ) {
        result.push(def.extraVaultDataId);
      }
    }
    return result;
  }, [network]);

  // Update #1
  const voltVaultDatas = useCondomOfEquality(
    useParsedAccountsData(volt1Keys, Volt1Parser)
  );

  const extraVoltDatas = useCondomOfEquality(
    useParsedAccountsData(extraVolt1Keys, ExtraVoltParser)
  );
  // On initial load, this does a double load! But it's not a big deal because we don't have side effets ... uhh we don't right?

  // Update #2
  const incompleteLoadedData1: Record<GlobalId, IncompleteData1 | null> | null =
    useCondomOfEquality(
      useMemo(() => {
        if (
          !voltVaultDatas ||
          !extraVoltDatas ||
          voltVaultDatas.every((a) => a === undefined)
        ) {
          return null;
        } else {
          whatChangedDeeply("incompleteLoadedData1", {
            network,
            volt1Keys,
            voltVaultDatas,
            extraVoltDatas,
          });
          const incompleteLoadedData1: Record<
            GlobalId,
            IncompleteData1 | null
          > = newGlobalIdToNull();
          for (const def of Object.values(STRONG_SUBVOLTS)) {
            if (network === def.network) {
              const indexOfAccountData = volt1Keys.findIndex((key) => {
                return key.equals(def.voltVaultId);
              });
              invariant(indexOfAccountData >= 0, "this is static info bruh");
              const foundDatum = voltVaultDatas[indexOfAccountData];
              if (!foundDatum) {
                console.error("Found null datum");
                return null;
              }

              const foundExtraVoltData = extraVoltDatas.find(
                (ev) =>
                  def.extraVaultDataId &&
                  ev?.accountId.toString() === def.extraVaultDataId.toString()
              );

              incompleteLoadedData1[def.globalId] = {
                volt: def.volt,
                globalId: def.globalId,
                voltVaultData: foundDatum.accountInfo.data,
                extraVaultData: foundExtraVoltData?.accountInfo?.data ?? null,
                apy:
                  def.volt === 4 && basisVoltData
                    ? basisVoltData[
                        def.underlying.symbol as AllBasisSymbolsUnion
                      ]?.apy ?? def.expectedApy
                    : def.volt === 5 && protectionVoltData
                    ? protectionVoltData[
                        def.globalId as AllProtectionVoltGlobalIdsUnion
                      ]?.apy ?? def.expectedApy
                    : def.expectedApy,
                capacity: new Decimal(
                  foundDatum.accountInfo.data.capacity.toString()
                ).div(10 ** def.depositToken.decimals),
                individualCapacity: new Decimal(
                  foundDatum.accountInfo.data.individualCapacity.toString()
                ).div(10 ** def.depositToken.decimals),
              };
            } else {
              incompleteLoadedData1[def.globalId] = null;
            }
          }
          if (Object.values(incompleteLoadedData1).every((d) => d === null)) {
            return ALWAYS_GLOBALID_TO_NULL;
          }
          return incompleteLoadedData1;
        }
      }, [
        network,
        volt1Keys,
        voltVaultDatas,
        extraVoltDatas,
        basisVoltData,
        protectionVoltData,
      ])
    );

  // Layer 2 of fetching: Get totalDeposits

  // Update #3
  const [roundUnderlyingTokensKeys, setRoundUnderlyingTokensKeys] =
    useState<Record<GlobalId, PublicKey | null> | null>(null);
  const [latestRoundInfoKeys, setLatestRoundInfoKeys] = useState<Record<
    GlobalId,
    PublicKey | null
  > | null>(null);

  // Calculate
  useEffect(() => {
    (async () => {
      if (!incompleteLoadedData1) {
        return;
      }
      let foundSomething = false;
      const newRoundUnderlyingTokensKeys: Record<GlobalId, PublicKey | null> =
        newGlobalIdToNull();
      const newLatestRoundInfoKeys: Record<GlobalId, PublicKey | null> =
        newGlobalIdToNull();
      for (const def of Object.values(STRONG_SUBVOLTS)) {
        if (network === def.network) {
          foundSomething = true;
          const incompleteData = incompleteLoadedData1[def.globalId];
          invariant(
            incompleteData,
            "incompleteData should have been checked in the useMemo"
          );
          const [roundUnderlyingTokensKey] =
            await VoltSDK.findRoundUnderlyingTokensAddress(
              def.voltVaultId,
              incompleteData.voltVaultData.roundNumber,
              sdk.programs.Volt.programId
            );

          const [roundInfoKey] = await VoltSDK.findRoundInfoAddress(
            def.voltVaultId,
            incompleteData.voltVaultData.roundNumber,
            sdk.programs.Volt.programId
          );
          newRoundUnderlyingTokensKeys[def.globalId] = roundUnderlyingTokensKey;
          newLatestRoundInfoKeys[def.globalId] = roundInfoKey;
        }
      }
      if (foundSomething) {
        if (!equal(roundUnderlyingTokensKeys, newRoundUnderlyingTokensKeys)) {
          setRoundUnderlyingTokensKeys(newRoundUnderlyingTokensKeys);
        }
        if (!equal(latestRoundInfoKeys, newLatestRoundInfoKeys)) {
          setLatestRoundInfoKeys(newLatestRoundInfoKeys);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incompleteLoadedData1, network, sdk.programs.Volt.programId]);
  // Would be nice to have a usePDA that takes in the VoltSDK function and
  // properly caches it. This would save on CPU hashing sha256. But I think this
  // is not important because a modern cpu can do about 2 million sha256 per
  // second and finding bump is only expect cost of 2 hashes.
  // But the convenience would be really nice. We are doing it for the convenience.

  // Update #4: port refreshTVLForVault over to here sans USD part
  // Only fetching underlying
  // First, get all the accounts you will need

  // From globalId to totalDeposits ... currently fake
  // const totalDepositsForVaults: Record<GlobalId, Decimal | null> | null =
  //   useMemo(() => {
  //     return roundUnderlyingTokensKeys
  //       ? {
  //           devnet_income_call_btc: null,
  //           devnet_income_call_sol: null,
  //           mainnet_income_call_btc: new Decimal(100000),
  //           mainnet_income_call_sol: new Decimal(100000),
  //           mainnet_income_call_marinade: new Decimal(100000),
  //         }
  //       : null;
  //   }, [roundUnderlyingTokensKeys]);

  // NOTE: more readable way would be having one object to store all fields.
  // splitting up dictionaries allows us to update the first value that loads,
  // thus beginning process of EvilTwinSisterOfVFAC much faster.
  const [totalDepositsForVaults, setTotalDepositsForVaults] = useState<Record<
    GlobalId,
    Decimal | null
  > | null>(null);
  const [sharePriceForVaults, setSharePriceForVaults] = useState<Record<
    GlobalId,
    Decimal | null
  > | null>(null);

  const [aumFeeForVaults, setAumFeeForVaults] = useState<Record<
    GlobalId,
    number | null
  > | null>(null);

  const roundInfoKeys = useMemo(() => {
    const result: (PublicKey | undefined)[] = [];
    if (!latestRoundInfoKeys || !incompleteLoadedData1) {
      return result;
    }
    for (const def of Object.values(STRONG_SUBVOLTS)) {
      if (network === def.network) {
        result.push(latestRoundInfoKeys[def.globalId] ?? undefined);
      }
    }

    return result;
  }, [latestRoundInfoKeys, incompleteLoadedData1, network]);

  const vaultMintKeys = useMemo(() => {
    const result: (PublicKey | undefined)[] = [];
    if (!incompleteLoadedData1) {
      return result;
    }
    for (const def of Object.values(STRONG_SUBVOLTS)) {
      if (network === def.network) {
        const vaultMintBase58 =
          incompleteLoadedData1[
            def.globalId
          ]?.voltVaultData.vaultMint.toBase58();
        if (vaultMintBase58) {
          window.vaultTokenMints[def.globalId] = vaultMintBase58;
          result.push(
            incompleteLoadedData1[def.globalId]?.voltVaultData.vaultMint
          );
        }
      }
    }

    return result;
  }, [incompleteLoadedData1, network]);

  const depositPoolKeys = useMemo(() => {
    const result: (PublicKey | undefined)[] = [];
    if (!incompleteLoadedData1) {
      return result;
    }
    for (const def of Object.values(STRONG_SUBVOLTS)) {
      if (network === def.network) {
        result.push(
          incompleteLoadedData1[def.globalId]?.voltVaultData.depositPool
        );
      }
    }

    return result;
  }, [incompleteLoadedData1, network]);

  const roundUnderlyingTokenKeys = useMemo(() => {
    const result: (PublicKey | undefined | null)[] = [];
    if (!roundUnderlyingTokensKeys) {
      return result;
    }
    for (const def of Object.values(STRONG_SUBVOLTS)) {
      if (network === def.network) {
        result.push(roundUnderlyingTokensKeys[def.globalId]);
      }
    }

    return result;
  }, [roundUnderlyingTokensKeys, network]);

  const writerTokenPoolKeys = useMemo(() => {
    const result: (PublicKey | undefined)[] = [];
    if (!incompleteLoadedData1) {
      return result;
    }
    for (const def of Object.values(STRONG_SUBVOLTS)) {
      if (network === def.network && (def.volt === 1 || def.volt === 2)) {
        if (
          incompleteLoadedData1[
            def.globalId
          ]?.voltVaultData.writerTokenMint.toString() !==
          "11111111111111111111111111111111"
        )
          result.push(
            incompleteLoadedData1[def.globalId]?.voltVaultData.writerTokenPool
          );
      }
    }

    return result;
  }, [incompleteLoadedData1, network]);

  const roundInfoAccounts = useParsedAccountsData(
    roundInfoKeys,
    Volt1RoundParser
  );
  const parsedVaultMintTokenAccounts = useParsedAccountsData(
    vaultMintKeys,
    MINT_PARSER
  );
  const parsedDepositPoolTokenAccounts = useParsedAccountsData(
    depositPoolKeys,
    TOKEN_ACCOUNT_PARSER
  );
  const parsedRoundUnderlyingTokenAccounts = useParsedAccountsData(
    roundUnderlyingTokenKeys,
    TOKEN_ACCOUNT_PARSER
  );
  const parsedWriterTokenAccounts = useParsedAccountsData(
    writerTokenPoolKeys,
    TOKEN_ACCOUNT_PARSER
  );

  // Main EFFECT: load volts
  useEffect(() => {
    (async () => {
      if (
        !incompleteLoadedData1 ||
        !roundUnderlyingTokensKeys ||
        !latestRoundInfoKeys
      )
        return;

      if (
        !parsedVaultMintTokenAccounts ||
        parsedVaultMintTokenAccounts.every((a) => a === undefined || a === null)
      ) {
        return;
      }
      if (
        !parsedDepositPoolTokenAccounts ||
        parsedDepositPoolTokenAccounts.every(
          (a) => a === undefined || a === null
        )
      ) {
        return;
      }
      if (
        !parsedRoundUnderlyingTokenAccounts ||
        parsedRoundUnderlyingTokenAccounts.every(
          (a) => a === undefined || a === null
        )
      ) {
        return;
      }

      let foundSomething = false;
      const newTotalDepositsForVaults: Record<GlobalId, Decimal | null> =
        newGlobalIdToNull();
      const newSharePriceForVaults: Record<GlobalId, Decimal | null> =
        newGlobalIdToNull();
      const newAumFeeForVaults: Record<GlobalId, number | null> =
        newGlobalIdToNull();
      for (const def of Object.values(STRONG_SUBVOLTS)) {
        if (network === def.network) {
          foundSomething = true;

          const voltVaultData =
            incompleteLoadedData1[def.globalId]?.voltVaultData;
          if (!voltVaultData) {
            return;
          }
          const extraVaultData =
            incompleteLoadedData1[def.globalId]?.extraVaultData;
          if (def.requiresExtraVoltData() && !extraVaultData) return;
          const vSdk = await sdk.loadVoltSDKByKey(
            def.voltVaultId,
            voltVaultData,
            extraVaultData ?? undefined,
            false,
            // TODO-PP: load principal protection vaul
            undefined,
            undefined,
            true
          );

          const voltType = vSdk.voltType();

          try {
            if (extraVaultData) {
              const aumFee = vSdk.getAumFeeBpsAnnualized().toNumber();
              newAumFeeForVaults[def.globalId] = aumFee;
            }
          } catch (e) {
            console.warn("Error trying to retrieve aum");
          }

          if (
            voltType !== VoltType.Entropy &&
            incompleteLoadedData1[
              def.globalId
            ]?.voltVaultData.writerTokenMint.toString() !==
              "11111111111111111111111111111111" &&
            (!parsedWriterTokenAccounts ||
              parsedWriterTokenAccounts.every(
                (a) => a === undefined || a === null
              ))
          ) {
            return;
          }

          const indexOfRoundInfo = roundInfoKeys.findIndex((key) => {
            const keyToCheck = latestRoundInfoKeys[def.globalId];
            if (!keyToCheck || !key) return false;
            return key.equals(keyToCheck);
          });
          invariant(indexOfRoundInfo >= 0, "this is static info bruh");
          const roundInfo = roundInfoAccounts[indexOfRoundInfo];

          const indexOfVaultMintAccountData = vaultMintKeys.findIndex((key) => {
            const keyToCheck =
              incompleteLoadedData1[def.globalId]?.voltVaultData.vaultMint;
            if (!keyToCheck || !key) return false;
            return key.equals(keyToCheck);
          });
          invariant(
            indexOfVaultMintAccountData >= 0,
            "this is static info bruh"
          );
          const indexOfDepositPoolAccountData = depositPoolKeys.findIndex(
            (key) => {
              const keyToCheck =
                incompleteLoadedData1[def.globalId]?.voltVaultData.depositPool;
              if (!keyToCheck || !key) return false;
              return key.equals(keyToCheck);
            }
          );
          invariant(
            indexOfDepositPoolAccountData >= 0,
            "this is static info bruh"
          );
          const foundDepositPoolDatum =
            parsedDepositPoolTokenAccounts[indexOfDepositPoolAccountData];

          const indexOfRoundUnderlyingTokenAccountData =
            roundUnderlyingTokenKeys.findIndex((key) => {
              const keyToCheck = roundUnderlyingTokensKeys[def.globalId];
              if (!keyToCheck || !key) return false;
              return key.equals(keyToCheck);
            });
          invariant(
            indexOfRoundUnderlyingTokenAccountData >= 0,
            "this is static info bruh"
          );
          const foundRoundUnderlyingTokenAccountDatum =
            parsedRoundUnderlyingTokenAccounts[
              indexOfRoundUnderlyingTokenAccountData
            ];

          const indexOfWriterTokenAccountData = writerTokenPoolKeys.findIndex(
            (key) => {
              const keyToCheck =
                incompleteLoadedData1[def.globalId]?.voltVaultData
                  .writerTokenPool;
              if (!keyToCheck || !key) return false;
              if (
                incompleteLoadedData1[
                  def.globalId
                ]?.voltVaultData.writerTokenMint.toString() ===
                "11111111111111111111111111111111"
              )
                return false;
              return key.equals(keyToCheck);
            }
          );
          const foundWriterTokenAccountDatum =
            indexOfWriterTokenAccountData >= 0
              ? parsedWriterTokenAccounts[indexOfWriterTokenAccountData]
              : null;

          // foundWriterTokenAccountDatum could be undefined if writerTokenMint is 11111111111111111111111111111111...
          if (
            !foundDepositPoolDatum ||
            !foundRoundUnderlyingTokenAccountDatum
          ) {
            return;
          }

          const voltUnderlyingTokenBalance = new Decimal(
            foundDepositPoolDatum.accountInfo.data.amount.toString()
          );
          const roundUnderlyingTokenBalance = new Decimal(
            foundRoundUnderlyingTokenAccountDatum.accountInfo.data.amount.toString()
          );
          const underlyingAmountPerContractRaw =
            incompleteLoadedData1[def.globalId]?.voltVaultData
              .underlyingAmountPerContract;
          invariant(
            underlyingAmountPerContractRaw,
            "underlyingAmountPerContractRaw should be good"
          );

          let voltWriterTokenBalance = new Decimal(0);
          if (
            voltType !== VoltType.Entropy &&
            incompleteLoadedData1[
              def.globalId
            ]?.voltVaultData.writerTokenMint.toString() !==
              "11111111111111111111111111111111"
          ) {
            // if (!foundWriterTokenAccountDatum) {
            //   console.error("Not gucci. wallet change maybe?");
            //   return;
            // }
            // invariant(
            //   foundWriterTokenAccountDatum,
            //   "foundWriterTokenAccountDatum should be gucci"
            // );
            voltWriterTokenBalance = new Decimal(
              foundWriterTokenAccountDatum?.accountInfo.data.amount?.toString() ??
                0
            );
          }
          let estimatedTotalUnderlyingWithoutPending = new Decimal(0);
          let totalDeposit;
          let acctEquity = new Decimal(0);
          if (voltType === VoltType.Entropy) {
            const eSdk = vSdk as EntropyVoltSDK;
            const { entropyGroup, entropyAccount, entropyCache } =
              await eSdk.getEntropyObjectsForEvData();
            acctEquity = new Decimal(
              entropyAccount.computeValue(entropyGroup, entropyCache).toString()
            );
            const oraclePrice = await eSdk.getOraclePriceForDepositToken(
              entropyGroup,
              entropyCache
            );
            const acctValueInDepositToken = acctEquity.div(oraclePrice);

            estimatedTotalUnderlyingWithoutPending = new Decimal(
              acctValueInDepositToken.toString()
            ).add(
              voltUnderlyingTokenBalance.div(
                new Decimal(10 ** def.depositToken.decimals)
              )
            );

            totalDeposit = estimatedTotalUnderlyingWithoutPending.plus(
              roundUnderlyingTokenBalance.div(
                new Decimal(10 ** def.depositToken.decimals)
              )
            );
          } else {
            totalDeposit = voltUnderlyingTokenBalance
              .plus(
                voltWriterTokenBalance
                  .mul(new Decimal(underlyingAmountPerContractRaw.toString()))
                  .plus(roundUnderlyingTokenBalance)
              )
              .div(new Decimal(10 ** def.depositToken.decimals));
          }

          if (def.isLendingOnMango === true) {
            const numLendingTokens =
              await vSdk.getEntropyLendingTvlInDepositToken();
            totalDeposit = totalDeposit.add(numLendingTokens);
            estimatedTotalUnderlyingWithoutPending =
              estimatedTotalUnderlyingWithoutPending.add(
                numLendingTokens.div(
                  new Decimal(10).pow(def.depositToken.decimals)
                )
              );
          }

          const underlyingAmountPerContract =
            incompleteLoadedData1[def.globalId]?.voltVaultData
              .underlyingAmountPerContract;

          const vaultMintSupplyExPendingWithdrawals =
            parsedVaultMintTokenAccounts[indexOfVaultMintAccountData];
          if (!roundInfo || !vaultMintSupplyExPendingWithdrawals) {
            return;
          }
          if (voltType === undefined || voltType === VoltType.ShortOptions) {
            if (!underlyingAmountPerContract) return;
            console.log("adding to estimated in if statement");
            estimatedTotalUnderlyingWithoutPending =
              estimatedTotalUnderlyingWithoutPending.add(
                voltUnderlyingTokenBalance
                  .add(
                    voltWriterTokenBalance.mul(
                      underlyingAmountPerContract.toString()
                    )
                  )
                  .div(new Decimal(10 ** def.depositToken.decimals))
              );
          }

          if (voltType === VoltType.PrincipalProtection) {
            estimatedTotalUnderlyingWithoutPending =
              estimatedTotalUnderlyingWithoutPending
                .add(voltUnderlyingTokenBalance)
                .div(new Decimal(10 ** def.depositToken.decimals));
          }
          const capacity = new Decimal(voltVaultData.capacity.toString()).div(
            def.depositToken.normFactor
          );
          if (capacity.gt(10) && totalDeposit.greaterThan(capacity)) {
            totalDeposit = capacity;
          }
          newTotalDepositsForVaults[def.globalId] = new Decimal(
            totalDeposit.toString()
          );

          let inclusiveVoltTokenSupply: Decimal;

          if (voltType === VoltType.Entropy) {
            inclusiveVoltTokenSupply = new Decimal(
              vaultMintSupplyExPendingWithdrawals.accountInfo.data.supply.toString()
            );
            if (
              vSdk?.voltVault.roundHasStarted &&
              vSdk.extraVoltData?.rebalanceIsReady &&
              !def.isLendingOnMango
            ) {
              const eSdk = vSdk as EntropyVoltSDK;
              const entropyRound =
                (await eSdk?.getCurrentEntropyRound()) as EntropyRoundWithKey;
              const expectedMintedVaultTokensFromDeposits: Decimal =
                new Decimal(
                  new Decimal(entropyRound.depositAmtQuote as string)
                    .div(
                      new Decimal(
                        entropyRound.newEquityPostDeposit as string
                      ).sub(new Decimal(entropyRound.depositAmtQuote as string))
                    )
                    .mul(inclusiveVoltTokenSupply)
                    .toFixed(0)
                );
              if (!expectedMintedVaultTokensFromDeposits.isNaN()) {
                inclusiveVoltTokenSupply = inclusiveVoltTokenSupply.add(
                  expectedMintedVaultTokensFromDeposits
                );

                inclusiveVoltTokenSupply = inclusiveVoltTokenSupply.add(
                  new Decimal(
                    roundInfo.accountInfo.data.voltTokensFromPendingWithdrawals.toString()
                  )
                    .mul(
                      new Decimal(
                        entropyRound.withdrawAmtNative
                          .sub(entropyRound.withdrawCompFromDepositNative)
                          .toString()
                      )
                    )
                    .div(new Decimal(entropyRound.withdrawAmtNative.toString()))
                );
              } else {
                inclusiveVoltTokenSupply = inclusiveVoltTokenSupply.add(
                  new Decimal(
                    roundInfo.accountInfo.data.voltTokensFromPendingWithdrawals.toString()
                  )
                );
              }
            } else if (vSdk?.voltVault.roundHasStarted) {
              inclusiveVoltTokenSupply = inclusiveVoltTokenSupply.add(
                new Decimal(
                  roundInfo.accountInfo.data.voltTokensFromPendingWithdrawals.toString()
                )
              );
            }
          } else {
            inclusiveVoltTokenSupply = new Decimal(
              vaultMintSupplyExPendingWithdrawals.accountInfo.data.supply.toString()
            ).add(
              new Decimal(
                roundInfo.accountInfo.data.voltTokensFromPendingWithdrawals.toString()
              )
            );
          }

          let sharePrice: Decimal;
          if (voltType !== VoltType.Entropy) {
            sharePrice = inclusiveVoltTokenSupply.gt(0)
              ? estimatedTotalUnderlyingWithoutPending
                  .div(inclusiveVoltTokenSupply)
                  .mul(
                    new Decimal(10).pow(
                      vaultMintSupplyExPendingWithdrawals.accountInfo.data
                        .decimals
                    )
                  )
                  .div(new Decimal(10).pow(def.depositToken.decimals))
              : new Decimal(0);
          } else {
            sharePrice = inclusiveVoltTokenSupply.gt(0)
              ? new Decimal(
                  estimatedTotalUnderlyingWithoutPending?.toString()
                ).div(inclusiveVoltTokenSupply)
              : new Decimal(0);
          }

          sharePrice = sharePrice.mul(
            new Decimal(10 ** def.depositToken.decimals)
          );

          newSharePriceForVaults[def.globalId] = sharePrice;
        }
      }
      if (foundSomething) {
        if (
          isBigEnoughChange(totalDepositsForVaults, newTotalDepositsForVaults)
        ) {
          setTotalDepositsForVaults(newTotalDepositsForVaults);
        }
        if (isBigEnoughChange(sharePriceForVaults, newSharePriceForVaults)) {
          setSharePriceForVaults(newSharePriceForVaults);
        }
        if (
          isBigEnoughChangeNumberVersion(aumFeeForVaults, newAumFeeForVaults)
        ) {
          setAumFeeForVaults(newAumFeeForVaults);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    roundUnderlyingTokensKeys,
    network,
    depositPoolKeys,
    incompleteLoadedData1,
    parsedDepositPoolTokenAccounts,
    parsedRoundUnderlyingTokenAccounts,
    parsedWriterTokenAccounts,
    roundUnderlyingTokenKeys,
    writerTokenPoolKeys,
    parsedVaultMintTokenAccounts,
    vaultMintKeys,
    latestRoundInfoKeys,
    roundInfoKeys,
    roundInfoAccounts,
  ]);

  // Update #N??
  // Layer 3 (which is not really a layer)
  // Get the price somehow (maybe from MarkPriceContext)
  // Calculate the USD convenience fields
  // Merge in the quarry data

  const loadedData = useMemo(() => {
    if (
      !roundUnderlyingTokensKeys ||
      !incompleteLoadedData1 ||
      !totalDepositsForVaults ||
      !sharePriceForVaults ||
      !markPricesDecimal ||
      !aumFeeForVaults
    ) {
      return;
    }

    whatChangedDeeply("loadedData", {
      roundUnderlyingTokensKeys,
      incompleteLoadedData1,
      totalDepositsForVaults,
      sharePriceForVaults,
      aumFeeForVaults,
      markPricesDecimal,
      network,
    });

    const resultingLoadedData: Record<GlobalId, Subvolt1Data | null> =
      newGlobalIdToNull();

    for (const def of Object.values(STRONG_SUBVOLTS)) {
      if (network === def.network) {
        const incompleteData = incompleteLoadedData1[def.globalId];

        invariant(
          incompleteData,
          "incompleteData should have been checked in the useMemo when compiling loadedData"
        );
        const totalDeposits = totalDepositsForVaults[def.globalId];
        if (totalDeposits === null) {
          return;
        }
        const sharePrice = sharePriceForVaults[def.globalId];
        if (sharePrice === null) {
          return;
        }

        const vaultMintBase58 =
          incompleteLoadedData1[
            def.globalId
          ]?.voltVaultData.vaultMint.toBase58();
        if (!vaultMintBase58) {
          return;
        }

        const optionMint =
          incompleteLoadedData1[def.globalId]?.voltVaultData.optionMint;

        resultingLoadedData[def.globalId] = {
          ...incompleteData,
          totalDeposits,
          markPrice: markPricesDecimal[def.depositToken.symbol],
          totalDepositsUSD: totalDeposits.mul(
            markPricesDecimal[def.depositToken.symbol]
          ),
          capacityUSD: incompleteData.capacity.mul(
            markPricesDecimal[def.depositToken.symbol]
          ),
          sharePrice,
          shareMint: new PublicKey(vaultMintBase58),
          optionMint,
          aumFee: aumFeeForVaults[def.globalId],
        };
      }
    }

    if (Object.values(resultingLoadedData).every((d) => d === null)) {
      return ALWAYS_GLOBALID_TO_NULL;
    }
    return resultingLoadedData;
  }, [
    roundUnderlyingTokensKeys,
    incompleteLoadedData1,
    totalDepositsForVaults,
    sharePriceForVaults,
    markPricesDecimal,
    aumFeeForVaults,
    network,
  ]);

  const finalLoadedData = loadedData ?? ALWAYS_GLOBALID_TO_NULL;
  const finalIncompleteData =
    !incompleteLoadedData1 ||
    Object.values(incompleteLoadedData1).every((d) => d === null)
      ? ALWAYS_GLOBALID_TO_NULL
      : incompleteLoadedData1;

  const contextResult = useMemo(() => {
    return {
      allLoaded: !!loadedData,
      loadedData: finalLoadedData,
      incompleteData: finalIncompleteData,
    };
  }, [finalIncompleteData, finalLoadedData, loadedData]);

  return (
    <SubvoltLoader10Context.Provider value={contextResult}>
      {children}
    </SubvoltLoader10Context.Provider>
  );
};
export const useSubvoltLoader = () => useContext(SubvoltLoader10Context);

declare global {
  interface Window {
    vaultTokenMints: Record<GlobalId, string | null>;
  }
}
window.vaultTokenMints = newGlobalIdToNull();

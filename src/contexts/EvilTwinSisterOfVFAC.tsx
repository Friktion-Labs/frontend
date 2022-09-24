import {
  EntropyMetadata,
  FriktionSDK,
  PendingDepositWithKey,
  PendingWithdrawalWithKey,
  RoundWithKey,
  VoltSDK,
  VoltVaultWithKey,
} from "@friktion-labs/friktion-sdk";
import { useAppWallet } from "features/wallet";
import { Connection, PublicKey } from "@solana/web3.js";
import { Decimal } from "decimal.js";
import moment from "moment";
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import invariant from "tiny-invariant";
import {
  ALWAYS_GLOBALID_TO_NULL,
  GlobalId,
  newGlobalIdToNull,
  STRONG_SUBVOLTS,
  SUBVOLT_LIST,
} from "../09/registry10";
import { IncompleteData1, useSubvoltLoader } from "../09/SubvoltLoader10";
import { deepEqual } from "../09/superCondom";
import { usePreloadAddress } from "../09/usePreloadAddress";
import { useSearchedWalletForPortfolioPage } from "../09/useSearchedWalletForPortfolioPage";
import { EwwTokenAccount } from "../all_types";
import { useFriktionSDK } from "../hooks/useFriktionSDK";
import useOwnedTokenAccounts from "../hooks/useOwnedTokenAccounts";
import { useProviders } from "../hooks/useProvider";
import {
  PendingDepositedForAsset,
  PendingWithdrawnForAsset,
} from "../types/volts.type";
import {
  getAccountBalance,
  getAccountBalanceOrZero,
  getHighestAccount,
  getMintSupplyOrZero,
} from "../utils/token";
import { getRoundInfo, isNullOrUndefined } from "../utils/utils";

export type EvilTwinSisterOfVFACType = {
  vaultsForAssets: Record<GlobalId, EvilVaultForAsset | null>;
  depositedForAssets: Record<GlobalId, EvilDepositedForAsset | null>;
  depositedForAssetsForSearchedWallet: Record<
    GlobalId,
    EvilDepositedForAsset | null
  >;
  allowRefreshSoon: () => void;
};

export type EvilVaultForAsset = {
  rawVoltInfo: VoltVaultWithKey;
  globalId: GlobalId;
  depositTokenBalance: Decimal | null;
  tokenSupply: Decimal | null;
  markPrice: Decimal | null;

  /**
   * @deprecated: always null
   */
  optionMarkPrice: Decimal | null;
  /**
   * @deprecated dumy
   */
  tvl: Decimal | null;

  /**
   * @deprecated dumy
   */
  expectedApy: number;

  /**
   * @deprecated dumy
   */
  totalPnl: Decimal | null;

  /**
   * @deprecated dumy
   */
  userPnl: Decimal | null;
  lastFetched: moment.Moment;
};

const pageload = Date.now();
let oatLogged = false;
export type EvilDepositedForAsset = {
  estimatedTotalWithoutPendingDepositTokenAmount: Decimal | null;
  mergedDepositTokenAmount: Decimal | null;
  normalDepositTokenAmount: Decimal | null;
  pendingDepositInfo: PendingDepositedForAsset;
  pendingWithdrawalInfo: PendingWithdrawnForAsset;
  pendingDepositRoundDepositTokenAmount: Decimal | null;
  pendingDepositRoundVoltTokenAmount: Decimal | null;
  pendingWithdrawalRoundVoltTokenAmount: Decimal | null;
  pendingWithdrawalRoundDepositTokenAmount: Decimal | null;

  /**
   * Directly use this
   */
  claimableShares: Decimal | null;
  normFactor: Decimal;
};

let firstFetchDone = false;
export const EvilTwinSisterOfVFACContext =
  createContext<EvilTwinSisterOfVFACType>({
    vaultsForAssets: newGlobalIdToNull(),
    depositedForAssets: newGlobalIdToNull(),
    depositedForAssetsForSearchedWallet: newGlobalIdToNull(),
    allowRefreshSoon: () => {},
  });

export const EvilTwinSisterOfVFACProvider: React.FC<
  PropsWithChildren<unknown>
> = ({ children }) => {
  const {
    loadingOwnedTokenAccounts,
    ownedTokenAccounts,
    loadingOwnedTokenAccountsForSearchedWallet,
    ownedTokenAccountsForSearchedWallet,
  } = useOwnedTokenAccounts();
  const { readonlyProvider } = useProviders();
  const connection = readonlyProvider.connection;
  const { publicKey } = useAppWallet();
  const { searchedWalletForPortfolioPage } =
    useSearchedWalletForPortfolioPage();
  const { incompleteData } = useSubvoltLoader();
  const sdk = useFriktionSDK();
  const [vaultsForAssets, setVaultsForAssets] = useState(
    {} as Record<GlobalId, EvilVaultForAsset | null>
  );

  let [depositedForAssetsForUsers, setDepositedForAssetsForUsers] = useState(
    {} as Record<string, Record<GlobalId, EvilDepositedForAsset | null>>
  );

  const { preloadAddress } = usePreloadAddress();

  // Prevent showing the wrong info to the wrong wallet
  const [dataLoadedFor, setDataLoadedFor] = useState<string>("NOT_YET_LOADED");

  const [walletLoad, setWalletLoad] = useState(0);
  if (walletLoad === 0 && publicKey !== null) {
    setWalletLoad(Date.now());
  }
  const [lastFetchTime, setLastFetchTime] = useState(0);

  const subvolts = SUBVOLT_LIST[sdk.network];

  // EFFECT: calculate and set vault for assets. return early if subvoltloader hasn't started.
  useEffect(() => {
    (async () => {
      if (!connection || !sdk || !incompleteData) return;

      if (Object.values(incompleteData).every((d) => d === null)) {
        // only return early if all volts are null. so this loads any volt that is already processed by subvolt later, even if only 1
        return;
      }

      let newVaultsForAssets: Record<GlobalId, EvilVaultForAsset | null> =
        newGlobalIdToNull();

      for (const [, iData] of Object.entries(incompleteData)) {
        if (iData) {
          newVaultsForAssets[iData.globalId] = {
            rawVoltInfo: {
              ...iData.voltVaultData,
              key: STRONG_SUBVOLTS[iData.globalId].voltVaultId,
            },
            globalId: iData.globalId,
          } as unknown as EvilVaultForAsset;
        }
      }

      let promises = [];
      for (const def of subvolts) {
        promises.push(
          (async () => {
            const vault = newVaultsForAssets[def.globalId];
            if (vault?.rawVoltInfo) {
              const roundInfo = await getRoundInfo(
                sdk,
                vault,
                vault.rawVoltInfo.roundNumber
              );

              let voltDepositTokenBalance: Decimal | null = null;
              let voltVaultTokenSupply: Decimal | null = null;

              if (roundInfo) {
                const voltTokenBalancesAndSupply =
                  await getVoltTokenBalancesAndSupplies(
                    connection,
                    vault,
                    def.depositToken.mintAccount,
                    roundInfo
                  );
                voltDepositTokenBalance =
                  voltTokenBalancesAndSupply.voltDepositTokenBalance;
                voltVaultTokenSupply =
                  voltTokenBalancesAndSupply.voltVaultTokenSupply;
              }

              newVaultsForAssets[def.globalId] = {
                ...vault,
                depositTokenBalance: voltDepositTokenBalance,
                tokenSupply: voltVaultTokenSupply,
                markPrice: null,
                optionMarkPrice: null,
                expectedApy: def.expectedApy,
                tvl: null,
                lastFetched: moment(),
              };
            }
          })()
        );
      }

      await Promise.all(promises);

      if (!deepEqual(vaultsForAssets, newVaultsForAssets)) {
        setVaultsForAssets(newVaultsForAssets);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection, incompleteData, sdk, subvolts]);

  const getVoltTokenBalancesAndSupplies = async (
    connection: Connection,
    vault: EvilVaultForAsset,
    depositTokenMint: PublicKey,
    roundInfo: RoundWithKey
  ): Promise<{
    voltDepositTokenBalance: Decimal;
    voltVaultTokenSupply: Decimal;
  }> => {
    const voltDepositTokenBalance = getAccountBalanceOrZero(
      connection,
      depositTokenMint,
      vault.rawVoltInfo.depositPool
    );
    const voltVaultTokenSupply = (
      await getMintSupplyOrZero(connection, vault.rawVoltInfo.vaultMint)
    ).add(new Decimal(roundInfo.voltTokensFromPendingWithdrawals.toString()));

    return {
      voltDepositTokenBalance: await voltDepositTokenBalance,
      voltVaultTokenSupply,
    };
  };

  const calculateUserTokenBalance = (
    ownedTokenAccounts: Record<string, EwwTokenAccount[]>,
    voltInfo: VoltVaultWithKey
  ): Decimal | null => {
    const vaultTokenAccounts =
      ownedTokenAccounts[voltInfo.vaultMint.toString()];
    if (!vaultTokenAccounts) {
      return null;
    }
    const vaultTokenAccount = getHighestAccount(vaultTokenAccounts);
    return vaultTokenAccount ? vaultTokenAccount.amount : null;
  };

  const getPendingDeposit = async (
    sdk: FriktionSDK,
    vault: EvilVaultForAsset,
    pubkey: PublicKey
  ): Promise<PendingDepositWithKey | null> => {
    if (!pubkey) {
      return null;
    }

    let pendingDeposit: PendingDepositWithKey | null;
    try {
      const [pendingDepositInfoKey] =
        await VoltSDK.findPendingDepositInfoAddress(
          vault.rawVoltInfo.key,
          pubkey,
          sdk.programs.Volt.programId
        );

      const voltSdk = sdk.loadSimpleVoltSDK(
        vault.rawVoltInfo.key,
        vault.rawVoltInfo
      );

      pendingDeposit = await voltSdk.getPendingDepositByKey(
        pendingDepositInfoKey
      );
    } catch (err) {
      pendingDeposit = null;
    }

    // might have to normalize optionMarket.underlyingamountpercontract as well. normalizationafctor is just 10^(num decimals) in order to make
    // the output human readable (aka 1000000 btc token => 0.01 btc);
    return pendingDeposit;
  };

  const calculateUserFractionOfVault = (
    userVoltTokenBalance: Decimal,
    voltTokenSupply: Decimal
  ) => {
    return userVoltTokenBalance.div(voltTokenSupply);
  };

  const calculateTotalDepositTokenEstimate = (
    voltWriterTokenBalance: Decimal,
    voltDepositTokenBalance: Decimal,
    underlyingAmountPerContract: Decimal,
    normFactor: Decimal | null
  ) => {
    if (
      isNullOrUndefined(voltWriterTokenBalance) ||
      isNullOrUndefined(voltDepositTokenBalance) ||
      isNullOrUndefined(underlyingAmountPerContract) ||
      isNullOrUndefined(normFactor)
    ) {
      return null;
    }

    // might have to normalize optionMarket.underlyingamountpercontract as well. normalizationafctor is just 10^(num decimals) in order to make
    // the output human readable (aka 1000000 btc token => 0.01 btc);
    return voltDepositTokenBalance
      .plus(voltWriterTokenBalance.mul(underlyingAmountPerContract))
      .div(normFactor);
  };

  const calculateDepositedUnderlying = (
    userVaultTokenBalance: Decimal,
    voltVaultTokenSupply: Decimal,
    estimatedTotalUnderlying: Decimal
  ) => {
    if (
      isNullOrUndefined(userVaultTokenBalance) ||
      isNullOrUndefined(voltVaultTokenSupply) ||
      isNullOrUndefined(estimatedTotalUnderlying)
    ) {
      return new Decimal(0);
    }

    let calced_amount = calculateUserFractionOfVault(
      userVaultTokenBalance,
      voltVaultTokenSupply
    ).mul(estimatedTotalUnderlying);
    if (calced_amount.isNaN()) calced_amount = new Decimal(0);
    return calced_amount ?? new Decimal(0);
  };
  const getVoltWriterTokenBalance = async (
    connection: Connection,
    vault: EvilVaultForAsset
  ) => {
    let voltWriterTokenBalance = new Decimal(0);
    if (
      vault.rawVoltInfo.writerTokenMint.toString() !==
      "11111111111111111111111111111111"
    ) {
      voltWriterTokenBalance = await getAccountBalanceOrZero(
        connection,
        vault.rawVoltInfo.writerTokenMint,
        vault.rawVoltInfo.writerTokenPool
      );
    }
    return voltWriterTokenBalance;
  };

  const updateDepositTokenEstimates = async (
    connection: Connection,
    friktionSDK: FriktionSDK,
    ownedTokenAccounts: Record<string, EwwTokenAccount[]>,
    vault: EvilVaultForAsset,
    calcsBalanceWithEntropy: boolean,
    pendingDepositInfo: PendingDepositWithKey | null,
    roundInfo: RoundWithKey | null,
    depositTokenMint: PublicKey,
    amountPerContract: string,
    normFactor: Decimal | null,
    isLendingOnMango: boolean
  ): Promise<{
    estimatedTotalWithoutPendingDepositTokenAmount: Decimal;
    estimatedUserDepositTokenAmount: Decimal;
  }> => {
    let userVoltTokenBalance = calculateUserTokenBalance(
      ownedTokenAccounts,
      vault.rawVoltInfo
    );

    let estimatedUserDepositTokenAmount = new Decimal(0);
    let estimatedTotalWithoutPendingDepositTokenAmount = new Decimal(0);

    if (!userVoltTokenBalance) {
      userVoltTokenBalance = new Decimal(0);
    }
    if (roundInfo) {
      // TODO: This could make balances show up as 0
      // #TODO: error handling here
      const { voltDepositTokenBalance, voltVaultTokenSupply } =
        await getVoltTokenBalancesAndSupplies(
          connection,
          vault,
          depositTokenMint,
          roundInfo
        );

      if (calcsBalanceWithEntropy) {
        const extraVoltData = await VoltSDK.extraVoltDataForVoltKey(
          vault.rawVoltInfo.key,
          friktionSDK
        );
        const vSdk = friktionSDK.loadEntropyVoltSDK(
          vault.rawVoltInfo.key,
          vault.rawVoltInfo,
          extraVoltData,
          null as unknown as EntropyMetadata
        );

        const { entropyGroup, entropyAccount, entropyCache } =
          await vSdk.getEntropyObjectsForEvData();
        const acctEquity = new Decimal(
          entropyAccount.computeValue(entropyGroup, entropyCache).toString()
        );

        const oraclePrice = await vSdk.getOraclePriceForDepositToken(
          entropyGroup,
          entropyCache
        );
        const acctValueInDepositToken = acctEquity.div(oraclePrice);

        estimatedTotalWithoutPendingDepositTokenAmount = new Decimal(
          acctValueInDepositToken.toString()
        ).add(
          voltDepositTokenBalance.div(normFactor ?? new Decimal(10).pow(6))
        );
      } else {
        // TODO: This could make balances show up as 0
        // #TODO: error handling here
        const voltWriterTokenBalance = await getVoltWriterTokenBalance(
          connection,
          vault
        );
        estimatedTotalWithoutPendingDepositTokenAmount =
          calculateTotalDepositTokenEstimate(
            voltWriterTokenBalance,
            voltDepositTokenBalance,
            new Decimal(amountPerContract),
            normFactor
          ) || new Decimal(0);
      }

      if (isLendingOnMango) {
        const vSdk = friktionSDK.loadSimpleVoltSDK(
          vault.rawVoltInfo.key,
          vault.rawVoltInfo
        );
        const numLendingTokens =
          await vSdk.getEntropyLendingTvlInDepositToken();
        estimatedTotalWithoutPendingDepositTokenAmount =
          estimatedTotalWithoutPendingDepositTokenAmount.add(numLendingTokens);
      }

      let voltTokensForPendingDeposit = new Decimal(0);
      if (
        pendingDepositInfo &&
        pendingDepositInfo.roundNumber.gtn(0) &&
        pendingDepositInfo.roundNumber.lt(vault.rawVoltInfo.roundNumber)
      ) {
        const pendingDepositRoundInfo = await getRoundInfo(
          friktionSDK,
          vault,
          pendingDepositInfo.roundNumber
        );

        invariant(pendingDepositRoundInfo!, "round info should exist");
        const totalVoltTokensPendingDepositRound = await getAccountBalance(
          connection,
          vault.rawVoltInfo.vaultMint,
          (
            await VoltSDK.findRoundVoltTokensAddress(
              vault.rawVoltInfo.key,
              pendingDepositInfo.roundNumber,
              friktionSDK.programs.Volt.programId
            )
          )[0]
        );

        voltTokensForPendingDeposit = new Decimal(
          pendingDepositInfo?.numUnderlyingDeposited.toString()
        )
          .mul(new Decimal(totalVoltTokensPendingDepositRound.toString()))
          .div(
            new Decimal(
              pendingDepositRoundInfo.underlyingFromPendingDeposits.toString()
            )
          );
      }

      estimatedUserDepositTokenAmount = calculateDepositedUnderlying(
        userVoltTokenBalance.add(voltTokensForPendingDeposit),
        voltVaultTokenSupply,
        estimatedTotalWithoutPendingDepositTokenAmount
      );
    }
    return {
      estimatedTotalWithoutPendingDepositTokenAmount:
        estimatedTotalWithoutPendingDepositTokenAmount,
      estimatedUserDepositTokenAmount: estimatedUserDepositTokenAmount,
    };
  };

  const [lastGiantUpdate, setLastGiantUpdate] = useState(0);

  const theGIANTmonsterThatWeNeedToKeepFeedingBecauseItGivesUsDepositInfo =
    async (
      connection: Connection,
      ownedTokenAccounts: Record<string, EwwTokenAccount[]> | null,
      walletAddy: PublicKey | null,
      vaultsForAssets: Record<GlobalId, EvilVaultForAsset | null>,
      loadingOwnedTokenAccounts: boolean,
      incompleteData: Record<GlobalId, IncompleteData1 | null>,
      sdk: FriktionSDK,
      setDepositedForAssetsForUsers: React.Dispatch<
        React.SetStateAction<
          Record<string, Record<GlobalId, EvilDepositedForAsset | null>>
        >
      >,
      lastGiantUpdate?: number | undefined,
      setLastGiantUpdate?:
        | React.Dispatch<React.SetStateAction<number>>
        | undefined,
      setLastFetchTime?: (
        value: React.SetStateAction<number>
      ) => void | undefined,
      setDataLoadedFor?: (
        value: React.SetStateAction<string>
      ) => void | undefined
    ) => {
      if (!connection || !ownedTokenAccounts || !walletAddy) {
        return;
      }
      const walletAddress = walletAddy;
      if (!walletAddress) {
        return;
      }
      if (loadingOwnedTokenAccounts) {
        return;
      }
      try {
        const start = Date.now();
        // CHRISTMAS_TREE_TIME_HERE: Move away from this antipattern
        let newDepositedForAssetsForPubkey: Record<
          GlobalId,
          EvilDepositedForAsset | null
        > = newGlobalIdToNull();

        // Pre-emptive check if we actually need to do stuff
        let alreadyPunched = false;
        for (let key in vaultsForAssets) {
          const vault = vaultsForAssets[key as GlobalId];
          if (vault?.rawVoltInfo) {
            // We found something apparently.
            if (lastGiantUpdate && setLastGiantUpdate) {
              if (Date.now() - lastGiantUpdate < 10_000) {
                return;
              }
              if (!alreadyPunched) {
                setLastGiantUpdate(Date.now());
                alreadyPunched = true;
              }
            }
          }
        }

        const fakeVaultsForAssetsContextUseless: Record<
          GlobalId,
          EvilVaultForAsset | null
        > = newGlobalIdToNull();
        for (const [, iData] of Object.entries(incompleteData)) {
          if (iData) {
            fakeVaultsForAssetsContextUseless[iData.globalId] = {
              rawVoltInfo: {
                ...iData.voltVaultData,
                key: STRONG_SUBVOLTS[iData.globalId].voltVaultId,
              },
              globalId: iData.globalId,
            } as unknown as EvilVaultForAsset;
          }
        }

        let pinkyPromises = [];
        for (const [globalId, fakeVault] of Object.entries(
          fakeVaultsForAssetsContextUseless
        )) {
          const processor = async (globalId: string) => {
            if (fakeVault === null) {
              return;
            }
            if (fakeVault?.rawVoltInfo) {
              const voltSdk = sdk.loadSimpleVoltSDK(
                fakeVault.rawVoltInfo.key,
                //@ts-ignore
                fakeVault.rawVoltInfo
              );

              let pendingWithdrawalRawPromise: Promise<PendingWithdrawalWithKey | null> | null =
                null;

              try {
                const [pwia] = await VoltSDK.findPendingWithdrawalInfoAddress(
                  voltSdk.voltKey,
                  walletAddress,
                  sdk.programs.Volt.programId
                );
                pendingWithdrawalRawPromise = voltSdk
                  .getPendingWithdrawalByKey(pwia)
                  .catch(() => null);
              } catch (e) {
                // console.error("Early error (to be expected i think)", e);
              }

              const pendingDepositRawPromise = getPendingDeposit(
                sdk,
                fakeVault,
                walletAddress
              );
              const roundInfo = await getRoundInfo(
                sdk,
                fakeVault,
                fakeVault.rawVoltInfo.roundNumber
              );
              const pendingDepositRaw = await pendingDepositRawPromise;

              const subvolt = STRONG_SUBVOLTS[fakeVault.globalId];

              const normFactor =
                STRONG_SUBVOLTS[fakeVault.globalId].depositToken.normFactor;

              const updateDepositTokenAmountPromise =
                updateDepositTokenEstimates(
                  connection,
                  sdk,
                  ownedTokenAccounts,
                  fakeVault,
                  subvolt.isEntropy(),
                  pendingDepositRaw,
                  roundInfo,
                  subvolt.depositToken.mintAccount,
                  fakeVault.rawVoltInfo.underlyingAmountPerContract.toString(),
                  STRONG_SUBVOLTS[fakeVault.globalId].depositToken.normFactor,
                  subvolt.isLendingOnMango
                );

              let pendingDepositInfo: PendingDepositedForAsset;
              let pendingDepositRound: RoundWithKey | null = null;
              let pendingDepositVoltTokensHeld: Decimal | null = null;
              let claimableShares: Decimal | null = null;

              if (
                !isNullOrUndefined(pendingDepositRaw) &&
                pendingDepositRaw.roundNumber.gtn(0)
              ) {
                pendingDepositInfo = {
                  initialized: pendingDepositRaw.initialized as boolean,
                  roundNumber: new Decimal(
                    pendingDepositRaw.roundNumber.toString()
                  ),
                  pendingDepositedUnderlying: pendingDepositRaw.roundNumber.lt(
                    fakeVault.rawVoltInfo.roundNumber
                  )
                    ? new Decimal(0)
                    : new Decimal(
                        pendingDepositRaw.numUnderlyingDeposited.toString()
                      ).div(normFactor),
                };

                pendingDepositRound = await getRoundInfo(
                  sdk,
                  fakeVault,
                  pendingDepositRaw.roundNumber
                );

                if (
                  pendingDepositRaw &&
                  pendingDepositRaw.roundNumber.lt(
                    fakeVault.rawVoltInfo.roundNumber
                  ) &&
                  pendingDepositRaw?.numUnderlyingDeposited?.gtn(0)
                ) {
                  claimableShares = new Decimal(
                    pendingDepositRaw.numUnderlyingDeposited.toString()
                  ).div(normFactor);
                }

                pendingDepositVoltTokensHeld = await getAccountBalance(
                  connection,
                  voltSdk.voltVault.vaultMint,
                  (
                    await VoltSDK.findRoundVoltTokensAddress(
                      voltSdk.voltKey,
                      pendingDepositRaw.roundNumber,
                      sdk.programs.Volt.programId
                    )
                  )[0]
                );
              } else {
                pendingDepositInfo = {
                  initialized: false,
                  roundNumber: new Decimal(0),
                  pendingDepositedUnderlying: new Decimal(0),
                };
              }

              let pendingWithdrawalRaw: PendingWithdrawalWithKey | null = null;

              try {
                if (pendingWithdrawalRawPromise !== null) {
                  pendingWithdrawalRaw = await pendingWithdrawalRawPromise;
                }
              } catch (error) {
                // this is not an error, valid behavior
              }

              let pendingWithdrawalInfo: PendingWithdrawnForAsset;
              let pendingWithdrawalRound: RoundWithKey | null = null;
              let pendingWithdrawalUnderlyingTokensHeld: Decimal | null = null;

              if (
                pendingWithdrawalRaw &&
                pendingWithdrawalRaw.roundNumber.gtn(0)
              ) {
                pendingWithdrawalInfo = {
                  initialized: pendingWithdrawalRaw.initialized as boolean,
                  roundNumber: new Decimal(
                    pendingWithdrawalRaw.roundNumber.toString()
                  ),
                  numVoltRedeemed: new Decimal(
                    pendingWithdrawalRaw.numVoltRedeemed.toString()
                  ),
                };

                pendingWithdrawalRound = await getRoundInfo(
                  sdk,
                  fakeVault,
                  pendingWithdrawalRaw.roundNumber
                );

                pendingWithdrawalUnderlyingTokensHeld = await getAccountBalance(
                  connection,
                  subvolt.depositToken.mintAccount,
                  (
                    await VoltSDK.findRoundUnderlyingPendingWithdrawalsAddress(
                      voltSdk.voltKey,
                      pendingWithdrawalRaw.roundNumber,
                      sdk.programs.Volt.programId
                    )
                  )[0]
                );
              } else {
                pendingWithdrawalInfo = {
                  initialized: false,
                  roundNumber: new Decimal(0),
                  numVoltRedeemed: new Decimal(0),
                };
              }

              const {
                estimatedTotalWithoutPendingDepositTokenAmount:
                  estimatedTotalUnderlyingWithoutPending,
                estimatedUserDepositTokenAmount: estimatedUserUnderlying,
              } = await updateDepositTokenAmountPromise;

              // CHRISTMAS: Change this from some name to gloabalId
              newDepositedForAssetsForPubkey[globalId as GlobalId] = {
                // #NOTE: estimated total underlying does not include pending deposits
                estimatedTotalWithoutPendingDepositTokenAmount:
                  estimatedTotalUnderlyingWithoutPending,
                mergedDepositTokenAmount: estimatedUserUnderlying.add(
                  pendingDepositInfo.pendingDepositedUnderlying ||
                    new Decimal(0)
                ),
                normalDepositTokenAmount: estimatedUserUnderlying,
                pendingDepositInfo: pendingDepositInfo,
                pendingWithdrawalInfo: pendingWithdrawalInfo,
                pendingDepositRoundDepositTokenAmount: pendingDepositRound
                  ? new Decimal(
                      pendingDepositRound?.underlyingFromPendingDeposits.toString()
                    )
                  : null,

                pendingDepositRoundVoltTokenAmount:
                  pendingDepositVoltTokensHeld,

                pendingWithdrawalRoundVoltTokenAmount: pendingWithdrawalRound
                  ? new Decimal(
                      pendingWithdrawalRound.voltTokensFromPendingWithdrawals.toString()
                    )
                  : null,

                pendingWithdrawalRoundDepositTokenAmount:
                  pendingWithdrawalUnderlyingTokensHeld,

                claimableShares,

                normFactor: normFactor,
              };
            }
          };
          pinkyPromises.push(processor(globalId));
        }
        await Promise.all(pinkyPromises);
        if (!firstFetchDone) {
          if (Object.keys(newDepositedForAssetsForPubkey).length > 0) {
            console.log(
              `${Date.now() - start}ms deposit fetch start -> deposit loaded`
            );
          }
          if (setLastFetchTime) {
            setLastFetchTime(Date.now());
          }
        }
        firstFetchDone = true;
        if (setDataLoadedFor) {
          setDataLoadedFor(walletAddress.toString());
        }

        setDepositedForAssetsForUsers((old) => {
          return {
            ...old,
            [walletAddress.toBase58()]: newDepositedForAssetsForPubkey,
          };
        });
      } catch (e) {
        console.error("Error in helper()");
        console.error(e);
      }
    };

  useEffect(() => {
    theGIANTmonsterThatWeNeedToKeepFeedingBecauseItGivesUsDepositInfo(
      connection,
      ownedTokenAccounts,
      preloadAddress,
      vaultsForAssets,
      loadingOwnedTokenAccounts,
      incompleteData,
      sdk,
      setDepositedForAssetsForUsers,
      lastGiantUpdate,
      setLastGiantUpdate,
      setLastFetchTime,
      setDataLoadedFor
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    connection,
    ownedTokenAccounts,
    vaultsForAssets,
    loadingOwnedTokenAccounts,
    incompleteData,
    lastGiantUpdate,
    setLastGiantUpdate,
    setLastFetchTime,
    setDataLoadedFor,
    setDepositedForAssetsForUsers,
    sdk,
    preloadAddress,
  ]);

  // okay this guy is for searchedWalletForPortfolioPage!!
  useEffect(() => {
    theGIANTmonsterThatWeNeedToKeepFeedingBecauseItGivesUsDepositInfo(
      connection,
      ownedTokenAccountsForSearchedWallet,
      searchedWalletForPortfolioPage,
      vaultsForAssets,
      loadingOwnedTokenAccountsForSearchedWallet,
      incompleteData,
      sdk,
      setDepositedForAssetsForUsers
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    connection,
    ownedTokenAccountsForSearchedWallet,
    vaultsForAssets,
    loadingOwnedTokenAccountsForSearchedWallet,
    incompleteData,
    setDepositedForAssetsForUsers,
    sdk,
    searchedWalletForPortfolioPage,
  ]);

  useEffect(() => {
    if (lastFetchTime > 0 && walletLoad > 0 && !oatLogged) {
      logIfLocalhost(
        `${walletLoad - pageload}ms page load -> deposited fetched`
      );
      logIfLocalhost(
        `${lastFetchTime - walletLoad}ms wallet load -> deposited fetched`
      );
      oatLogged = true;
    }
  }, [lastFetchTime, walletLoad]);

  const allowRefreshSoon = useCallback(() => {
    setLastGiantUpdate(0);
  }, []);

  const dfafu = preloadAddress
    ? dataLoadedFor === preloadAddress.toBase58()
      ? depositedForAssetsForUsers[preloadAddress.toBase58()]
      : ALWAYS_GLOBALID_TO_NULL
    : ALWAYS_GLOBALID_TO_NULL;

  const dfafuForSearchedWallet = searchedWalletForPortfolioPage
    ? depositedForAssetsForUsers[searchedWalletForPortfolioPage.toBase58()]
    : ALWAYS_GLOBALID_TO_NULL;

  const value: EvilTwinSisterOfVFACType = {
    vaultsForAssets,
    depositedForAssets: dfafu,
    depositedForAssetsForSearchedWallet: dfafuForSearchedWallet,
    allowRefreshSoon,
  };

  return (
    <EvilTwinSisterOfVFACContext.Provider value={value}>
      {children}
    </EvilTwinSisterOfVFACContext.Provider>
  );
};

export const useEvilTwinSisterOfVFAC = () =>
  useContext(EvilTwinSisterOfVFACContext);

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

const logIfLocalhost = (message: string) => {
  if (isLocalhost) {
    console.log(message);
  }
};

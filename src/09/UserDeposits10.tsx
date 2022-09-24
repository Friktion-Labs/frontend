import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
} from "react";
import {
  Connection,
  KeyedAccountInfo,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import {
  AllSymbolsUnion,
  ALWAYS_GLOBALID_TO_NULL,
  ALWAYS_SYMBOLS_TO_NULL,
  GlobalId,
  newGlobalIdToNull,
  newSymbolsToNull,
  STRONG_SUBVOLTS,
  Subvolt1Data,
  Subvolt1UserDeposits,
  UltraToken,
} from "./registry10";
import { useFriktionSDK } from "../hooks/useFriktionSDK";
import { useAppWallet } from "features/wallet";
import Decimal from "decimal.js";
import { useEffect, useState } from "react";
import { SUBVOLT_LIST } from "./registry10";
import { getAssetBalanceNew } from "../utils/utils";
import { useProviders } from "../hooks/useProvider";
import useOwnedTokenAccounts from "../hooks/useOwnedTokenAccounts";
import {
  EvilDepositedForAsset,
  EvilVaultForAsset,
  useEvilTwinSisterOfVFAC,
} from "../contexts/EvilTwinSisterOfVFAC";
import { useSubvoltLoader } from "./SubvoltLoader10";
import { usePreloadAddress } from "./usePreloadAddress";
import { Token } from "@saberhq/token-utils";
import { useCondomOfEquality } from "./superCondom";
import {
  findMinerAddress,
  MinerData,
  QuarryMineJSON,
} from "@quarryprotocol/quarry-sdk";
import { useParsedAccountsData } from "@saberhq/sail";
import { BorshCoder } from "@project-serum/anchor";
import { getHighestAccount } from "../utils/token";
import { useSearchedWalletForPortfolioPage } from "./useSearchedWalletForPortfolioPage";
import { EwwTokenAccount } from "../all_types";
import { FriktionSDK } from "@friktion-labs/friktion-sdk";

const MINE_CODER = new BorshCoder(QuarryMineJSON);
export const PARSE_MINER = (d: KeyedAccountInfo): MinerData =>
  MINE_CODER.accounts.decode<MinerData>("Miner", d.accountInfo.data);

export type UseUserDeposits10Type = {
  // allLoaded: loadedData.every(e !== null)
  /**
   * All stuff on current network is loaded
   */
  allLoaded: boolean;

  depositsForUser: Record<GlobalId, Subvolt1UserDeposits | null>;
  depositsForSearchedWallet: Record<GlobalId, Subvolt1UserDeposits | null>;
  solBalance: Decimal | null;
  /**
   * Will refresh balances AND also refresh ownedTokenAccounts
   *
   * The difference between this and the fresh in ownedTokenAccounts is that this
   * will also refresh SOL balance.
   *
   * If you await, you are only awaiting on the ownedTokenAccounts balance change,
   *  and not the SOL balance change.
   */
  refresh: () => Promise<void>;
};

export const UserDeposits10Context = createContext<UseUserDeposits10Type>({
  allLoaded: false,
  depositsForUser: ALWAYS_GLOBALID_TO_NULL,
  depositsForSearchedWallet: ALWAYS_GLOBALID_TO_NULL,
  solBalance: null,
  refresh: () => Promise.resolve(),
});

export const UserDeposits10Provider: React.FC<PropsWithChildren<unknown>> = ({
  children,
}) => {
  const {
    loading: balancesLoading,
    balances,
    balancesForSearchedWallet,
    loadingBalancesForSearchedWallet,
    refresh,
  } = useBalancesForAssets10();
  const { ownedTokenAccounts, ownedTokenAccountsForSearchedWallet } =
    useOwnedTokenAccounts();
  const { searchedWalletForPortfolioPage } =
    useSearchedWalletForPortfolioPage();

  const { publicKey } = useAppWallet();

  const { loadedData } = useSubvoltLoader();
  const sdk = useFriktionSDK();

  const [deposits10, setDeposits10] = useState<
    Record<GlobalId, Subvolt1UserDeposits | null>
  >(ALWAYS_GLOBALID_TO_NULL);
  const [deposits10ForSearchedWallet, setDeposits10ForSearchedWallet] =
    useState<Record<GlobalId, Subvolt1UserDeposits | null>>(
      ALWAYS_GLOBALID_TO_NULL
    );

  const {
    depositedForAssets,
    vaultsForAssets,
    depositedForAssetsForSearchedWallet,
  } = useEvilTwinSisterOfVFAC();

  const [minerAddresses, setMinerAddresses] = useState<null | Partial<
    Record<
      GlobalId,
      {
        index: number;
        miner: PublicKey;
      }
    >
  >>(null);
  const [minerAddressList, setMinerAddressList] = useState<PublicKey[]>([]);

  // for searched wallet (for portfolio page)--------------------------------
  const [minerAddressesForSearchedWallet, setMinerAddressesForSearchedWallet] =
    useState<null | Partial<
      Record<
        GlobalId,
        {
          index: number;
          miner: PublicKey;
        }
      >
    >>(null);
  const [
    minerAddressListForSearchedWallet,
    setMinerAddressListForSearchedWallet,
  ] = useState<PublicKey[]>([]);
  //---------------------------------------------------------------------------

  const updateMinerAddressesForWallet = async (
    walletAddy: PublicKey | null,
    setMinerAddresses: React.Dispatch<
      React.SetStateAction<null | Partial<
        Record<
          GlobalId,
          {
            index: number;
            miner: PublicKey;
          }
        >
      >>
    >,
    setMinerAddressList: React.Dispatch<React.SetStateAction<PublicKey[]>>
  ) => {
    if (walletAddy) {
      const arr: PublicKey[] = [];
      const result: typeof minerAddresses = {};
      let currentIndex = 0;
      // loop through each subvolt
      for (const def of SUBVOLT_LIST["mainnet-beta"]) {
        if (def.quarrySingleMine) {
          const minerAddress = (
            await findMinerAddress(def.quarrySingleMine.quarryMine, walletAddy)
          )[0];
          result[def.globalId] = {
            index: currentIndex,
            miner: minerAddress,
          };
          arr.push(minerAddress);
          currentIndex += 1;
        }
      }
      setMinerAddresses(result);
      setMinerAddressList(arr);
    }
  };

  useEffect(() => {
    updateMinerAddressesForWallet(
      publicKey ?? null,
      setMinerAddresses,
      setMinerAddressList
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey]);

  const parsedMiners = useParsedAccountsData(minerAddressList, PARSE_MINER);
  const minersLoaded =
    minerAddresses !== null &&
    parsedMiners.length > 0 &&
    parsedMiners.every((e) => e !== undefined);

  useEffect(() => {
    updateMinerAddressesForWallet(
      searchedWalletForPortfolioPage ?? null,
      setMinerAddressesForSearchedWallet,
      setMinerAddressListForSearchedWallet
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchedWalletForPortfolioPage]);

  const parsedMinersForSearchedWallet = useParsedAccountsData(
    minerAddressListForSearchedWallet,
    PARSE_MINER
  );
  const minersLoadedForSearchedWallet =
    minerAddressesForSearchedWallet !== null &&
    parsedMinersForSearchedWallet.length > 0 &&
    parsedMinersForSearchedWallet.every((e) => e !== undefined);

  const buildDeposits10ForWallet = async (
    depositedForAssets: Record<GlobalId, EvilDepositedForAsset | null>,
    minerAddresses: null | Partial<
      Record<
        GlobalId,
        {
          index: number;
          miner: PublicKey;
        }
      >
    >,
    minersLoaded: boolean,
    loadedData: Record<GlobalId, Subvolt1Data | null>,
    parsedMiners: any,
    vaultsForAssets: Record<GlobalId, EvilVaultForAsset | null>,
    sdk: FriktionSDK,
    balancesLoading: boolean,
    balances: Record<AllSymbolsUnion, Decimal | null>,
    ownedTokenAccounts: Record<string, EwwTokenAccount[]> | null
  ) => {
    let deposits10: Record<GlobalId, Subvolt1UserDeposits | null> =
      newGlobalIdToNull();

    // CHRISTMAS: Move the massive logic from useQuarantineChristmas to here
    // This thing will convert from EvilTwinSisterOfVFAC to Subvolt1UserDeposits

    if (depositedForAssets && minerAddresses && minersLoaded) {
      Object.keys(loadedData).forEach((loadedDataKey) => {
        const loadedSubvolt = loadedData[loadedDataKey as unknown as GlobalId];
        const def = STRONG_SUBVOLTS[loadedDataKey as unknown as GlobalId];
        const depositInfo = depositedForAssets[def.globalId];
        if (!loadedSubvolt) return;
        const volt = loadedSubvolt.voltVaultData;

        // Quarry stuff
        const minerAddress = minerAddresses[def.globalId];
        const legacyMiner = minerAddress
          ? parsedMiners[minerAddress.index]
          : null;
        const legacyMinerBalance =
          legacyMiner && def.quarrySingleMine
            ? def.quarrySingleMine.realRewardToken.normalize(
                legacyMiner.accountInfo.data.balance
              )
            : null;

        const vfac = vaultsForAssets[def.globalId];
        if (!vfac) return;
        const tokenSupply = vfac.tokenSupply;

        const globalId = loadedSubvolt.globalId;
        if (!globalId) {
          console.error("Global id not found for valid deposit: ", depositInfo);
          return;
        }

        const voltSdk = sdk.loadSimpleVoltSDK(def.voltVaultId, volt);

        let balance: Decimal | null = null;
        if (!balancesLoading) {
          balance = balances[def.depositToken.symbol as AllSymbolsUnion];
        }

        let notActuallyAllDepositAmountInFactDoesntIncludePending:
          | Decimal
          | undefined;
        let pendingDepositAmount: Decimal | undefined;
        let pendingWithdrawalAmount: Decimal | undefined;
        let maxWithdrawableAmount: Decimal | undefined;
        let claimableWithdrawals: Decimal | undefined;
        const voltVault = voltSdk.voltVault;

        let totalDepositedExPending: Decimal | undefined;
        if (!balancesLoading) {
          totalDepositedExPending =
            depositInfo?.normalDepositTokenAmount ?? undefined;
        }

        if (depositInfo) {
          notActuallyAllDepositAmountInFactDoesntIncludePending =
            depositInfo.normalDepositTokenAmount ?? undefined;
          pendingDepositAmount = depositInfo.pendingDepositInfo
            .pendingDepositedUnderlying
            ? depositInfo.pendingDepositInfo.pendingDepositedUnderlying
            : new Decimal(0);

          maxWithdrawableAmount = depositInfo.pendingDepositInfo.roundNumber.lt(
            new Decimal(voltVault.roundNumber.toString())
          )
            ? totalDepositedExPending?.add(pendingDepositAmount)
            : totalDepositedExPending;

          pendingWithdrawalAmount = new Decimal(0);

          if (
            depositInfo &&
            depositInfo.pendingWithdrawalInfo.numVoltRedeemed &&
            // depositInfo.mostRecentVoltTokens &&
            depositInfo.pendingWithdrawalRoundDepositTokenAmount &&
            depositInfo.pendingWithdrawalRoundVoltTokenAmount &&
            depositInfo.estimatedTotalWithoutPendingDepositTokenAmount &&
            tokenSupply
          ) {
            pendingWithdrawalAmount =
              depositInfo.pendingWithdrawalInfo.roundNumber.eq(
                new Decimal(voltVault.roundNumber.toString())
              )
                ? depositInfo.pendingWithdrawalInfo.numVoltRedeemed
                    .mul(
                      depositInfo.estimatedTotalWithoutPendingDepositTokenAmount.mul(
                        depositInfo.normFactor
                      )
                    )
                    .div(tokenSupply)
                    .div(depositInfo.normFactor)
                : new Decimal(0);

            claimableWithdrawals =
              depositInfo.pendingWithdrawalInfo.roundNumber.lt(
                new Decimal(voltVault.roundNumber.toString())
              )
                ? depositInfo.pendingWithdrawalInfo.numVoltRedeemed
                    .mul(depositInfo.pendingWithdrawalRoundDepositTokenAmount)
                    .div(depositInfo.pendingWithdrawalRoundVoltTokenAmount)
                    .div(depositInfo.normFactor)
                : new Decimal(0);
          }
          if (!claimableWithdrawals) {
            claimableWithdrawals = new Decimal(0);
          }
        }

        if (!pendingDepositAmount) {
          return;
        }

        // EWW ... why is this derived in so many different ways?
        // totalDeposits should be deposits + pendingDeposits
        let totalDeposits =
          notActuallyAllDepositAmountInFactDoesntIncludePending
            ? notActuallyAllDepositAmountInFactDoesntIncludePending?.add(
                depositInfo?.pendingDepositInfo.roundNumber.eq(
                  new Decimal(voltVault.roundNumber.toString())
                )
                  ? pendingDepositAmount ?? 0
                  : new Decimal(0)
              )
            : null;

        if (legacyMinerBalance && totalDeposits) {
          totalDeposits = totalDeposits.plus(
            legacyMinerBalance.mul(loadedSubvolt.sharePrice)
          );
        }
        const legacyMinerBalanceOrZero = legacyMinerBalance ?? new Decimal(0);

        if (!totalDeposits) {
          return;
        }

        if (totalDeposits.greaterThan(0)) {
          totalDeposits = totalDeposits.plus("0.000000000000001");
        }

        if (maxWithdrawableAmount?.greaterThan(0)) {
          maxWithdrawableAmount =
            maxWithdrawableAmount.plus("0.000000000000001");
        }

        let userVoltTokenBalance = new Decimal(0);

        const usersVoltTokenAccounts = ownedTokenAccounts
          ? ownedTokenAccounts[voltVault.vaultMint.toString()]
          : undefined;
        if (usersVoltTokenAccounts) {
          const vaultTokenAccount = getHighestAccount(usersVoltTokenAccounts);
          if (vaultTokenAccount) {
            userVoltTokenBalance = def.depositToken.normalize(
              vaultTokenAccount.amount
            );
          }
        }

        const possibleSubvoltDeposit: Subvolt1UserDeposits = {
          volt: def.volt,
          globalId,
          depositTokenWalletBalance: balance ?? new Decimal(-1),
          deposits: new Decimal(depositInfo?.normalDepositTokenAmount ?? 0).add(
            legacyMinerBalanceOrZero.mul(loadedSubvolt.sharePrice)
          ),
          pendingDeposits: pendingDepositAmount,
          totalDeposits: totalDeposits,

          pendingWithdrawals: pendingWithdrawalAmount ?? new Decimal(-1),
          mintableShares:
            depositInfo?.claimableShares?.div(loadedSubvolt.sharePrice) ??
            new Decimal(0), // This is special! Because this comes clean from the EvilTwinSister
          claimableWithdrawals: claimableWithdrawals ?? new Decimal(-1),
          maxWithdrawableAmount: maxWithdrawableAmount ?? new Decimal(-1),
          estimatedTotalUnderlyingWithoutPending:
            depositInfo?.estimatedTotalWithoutPendingDepositTokenAmount ??
            new Decimal(-1),
          sharesInWallet: userVoltTokenBalance,
          singleQuarryDeposits: legacyMinerBalance,
        };

        let foundNegative = false;
        // Check if any values in possibleSubvoltDeposit are .lessThan(0)
        // if so, return null
        for (const [, value] of Object.entries(possibleSubvoltDeposit)) {
          if (value instanceof Decimal && value.lessThan(0)) {
            foundNegative = true;
          }
        }
        if (!foundNegative) {
          deposits10[globalId] = possibleSubvoltDeposit;
        }
      });
    }

    return deposits10;
  };

  useEffect(() => {
    (async () => {
      const result = await buildDeposits10ForWallet(
        depositedForAssets,
        minerAddresses,
        minersLoaded,
        loadedData,
        parsedMiners,
        vaultsForAssets,
        sdk,
        balancesLoading,
        balances,
        ownedTokenAccounts
      );
      setDeposits10(result);
    })();
  }, [
    balances,
    balancesLoading,
    depositedForAssets,
    loadedData,
    minerAddresses,
    minersLoaded,
    ownedTokenAccounts,
    parsedMiners,
    sdk,
    vaultsForAssets,
  ]);

  useEffect(() => {
    (async () => {
      const result = await buildDeposits10ForWallet(
        depositedForAssetsForSearchedWallet,
        minerAddressesForSearchedWallet,
        minersLoadedForSearchedWallet,
        loadedData,
        parsedMinersForSearchedWallet,
        vaultsForAssets,
        sdk,
        loadingBalancesForSearchedWallet,
        balancesForSearchedWallet,
        ownedTokenAccountsForSearchedWallet
      );
      setDeposits10ForSearchedWallet(result);
    })();
  }, [
    balancesForSearchedWallet,
    loadingBalancesForSearchedWallet,
    depositedForAssetsForSearchedWallet,
    loadedData,
    minerAddressesForSearchedWallet,
    minersLoadedForSearchedWallet,
    ownedTokenAccountsForSearchedWallet,
    parsedMinersForSearchedWallet,
    sdk,
    vaultsForAssets,
  ]);

  let filteredDeposits10 = useCondomOfEquality(deposits10);
  if (Object.values(filteredDeposits10).every((d) => d === null)) {
    filteredDeposits10 = ALWAYS_GLOBALID_TO_NULL;
  }

  let filteredDeposits10ForSearchedWallet = useCondomOfEquality(
    deposits10ForSearchedWallet
  );
  if (
    Object.values(filteredDeposits10ForSearchedWallet).every((d) => d === null)
  ) {
    filteredDeposits10ForSearchedWallet = ALWAYS_GLOBALID_TO_NULL;
  }

  const result = useMemo(() => {
    return {
      allLoaded: Object.values(filteredDeposits10).some((d) => d !== null),
      depositsForUser: filteredDeposits10,
      depositsForSearchedWallet: filteredDeposits10ForSearchedWallet,
      solBalance: balances["SOL"],
      refresh,
    };
  }, [
    balances,
    filteredDeposits10,
    refresh,
    filteredDeposits10ForSearchedWallet,
  ]);

  return (
    <UserDeposits10Context.Provider value={result}>
      {children}
    </UserDeposits10Context.Provider>
  );
};

export const useDeposits10 = () => useContext(UserDeposits10Context);

export const useBalancesForAssets10 = (): {
  loading: boolean;
  balances: Record<AllSymbolsUnion, Decimal | null>;
  balancesForSearchedWallet: Record<AllSymbolsUnion, Decimal | null>;
  loadingBalancesForSearchedWallet: boolean;
  refresh: () => Promise<void>;
} => {
  const { readonlyProvider } = useProviders();
  const connection = readonlyProvider.connection;
  const { publicKey } = useAppWallet();
  const { searchedWalletForPortfolioPage } =
    useSearchedWalletForPortfolioPage();
  const {
    ownedTokenAccounts,
    refresh: otaRefresh,
    ownedTokenAccountsForSearchedWallet,
  } = useOwnedTokenAccounts();

  const [refreshNonce, setrefreshNonce] = useState<number>(0);

  // only refresh for user not searchedWalletForPortfolioPage
  const refresh = useCallback(async () => {
    setrefreshNonce((refreshNonce) => refreshNonce + 1);
    await otaRefresh();
  }, [otaRefresh]);

  let [balancesForPubkey, setBalancesForPubkey] = useState<
    Record<string, Record<AllSymbolsUnion, Decimal | null> | undefined>
  >({});

  const sdk = useFriktionSDK();

  const subvolts = SUBVOLT_LIST[sdk.network];

  //remove duplicates from tokenInfos array
  const tokens = useMemo(() => {
    const tokensMayHaveDuplicates = subvolts.map((def) => def.depositToken);

    return tokensMayHaveDuplicates.filter(
      (item, pos) => tokensMayHaveDuplicates.indexOf(item) === pos
    );
  }, [subvolts]);

  const { preloadAddress, addressChange } = usePreloadAddress();

  if (addressChange && preloadAddress) {
    balancesForPubkey = {
      [preloadAddress.toString()]: newSymbolsToNull(),
    };
    setBalancesForPubkey(balancesForPubkey);
  }

  const updateBalanceMapForSolSpecialCase = async (
    connection: Connection,
    walletAddy: PublicKey | null,
    setBalancesForPubkey: React.Dispatch<
      React.SetStateAction<
        Record<string, Record<AllSymbolsUnion, Decimal | null> | undefined>
      >
    >
  ) => {
    if (!walletAddy) {
      return;
    }

    const lamports = await connection.getBalance(walletAddy);
    setBalancesForPubkey((oldBalanceMapForPubkey) => {
      let balanceMap = oldBalanceMapForPubkey[walletAddy.toString()];

      if (!balanceMap) {
        balanceMap = newSymbolsToNull();
      }

      balanceMap.SOL = new Decimal(lamports / LAMPORTS_PER_SOL);

      const newBalanceMapForPubkey = {
        ...oldBalanceMapForPubkey,
        [walletAddy.toString()]: balanceMap,
      };

      return newBalanceMapForPubkey;
    });
  };

  // SOL is a special case
  useEffect(() => {
    updateBalanceMapForSolSpecialCase(
      connection,
      preloadAddress,
      setBalancesForPubkey
    );
  }, [connection, preloadAddress, publicKey, refreshNonce]);

  // SOL is a special case (still for searched wallet for portfolio page)
  useEffect(() => {
    updateBalanceMapForSolSpecialCase(
      connection,
      searchedWalletForPortfolioPage,
      setBalancesForPubkey
    );
  }, [connection, searchedWalletForPortfolioPage]);

  const updateBalancesForWallet = async (
    connection: Connection,
    walletAddy: PublicKey | null,
    tokens: UltraToken[],
    ownedTokenAccounts: Record<string, EwwTokenAccount[]> | null,
    setBalancesForPubkey: (
      value: React.SetStateAction<
        Record<string, Record<AllSymbolsUnion, Decimal | null> | undefined>
      >
    ) => void
  ) => {
    if (!walletAddy) return;
    const balancePromises = [];
    for (const token of tokens) {
      if (token.symbol !== "SOL") {
        balancePromises.push(
          getAssetBalanceNew(
            connection,
            walletAddy,
            ownedTokenAccounts,
            new Token(token.info)
          )
            .then((amount) => {
              if (amount) {
                setBalancesForPubkey((oldBalanceMapForPubkey) => {
                  let balanceMap =
                    oldBalanceMapForPubkey[walletAddy.toString()];

                  if (!balanceMap) {
                    balanceMap = newSymbolsToNull();
                  }

                  balanceMap[token.symbol as AllSymbolsUnion] = new Decimal(
                    amount
                  );

                  const newBalanceMapForPubkey = {
                    ...oldBalanceMapForPubkey,
                    [walletAddy.toString()]: balanceMap,
                  };

                  return newBalanceMapForPubkey;
                });
              }
            })
            .catch((e) => {
              console.error("Couldnt fetch balance for " + token.symbol, e);
            })
        );
      }
    }
  };

  useEffect(() => {
    updateBalancesForWallet(
      connection,
      preloadAddress,
      tokens,
      ownedTokenAccounts,
      setBalancesForPubkey
    );
  }, [
    connection,
    ownedTokenAccounts,
    preloadAddress,
    tokens,
    publicKey,
    refreshNonce,
  ]);

  useEffect(() => {
    updateBalancesForWallet(
      connection,
      searchedWalletForPortfolioPage,
      tokens,
      ownedTokenAccountsForSearchedWallet,
      setBalancesForPubkey
    );
  }, [
    connection,
    ownedTokenAccountsForSearchedWallet,
    searchedWalletForPortfolioPage,
    tokens,
  ]);

  const bfpkpats = preloadAddress
    ? balancesForPubkey[preloadAddress.toString()]
    : undefined;
  const numNonNullBalances =
    preloadAddress && bfpkpats
      ? Object.keys(bfpkpats).filter((e) => e !== null).length
      : 0;
  const bfpkpatsForSearchedWallet = searchedWalletForPortfolioPage
    ? balancesForPubkey[searchedWalletForPortfolioPage.toString()]
    : undefined;
  const numNonNullBalancesForSearchedWallet =
    searchedWalletForPortfolioPage && bfpkpatsForSearchedWallet
      ? Object.keys(bfpkpatsForSearchedWallet).filter((e) => e !== null).length
      : 0;

  return {
    loading: numNonNullBalances < tokens.length, // this will break if no SOL in subvolts
    balances:
      preloadAddress && publicKey
        ? balancesForPubkey[preloadAddress.toString()] ?? ALWAYS_SYMBOLS_TO_NULL
        : ALWAYS_SYMBOLS_TO_NULL,
    balancesForSearchedWallet:
      bfpkpatsForSearchedWallet ?? ALWAYS_SYMBOLS_TO_NULL,
    loadingBalancesForSearchedWallet:
      numNonNullBalancesForSearchedWallet < tokens.length,
    refresh,
  };
};

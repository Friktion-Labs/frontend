import { useAppWallet } from "features/wallet";
import { AccountLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { Decimal as BigNumber } from "decimal.js";
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { EwwTokenAccount } from "../all_types";
import { DEVNET_MM } from "../friktionConstants";
import { getHighestAccount } from "../utils/token";
import { useProviders } from "../hooks/useProvider";
import { usePreloadAddress } from "../09/usePreloadAddress";
import { useSearchedWalletForPortfolioPage } from "../09/useSearchedWalletForPortfolioPage";
import { lightningOGMap } from "../constants/lightningOGs";

export type OwnedTokenAccountsContextT = {
  loadingOwnedTokenAccounts: boolean;
  ownedTokenAccounts: Record<string, EwwTokenAccount[]> | null;
  // okay this is for the ability to look at someones portfolio on the portfolio page
  loadingOwnedTokenAccountsForSearchedWallet: boolean;
  ownedTokenAccountsForSearchedWallet: Record<string, EwwTokenAccount[]> | null;
  refresh: () => Promise<void>;
  getHighestTokenAccount: (mint: PublicKey) => Promise<PublicKey | null>;
  isMarketMaker: boolean;
  isLightningOGHolder: boolean;
  isSearchedWalletALightningOGHolder: boolean;
};

export const OwnedTokenAccountsContext =
  createContext<OwnedTokenAccountsContextT>({
    loadingOwnedTokenAccounts: false,
    ownedTokenAccounts: null,
    loadingOwnedTokenAccountsForSearchedWallet: false,
    ownedTokenAccountsForSearchedWallet: null,
    refresh: async () => {},
    getHighestTokenAccount: async () => {
      return null;
    },
    isMarketMaker: false,
    isLightningOGHolder: false,
    isSearchedWalletALightningOGHolder: false,
  });

/**
 * PLEASE. DONT DO THIS ANYMORE.
 */
const convertAccountInfoToLocalStruct = (
  _accountInfo: any,
  pubkey: PublicKey
): EwwTokenAccount => {
  const amountBuffer = Buffer.from(_accountInfo.amount);
  const beginAmount = new BigNumber(amountBuffer.readUIntLE(0, 6).toString());
  const latterAmount = new BigNumber(
    amountBuffer.readUIntLE(6, 2).toString()
  ).mul(new BigNumber(2).toPower(48));
  const amount = beginAmount.add(latterAmount);

  return {
    amount,
    mint: new PublicKey(_accountInfo.mint),
    // public key for the specific token account (NOT the wallet)
    pubKey: pubkey,
  };
};

/**
 * State for the Wallet's SPL accounts and solana account.
 *
 * Fetches and subscribes to all of the user's SPL Tokens on mount
 */
export const OwnedTokenAccountsProvider: React.FC<
  PropsWithChildren<unknown>
> = ({ children }) => {
  const { readonlyProvider } = useProviders();
  const connection = readonlyProvider.connection;
  const { publicKey } = useAppWallet();
  const { searchedWalletForPortfolioPage } =
    useSearchedWalletForPortfolioPage();

  const { preloadAddress, addressChange } = usePreloadAddress();

  let [loadingOwnedTokenAccounts, setLoading] = useState(true);
  let [
    loadingOwnedTokenAccountsForSearchedWallet,
    setLoadingOwnedTokenAccountsForSearchedWallet,
  ] = useState(false);
  let [ownedTokenAccountsForUsers, setOwnedTokenAccountsForUsers] = useState<
    Record<string, Record<string, EwwTokenAccount[]>>
  >({});
  const [isMarketMaker, setIsMarketMaker] = useState(false);
  const [isLightningOGHolder, setIsLightningOGHolder] = useState(false);
  const [
    isSearchedWalletALightningOGHolder,
    setIsSearchedWalletALightningOGHolder,
  ] = useState(false);

  // If preload doesnt match wallet
  if (addressChange) {
    ownedTokenAccountsForUsers = {};
    setOwnedTokenAccountsForUsers(ownedTokenAccountsForUsers);
    setIsMarketMaker(false);
    setIsLightningOGHolder(false);
    setIsSearchedWalletALightningOGHolder(false);
    setLoading(true);
    loadingOwnedTokenAccounts = true;
  }

  const [walletLoad, setWalletLoad] = useState(0);
  if (walletLoad === 0 && publicKey !== null) {
    setWalletLoad(Date.now());
  }
  const [oatFetchTime, setOatFetchTime] = useState(0);

  const getHighestTokenAccount = useCallback(
    async (mint: PublicKey) => {
      const oat =
        ownedTokenAccountsForUsers[preloadAddress?.toString() ?? "null"];
      if (!oat) return null;
      const accts = oat[mint.toString()];
      if (!accts) return null;
      const bestAccount = getHighestAccount(accts);
      if (bestAccount !== null) return bestAccount.pubKey;

      return null;
    },
    [ownedTokenAccountsForUsers, preloadAddress]
  );

  // currently does NOT refresh searchedWalletForPortfolioPage's token data!
  const refresh = useCallback(async () => {
    if (!preloadAddress) {
      // short circuit when there is no wallet connected
      if (!searchedWalletForPortfolioPage) setOwnedTokenAccountsForUsers({});
      return;
    }

    try {
      const resp = await connection.getTokenAccountsByOwner(
        preloadAddress,
        {
          programId: TOKEN_PROGRAM_ID,
        },
        connection.commitment
      );
      const _ownedTokenAccounts: Record<string, EwwTokenAccount[]> = {};
      if (resp?.value) {
        resp.value.forEach(({ account, pubkey }) => {
          const accountInfo = AccountLayout.decode(account.data);
          const initialAccount = convertAccountInfoToLocalStruct(
            accountInfo,
            pubkey
          );
          const mint = initialAccount.mint.toString();

          if (mint === DEVNET_MM) {
            setIsMarketMaker(true);
          }

          if (lightningOGMap[mint]) {
            setIsLightningOGHolder(true);
          }

          if (_ownedTokenAccounts[mint]) {
            _ownedTokenAccounts[mint].push(initialAccount);
          } else {
            _ownedTokenAccounts[mint] = [initialAccount];
          }
        });
      }
      setOatFetchTime(Date.now());
      setOwnedTokenAccountsForUsers((oat) => {
        return {
          ...oat,
          [preloadAddress.toString()]: _ownedTokenAccounts ?? null,
        };
      });
      setLoading(false);
    } catch (err) {
      console.log("error in OwnedTokenAccounts : " + err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preloadAddress, connection]);

  useEffect(() => {
    // Fetch and subscribe to Token Account updates on mount
    refresh();
  }, [refresh]);

  useEffect(() => {
    const grabTokenDataForSearchedWalletForPortfolioPage = async () => {
      if (!searchedWalletForPortfolioPage) {
        return;
      }

      setLoadingOwnedTokenAccountsForSearchedWallet(true);

      try {
        const resp = await connection.getTokenAccountsByOwner(
          searchedWalletForPortfolioPage,
          {
            programId: TOKEN_PROGRAM_ID,
          },
          connection.commitment
        );
        const _ownedTokenAccounts: Record<string, EwwTokenAccount[]> = {};
        if (resp?.value) {
          resp.value.forEach(({ account, pubkey }) => {
            const accountInfo = AccountLayout.decode(account.data);
            const initialAccount = convertAccountInfoToLocalStruct(
              accountInfo,
              pubkey
            );
            const mint = initialAccount.mint.toString();

            if (lightningOGMap[mint]) {
              setIsSearchedWalletALightningOGHolder(true);
            }

            if (_ownedTokenAccounts[mint]) {
              _ownedTokenAccounts[mint].push(initialAccount);
            } else {
              _ownedTokenAccounts[mint] = [initialAccount];
            }
          });
        }
        setOwnedTokenAccountsForUsers((oat) => {
          return {
            ...oat,
            [searchedWalletForPortfolioPage.toString()]:
              _ownedTokenAccounts ?? null,
          };
        });
        setLoadingOwnedTokenAccountsForSearchedWallet(false);
      } catch (err) {
        console.log(
          "error in searchedWalletForPortfolioPage's OwnedTokenAccounts : " +
            err
        );
      } finally {
        setLoadingOwnedTokenAccountsForSearchedWallet(false);
      }
    };
    grabTokenDataForSearchedWalletForPortfolioPage();
  }, [searchedWalletForPortfolioPage, connection]);

  useEffect(() => {
    if (oatFetchTime > 0 && walletLoad > 0 && !logged) {
      logIfLocalhost(
        `${
          oatFetchTime - walletLoad
        }ms wallet load -> owned token accounts fetched`
      );
      logged = true;
    }
  }, [oatFetchTime, walletLoad]);

  const ownedTokenAccounts =
    ownedTokenAccountsForUsers[preloadAddress?.toString() ?? "error"];
  const ownedTokenAccountsForSearchedWallet = searchedWalletForPortfolioPage
    ? ownedTokenAccountsForUsers[searchedWalletForPortfolioPage.toString()]
    : null;
  const finalIsMarketMaker =
    publicKey === null || preloadAddress?.toString() !== publicKey.toString()
      ? false
      : isMarketMaker;
  const finalIsLightningOGHolder =
    publicKey === null || preloadAddress?.toString() !== publicKey.toString()
      ? false
      : isLightningOGHolder;

  const providerResult = useMemo(() => {
    return {
      loadingOwnedTokenAccounts,
      ownedTokenAccounts,
      loadingOwnedTokenAccountsForSearchedWallet,
      ownedTokenAccountsForSearchedWallet,
      getHighestTokenAccount: getHighestTokenAccount,
      isMarketMaker: finalIsMarketMaker,
      isLightningOGHolder: finalIsLightningOGHolder,
      isSearchedWalletALightningOGHolder,
      refresh,
    };
  }, [
    finalIsMarketMaker,
    finalIsLightningOGHolder,
    isSearchedWalletALightningOGHolder,
    getHighestTokenAccount,
    loadingOwnedTokenAccounts,
    ownedTokenAccounts,
    refresh,
    loadingOwnedTokenAccountsForSearchedWallet,
    ownedTokenAccountsForSearchedWallet,
  ]);

  return (
    <OwnedTokenAccountsContext.Provider value={providerResult}>
      {children}
    </OwnedTokenAccountsContext.Provider>
  );
};

let logged = false;

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

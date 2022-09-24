import { useAppWallet } from "features/wallet";
import { DialogOverlay, DialogContent } from "@reach/dialog";
import { VisuallyHidden } from "@reach/visually-hidden";
import styled from "@emotion/styled";
import {
  button09Reset,
  Button09,
  AsyncButton09,
  AsyncButton09Bolt,
  button09Styles,
  ButtonLink09,
} from "./Button09";
import ConstructionWorker from "../randomIcons/construction-worker-emoji.png";
import fcstSOLIcon from "./greatLogos/logos/fcstSOL_icon.png";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useQuarantineChristmas10VFACWarningOnlyWorksWithCoveredCalls } from "./useChristmasCard10";
import {
  BlueNonAnimatedBar,
  BlueGradient,
  GreenNonAnimatedBar,
  PinkNonAnimatedBar,
  RedNonAnimatedBar,
  VioletNonAnimatedBar,
  YellowNonAnimatedBar,
} from "./glow09";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { css, Theme } from "@emotion/react";
import { errorToast, successToast } from "../utils/yummyNotifications";
import Bolt from "./friktionLogos/bolt80.png";
import {
  formatUSDCentsRoundNearest,
  formatUSDCentsSilly,
  youProbablyDontWantToRoundSoPleaseUseFloorViaGoodLoadableFormatShort,
  greatFloorLocaleN,
  formatUSDRoundDown,
  dontUseRoundLocaleN,
  formatUSDForPrice,
  dontUseRoundingUnlessAbsolutelyNecessaryN,
  decimalFloorN,
} from "./format09";
import { EpochCountdown } from "./FormattedCountdown";
import Decimal from "decimal.js";
import useOwnedTokenAccounts from "../hooks/useOwnedTokenAccounts";
import { InlineDocMissingLink, InlineHoverDoc } from "./misc09";
import {
  autoCompoundingExplanation,
  mintableVoltTokensExplanation,
  claimableWithdrawalsExplanation,
  pendingDepositsExplanation,
  pendingWithdrawalsExplanation,
  totalDepositsExplanation,
  walletBalanceExplanation,
  estimatedYieldExplanation,
  swapInputExplanation,
  swapOutputExplanation,
  swapYouPayExplanation,
  swapYouReceiveExplanation,
  swapRentExplanation,
  swapRateExplanation,
  swapProtocolsExplanation,
  swapPlatformFeeExplanation,
  shareTokenOverviewExplanation,
  coingeckoPriceDisclaimer,
  quarryExplanation,
  basisFundingExplanation,
  basisBorrowInterestExplanation,
  basisSupplyInterestExplanation,
  getCrossChainDepositsExplanation,
  getCrossChainDepositInProgressText,
  getCrossChainBalanceExplanation,
  newFeesExplanation,
  volt5FeesExplanation,
  snowflakeCrossChainDisabledText,
  automatedEmissionsExplanation,
  additionalLidoStakingBoostExplanation,
} from "./textForTooltipsOnly";
import {
  claimPendingWithdraw,
  depositIntoVolt1,
  withdrawFromVolt1,
} from "./transactionHandler";
import {
  formatOptionProductShort,
  MainnetSOLToken,
  MainnetUSDCToken,
  DevnetUSDCToken,
  UltraToken,
  WEAK_SUBVOLTS,
  AllEntropySymbolsUnion,
  QuarrySingleMine,
  AllBasisSymbolsUnion,
  MainnetLIDOSTSOLToken,
  AllProtectionVoltGlobalIdsUnion,
} from "./registry10";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  apyFromData,
  apyNumberFromData,
  biggestYieldNumber,
  FullYieldTooltip,
} from "./YieldTooltip";
import {
  coingeckoConversionReal,
  isStablecoin,
  useMarkPrices,
} from "./MarkPrices10";
import { TokenLink } from "./tokenLink";
import {
  useJupiter,
  UseJupiterResult,
  useJupiterWrapper,
  SPLTokenInfo,
  createSomeMorePlatformFeeATAs,
} from "./JupiterWrapper";
import { PublicKey } from "@saberhq/solana-contrib";
import { TransactionError } from "@solana/web3.js";
import { useProviders } from "../hooks/useProvider";
import {
  handleTxWrappedErrorToast,
  handleTxWrappedPendingInfoToast,
} from "../hooks/handleTXWrapped";
import { Popover } from "antd";
import { getHighestAccount } from "../utils/token";
import { useDeposits10 } from "./UserDeposits10";
import { TokenInfo } from "@saberhq/token-utils";
import { RouteInfo } from "@jup-ag/core";
import { deepEqual, whatChangedDeeply } from "./superCondom";
import { VoltageBox } from "./VoltageBox";
import { Card09Props } from "./Card10";
import { useCrabData } from "./CrabData";
import {
  SingleQuarryRewardCounter,
  StakeRewardCoin,
  StakeRewardNumber,
  StakeRewardRow,
} from "./SingleQuarryRewardCounter";
import { useSingleDeposit, useSingleWithdraw } from "./quarryUtils";
import { useQuarryData } from "./useQuarryData";
import { useBasisData } from "./BasisData";
import {
  CrossChainConnectButton,
  CrossChainDepositButton,
  getChainIdFromAsset,
  getChainNetworkNameFromAsset,
  getTickerFromWormholeChainId,
  useWormholeProgress,
  useCrossChainBalances,
  useCrossChainTransactionFees,
} from "features/wormhole";
import { ImportantAssetLogos } from "./greatLogos/assetLogos";
import {
  generateSolanaFmLink,
  useExplorerLink,
} from "../hooks/useExplorerLink";
import { Typography } from "common/components/Typography";
import { lighten, darken } from "@mui/material";
import { useAppConnection } from "features/connection";
import { useAuctionResults } from "./AuctionResults";
import { LDOEmissionsPlot } from "./AnalyticsGraphs";
import { useProtectionData } from "./ProtectionData";
import { useQuery } from "react-query";
import { SolidoSDK } from "@lidofinance/solido-sdk";

export type ManagementModalPage = "deposit" | "withdraw" | "swap" | "stake";

const fontSizeReducer = (value: string) => {
  if (value.length > 9) {
    return `${Math.max(12, 24 - (value.length - 9) * 1.4)}px`;
  }
  return "24px";
};
const fontSizeReducerSteeper = (value: string) => {
  if (value.length > 9) {
    return `${Math.max(11, 22 - (value.length - 9) * 1.5)}px`;
  }
  return "22px";
};

declare global {
  interface Window {
    jupiterUser?: PublicKey;
  }
}

let _sesameOpened =
  window.location.hash === "#open_sesame_is_the_key_to_the_yummy_marinade";
setInterval(() => {
  if (
    window.location.hash === "#open_sesame_is_the_key_to_the_yummy_marinade"
  ) {
    _sesameOpened = true;
  }
}, 200);

export type Await<T> = T extends Promise<infer U> ? U : T;
// let isMobile = false;

// try {
//   isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
// } catch (e) {}
export const useManagementModal = () => {
  const [nonce, setNonce] = useState(0);
  const [globalId, setGlobalId] = useState("");

  return {
    modalSesameBall: {
      nonce,
      globalId,
    },
    openModal: (
      globalId: string /* page?: when we need to open specific */
    ) => {
      setGlobalId(globalId);
      setNonce(nonce + 1);
    },
  };
};

/**
 * You can only open a modal.
 *
 * Get a modalSesameBall from useManagementModal
 */
export const ZeroNineManagementModal = (props: {
  modalSesameBall: {
    nonce: number;
    globalId: string;
  };
}) => {
  const { createExplorerLink } = useExplorerLink();
  const wallet = useAppWallet();

  const [_stateSponsoredSesame, setStateSponsoredSesame] =
    useState(_sesameOpened);
  useEffect(() => {
    const interval = setInterval(() => {
      if (
        window.location.hash ===
          "#open_sesame_is_the_key_to_the_yummy_marinade" &&
        !_stateSponsoredSesame
      ) {
        setStateSponsoredSesame(true);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [_stateSponsoredSesame]);

  const [isUsingCrossChainDeposit, setIsUsingCrossChainDeposit] =
    useState(false);

  const sesameOpened = _stateSponsoredSesame || _sesameOpened;

  const vfac09 = useQuarantineChristmas10VFACWarningOnlyWorksWithCoveredCalls();
  const { publicKey } = useAppWallet();
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const body = document.body;
    if (showDialog) {
      // Disable body scroll when modal is open
      body.style.setProperty("overflow", "hidden", "important");
    } else {
      body.style.removeProperty("overflow");
      setIsUsingCrossChainDeposit(false);
    }
  }, [showDialog]);

  const getCrossChainTransactionFees = useCrossChainTransactionFees([
    showDialog,
    isUsingCrossChainDeposit,
  ]);

  const globalId = props.modalSesameBall.globalId;
  let [page, setPage] = useState<ManagementModalPage>("deposit");
  const { tokenList } = useJupiterWrapper();

  const [lastNonce, setLastNonce] = useState(0);
  const { network } = useAppConnection();
  const ownedTokenAccountsContext = useOwnedTokenAccounts();
  const { markPrices } = useMarkPrices();
  const { crabVoltData } = useCrabData();
  const { basisVoltData } = useBasisData();
  const { protectionVoltData } = useProtectionData();
  const { quarryData } = useQuarryData();
  const { readonlyProvider } = useProviders();
  const { yieldDataPerVolt } = useAuctionResults();
  const deposits10 = useDeposits10();
  const usdcTokenInfo =
    network === "devnet" ? DevnetUSDCToken.info : MainnetUSDCToken.info;
  let [swapToken, setSwapToken] = useState<TokenInfo>(MainnetSOLToken.info);

  const [isHighVoltageSelected, setIsHighVoltageSelected] = useState(false);

  const [isLidoSectionExpanded, setIsLidoSectionExpanded] = useState(false);

  const { balances: crossChainBalances, loading: crossChainBalancesLoading } =
    useCrossChainBalances();

  // Do not mess with the raw values
  let [rawDepositAmount, setDepositAmount] = useState("");
  // for the expandable Stake Lido to create stSOL section of the modal
  let [rawDepositAmountForLidoSection, setDepositAmountForLidoSection] =
    useState("");
  let [rawWithdrawAmount, setWithdrawAmount] = useState("");
  let [rawSwapAmount, setSwapAmount] = useState("0.5");

  let [lastDepositTokenSymbol, setlastDepositTokenSymbol] = useState("");
  let [smartSwapAmountHasBeenSet, setsmartSwapAmountHasBeenSet] =
    useState(false);

  const [solToLidoStakedSolMultiplier, setSolToLidoStakedSolMultiplier] =
    useState<number | null>(null);

  const updateSwapTokenAndAmount = useCallback(
    (tokenInfo: TokenInfo, amount: string) => {
      setSwapToken(tokenInfo);
      setSwapAmount(amount);
    },
    []
  );

  // Popover stuff for jup
  const [visible, setVisible] = useState<boolean>(false);

  const hide = useCallback(() => setVisible(false), []);

  const handleVisibleChange = useCallback((visible: boolean) => {
    setVisible(visible);
  }, []);

  /**
   * When the user deposits, there is a flash of loading, and we need to keep things consistent
   */
  let [lockedShowPending, setLockedShowPending] = useState([
    false,
    false,
    false,
    false,
  ] as [boolean, boolean, boolean, boolean]);

  if (props.modalSesameBall.nonce !== lastNonce) {
    setLastNonce(props.modalSesameBall.nonce);
    setShowDialog(true);
    setDepositAmount("");
    setDepositAmountForLidoSection("");
    setWithdrawAmount("");
    rawDepositAmount = "";
    rawDepositAmountForLidoSection = "";
    rawWithdrawAmount = "";
    setPage("deposit");
    page = "deposit";
    setLockedShowPending([false, false, false, false]);
    lockedShowPending = [false, false, false, false];
  }

  const close = useCallback(() => {
    setShowDialog(false);
    setIsLidoSectionExpanded(false);
  }, []);

  const card = vfac09.cards.find((card) => {
    return card.def && card.def.globalId === globalId;
  });

  const lowVoltageCard = vfac09.cards.find(
    (item) => item.def && item.def.highVoltage === card?.def?.globalId
  );
  useEffect(() => {
    if (lowVoltageCard) {
      // if card has a corresponding low voltage card, it means that currently selected card is high voltage
      setIsHighVoltageSelected(true);
    } else {
      setIsHighVoltageSelected(false);
    }
  }, [lowVoltageCard, showDialog]);

  useEffect(() => {
    if (
      card?.def?.depositToken.info.symbol === "SOL" &&
      swapToken.symbol === "SOL"
    ) {
      setSwapToken(usdcTokenInfo);
      setSwapAmount("25");
    }

    if (
      card?.def?.depositToken.info.symbol === "USDC" &&
      swapToken.symbol === "USDC"
    ) {
      setSwapToken(MainnetSOLToken.info);
      if (deposits10.solBalance) {
        const maxSol = deposits10.solBalance.sub(0.00889);
        if (maxSol.gt(0)) {
          setSwapAmount(maxSol.toString());
        } else {
          setSwapAmount("0.1");
        }
      }
      setSwapAmount("0.5");
    }
  }, [
    card?.def?.depositToken.info.symbol,
    deposits10.solBalance,
    swapToken.symbol,
    usdcTokenInfo,
  ]);

  const lidoRewardsApyQuery = useQuery<
    unknown,
    unknown,
    Record<string, number>
  >(
    "lidoRewardsApyQuery",
    () => {
      return fetch("https://api.friktion.fi/lido_volt_rewards").then((res) =>
        res.json()
      );
    },
    {
      staleTime: Infinity,
      retry: 3,
      enabled: card?.def?.globalId === "mainnet_income_call_stsol",
    }
  );
  const lidoStakedSolApyQuery = useQuery<
    unknown,
    unknown,
    { data: { apy: number; apr: number; intervalPrices: any } }
  >(
    "lidoStakedSolApyQuery",
    () => {
      return fetch("https://sol-api-pub.lido.fi/v1/apy?since_launch").then(
        (res) => res.json()
      );
    },
    {
      staleTime: Infinity,
      retry: 3,
      enabled: card?.def?.globalId === "mainnet_income_call_stsol",
    }
  );
  const lidoRewardsForUserQuery = useQuery<
    unknown,
    unknown,
    {
      total_rewards_mined: number;
      total_rewards_sent: number;
      total_rewards_pending: number;
      reward_transactions: any[];
    }
  >(
    "lidoRewardsForUserQuery",
    () => {
      return fetch(
        `https://api.friktion.fi/lido_user_rewards?userAddress=${publicKey?.toString()}`
      ).then((res) => res.json());
    },
    {
      staleTime: Infinity,
      retry: 3,
      enabled:
        card?.def?.globalId === "mainnet_income_call_stsol" &&
        publicKey !== null,
    }
  );

  useEffect(() => {
    (async () => {
      if (card?.def?.globalId === "mainnet_income_call_stsol") {
        try {
          const solidoSDK = new SolidoSDK(
            "mainnet-beta",
            readonlyProvider.connection,
            "6JPMBNYswWcb3QNiAu1LiSrzTE3tvFhNpf7n5xjo9gFc"
          );

          const { SOLToStSOL } = await solidoSDK.getExchangeRate();
          setSolToLidoStakedSolMultiplier(SOLToStSOL);
        } catch (e) {
          console.error("Could not get SOL to stSOL exchange rate!");
        }
      }
    })();
  }, [card?.def?.globalId, readonlyProvider.connection]);

  const [expectingPositiveBalance, setExpectingPositiveBalance] = useState<
    Record<string, true>
  >({});

  const parsedSwapAmount = card?.def?.depositToken
    ? parseInputNumber(card.def.depositToken, rawSwapAmount)
    : null;
  const parsedSwapAmountUnit = parsedSwapAmount
    ? parsedSwapAmount.mul(10 ** swapToken.decimals).toNumber()
    : null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const jupSupportedTokensOwnedByUser = useMemo(() => {
    if (!publicKey) {
      return null;
    }
    if (
      ownedTokenAccountsContext.loadingOwnedTokenAccounts ||
      !ownedTokenAccountsContext.ownedTokenAccounts
    ) {
      return null;
    }

    const highestFounds: {
      tokenInfo: SPLTokenInfo;
      amount: Decimal;
    }[] = [];

    if (deposits10.solBalance && card?.def?.depositToken.symbol !== "SOL") {
      highestFounds.push({
        tokenInfo: MainnetSOLToken.info,
        amount: deposits10.solBalance,
      });
    }

    for (const [, value] of Object.entries(
      ownedTokenAccountsContext.ownedTokenAccounts
    )) {
      const highest = getHighestAccount(value);
      if (
        highest &&
        highest.amount.gt(0) &&
        highest.mint.toString() !== card?.def?.depositToken.address
      ) {
        const mint = highest.mint.toBase58();
        const token = tokenList.find((t) => t.address === mint);

        if (token) {
          highestFounds.push({
            tokenInfo: token,
            amount: highest.amount.div(10 ** token.decimals),
          });
        }
      }
    }
    return highestFounds;
  }, [
    card?.def?.depositToken,
    deposits10.solBalance,
    ownedTokenAccountsContext.loadingOwnedTokenAccounts,
    ownedTokenAccountsContext.ownedTokenAccounts,
    tokenList,
    publicKey,
  ]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [priceInverted, setPriceInverted] = useState(false);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const useJupiterProps: Parameters<typeof useJupiter>[0] = useMemo(() => {
    return {
      amount: parsedSwapAmountUnit
        ? parsedSwapAmountUnit
        : 1 * 10 ** swapToken.decimals, // raw input amount of tokens
      inputMint: swapToken.address
        ? new PublicKey(swapToken.address)
        : undefined,
      outputMint: card?.def?.depositToken.mintAccount,
      slippage: 1, // 1% slippage
      debounceTime: 250, // debounce ms time before refresh
    };
  }, [
    card?.def?.depositToken.mintAccount,
    parsedSwapAmountUnit,
    swapToken.address,
    swapToken.decimals,
  ]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const jupiter: UseJupiterResult = useJupiter(useJupiterProps);
  // console.log(jupiter);
  whatChangedDeeply("Jupiter is making me stupiter", jupiter);

  const foundRoutes: Array<RouteInfo | undefined> | undefined =
    jupiter?.routes || [];
  let bestRoute: null | undefined | typeof foundRoutes[0] | undefined =
    foundRoutes[0];

  const [depositAndFee, setDepositAndFee] =
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useState<Await<ReturnType<RouteInfo["getDepositAndFee"]>>>(undefined);

  let swapTokenBalance: Decimal = new Decimal(0);
  const foundSwapToken = jupSupportedTokensOwnedByUser?.find(
    (j) => j.tokenInfo.address === swapToken.address
  );
  if (foundSwapToken) {
    swapTokenBalance = foundSwapToken.amount;
  }

  // eslint is drunk
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (
      jupSupportedTokensOwnedByUser?.length &&
      ((card?.def?.depositToken &&
        lastDepositTokenSymbol !== card.def.depositToken.symbol) ||
        !smartSwapAmountHasBeenSet)
    ) {
      if (card?.def?.depositToken.symbol === "SOL") {
        let usdcAddress = "";
        if (network === "devnet") {
          usdcAddress = DevnetUSDCToken.info.address;
        } else {
          usdcAddress = MainnetUSDCToken.info.address;
        }
        const foundUsdcToken = jupSupportedTokensOwnedByUser?.find(
          (j) => j.tokenInfo.address === usdcAddress
        );
        if (foundUsdcToken) {
          if (network === "devnet") {
            setSwapToken(DevnetUSDCToken.info);
          } else {
            setSwapToken(MainnetUSDCToken.info);
          }
          setSwapAmount(foundUsdcToken.amount.toString());
          setsmartSwapAmountHasBeenSet(true);
        } else if (
          jupSupportedTokensOwnedByUser.length &&
          jupSupportedTokensOwnedByUser[0]
        ) {
          setSwapToken(jupSupportedTokensOwnedByUser[0].tokenInfo);
          setSwapAmount(jupSupportedTokensOwnedByUser[0].amount.toString());
          setsmartSwapAmountHasBeenSet(true);
        } else {
          if (network === "devnet") {
            setSwapToken(DevnetUSDCToken.info);
          } else {
            setSwapToken(MainnetUSDCToken.info);
          }
          setSwapAmount("");
        }
      } else if (deposits10.solBalance) {
        setSwapToken(MainnetSOLToken.info);
        let reducedAmount = deposits10.solBalance.sub(0.00889);
        if (reducedAmount.lt(0)) {
          reducedAmount = new Decimal(0);
        }
        setSwapAmount(reducedAmount.toString());

        setsmartSwapAmountHasBeenSet(true);
      }
      // console.log("Set the last!", card?.def?.depositToken.symbol);
      setlastDepositTokenSymbol(card?.def?.depositToken.symbol || "");
    }
  }, [
    card?.def?.depositToken,
    jupSupportedTokensOwnedByUser,
    lastDepositTokenSymbol,
    network,
    smartSwapAmountHasBeenSet,
    deposits10,
  ]);

  // eslint is drunk
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const br = bestRoute;
    (async () => {
      if (br) {
        const newDepositAndFee = await br.getDepositAndFee();
        if (!deepEqual(newDepositAndFee, depositAndFee)) {
          setDepositAndFee(depositAndFee);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bestRoute]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const swapRouteParsed = useMemo(() => {
    let swapRouteParsed = "...";

    if (bestRoute && bestRoute.marketInfos.length > 0) {
      swapRouteParsed = bestRoute.marketInfos
        .map((mi) => {
          return mi.amm.label;
        })
        .join(" × ");
    }
    return swapRouteParsed;
  }, [bestRoute]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const swapCurrenciesParsed = useMemo(() => {
    let swapCurrenciesParsed = "...";
    if (bestRoute && bestRoute.marketInfos.length > 0) {
      const swapCurrencyNodes: string[] = [swapToken.symbol];
      for (const [, mi] of bestRoute.marketInfos.entries()) {
        const outputMint = mi.outputMint.toString();
        const token = tokenList.find((t) => t.address === outputMint);
        if (token) {
          swapCurrencyNodes.push(token.symbol);
        } else if (outputMint.length > 6) {
          swapCurrencyNodes.push(
            outputMint.substring(0, 3) +
              ".." +
              outputMint.substring(outputMint.length - 3)
          );
        } else {
          swapCurrencyNodes.push("???");
        }
      }
      swapCurrenciesParsed = swapCurrencyNodes.join(" → ");
    }
    return swapCurrenciesParsed;
  }, [bestRoute, swapToken.symbol, tokenList]);

  const highVoltageGlobalId = card?.def?.highVoltage;
  const highVoltageCard = lowVoltageCard
    ? card
    : vfac09.cards.find((card) => {
        return card.def && card.def.globalId === highVoltageGlobalId;
      });
  let selectedCard: Card09Props | undefined = card;
  if (highVoltageCard && isHighVoltageSelected) selectedCard = highVoltageCard;
  if (lowVoltageCard && !isHighVoltageSelected) selectedCard = lowVoltageCard;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { wormholeTransactionInfo } = useWormholeProgress(
    selectedCard?.def?.globalId
  );

  useEffect(() => {
    if (
      selectedCard?.def &&
      wormholeTransactionInfo &&
      isUsingCrossChainDeposit
    ) {
      setDepositAmount(
        sanitizeInputNumber(
          selectedCard.def.depositToken.decimals,
          wormholeTransactionInfo.amount,
          rawDepositAmount
        )
      );
    }
  }, [
    wormholeTransactionInfo,
    rawDepositAmount,
    selectedCard?.def,
    isUsingCrossChainDeposit,
  ]);

  // we want to open the cross chain deposit tab by default if there was an ongoing wormhole txn
  // However, this switch should only happen once per dialog open and thus we keep track of that
  // with this ref
  const hasSetIsUsingCrossChain = useRef(false);
  useEffect(() => {
    if (!showDialog) {
      hasSetIsUsingCrossChain.current = false;
    } else if (!hasSetIsUsingCrossChain.current && wormholeTransactionInfo) {
      hasSetIsUsingCrossChain.current = true;
      setIsUsingCrossChainDeposit(true);
    }
  }, [wormholeTransactionInfo, showDialog]);

  ////// REturns start happening. no more hooks

  if (!showDialog) {
    return null;
  }

  if (!card) {
    errorToast(
      "App error on deposit/withdraw",
      `Card with globalId "${globalId}" not found`
    );
    close();
    return null;
  }
  if (!card.def) {
    errorToast(
      "App error on deposit/withdraw",
      `Card with globalId "${globalId}" not yet launched`
    );
    close();
    return null;
  }

  if (highVoltageGlobalId && !highVoltageCard) {
    errorToast(
      "App error on deposit/withdraw",
      `High Voltage Card with globalId "${highVoltageGlobalId}" not found`
    );
    close();
    return null;
  }
  if (highVoltageGlobalId && !highVoltageCard?.def) {
    errorToast(
      "App error on deposit/withdraw",
      `High Voltage Card with globalId "${highVoltageGlobalId}" not yet launched`
    );
    close();
    return null;
  }

  if (!selectedCard) {
    errorToast("App error on deposit/withdraw", `Selected Card not found`);
    close();
    return null;
  }
  if (!selectedCard.def) {
    errorToast(
      "App error on deposit/withdraw",
      `Selected Card not yet launched`
    );
    close();
    return null;
  }
  const isCrabVolt = selectedCard.def.volt === 3;
  const isBasisVolt = selectedCard.def.volt === 4;
  const parsedDepositAmount = parseInputNumber(
    selectedCard.def.depositToken,
    rawDepositAmount
  );
  const parsedDepositAmountForLidoSection = parseInputNumber(
    MainnetSOLToken,
    rawDepositAmountForLidoSection
  );
  const parsedWithdrawAmount = parseInputNumber(
    selectedCard.def.depositToken,
    rawWithdrawAmount
  );

  const subvoltInfo = WEAK_SUBVOLTS[selectedCard.def.globalId];
  if (subvoltInfo === undefined) {
    errorToast(
      "App error on deposit/withdraw",
      `Card with globalId "${selectedCard.def.globalId}" not found`
    );
    close();
    return null;
  }

  const deposits = selectedCard.deposits;

  const personalDepositBreakdownItems = [];

  if (selectedCard.deposits?.pendingDeposits.gt(0) || lockedShowPending[0]) {
    if (!lockedShowPending[0]) {
      setLockedShowPending((lsp) => [true, lsp[1], lsp[2], lsp[3]]);
    }
    personalDepositBreakdownItems.push(
      <InfoRow key={0}>
        <InfoLabel>
          <InlineDocMissingLink content={pendingDepositsExplanation}>
            Pending deposits
          </InlineDocMissingLink>
        </InfoLabel>
        <InfoDatum>
          {selectedCard.def.format(selectedCard.deposits?.pendingDeposits)}
        </InfoDatum>
      </InfoRow>
    );
  }

  if (selectedCard.deposits?.pendingWithdrawals.gt(0) || lockedShowPending[1]) {
    if (!lockedShowPending[1]) {
      setLockedShowPending((lsp) => [lsp[0], true, lsp[2], lsp[3]]);
    }

    personalDepositBreakdownItems.push(
      <InfoRow key={1}>
        <InfoLabel>
          <InlineDocMissingLink content={pendingWithdrawalsExplanation}>
            Pending withdrawals
          </InlineDocMissingLink>
        </InfoLabel>
        <InfoDatum>
          <BlackAndWhiteText variant="bodyXl">
            {(selectedCard.deposits?.pendingWithdrawals
              ? youProbablyDontWantToRoundSoPleaseUseFloorViaGoodLoadableFormatShort(
                  selectedCard.def,
                  selectedCard.deposits.pendingWithdrawals
                )
              : "...") +
              " " +
              selectedCard.def.depositToken.symbol}
          </BlackAndWhiteText>
        </InfoDatum>
      </InfoRow>
    );
  }

  if (selectedCard.deposits?.mintableShares.gt(0) || lockedShowPending[2]) {
    if (!lockedShowPending[2]) {
      setLockedShowPending((lsp) => [lsp[0], lsp[1], true, lsp[3]]);
    }

    personalDepositBreakdownItems.push(
      <InfoRow key={2}>
        <InfoLabel>
          <InlineDocMissingLink content={mintableVoltTokensExplanation}>
            Mintable {selectedCard.def.shareTokenSymbol} shares
          </InlineDocMissingLink>
        </InfoLabel>
        <InfoDatum>
          <BlackAndWhiteText variant="bodyXl">
            {selectedCard.deposits?.mintableShares ? "yes (optional)" : "..."}
          </BlackAndWhiteText>
        </InfoDatum>
      </InfoRow>
    );
  }

  if (
    selectedCard.deposits?.claimableWithdrawals.gt(0) ||
    lockedShowPending[3]
  ) {
    if (!lockedShowPending[3]) {
      setLockedShowPending((lsp) => [lsp[0], lsp[1], lsp[2], true]);
    }
    personalDepositBreakdownItems.push(
      <InfoRow key={3}>
        <InfoLabel>
          <InlineDocMissingLink content={claimableWithdrawalsExplanation}>
            Claimable withdrawals
          </InlineDocMissingLink>
        </InfoLabel>
        <InfoDatum>
          {selectedCard.def.format(selectedCard.deposits?.claimableWithdrawals)}
        </InfoDatum>
      </InfoRow>
    );
  }

  const personalDepositBreakdown = personalDepositBreakdownItems.length ? (
    <CompactInfoTable>{personalDepositBreakdownItems}</CompactInfoTable>
  ) : null;

  const yieldData = yieldDataPerVolt[selectedCard.def.globalId];

  const latestEpochYield = yieldData ? yieldData.latestEpochYield : null;

  const averagedEpochYield = yieldData ? yieldData.averagedEpochYield : null;

  const lastTradedOption = yieldData ? yieldData.lastTradedOption : null;

  const estimatedYieldPreFees =
    selectedCard.deposits?.deposits && latestEpochYield
      ? selectedCard.deposits.deposits
          .add(selectedCard.deposits.pendingWithdrawals)
          .mul(latestEpochYield.epochYield)
      : null;

  let nativeBalance: Decimal | null | undefined = new Decimal(0);

  if (
    !crossChainBalancesLoading &&
    crossChainBalances &&
    selectedCard.def.wormholeAsset
  ) {
    const newCrosschainBalance =
      crossChainBalances[selectedCard.def.wormholeAsset];
    if (newCrosschainBalance !== null && newCrosschainBalance !== undefined)
      nativeBalance = newCrosschainBalance;
  }

  const depositTokenBalance = isUsingCrossChainDeposit
    ? nativeBalance
    : selectedCard.deposits?.depositTokenWalletBalance;

  const personalInfoTable = (
    <CompactInfoTable>
      <InfoRow>
        <InfoLabel>
          <InlineDocMissingLink
            content={
              isUsingCrossChainDeposit && selectedCard.def.wormholeAsset
                ? getCrossChainBalanceExplanation(
                    selectedCard.def.depositToken.symbol,
                    selectedCard.def.wormholeAsset
                  )
                : walletBalanceExplanation(
                    selectedCard.def.depositToken.info.name
                  )
            }
          >
            Wallet balance
          </InlineDocMissingLink>
        </InfoLabel>
        <InfoDatum>
          <BlackAndWhiteText variant="bodyXl">
            {!wallet.connected ||
            (isUsingCrossChainDeposit && depositTokenBalance === undefined) ? (
              <span className="greyed">not connected</span>
            ) : (
              selectedCard.def.depositToken.format(depositTokenBalance)
            )}
          </BlackAndWhiteText>
        </InfoDatum>
      </InfoRow>
      <InfoRow>
        <InfoLabel>
          <InlineDocMissingLink content={totalDepositsExplanation}>
            Your deposits
          </InlineDocMissingLink>
        </InfoLabel>
        <InfoDatum>
          <BlackAndWhiteText variant="bodyXl">
            {!wallet.connected ? (
              <span className="greyed">not connected</span>
            ) : (
              selectedCard.def.format(selectedCard.deposits?.totalDeposits)
            )}
          </BlackAndWhiteText>
        </InfoDatum>
      </InfoRow>
      {selectedCard.deposits?.singleQuarryDeposits ? (
        <InfoRow>
          <InfoLabel
            css={css`
              padding-left: 12px;
            `}
          >
            <InlineDocMissingLink content={"TODO"}>
              {" "}
              Staked volt tokens
            </InlineDocMissingLink>
          </InfoLabel>
          <InfoDatum>
            {publicKey === null ? (
              <span className="greyed">not connected</span>
            ) : (
              selectedCard.def.depositToken.format(
                selectedCard.deposits?.singleQuarryDeposits,
                selectedCard.def.shareTokenSymbol
              )
            )}
          </InfoDatum>
        </InfoRow>
      ) : null}
      {estimatedYieldPreFees?.gt(0) ? (
        <InfoRow>
          <InfoLabel>
            <InlineDocMissingLink content={estimatedYieldExplanation}>
              Your estimated returns
            </InlineDocMissingLink>
          </InfoLabel>
          <InfoDatum>
            <BlackAndWhiteText variant="bodyXl">
              {!wallet.connected ? (
                <span className="greyed">not connected</span>
              ) : (
                selectedCard.def.format(estimatedYieldPreFees.mul(0.9))
              )}
            </BlackAndWhiteText>
          </InfoDatum>
        </InfoRow>
      ) : null}
    </CompactInfoTable>
  );

  let lidoRewardsApy: string = "...%";
  if (lidoRewardsApyQuery.data) {
    lidoRewardsApy = `${lidoRewardsApyQuery.data.apy.toFixed(1)}%`;
  }
  let lidoStakedSolApy: string = "...%";
  if (lidoStakedSolApyQuery.data) {
    lidoStakedSolApy = `${lidoStakedSolApyQuery.data.data.apy.toFixed(1)}%`;
  }
  let usersPendingLDORewards: string = "...";
  if (
    lidoRewardsForUserQuery.data &&
    lidoRewardsForUserQuery.data.total_rewards_pending > 0
  ) {
    usersPendingLDORewards = `${lidoRewardsForUserQuery.data.total_rewards_pending.toFixed(
      6
    )}`;
  }

  const generalInfoTable = (
    <TopInfoTable>
      {" "}
      {/* <InfoRow>
            <InfoLabel>Value deposited</InfoLabel>
            <InfoDatum>
              {!relevantCard.loading
                ? formatUSDRoundDown(relevantCard.tvlUSD)
                : "..."}
            </InfoDatum>
          </InfoRow> */}
      {selectedCard.def.abnormalEpochLength ? (
        <InfoRow>
          <InfoLabel>
            <InlineDocMissingLink
              content={`Most volts have epoch lengths of 7 days. This one has epoch length ${selectedCard.def.abnormalEpochLength} days. This means once the epoch has started, you won't be able to withdraw for up to ${selectedCard.def.abnormalEpochLength} days.`}
            >
              Abnormal epoch length{" "}
              <span
                className="hoverShow"
                css={css`
                  &:after {
                    display: inline-block;
                    content: "ⓘ";
                    color: #ff0;
                    font-weight: bold;
                  }
                `}
              ></span>
            </InlineDocMissingLink>
          </InfoLabel>
          <InfoDatum>{selectedCard.def.abnormalEpochLength} days</InfoDatum>
        </InfoRow>
      ) : null}
      <InfoRow>
        <InfoLabel>
          <InlineDocMissingLink
            content={FullYieldTooltip(
              selectedCard.data,
              averagedEpochYield,
              latestEpochYield,
              selectedCard.def.volt === 5 && protectionVoltData
                ? protectionVoltData[
                    selectedCard.def.globalId as AllProtectionVoltGlobalIdsUnion
                  ]
                : null,
              selectedCard.def.globalId === "mainnet_income_call_stsol"
                ? lidoRewardsApy
                : undefined
            )}
          >
            Projected APY
          </InlineDocMissingLink>
        </InfoLabel>
        <InfoDatum>
          <BlackAndWhiteText variant="bodyXl">
            {apyFromData(
              selectedCard.data,
              yieldData ? yieldData.averagedEpochYield : null
            )}
          </BlackAndWhiteText>
        </InfoDatum>
      </InfoRow>
      {selectedCard.def.globalId === "mainnet_income_call_stsol" && (
        <InfoRow>
          <InfoLabel>
            <InlineDocMissingLink
              content={additionalLidoStakingBoostExplanation}
            >
              Addtional Staking Boost
            </InlineDocMissingLink>
          </InfoLabel>
          <InfoDatum>
            <BlackAndWhiteText variant="bodyXl">
              {lidoRewardsApy}
            </BlackAndWhiteText>
          </InfoDatum>
        </InfoRow>
      )}
    </TopInfoTable>
  );

  let profitRangeStart;
  let profitRangeEnd;
  let dailyFundingRate;
  let impliedVolatility;
  let collateralRatio;
  let liquidationThreshold;
  let delta;

  if (isCrabVolt && markPrices && crabVoltData) {
    const symbol = selectedCard.def.underlying.symbol;
    const crabData = crabVoltData[symbol as AllEntropySymbolsUnion];
    if (crabData && crabData.profitRangeLow && crabData.profitRangeHigh) {
      delta = crabData.delta;
      profitRangeStart = crabData.profitRangeLow;
      profitRangeEnd = crabData.profitRangeHigh;
      dailyFundingRate = crabData.dailyFundingRate;
      impliedVolatility = crabData.impliedVolatility;
      collateralRatio = crabData.collateralRatio;
      liquidationThreshold = crabData.liquidationThreshold;
    }
  }

  // let basisLeverageRatio;
  let basisBorrowInterest;
  let basisSupplyInterest;
  let basisFunding;

  if (isBasisVolt && basisVoltData) {
    const symbol = selectedCard.def.underlying.symbol;
    const basisData = basisVoltData[symbol as AllBasisSymbolsUnion];
    if (basisData) {
      // basisLeverageRatio = basisData.leverageRatio;
      basisBorrowInterest = basisData.borrowInterest;
      basisSupplyInterest = basisData.supplyInterest;
      basisFunding = basisData.funding;
    }
  }

  const extraLidoStakingInfoBox = (
    <GeneralInfoTable
      css={css`
        height: 100%;
        justify-content: space-between;
      `}
    >
      <div
        css={css`
          font-family: "Euclid Circular B";
          color: white;
          font-size: 12px;
        `}
      >
        Instantly stake SOL with{" "}
        <a href="http://solana.lido.fi/" target="_blank" rel="noreferrer">
          Lido
        </a>{" "}
        to receive stSOL, an on-chain representation of SOL staking position.
        Automatically earn additional returns by depositing that stSOL into
        Friktion!
      </div>
      <div
        css={css`
          display: flex;
          flex-direction: column;
        `}
      >
        <div
          css={css`
            display: grid;
            width: 100%;
            height: 20px;
            grid-template-columns: 1fr 1fr 1fr;
            margin-top: 10px;
          `}
        >
          <span
            css={css`
              font-family: "Euclid Circular B";
              font-size: 10px;
              margin-left: 9px;
            `}
          >
            Stake
          </span>
          <span
            css={css`
              font-family: "Euclid Circular B";
              font-size: 10px;
              margin-left: 7px;
            `}
          >
            Deposit
          </span>
          <span
            css={css`
              font-family: "Euclid Circular B";
              font-size: 10px;
              margin-left: 42px;
            `}
          >
            Earn
          </span>
        </div>
        <div
          css={css`
            display: flex;
            width: 100%;
            align-self: center;
            align-items: center;
            place-content: space-around;
          `}
        >
          <img src={MainnetSOLToken.icon} width="30" height="30" alt="" />
          <div
            css={css`
              width: 47px;
              height: 1px;
              background: white;
              position: relative;
            `}
          >
            <EndOfArrowRight />
          </div>
          <img src={MainnetLIDOSTSOLToken.icon} width="30" height="30" alt="" />
          <div
            css={css`
              width: 47px;
              height: 1px;
              background: white;
              position: relative;
            `}
          >
            <EndOfArrowRight />
          </div>
          <div
            css={css`
              display: flex;
              gap: 6px;
              align-items: center;
            `}
          >
            <img
              css={css`
                border-radius: 15px;
              `}
              height="30"
              width="30"
              src={fcstSOLIcon}
              alt=""
            />
            +
            <img
              src={ImportantAssetLogos["LDO"]}
              width="30"
              height="30"
              alt=""
            />
          </div>
        </div>
        <div
          css={css`
            display: grid;
            width: 100%;
            height: 20px;
            grid-template-columns: 1fr 1fr 1fr;
            margin-top: 4px;
          `}
        >
          <div />
          <span
            css={css`
              font-family: "Euclid Circular B";
              font-size: 12px;
              margin-left: 7px;
              color: #5ded39;
            `}
          >
            +{lidoStakedSolApy}
          </span>
          <div
            css={css`
              display: flex;
              width: 100%;
              align-self: center;
              align-items: center;
              justify-content: right;
            `}
          >
            <span
              css={css`
                font-family: "Euclid Circular B";
                font-size: 12px;
                color: #5ded39;
                margin-right: 14px;
              `}
            >
              +
              {apyFromData(
                selectedCard.data,
                yieldData ? yieldData.averagedEpochYield : null
              )}
            </span>
            <span
              css={css`
                font-family: "Euclid Circular B";
                font-size: 12px;
                color: #5ded39;
                margin-right: 5px;
              `}
            >
              +{lidoRewardsApy}
            </span>
          </div>
        </div>
      </div>
      <Button09
        onClick={() => {
          setIsLidoSectionExpanded(!isLidoSectionExpanded);
        }}
        className="analyticsButton"
      >
        More parameters
      </Button09>
    </GeneralInfoTable>
  );

  const extraInfoTable = (
    <GeneralInfoTable>
      {isCrabVolt && (
        <>
          <InfoRow>
            <InfoLabel>Profit range</InfoLabel>
            <InfoDatum
              css={(theme) =>
                css`
                  ${blackAndWhiteTextStyles(theme)};
                `
              }
            >
              {profitRangeStart && profitRangeEnd
                ? `$${profitRangeStart.toFixed(2)} - $${profitRangeEnd.toFixed(
                    2
                  )}`
                : "Loading..."}
            </InfoDatum>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Daily funding rate</InfoLabel>
            <InfoDatum
              css={(theme) =>
                css`
                  ${blackAndWhiteTextStyles(theme)};
                `
              }
            >
              {dailyFundingRate
                ? `${dailyFundingRate.toFixed(3)}%`
                : "Loading..."}
            </InfoDatum>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Implied volatility</InfoLabel>
            <InfoDatum
              css={(theme) =>
                css`
                  ${blackAndWhiteTextStyles(theme)};
                `
              }
            >
              {impliedVolatility
                ? `${impliedVolatility.toFixed(2)}%`
                : "Loading..."}
            </InfoDatum>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Delta exposure</InfoLabel>
            <InfoDatum
              css={(theme) =>
                css`
                  ${blackAndWhiteTextStyles(theme)};
                `
              }
            >
              {delta ? `${delta.toFixed(2)}%` : "Loading..."}
            </InfoDatum>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Collateral ratio</InfoLabel>
            <InfoDatum
              css={(theme) =>
                css`
                  ${blackAndWhiteTextStyles(theme)};
                `
              }
            >
              {collateralRatio ? `${collateralRatio}%` : "Loading..."}
            </InfoDatum>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Liquidation threshold</InfoLabel>
            <InfoDatum
              css={(theme) =>
                css`
                  ${blackAndWhiteTextStyles(theme)};
                `
              }
            >
              {liquidationThreshold ? `${liquidationThreshold}%` : "Loading..."}
            </InfoDatum>
          </InfoRow>
        </>
      )}
      {isBasisVolt && (
        <>
          <InfoRow>
            <InfoLabel>
              <InlineDocMissingLink content={basisFundingExplanation}>
                Total funding collected
              </InlineDocMissingLink>
            </InfoLabel>
            <InfoDatum
              css={(theme) =>
                css`
                  ${blackAndWhiteTextStyles(theme)};
                `
              }
            >
              {basisFunding ? `$${basisFunding.toFixed(2)}` : "Loading..."}
            </InfoDatum>
          </InfoRow>
          {/* <InfoRow>
            <InfoLabel>Leverage ratio</InfoLabel>
            <InfoDatum>
              {basisLeverageRatio
                ? `${basisLeverageRatio.toFixed(2)}x`
                : "Loading..."}
            </InfoDatum>
          </InfoRow> */}
          <InfoRow>
            <InfoLabel>
              <InlineDocMissingLink content={basisBorrowInterestExplanation}>
                Total borrow interest paid
              </InlineDocMissingLink>
            </InfoLabel>
            <InfoDatum
              css={(theme) =>
                css`
                  ${blackAndWhiteTextStyles(theme)};
                `
              }
            >
              {basisBorrowInterest
                ? `${basisBorrowInterest.toFixed(2)} ${
                    selectedCard.def.underlying.symbol
                  }`
                : "Loading..."}
            </InfoDatum>
          </InfoRow>
          <InfoRow>
            <InfoLabel>
              <InlineDocMissingLink content={basisSupplyInterestExplanation}>
                Total supply Interest received
              </InlineDocMissingLink>
            </InfoLabel>
            <InfoDatum
              css={(theme) =>
                css`
                  ${blackAndWhiteTextStyles(theme)};
                `
              }
            >
              {basisSupplyInterest
                ? `$${basisSupplyInterest.toFixed(2)}`
                : "Loading..."}
            </InfoDatum>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Mango account</InfoLabel>
            <InfoDatum
              css={(theme) =>
                css`
                  ${blackAndWhiteTextStyles(theme)};
                `
              }
            >
              {selectedCard.def.basisAccount ? (
                <a
                  href={`https://trade.mango.markets/account?pubkey=${selectedCard.def.basisAccount.toBase58()}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View position
                </a>
              ) : (
                "Loading..."
              )}
            </InfoDatum>
          </InfoRow>
        </>
      )}
      <InfoRow>
        <InfoLabel>Underlying asset</InfoLabel>

        <InfoDatum>
          <BlackAndWhiteText variant="bodyXl">
            <TokenLink
              network={network}
              token={selectedCard.def.underlying}
              useSolanaFm={selectedCard.def.globalId.includes("_eth")}
            />
          </BlackAndWhiteText>
        </InfoDatum>
      </InfoRow>
      <InfoRow>
        <InfoLabel>
          Capacity
          {/* <span
            className="clickableItem"
            onClick={() => setDenominationUSD(!denominationUSD)}
          >
            ↔
          </span> */}
        </InfoLabel>
        <InfoDatum
        // className="clickable"
        // onClick={() => setDenominationUSD(!denominationUSD)}
        >
          <InlineDocMissingLink
            css={(theme) =>
              css`
                ${blackAndWhiteTextStyles(theme)};
              `
            }
            content={
              selectedCard.data
                ? (isStablecoin(selectedCard.def.depositToken)
                    ? `${greatFloorLocaleN(
                        selectedCard.def,
                        selectedCard.data.totalDeposits,
                        0
                      )} ${selectedCard.def.depositToken.symbol}`
                    : "~" +
                      formatUSDRoundDown(
                        selectedCard.data.totalDeposits.mul(
                          selectedCard.data.markPrice
                        )
                      ) +
                      " / " +
                      formatUSDRoundDown(
                        selectedCard.data.capacity.mul(
                          selectedCard.data.markPrice
                        )
                      )) +
                  ` (${
                    dontUseRoundLocaleN(
                      selectedCard.data.totalDeposits
                        .div(selectedCard.data.capacity)
                        .mul(100),
                      1
                    ) + "%"
                  })`
                : "..."
            }
          >
            {selectedCard.data
              ? isStablecoin(selectedCard.def.depositToken)
                ? `${formatUSDRoundDown(
                    selectedCard.data.totalDeposits
                  )} / ${formatUSDRoundDown(selectedCard.data.capacity)}`
                : `${greatFloorLocaleN(
                    selectedCard.def,
                    selectedCard.data.totalDeposits,
                    0
                  )} / ${greatFloorLocaleN(
                    selectedCard.def,
                    selectedCard.data.capacity,
                    0
                  )}`
              : "..."}
            {isStablecoin(selectedCard.def.depositToken) ? null : (
              <> {selectedCard.def.depositToken.symbol}</>
            )}
          </InlineDocMissingLink>
        </InfoDatum>
      </InfoRow>
      {selectedCard.volt === 2 ? (
        <InfoRow>
          <InfoLabel>Quote asset</InfoLabel>
          <InfoDatum>
            <TokenLink
              css={(theme) =>
                css`
                  ${blackAndWhiteTextStyles(theme)};
                `
              }
              network={network}
              token={selectedCard.def.quote}
              useSolanaFm={selectedCard.def.globalId.includes("_eth")}
            />
          </InfoDatum>
        </InfoRow>
      ) : null}
      <InfoRow>
        <InfoLabel>
          <InlineDocMissingLink content={shareTokenOverviewExplanation}>
            Volt token
          </InlineDocMissingLink>
        </InfoLabel>
        <InfoDatum>
          <BlackAndWhiteText variant="bodyXs">
            1{" "}
            {selectedCard.data?.shareMint ? (
              <a
                css={(theme) =>
                  css`
                    ${blackAndWhiteTextStyles(theme)};
                  `
                }
                href={createExplorerLink(
                  selectedCard?.data.shareMint.toBase58(),
                  selectedCard.data.globalId.includes("_eth")
                    ? generateSolanaFmLink
                    : undefined
                )}
                target="_blank"
                rel="noreferrer"
              >
                {selectedCard.def.shareTokenSymbol}
              </a>
            ) : (
              "..."
            )}{" "}
            ={" "}
            {selectedCard.data?.sharePrice
              ? selectedCard.data.sharePrice.toFixed(5)
              : "..."}{" "}
            {selectedCard.def.depositToken.symbol}
          </BlackAndWhiteText>
        </InfoDatum>
      </InfoRow>
      <InfoRow>
        <InfoLabel>
          <InlineHoverDoc
            content={coingeckoPriceDisclaimer(
              coingeckoConversionReal[selectedCard.def.underlying.symbol]
            )}
          >
            {selectedCard.def.underlying.symbol} price
          </InlineHoverDoc>
        </InfoLabel>
        <InfoDatum>
          <BlackAndWhiteText variant="bodyXs">
            {markPrices
              ? formatUSDForPrice(
                  markPrices[selectedCard.def.underlying.symbol]
                )
              : "..."}
          </BlackAndWhiteText>
        </InfoDatum>
      </InfoRow>
      {selectedCard.def.volt === 1 ||
      selectedCard.def.volt === 2 ||
      selectedCard.def.volt === 3 ||
      selectedCard.def.volt === 5 ? (
        <InfoRow>
          <InfoLabel>
            {selectedCard.def.volt === 3
              ? "Last rebalance"
              : "Last traded option"}
          </InfoLabel>
          <InfoDatum>
            <BlackAndWhiteText variant="bodyXs">
              {lastTradedOption
                ? formatOptionProductShort(lastTradedOption.product)
                : "..."}
            </BlackAndWhiteText>
          </InfoDatum>
        </InfoRow>
      ) : null}
      {selectedCard.quoteAssetSymbol === "tsUSDC" ? (
        <InfoRow>
          <InfoLabel>Additional tsUSDC APY</InfoLabel>
          <InfoDatum>
            {" "}
            <BlackAndWhiteText
              css={css`
                font-weight: 500;
              `}
              variant="bodyXs"
            >
              5.87%
            </BlackAndWhiteText>
          </InfoDatum>
        </InfoRow>
      ) : null}
      <InfoRow>
        <InfoLabel>
          <InlineDocMissingLink content={autoCompoundingExplanation}>
            {selectedCard.data === null
              ? "..."
              : averagedEpochYield
              ? "Auto-compounding in"
              : "Epoch begins in"}
          </InlineDocMissingLink>
        </InfoLabel>
        <InfoDatum>
          <EpochCountdown
            css={(theme) =>
              css`
                ${blackAndWhiteTextStyles(theme)};
              `
            }
            isEntropy={
              selectedCard.def.volt === 3 || selectedCard.def.volt === 4
            }
          />
        </InfoDatum>
      </InfoRow>
      <InfoRow>
        <InfoLabel>
          <InlineDocMissingLink
            content={
              selectedCard?.volt === 5
                ? volt5FeesExplanation()
                : newFeesExplanation(selectedCard?.volt === 4)
            }
          >
            Fees
          </InlineDocMissingLink>
        </InfoLabel>
        <InfoDatum>
          <InlineDocMissingLink
            content={
              selectedCard?.volt === 5 ? (
                <div>
                  <span
                    css={css`
                      font-weight: 500;
                    `}
                  >
                    No fees for Genesis Wielders for
                  </span>
                  <br />
                  <span
                    css={css`
                      font-weight: 500;
                    `}
                  >
                    the first 2 weeks!
                  </span>
                  <br />
                  <br />
                  0% Performance fee
                  <br />
                  0% Withdrawal fee
                  <br />
                  0% Execution fee
                </div>
              ) : (
                <div>
                  10% Performance fee
                  <br />
                  0.1% Withdrawal fee
                  <br />
                  {selectedCard.data &&
                  selectedCard.data.aumFee !== null &&
                  selectedCard.data.aumFee !== 0
                    ? `${selectedCard.data.aumFee / 100}% (ann.) Execution fee`
                    : "0% Recurring management fee"}
                </div>
              )
            }
          >
            {selectedCard?.volt === 5 ? (
              <BlackAndWhiteText variant="bodyXs">
                0% / 0% / 0%
              </BlackAndWhiteText>
            ) : (
              <BlackAndWhiteText variant="bodyXs">
                10% / 0.1%
                {selectedCard.data &&
                selectedCard.data.aumFee !== null &&
                selectedCard.data.aumFee !== 0
                  ? ` / ${selectedCard.data.aumFee / 100}% (ann.)`
                  : ""}
              </BlackAndWhiteText>
            )}
          </InlineDocMissingLink>
        </InfoDatum>
      </InfoRow>
      {selectedCard.def.volt !== 5 && (
        <ButtonLink09
          to={`/analytics/${selectedCard.def.shareTokenSymbol}`}
          className="analyticsButton"
        >
          Analytics &amp; details
        </ButtonLink09>
      )}
    </GeneralInfoTable>
  );

  let iContainer: JSX.Element;

  let diaperWrapper = (
    <DiaperWrapper
      css={css`
        height: ${selectedCard.def.globalId === "mainnet_income_call_stsol" &&
        isLidoSectionExpanded &&
        page === "deposit"
          ? "242px"
          : ""};
      `}
    >
      <DiaperBody
        className={
          selectedCard.def.globalId === "mainnet_income_call_stsol" &&
          page === "deposit" &&
          isLidoSectionExpanded
            ? "expanded"
            : ""
        }
        css={css`
          transition: opacity 0.2s ease-in-out;

          &.expanded {
            opacity: 0;
          }
        `}
      >
        {extraInfoTable}
      </DiaperBody>
      {selectedCard.def.globalId === "mainnet_income_call_stsol" &&
        page === "deposit" && (
          <DiaperBody
            className={isLidoSectionExpanded ? "expanded" : ""}
            css={css`
              position: absolute;
              top: 0px;
              opacity: 0;
              transition: opacity 0.2s ease-in-out;
              z-index: -1;

              &.expanded {
                opacity: 0.8;
                z-index: 1;
              }
            `}
          >
            {extraLidoStakingInfoBox}
          </DiaperBody>
        )}
      {network === "devnet" ? (
        <div
          css={css`
            position: absolute;
            height: 24px;
            width: 24px;
            bottom: 0;
            right: 8px;
            background: url(${ConstructionWorker}) no-repeat;
            background-size: 24px 24px;
            opacity: 0.9;
          `}
        />
      ) : null}
    </DiaperWrapper>
  );

  const riskInfo = (
    <RiskInfoText>
      Higher Voltage = increased risk, defined by a higher probability of the
      option being exercised.
      <br /> In return for taking on increased risk, expected option premiums
      are higher, resulting in higher APYs.
      <br /> In flat markets, tactical traders can use Higher Voltage to take on
      a higher risk/reward landscape.
    </RiskInfoText>
  );

  // const VerticalColorBar = card.volt === 1 ? VerticalBlueBar : VerticalGreenBar;
  const ColorBar =
    card.volt === 1
      ? BlueNonAnimatedBar
      : card.volt === 2
      ? GreenNonAnimatedBar
      : card.volt === 3
      ? YellowNonAnimatedBar
      : card.volt === 4
      ? PinkNonAnimatedBar
      : card.volt === 5
      ? VioletNonAnimatedBar
      : RedNonAnimatedBar;
  let lowVoltageCardYieldData =
    lowVoltageCard && lowVoltageCard.def
      ? yieldDataPerVolt[lowVoltageCard.def.globalId]
      : null;

  let normalCardYieldData = yieldDataPerVolt[card.def.globalId];

  let highVoltageCardYieldData =
    highVoltageCard && highVoltageCard.def
      ? yieldDataPerVolt[highVoltageCard.def.globalId]
      : null;

  let voltageBoxes =
    highVoltageGlobalId || lowVoltageCard ? (
      <VoltageBoxContainer>
        <Popover destroyTooltipOnHide placement="bottom" content={riskInfo}>
          <VoltageTitleRow>
            <VoltageTitle>Select Risk Level</VoltageTitle>
            <span
              css={css`
                &:after {
                  content: "ⓘ";
                  color: #fff;
                  font-family: "Euclid Circular B";
                  font-size: 12px;
                  font-weight: bold;
                  opacity: 0.6;
                  margin-left: 6px;
                }
              `}
            ></span>
          </VoltageTitleRow>
        </Popover>
        <Boxes>
          <VoltageBox
            title={"Low Voltage"}
            apy={
              lowVoltageCard
                ? apyFromData(
                    lowVoltageCard.data,
                    lowVoltageCardYieldData
                      ? lowVoltageCardYieldData.averagedEpochYield
                      : null
                  )
                : apyFromData(
                    card.data,
                    normalCardYieldData
                      ? normalCardYieldData.averagedEpochYield
                      : null
                  )
            }
            deposits={card.def.format(
              lowVoltageCard
                ? lowVoltageCard.deposits?.totalDeposits
                : card.deposits?.totalDeposits
            )}
            isSelected={!isHighVoltageSelected}
            onClick={() => {
              setIsHighVoltageSelected(false);
            }}
            colorBar={!isHighVoltageSelected ? ColorBar : undefined}
          ></VoltageBox>
          <VoltageBox
            title={"High Voltage"}
            apy={apyFromData(
              highVoltageCard?.data ?? null,
              highVoltageCardYieldData
                ? highVoltageCardYieldData.averagedEpochYield
                : null
            )}
            deposits={selectedCard.def.format(
              highVoltageCard?.deposits?.totalDeposits ?? null
            )}
            isSelected={isHighVoltageSelected}
            onClick={() => {
              setIsHighVoltageSelected(true);
            }}
            colorBar={isHighVoltageSelected ? ColorBar : undefined}
          ></VoltageBox>
        </Boxes>
      </VoltageBoxContainer>
    ) : null;

  const loadingContainer = (
    <InteractionContainer
      autoComplete="off"
      onSubmit={(e) => e.preventDefault()}
      css={css`
        height: 267px;
        display: flex;
        color: hsl(230, 15%, 50%);
        justify-content: center;
        align-items: center;
      `}
    >
      <AsyncButton09Bolt
        css={css`
          visibility: visible;
          margin: 20px;
        `}
        src={Bolt}
      ></AsyncButton09Bolt>
      <span>loading...</span>
      <AsyncButton09Bolt
        css={css`
          visibility: visible;
          margin: 20px;
        `}
        src={Bolt}
        className="alternate"
      ></AsyncButton09Bolt>
    </InteractionContainer>
  );

  if (vfac09.loading) {
    iContainer = loadingContainer;
  } else {
    if (page === "deposit") {
      let totalAfterDeposit = new Decimal(0);
      if (parsedDepositAmount?.isPositive()) {
        totalAfterDeposit = totalAfterDeposit.add(parsedDepositAmount);
      }
      if (selectedCard.deposits?.totalDeposits?.isPositive()) {
        totalAfterDeposit = totalAfterDeposit.add(
          selectedCard.deposits.totalDeposits
        );
      }

      const crossChainTransactionFees = getCrossChainTransactionFees(
        selectedCard?.def?.wormholeAsset
      );
      const confirmDisable =
        selectedCard.def.volt === 5 &&
        !ownedTokenAccountsContext.isLightningOGHolder ? (
          <div>
            Lightning OG NFT Required! Get one{" "}
            <a
              href={"https://magiceden.io/marketplace/lightning_ogs"}
              target="_blank"
              rel="noreferrer"
              css={css`
                color: #ce56c2;
                &:hover {
                  color: #ff00dd;
                }
              `}
            >
              here
            </a>
            !
          </div>
        ) : selectedCard.def.canDepositsBeTurnedOff() &&
          selectedCard.data?.extraVaultData?.turnOffDepositsAndWithdrawals ? (
          "Volt is rebalancing..."
        ) : selectedCard.deposits?.claimableWithdrawals.greaterThan(0) ? (
          `You have an unclaimed withdrawal. Claim it in the Withdraw tab before depositing`
        ) : rawDepositAmount === "" ? (
          "Input amount is empty"
        ) : parsedDepositAmount === null ? (
          `Unable to parse input "${rawDepositAmount}"`
        ) : parsedDepositAmount.lessThanOrEqualTo(0) ? (
          "Amount needs to be greater than 0"
        ) : wormholeTransactionInfo === undefined &&
          depositTokenBalance &&
          parsedDepositAmount.greaterThan(depositTokenBalance) ? (
          `Amount is greater than wallet balance of ${selectedCard.def.format(
            depositTokenBalance
          )}`
        ) : selectedCard.def.depositToken.symbol === "SOL" &&
          selectedCard.deposits &&
          selectedCard.deposits?.depositTokenWalletBalance &&
          selectedCard.deposits.depositTokenWalletBalance
            .sub(parsedDepositAmount)
            .lessThan(0.008) ? (
          "Amount can not be the entire balance, because you need some SOL left for Solana network fees. Try using the max button"
        ) : wormholeTransactionInfo === undefined &&
          isUsingCrossChainDeposit &&
          selectedCard.def.wormholeAsset &&
          crossChainTransactionFees !== undefined &&
          nativeBalance
            .sub(parsedDepositAmount)
            .lessThan(crossChainTransactionFees) ? (
          `Amount can not be the entire balance, because you need some ${selectedCard.def.depositToken.symbol} left for network fees. Try using the max button`
        ) : isUsingCrossChainDeposit &&
          deposits10.solBalance &&
          deposits10.solBalance.lessThan(0.01) ? (
          "Not enough SOL for Solana network fees. Your Solana wallet should contain at least 0.01 SOL to pay for the network fees"
        ) : !selectedCard.deposits?.totalDeposits ? (
          `Waiting for data to load...`
        ) : totalAfterDeposit.greaterThan(
            selectedCard.data?.individualCapacity ?? 0
          ) ? (
          `Deposit amount exceeds individual deposit limit of ${
            selectedCard.data?.individualCapacity ?? 0
          } ${selectedCard.def.depositToken.symbol}`
        ) : selectedCard.data?.totalDeposits
            .add(totalAfterDeposit)
            .sub(selectedCard.deposits.totalDeposits)
            .greaterThan(selectedCard.data?.capacity ?? 0) ? (
          `Deposit would cause volt to exceed global deposit limit of ${
            selectedCard.data?.capacity ?? 0
          } ${selectedCard.def.depositToken.symbol}`
        ) : (
          false
        );

      const depositLabel =
        selectedCard.deposits?.claimableWithdrawals.greaterThan(0)
          ? `Claim required (see Withdraw tab)`
          : `Deposit ${
              parsedDepositAmount
                ? selectedCard.def.formatMaxWithoutSymbol(parsedDepositAmount) +
                  " "
                : ""
            }${
              isUsingCrossChainDeposit && selectedCard.def.wormholeAsset
                ? `via ${getChainNetworkNameFromAsset(
                    selectedCard.def.wormholeAsset
                  )}`
                : selectedCard.def.depositToken.symbol
            }`;

      const depositViaSolButton = (
        <ConfirmButtonWrapper className="confirmButton">
          <AsyncButton09
            theme={selectedCard.volt}
            disabled={confirmDisable ? confirmDisable : false}
            label={depositLabel}
            onClick={async (goodies) => {
              console.log("LETS DEPOSIT", parsedDepositAmount?.toString());
              if (
                selectedCard &&
                (await depositIntoVolt1(
                  goodies,
                  subvoltInfo,
                  ownedTokenAccountsContext,
                  parsedDepositAmount,
                  depositLabel,
                  undefined,
                  selectedCard.data?.extraVaultData ?? undefined
                ))
              ) {
                setDepositAmount("");
              }
            }}
          />
        </ConfirmButtonWrapper>
      );

      const isAmountInputDisabled =
        !!wormholeTransactionInfo &&
        isUsingCrossChainDeposit &&
        selectedCard.def.wormholeAsset
          ? getCrossChainDepositInProgressText(selectedCard.def.wormholeAsset)
          : false;
      const amountInput = (
        <div
          css={css`
            display: flex;
          `}
        >
          <AmountInput
            type="text"
            pattern="[0-9\.,]*"
            inputMode="decimal"
            onChange={(e) => {
              let value = e.target.value;
              if (!selectedCard?.def) {
                errorToast(
                  "App error on deposit/withdraw",
                  `Selected Card def not found`
                );
                close();
                return;
              }
              setDepositAmount(
                sanitizeInputNumber(
                  selectedCard.def.depositToken.decimals,
                  value,
                  rawDepositAmount
                )
              );
            }}
            value={rawDepositAmount}
            id="managementModalInput"
            placeholder={"0"}
            css={css`
              font-size: ${fontSizeReducer(rawDepositAmount)};
            `}
            maxLength={18}
            disabled={!!isAmountInputDisabled}
            // onInput={(e) => console.log(e.currentTarget.textContent)}
          />
          <InputSymbolContainer htmlFor={"managementModalInput"}>
            <InputSymbolText>
              {selectedCard.def.depositToken.symbol}{" "}
              <img src={selectedCard.def.depositToken.icon} alt="" />
            </InputSymbolText>
          </InputSymbolContainer>
        </div>
      );
      const isMaxDisabled =
        wallet === null
          ? "Connect your wallet"
          : isUsingCrossChainDeposit && depositTokenBalance === undefined
          ? "Connect cross chain wallet"
          : !depositTokenBalance
          ? false
          : depositTokenBalance.isZero()
          ? `No ${selectedCard.def.depositToken.symbol} in wallet`
          : isUsingCrossChainDeposit &&
            (!!wormholeTransactionInfo ||
              crossChainTransactionFees === undefined);

      const destinationTag = (
        <Tag
          disabled={wallet.isSafeApp}
          selected={isUsingCrossChainDeposit}
          onClick={() => {
            setDepositAmount("");
            setIsUsingCrossChainDeposit(true);
          }}
        >
          <img src={selectedCard.def.depositToken.icon} alt="" />
          {selectedCard.def.wormholeAsset && (
            <BlackAndWhiteText disabled={wallet.isSafeApp} variant="bodyS">
              {getTickerFromWormholeChainId(
                getChainIdFromAsset(selectedCard.def.wormholeAsset)
              )}
            </BlackAndWhiteText>
          )}
        </Tag>
      );

      iContainer = (
        <InteractionContainer
          autoComplete="off"
          onSubmit={(e) => e.preventDefault()}
        >
          <AmountInputContainer>
            <AmountInputRow>
              <Button09
                className="maxButton"
                disabled={isMaxDisabled}
                onClick={() => {
                  if (
                    selectedCard &&
                    selectedCard.deposits &&
                    depositTokenBalance
                  ) {
                    let depositableAmount = depositTokenBalance;
                    if (selectedCard.def.depositToken.symbol === "SOL") {
                      depositableAmount = depositableAmount.sub(0.00889);
                      if (depositableAmount.lessThanOrEqualTo(0)) {
                        depositableAmount = new Decimal(0);
                      } else {
                        depositableAmount = depositableAmount
                          .mul(10 ** (selectedCard.def.displayDecimals - 1))
                          .ceil()
                          .div(10 ** (selectedCard.def.displayDecimals - 1));
                      }
                    }

                    if (
                      isUsingCrossChainDeposit &&
                      crossChainTransactionFees !== undefined
                    ) {
                      depositableAmount = depositableAmount.sub(
                        crossChainTransactionFees
                      );
                      if (depositableAmount.lessThanOrEqualTo(0)) {
                        depositableAmount = new Decimal(0);
                      }
                    }

                    const individualMaxDepositable = new Decimal(
                      selectedCard.data?.individualCapacity ?? 0
                    ).sub(selectedCard.deposits.totalDeposits);
                    if (
                      individualMaxDepositable.isPositive() &&
                      individualMaxDepositable.lessThan(depositableAmount)
                    ) {
                      depositableAmount = individualMaxDepositable;
                    }
                    setDepositAmount(
                      selectedCard.def.formatMaxWithoutSymbol(depositableAmount)
                    );
                  }
                }}
              >
                <Typography
                  variant="bodyS"
                  css={(theme) =>
                    css`
                      color: ${!isMaxDisabled
                        ? theme.palette.mode === "dark"
                          ? "#FFF"
                          : "#000"
                        : theme.palette.mode === "dark"
                        ? "hsl(230, 15%, 60%)"
                        : theme.palette.grey[600]} !important;
                    `
                  }
                >
                  MAX
                </Typography>
              </Button09>
              {isAmountInputDisabled ? (
                <Popover
                  destroyTooltipOnHide
                  placement="bottom"
                  content={
                    <span css={css`display: block;max-width: 280px}`}>
                      {isAmountInputDisabled}
                    </span>
                  }
                  trigger="hover"
                >
                  {amountInput}
                </Popover>
              ) : (
                amountInput
              )}
              <ApproximateValue>
                <span>
                  {selectedCard.data && parsedDepositAmount
                    ? "≈" +
                      formatUSDCentsSilly(
                        parsedDepositAmount
                          .mul(selectedCard.data.markPrice)
                          .toNumber()
                      )
                    : rawDepositAmount === "..."
                    ? "≈" + formatUSDCentsRoundNearest(0)
                    : ""}
                </span>
              </ApproximateValue>
              <AmountInputRowHoverlayer />
            </AmountInputRow>
          </AmountInputContainer>
          {personalInfoTable}
          {personalDepositBreakdown}
          {generalInfoTable}
          {!selectedCard.def.wormholeAsset && depositViaSolButton}
          {selectedCard.def.wormholeAsset && (
            <>
              <CrossChainDepositContainer
                css={css`
                  margin-bottom: -22px;
                  margin-top: 16px;
                `}
              >
                <CrossChainDepositCard>
                  <ChainPickerContainer>
                    <InfoLabel>
                      <InlineDocMissingLink
                        content={getCrossChainDepositsExplanation(
                          selectedCard.def.wormholeAsset
                        )}
                      >
                        <GreyText variant="bodyS">Deposit From:</GreyText>
                      </InlineDocMissingLink>
                    </InfoLabel>
                    <TagRow>
                      <Tag
                        selected={!isUsingCrossChainDeposit}
                        onClick={() => {
                          setDepositAmount("");
                          setIsUsingCrossChainDeposit(false);
                        }}
                      >
                        <img src={ImportantAssetLogos.SOL} alt="" />
                        <BlackAndWhiteText variant="bodyS">
                          SOL
                        </BlackAndWhiteText>
                      </Tag>
                      {wallet.isSafeApp ? (
                        <Popover
                          trigger="hover"
                          destroyTooltipOnHide
                          placement="bottom"
                          content={snowflakeCrossChainDisabledText}
                        >
                          <span>{destinationTag}</span>
                        </Popover>
                      ) : (
                        destinationTag
                      )}
                    </TagRow>
                  </ChainPickerContainer>
                </CrossChainDepositCard>
              </CrossChainDepositContainer>
              {!isUsingCrossChainDeposit && depositViaSolButton}
              {isUsingCrossChainDeposit && (
                <CrossChainConnectButton
                  css={css({
                    height: "64px",
                  })}
                  chainId={getChainIdFromAsset(selectedCard.def.wormholeAsset)}
                  connectedComponent={(error) => {
                    if (
                      selectedCard?.def?.wormholeAsset &&
                      selectedCard?.def?.globalId
                    ) {
                      return (
                        <CrossChainDepositButton
                          error={error}
                          amount={parsedDepositAmount?.toString()}
                          wormholeAsset={selectedCard.def.wormholeAsset}
                          globalId={selectedCard.def.globalId}
                          theme={selectedCard.volt}
                          disabled={confirmDisable ? confirmDisable : false}
                          label={depositLabel}
                          refreshBalances={ownedTokenAccountsContext.refresh}
                          setIsUsingCrossChainDeposit={
                            setIsUsingCrossChainDeposit
                          }
                          onClick={async (goodies) => {
                            console.log(
                              "LETS DEPOSIT",
                              parsedDepositAmount?.toString()
                            );
                            if (selectedCard) {
                              const isSuccess = await depositIntoVolt1(
                                goodies,
                                subvoltInfo,
                                ownedTokenAccountsContext,
                                parsedDepositAmount,
                                depositLabel,
                                undefined,
                                // NOTE: shouldn put logic for this in registry 10 imo
                                selectedCard.data?.extraVaultData ?? undefined
                              );

                              if (isSuccess) {
                                setDepositAmount("");
                              }

                              return isSuccess;
                            }
                          }}
                        />
                      );
                    } else {
                      return null;
                    }
                  }}
                />
              )}
            </>
          )}
        </InteractionContainer>
      );
    } else if (page === "withdraw") {
      const confirmDisable = selectedCard.data?.extraVaultData
        ?.turnOffDepositsAndWithdrawals
        ? "Volt is rebalancing..."
        : rawWithdrawAmount === ""
        ? "Input amount is empty"
        : parsedWithdrawAmount === null
        ? `Unable to parse input "${rawWithdrawAmount}"`
        : parsedWithdrawAmount.lessThanOrEqualTo(0) &&
          (!deposits?.claimableWithdrawals ||
            deposits.claimableWithdrawals.equals(0))
        ? "Amount needs to be greater than 0"
        : selectedCard.deposits &&
          selectedCard.deposits.maxWithdrawableAmount &&
          parsedWithdrawAmount.greaterThan(
            selectedCard.deposits.maxWithdrawableAmount
          )
        ? `Withdrawal amount is greater than your max withdrawable amount of ${selectedCard.def.formatMaxWithoutSymbol(
            selectedCard.deposits.maxWithdrawableAmount
          )} ${selectedCard.def.depositToken.symbol}`
        : !selectedCard.deposits?.totalDeposits
        ? `Waiting for data to load...`
        : false;

      let buttonLabel = `Withdraw ${
        selectedCard.deposits && parsedWithdrawAmount
          ? selectedCard.def.formatMaxWithoutSymbol(
              selectedCard.deposits.claimableWithdrawals.plus(
                parsedWithdrawAmount
              )
            ) + " "
          : parsedWithdrawAmount
          ? selectedCard.def.formatMaxWithoutSymbol(parsedWithdrawAmount) + " "
          : ""
      }${selectedCard.def.depositToken.symbol}${
        parsedWithdrawAmount !== null && selectedCard.def.volt !== 5
          ? ` (-0.1% fee)`
          : ""
      }`;

      if (
        selectedCard.deposits?.claimableWithdrawals.greaterThan(0) &&
        (rawWithdrawAmount === "" || parsedWithdrawAmount?.lessThanOrEqualTo(0))
      ) {
        buttonLabel = `Claim ${selectedCard.def.format(
          selectedCard.deposits.claimableWithdrawals
        )}`;
      } else if (
        selectedCard.deposits?.mintableShares.greaterThan(0) &&
        rawWithdrawAmount === ""
      ) {
        buttonLabel = `Mint ${selectedCard.def.shareTokenSymbol} shares`;
        // buttonLabel = `Mint ${selectedCard.def.depositToken.format(
        //   selectedCard.deposits?.mintableShares,
        //   selectedCard.def.shareTokenSymbol
        // )} shares`;
      }
      const isWithdrawMaxButtonDisabled = !wallet.connected
        ? "Connect your wallet"
        : !deposits?.maxWithdrawableAmount
        ? "Deposit information not yet loaded"
        : deposits?.maxWithdrawableAmount.isZero()
        ? deposits?.pendingDeposits.gt(0)
          ? "You only have pending deposits. Pending deposits are not withdrawable. You will be able to initiate a withdraw after your pending deposit finalizes. Your pending deposits will be finalized at the end of the current epoch"
          : "No deposits yet"
        : false;
      iContainer = (
        <InteractionContainer autoComplete="off">
          <AmountInputContainer>
            <AmountInputRow>
              <Button09
                disabled={isWithdrawMaxButtonDisabled}
                className={"maxButton"}
                onClick={() => {
                  if (selectedCard && deposits?.maxWithdrawableAmount) {
                    setWithdrawAmount(
                      selectedCard.def.formatMaxWithoutSymbol(
                        deposits.maxWithdrawableAmount
                      )
                    );
                  } else {
                    setWithdrawAmount("0");
                  }
                }}
              >
                <Typography
                  variant="bodyS"
                  css={(theme) =>
                    css`
                      color: ${!isWithdrawMaxButtonDisabled
                        ? theme.palette.mode === "dark"
                          ? "#FFF"
                          : "#000"
                        : theme.palette.mode === "dark"
                        ? "hsl(230, 15%, 60%)"
                        : theme.palette.grey[600]} !important;
                    `
                  }
                >
                  max
                </Typography>
              </Button09>
              <AmountInput
                type="text"
                pattern="[0-9\.,]*"
                inputMode="decimal"
                onChange={(e) => {
                  let value = e.target.value;
                  if (!selectedCard?.def) {
                    errorToast(
                      "App error on deposit/withdraw",
                      `Selected Card def not found`
                    );
                    close();
                    return;
                  }
                  setWithdrawAmount(
                    sanitizeInputNumber(
                      selectedCard.def.depositToken.decimals,
                      value,
                      rawWithdrawAmount
                    )
                  );
                }}
                value={rawWithdrawAmount}
                id="managementModalInput"
                placeholder={"0.0"}
                css={css`
                  font-size: ${fontSizeReducer(rawWithdrawAmount)};
                `}
                maxLength={18} // JS number does some rounding
                // onInput={(e) => console.log(e.currentTarget.textContent)}
              />
              <InputSymbolContainer htmlFor={"managementModalInput"}>
                <InputSymbolText>
                  {selectedCard.def.depositToken.symbol}{" "}
                  <img src={selectedCard.def.depositToken.icon} alt="" />
                </InputSymbolText>
              </InputSymbolContainer>
              <ApproximateValue>
                <span>
                  {selectedCard.data && parsedWithdrawAmount
                    ? "≈" +
                      formatUSDCentsSilly(
                        parsedWithdrawAmount
                          .mul(selectedCard.data.markPrice)
                          .toNumber()
                      )
                    : rawDepositAmount === "..."
                    ? "≈" + formatUSDCentsRoundNearest(0)
                    : ""}
                </span>
              </ApproximateValue>
              <AmountInputRowHoverlayer />
            </AmountInputRow>
          </AmountInputContainer>
          {personalInfoTable}
          {personalDepositBreakdown}
          {generalInfoTable}
          <ConfirmButtonWrapper className="confirmButton">
            <AsyncButton09
              theme={selectedCard.volt}
              disabled={
                (selectedCard.deposits?.claimableWithdrawals.greaterThan(0) ||
                  selectedCard.deposits?.mintableShares.greaterThan(0)) &&
                rawWithdrawAmount === ""
                  ? false
                  : confirmDisable
                  ? confirmDisable
                  : false
              }
              label={buttonLabel}
              onClick={async (goodies) => {
                if (
                  await withdrawFromVolt1(
                    goodies,
                    subvoltInfo,
                    ownedTokenAccountsContext,
                    deposits?.estimatedTotalUnderlyingWithoutPending,
                    parsedWithdrawAmount ?? new Decimal(0),
                    buttonLabel,
                    selectedCard?.data?.extraVaultData ?? undefined
                  )
                ) {
                  setWithdrawAmount("");
                }
              }}
            />
          </ConfirmButtonWrapper>
          {(selectedCard.def?.globalId === "mainnet_income_call_ftt" ||
            selectedCard.def?.globalId === "mainnet_income_call_eth") && (
            <ConfirmButtonWrapper
              className="claimButton"
              css={css`
                padding: 0 20px 22px 20px;
                margin-top: -6px;
              `}
            >
              <AsyncButton09
                theme={selectedCard.volt}
                label={`Possibly Claim Old ${selectedCard.def.depositToken.symbol}`}
                onClick={async (goodies) => {
                  await claimPendingWithdraw(
                    goodies,
                    subvoltInfo,
                    ownedTokenAccountsContext,
                    selectedCard?.def?.globalId === "mainnet_income_call_ftt"
                      ? new PublicKey(
                          "AGFEad2et2ZJif9jaGpdMixQqvW5i81aBdvKe7PHNfz3"
                        )
                      : new PublicKey(
                          "2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk"
                        ),
                    "Claim",
                    selectedCard?.data?.extraVaultData ?? undefined
                  );
                }}
              />
            </ConfirmButtonWrapper>
          )}
        </InteractionContainer>
      );
    } else if (page === "swap") {
      if (tokenList.length === 0) {
        iContainer = loadingContainer;
      } else {
        let confirmDisable: string | false = false;

        let buttonLabel = `Swap into ${selectedCard.def.depositToken.name}`;

        const ioTable = (
          <CompactInfoTable>
            <InfoRow>
              <InfoLabel>
                <InlineDocMissingLink
                  content={swapInputExplanation(swapToken.symbol)}
                >
                  Input balance
                </InlineDocMissingLink>
              </InfoLabel>
              <InfoDatum>
                <BlackAndWhiteText variant="bodyXl">
                  {!wallet.connected ? (
                    <span className="greyed">not connected</span>
                  ) : (
                    swapTokenBalance.toString() + " " + swapToken.symbol
                  )}
                </BlackAndWhiteText>
              </InfoDatum>
            </InfoRow>
            <InfoRow>
              <InfoLabel>
                <InlineDocMissingLink
                  content={swapOutputExplanation(
                    selectedCard.def.depositToken.symbol
                  )}
                >
                  Output balance
                </InlineDocMissingLink>
              </InfoLabel>
              <InfoDatum>
                <BlackAndWhiteText variant="bodyXl">
                  {selectedCard.def.depositToken.format(
                    selectedCard?.deposits?.depositTokenWalletBalance
                  )}
                </BlackAndWhiteText>
              </InfoDatum>
            </InfoRow>
          </CompactInfoTable>
        );

        const cleanedReceiveAmount = bestRoute
          ? bestRoute.inAmount === parsedSwapAmountUnit
            ? selectedCard.def.depositToken.normalize(bestRoute.outAmount)
            : null
          : null;
        // console.log(bestRoute);

        const swapResult = (
          <CompactInfoTable>
            <InfoRow>
              <InfoLabel>
                <InlineDocMissingLink content={swapYouPayExplanation}>
                  You pay
                </InlineDocMissingLink>
              </InfoLabel>
              <InfoDatum>
                <BlackAndWhiteText variant="bodyXl">
                  {bestRoute && parsedSwapAmount
                    ? parsedSwapAmount.toNumber().toLocaleString("en-US") +
                      " " +
                      swapToken.symbol
                    : null}
                </BlackAndWhiteText>
              </InfoDatum>
            </InfoRow>
            <InfoRow>
              <InfoLabel>
                <InlineDocMissingLink content={swapYouReceiveExplanation}>
                  You receive
                </InlineDocMissingLink>
              </InfoLabel>
              <InfoDatum>
                <BlackAndWhiteText variant="bodyXl">
                  {bestRoute
                    ? cleanedReceiveAmount
                      ? "~" +
                        selectedCard.def.depositToken.format(
                          cleanedReceiveAmount
                        )
                      : `... ${selectedCard.def.depositToken.symbol}`
                    : null}
                </BlackAndWhiteText>
              </InfoDatum>
            </InfoRow>
            <InfoRow>
              <InfoLabel>
                <InlineDocMissingLink content={swapRentExplanation}>
                  Solana rent
                </InlineDocMissingLink>
              </InfoLabel>
              <InfoDatum>
                <BlackAndWhiteText variant="bodyXl">
                  {/* TODO fix this poop */}
                  {depositAndFee?.ataDeposits !== undefined
                    ? depositAndFee.ataDeposits.length === 0
                      ? "0"
                      : dontUseRoundingUnlessAbsolutelyNecessaryN(
                          new Decimal(
                            depositAndFee.ataDeposits.reduce(
                              (partialSum, a) => partialSum + a,
                              0
                            ) /
                              10 ** 9
                          ),
                          5
                        ).toString()
                    : "..."}{" "}
                  SOL
                </BlackAndWhiteText>
              </InfoDatum>
            </InfoRow>
          </CompactInfoTable>
        );

        let priceString: string = "...";

        if (
          parsedSwapAmount &&
          cleanedReceiveAmount &&
          jupiter.loading === false
        ) {
          priceString = priceInverted
            ? `${
                bestRoute
                  ? Number(
                      (
                        parsedSwapAmount.toNumber() /
                        cleanedReceiveAmount.toNumber()
                      ).toPrecision(4)
                    ).toString()
                  : "..."
              } ${swapToken.symbol} = 1 ${selectedCard.def.depositToken.symbol}`
            : `1 ${swapToken.symbol} = ${
                bestRoute
                  ? Number(
                      (
                        cleanedReceiveAmount.toNumber() /
                        parsedSwapAmount.toNumber()
                      ).toPrecision(4)
                    ).toString()
                  : "..."
              } ${selectedCard.def.depositToken.symbol}`;
        }

        let platformFeeBips = 0;
        if (bestRoute && bestRoute.marketInfos.length > 0) {
          const lastMarketInfo =
            bestRoute.marketInfos[bestRoute.marketInfos.length - 1];
          // console.log(lastMarketInfo.outputMint.toBase58());
          // console.log(lastMarketInfo);
          platformFeeBips = lastMarketInfo.platformFee.pct;
        }

        const swapDetailsTable = (
          <GeneralInfoTable>
            <InfoRow>
              <InfoLabel className="clickable">
                <InlineDocMissingLink content={swapRateExplanation}>
                  <span
                    className="clickableItem"
                    onClick={() => setPriceInverted(!priceInverted)}
                  >
                    Rate ↔
                  </span>
                </InlineDocMissingLink>
              </InfoLabel>
              <InfoDatum
                className="clickable"
                onClick={() => setPriceInverted(!priceInverted)}
              >
                <InlineDocMissingLink content={swapRateExplanation}>
                  <BlackAndWhiteText variant="bodyXs">
                    {priceString}
                  </BlackAndWhiteText>
                </InlineDocMissingLink>
              </InfoDatum>
            </InfoRow>
            <InfoRow>
              <InfoLabel>
                <InlineDocMissingLink content={swapProtocolsExplanation}>
                  Protocols
                </InlineDocMissingLink>
              </InfoLabel>
              <InfoDatum>
                <BlackAndWhiteText variant="bodyXs">
                  {swapRouteParsed}
                </BlackAndWhiteText>
              </InfoDatum>
            </InfoRow>
            <InfoRow>
              <InfoLabel>
                <InlineDocMissingLink content={swapProtocolsExplanation}>
                  Route
                </InlineDocMissingLink>
              </InfoLabel>
              <InfoDatum>
                <BlackAndWhiteText variant="bodyXs">
                  {swapCurrenciesParsed}
                </BlackAndWhiteText>
              </InfoDatum>
            </InfoRow>

            <InfoRow>
              <InfoLabel>
                <InlineDocMissingLink content={swapPlatformFeeExplanation}>
                  Platform fee{" "}
                  {window.location.hostname === "localhost" &&
                  publicKey?.toBase58() ===
                    "57RuPF5cKpzo8ZdN9kqeGTWAfqrYQbhHhatNF1rXyFcS" ? (
                    <AsyncButton09
                      label={"Create all"}
                      onClick={async (goodies) => {
                        return createSomeMorePlatformFeeATAs(goodies);
                      }}
                    />
                  ) : null}
                </InlineDocMissingLink>
              </InfoLabel>
              <InfoDatum>
                <BlackAndWhiteText variant="bodyXs">
                  {platformFeeBips}%
                </BlackAndWhiteText>
              </InfoDatum>
            </InfoRow>
          </GeneralInfoTable>
        );

        let originalButtonLabel = buttonLabel;
        if (publicKey !== null) {
          let rentMin = false;
          let adjustedBalance = new Decimal(0);

          if (swapTokenBalance) {
            if (swapToken.symbol === "SOL" && swapTokenBalance.gt(0)) {
              adjustedBalance = swapTokenBalance.sub(
                Math.max(
                  0.00889,
                  depositAndFee
                    ? depositAndFee.ataDeposits.reduce(
                        (partialSum, a) => partialSum + a,
                        0
                      ) /
                        10 ** 9
                    : 0
                )
              );
              if (
                adjustedBalance.lt(0) ||
                (parsedSwapAmount &&
                  adjustedBalance.lt(parsedSwapAmount) &&
                  swapTokenBalance.gte(parsedSwapAmount))
              ) {
                adjustedBalance = new Decimal(0);

                buttonLabel = `Insufficient SOL for rent`;

                confirmDisable =
                  "A bit of SOL is needed to pay for Solana fees and rent. This amount would not leave enough SOL for future rent fees";
                rentMin = true;
              }
            }
          }

          if (!rentMin && parsedSwapAmount) {
            if (swapTokenBalance.lt(parsedSwapAmount)) {
              buttonLabel = `Insufficient ${swapToken.symbol}`;
              confirmDisable = `Amount to swap is greater than your wallet balance of ${swapTokenBalance.toString()} ${
                swapToken.symbol
              }`;
            }
          }
        }

        if (originalButtonLabel === buttonLabel) {
          if (parsedSwapAmount === null || parsedSwapAmount.lte(0)) {
            confirmDisable = "Input amount is 0";
          } else if (
            jupiter.loading ||
            bestRoute?.inAmount !== parsedSwapAmountUnit
          ) {
            confirmDisable =
              "Searching for best route... (if this doesn't finish searching, try a bigger amount or different token)";
          } else if (bestRoute?.inAmount === 0 && bestRoute?.outAmount === 0) {
            buttonLabel = `Swap amount too small`;
            confirmDisable = "Try swapping with a bigger amount";
          }
        }
        const isSwapMaxButtonDisabled = !wallet.connected
          ? "Connect wallet to see balance"
          : swapTokenBalance && swapTokenBalance.eq(0)
          ? "Swap token balance is 0"
          : false;
        iContainer = (
          <InteractionContainer autoComplete="off">
            <AmountInputContainer>
              <AmountInputRow>
                <Button09
                  disabled={isSwapMaxButtonDisabled}
                  className={"maxButton"}
                  onClick={() => {
                    if (swapTokenBalance) {
                      if (swapToken.symbol === "SOL") {
                        let reducedAmount = swapTokenBalance.sub(0.00889);
                        if (reducedAmount.lt(0)) {
                          reducedAmount = new Decimal(0);
                        }
                        setSwapAmount(reducedAmount.toString());
                      } else {
                        setSwapAmount(swapTokenBalance.toString());
                      }
                    }
                  }}
                >
                  <Typography
                    variant="bodyS"
                    css={(theme) =>
                      css`
                        color: ${!isSwapMaxButtonDisabled
                          ? theme.palette.mode === "dark"
                            ? "#FFF"
                            : "#000"
                          : theme.palette.mode === "dark"
                          ? "hsl(230, 15%, 60%)"
                          : theme.palette.grey[600]} !important;
                      `
                    }
                  >
                    max
                  </Typography>
                </Button09>
                <AmountInput
                  type="text"
                  pattern="[0-9\.,]*"
                  inputMode="decimal"
                  onChange={(e) => {
                    let value = e.target.value;

                    setSwapAmount(
                      sanitizeInputNumber(
                        swapToken.decimals,
                        value,
                        rawSwapAmount
                      )
                    );
                  }}
                  value={rawSwapAmount}
                  id="managementModalInput"
                  placeholder={"0.0"}
                  css={css`
                    font-size: ${fontSizeReducerSteeper(rawSwapAmount)};
                  `}
                  maxLength={18} // JS number does some rounding
                  // onInput={(e) => console.log(e.currentTarget.textContent)}
                />
                <InputSymbolContainerPickable
                  htmlFor={"managementModalInput"}
                  css={css``}
                >
                  <Popover
                    destroyTooltipOnHide
                    overlayClassName="mediumOverlay"
                    placement="bottomRight"
                    trigger="click"
                    visible={visible}
                    onVisibleChange={handleVisibleChange}
                    content={
                      <AssetPickList
                        jupSupportedTokensOwnedByUser={
                          jupSupportedTokensOwnedByUser
                        }
                        selectAsset={updateSwapTokenAndAmount}
                        hide={hide}
                      />
                    }
                  >
                    <span css={button09Styles} className="selectAssetButton">
                      <InputSymbolText>
                        {swapToken.symbol}{" "}
                        <img src={swapToken.logoURI || ""} alt="" />
                      </InputSymbolText>
                      <KeyboardArrowDownIcon className="downIcon" />
                    </span>
                  </Popover>
                </InputSymbolContainerPickable>
                <AmountInputRowHoverlayer />
              </AmountInputRow>
            </AmountInputContainer>
            {ioTable}
            {swapResult}
            <ConfirmButtonWrapper className="confirmButton">
              <AsyncButton09
                theme={selectedCard.volt}
                disabled={confirmDisable}
                label={buttonLabel}
                onClick={async (goodies) => {
                  type SwapResult =
                    | {
                        txid: string;
                        inputAddress: PublicKey;
                        outputAddress: PublicKey;
                        inputAmount: number | undefined;
                        outputAmount: number | undefined;
                      }
                    | {
                        error?: TransactionError;
                      };
                  try {
                    if (!bestRoute) {
                      handleTxWrappedErrorToast(
                        goodies.label,
                        "No best route found"
                      );
                      return;
                    }
                    const result = jupiter.exchange({
                      //@ts-ignore
                      wallet: goodies.providerMut.wallet,
                      routeInfo: bestRoute,
                      confirmationWaiterFactory: async (txid: any) => {
                        console.log("sending transaction");
                        await readonlyProvider.connection.confirmTransaction(
                          txid
                        );
                        handleTxWrappedPendingInfoToast(
                          goodies.label,
                          txid,
                          createExplorerLink
                        );
                        console.log("confirmed transaction");

                        return await readonlyProvider.connection.getTransaction(
                          txid,
                          {
                            commitment: "confirmed",
                          }
                        );
                      },
                    });

                    // await didn't work for some reason
                    return result
                      .then((swapResult: SwapResult) => {
                        if ("error" in swapResult) {
                          const message = swapResult.error?.toString()
                            ? "Jupiter Aggregator error: " +
                              swapResult.error.toString() +
                              " (please try again in a bit or use a different amount)"
                            : "Unknown error in jup.ag swap result";
                          handleTxWrappedErrorToast(goodies.label, message);
                        } else if ("txid" in swapResult) {
                          const outputAmount = swapResult.outputAmount;
                          if (!selectedCard?.def) {
                            errorToast(
                              "App error on deposit/withdraw",
                              `Selected Card def not found`
                            );
                            close();
                            return;
                          }
                          const outputAmountString = outputAmount
                            ? selectedCard.def.depositToken.format(
                                selectedCard.def.depositToken.normalize(
                                  outputAmount
                                )
                              )
                            : selectedCard.def.depositToken.symbol;
                          // Don't log any success here because it is already handled above
                          successToast(
                            goodies.label + " success",
                            `Successfully swapped ${swapToken.symbol} for ${outputAmountString}`
                          );
                          console.log(swapResult);
                          deposits10.refresh();
                        } else {
                          const message =
                            "Unexpected swap result from jup.ag. " +
                            JSON.stringify(swapResult);
                          handleTxWrappedErrorToast(goodies.label, message);
                          deposits10.refresh();
                        }
                      })
                      .catch((e) => {
                        console.error(e);
                        if (e instanceof Error) {
                          handleTxWrappedErrorToast(
                            goodies.label,
                            "Error using jup.ag: " + e.toString()
                          );
                        }
                      });
                  } catch (e) {
                    console.error(e);
                    if (e instanceof Error) {
                      handleTxWrappedErrorToast(
                        goodies.label,
                        "Error using jupiter.exchange: " + e.toString()
                      );
                    }
                  }
                }}
              />
            </ConfirmButtonWrapper>
          </InteractionContainer>
        );

        diaperWrapper = (
          <DiaperWrapper>
            <DiaperBody>
              <DiaperBodyText>
                Easily swap any token into{" "}
                <TokenLink
                  network={network}
                  token={selectedCard.def.underlying}
                  useSolanaFm={selectedCard.def.globalId.includes("_eth")}
                />
                . Swap is powered by{" "}
                <a href="https://jup.ag/" target="_blank" rel="noreferrer">
                  Jupiter Aggregator
                </a>
                .
              </DiaperBodyText>
              {swapDetailsTable}
            </DiaperBody>
          </DiaperWrapper>
        );
      }
    } else if (page === "stake" && selectedCard.def.quarrySingleMine) {
      const stakedToken = selectedCard.def.quarrySingleMine.stakedToken;
      // If we just made a transaction, we expect balance to be more than 0
      let filteredAvailable = selectedCard.deposits?.sharesInWallet;
      if (!filteredAvailable || filteredAvailable.isZero()) {
        // zero
        if (expectingPositiveBalance[`wallet:${stakedToken}`]) {
          // and expecting positive
          filteredAvailable = undefined;
        }
      } else {
        // positive balance
        if (expectingPositiveBalance[`wallet:${stakedToken}`]) {
          setExpectingPositiveBalance((prevState) => {
            let newExpecting = {
              ...prevState,
            };
            delete newExpecting[`wallet:${stakedToken}`];
            return newExpecting;
          });
        }
      }

      let filteredStaked = selectedCard.deposits?.singleQuarryDeposits;
      if (!filteredStaked || filteredStaked.isZero()) {
        // zero
        if (expectingPositiveBalance[`quarry:${stakedToken}`]) {
          // and expecting positive
          filteredStaked = undefined;
        }
      } else {
        // positive balance
        if (expectingPositiveBalance[`quarry:${stakedToken}`]) {
          setExpectingPositiveBalance((prevState) => {
            let newExpecting = {
              ...prevState,
            };
            delete newExpecting[`quarry:${stakedToken}`];
            return newExpecting;
          });
        }
      }
      const quarryDPR = quarryData[selectedCard.def.globalId];

      const stakeInfoTable = (
        <CompactInfoTable>
          <InfoRow>
            <InfoLabel>
              <InlineDocMissingLink
                content={`The amount of volt tokens that you can stake. This number corresponds to the number of ${selectedCard.def.shareTokenSymbol} tokens in your wallet`}
              >
                Available to stake
              </InlineDocMissingLink>
            </InfoLabel>
            <InfoDatum>
              {selectedCard.def.depositToken.format(
                filteredAvailable,
                selectedCard.def.shareTokenSymbol
              )}
              {/* Need the share token balance, not the deposit token abalnce */}
              {/* {selectedCard.def.depositToken.format(
                selectedCard.deposits?.depositTokenWalletBalance,
                selectedCard.def.shareTokenSymbol
              )} */}
            </InfoDatum>
          </InfoRow>
          <InfoRow>
            <InfoLabel>
              <InlineDocMissingLink
                content={`The amount of ${selectedCard.def.shareTokenSymbol} staked and earning rewards`}
              >
                Staked amount
              </InlineDocMissingLink>
            </InfoLabel>
            <InfoDatum>
              {selectedCard.def.depositToken.format(
                filteredStaked,
                selectedCard.def.shareTokenSymbol
              )}
            </InfoDatum>
          </InfoRow>
        </CompactInfoTable>
      );
      const apyInfoTable = (
        <GeneralInfoTable>
          <InfoRow>
            <InfoLabel>
              <InlineDocMissingLink
                content={`The projected APY earned by the Friktion strategy. Does NOT include staking rewards`}
              >
                Volt strategy APY
              </InlineDocMissingLink>
            </InfoLabel>
            <InfoDatum>
              {apyFromData(
                selectedCard.data,
                yieldData ? yieldData.averagedEpochYield : null
              )}
            </InfoDatum>
          </InfoRow>
          <InfoRow>
            <InfoLabel>
              <InlineDocMissingLink
                content={`The Friktion strategy APY plus the staking APR`}
              >
                Total APY
              </InlineDocMissingLink>
            </InfoLabel>
            <InfoDatum>
              {quarryDPR !== null && selectedCard.data
                ? Number(
                    apyNumberFromData(selectedCard.data, averagedEpochYield) +
                      quarryDPR * 365
                  ).toFixed(1)
                : "..."}
              %
            </InfoDatum>
          </InfoRow>
        </GeneralInfoTable>
      );
      iContainer = selectedCard.def.quarrySingleMine ? (
        <InteractionContainer autoComplete="off">
          <DualTopConfirmButtonWrapper className="confirmButton">
            <QuarryStakeButton
              selectedCard={selectedCard}
              qsm={selectedCard.def.quarrySingleMine}
              sharesInWallet={selectedCard.deposits?.sharesInWallet}
              setExpectingPositiveBalance={setExpectingPositiveBalance}
            />
            <QuarryUnstakeButton
              selectedCard={selectedCard}
              qsm={selectedCard.def.quarrySingleMine}
              setExpectingPositiveBalance={setExpectingPositiveBalance}
            />
          </DualTopConfirmButtonWrapper>
          {stakeInfoTable}
          {apyInfoTable}
          <StakeRewardsContainer>
            <StakeRewardsBox>
              {selectedCard.def.quarrySingleMine ? (
                <SingleQuarryRewardCounter
                  walletKey={publicKey ? publicKey : undefined}
                  quarrySingleMine={selectedCard.def.quarrySingleMine}
                  voltNum={selectedCard.volt}
                  quarryDPR={quarryDPR ?? undefined}
                />
              ) : null}{" "}
            </StakeRewardsBox>
          </StakeRewardsContainer>
          <div
            css={css`
              background: red;
            `}
          ></div>
          {selectedCard.deposits?.pendingDeposits.gt(0) ? (
            <StakeWarningContainer>
              <StakeWarningBox>
                You have{" "}
                {selectedCard.def.depositToken.format(
                  selectedCard.deposits?.pendingDeposits
                )}{" "}
                of pending deposits. On the next epoch, you can mint your volt
                tokens on the "Withdraw" tab, and then stake these new volt
                tokens here
              </StakeWarningBox>
            </StakeWarningContainer>
          ) : null}
        </InteractionContainer>
      ) : (
        <div>Big bug</div>
      );

      diaperWrapper = (
        <DiaperWrapper>
          <DiaperBody>
            <DiaperBodyText>
              Earn extra rewards by staking your{" "}
              {selectedCard.def.shareTokenSymbol} volt tokens. You can instantly
              unstake into {selectedCard.def.shareTokenSymbol} at any time.
            </DiaperBodyText>
          </DiaperBody>
          <GeneralInfoTable>
            <InfoRow>
              <InfoLabel>Liquidity mining platform</InfoLabel>
              <InfoDatum>
                <InlineDocMissingLink content={quarryExplanation}>
                  Quarry
                </InlineDocMissingLink>
              </InfoDatum>
            </InfoRow>
            <InfoRow>
              <InfoLabel>One-time Solana rent fee</InfoLabel>
              <InfoDatum>
                <InlineDocMissingLink
                  content={
                    "A non-refundable amount of rent charged by the Solana network in order to earn these staking rewards"
                  }
                >
                  0.00802 SOL
                </InlineDocMissingLink>
              </InfoDatum>
            </InfoRow>
          </GeneralInfoTable>
        </DiaperWrapper>
      );
    } else if (
      page === "stake" &&
      selectedCard.def.doesHaveAutomatedEmissions
    ) {
      /** this is for when emissions are automated (i.e. stSOL volt) */

      const stakeInfoTable = (
        <CompactInfoTable
          css={css`
            padding: 20px 35px 0 35px;
          `}
        >
          <InfoRow>
            <InfoLabel>
              <InlineDocMissingLink
                content={`The amount of ${selectedCard.def.shareTokenSymbol} staked and earning rewards`}
              >
                Staked amount
              </InlineDocMissingLink>
            </InfoLabel>
            <InfoDatum>
              {!wallet.connected ? (
                <span className="greyed">not connected</span>
              ) : (
                selectedCard.def.format(selectedCard.deposits?.deposits)
              )}
            </InfoDatum>
          </InfoRow>
        </CompactInfoTable>
      );
      const apyInfoTable = (
        <GeneralInfoTable>
          <InfoRow>
            <InfoLabel>
              <InlineDocMissingLink
                content={`The projected APY earned by the Friktion strategy. Does NOT include staking rewards`}
              >
                Volt strategy APY
              </InlineDocMissingLink>
            </InfoLabel>
            <InfoDatum>
              {apyFromData(
                selectedCard.data,
                yieldData ? yieldData.averagedEpochYield : null
              )}
            </InfoDatum>
          </InfoRow>
          <InfoRow>
            <InfoLabel>
              <InlineDocMissingLink
                content={`The Friktion strategy APY plus the staking APR`}
              >
                Total APY
              </InlineDocMissingLink>
            </InfoLabel>
            <InfoDatum>
              {lidoRewardsApyQuery.data && selectedCard.data
                ? `${(
                    (yieldData && yieldData.averagedEpochYield
                      ? biggestYieldNumber(yieldData.averagedEpochYield)
                      : selectedCard.data.apy) + lidoRewardsApyQuery.data.apy
                  ).toFixed(1)}%`
                : "...%"}
            </InfoDatum>
          </InfoRow>
        </GeneralInfoTable>
      );
      iContainer = (
        <InteractionContainer autoComplete="off">
          {stakeInfoTable}
          {apyInfoTable}
          <StakeRewardsContainer>
            <StakeRewardsBox>
              <StakeRewardRow>
                <StakeRewardCoin>
                  <img src={ImportantAssetLogos["LDO"]} alt="" />{" "}
                  <span>{usersPendingLDORewards}</span>
                  <span>&nbsp;</span>
                  LDO
                </StakeRewardCoin>
                <StakeRewardNumber
                  css={css`
                    font-size: 14px;
                  `}
                >
                  {lidoRewardsApy} APR
                </StakeRewardNumber>
              </StakeRewardRow>
            </StakeRewardsBox>
          </StakeRewardsContainer>
        </InteractionContainer>
      );

      diaperWrapper = (
        <DiaperWrapper>
          <DiaperBody>
            {selectedCard.deposits?.deposits !== undefined &&
            selectedCard.deposits?.deposits.gt(0) ? (
              <DiaperBodyText>
                You are earning extra rewards from staking your{" "}
                {selectedCard.def.shareTokenSymbol} volt tokens. Continue
                holding {selectedCard.def.shareTokenSymbol} in your wallet, and
                receive LDO rewards monthly.
              </DiaperBodyText>
            ) : (
              <DiaperBodyText>
                <span
                  css={css`
                    font-weight: 600;
                  `}
                >
                  Automatically
                </span>{" "}
                earn extra rewards from depositing into this stSOL volt. You
                will receive LDO rewards monthly.
              </DiaperBodyText>
            )}
            <LDOEmissionsPlot />
          </DiaperBody>
          <GeneralInfoTable>
            <InfoRow>
              <InfoLabel>Liquidity mining platform</InfoLabel>
              <InfoDatum>
                <InlineDocMissingLink content={automatedEmissionsExplanation}>
                  Friktion
                </InlineDocMissingLink>
              </InfoDatum>
            </InfoRow>
          </GeneralInfoTable>
        </DiaperWrapper>
      );
    } else {
      throw new Error("Unknown page");
    }
  }
  const isLidoMaxDisabled = !wallet.connected
    ? "Connect your wallet"
    : deposits10.solBalance === null || deposits10.solBalance.lessThan(0.01)
    ? `Not enough SOL in wallet`
    : false;

  const solSpotPrice = markPrices ? markPrices["SOL"] : null;

  const personalInfoTableForLidoSection = (
    <CompactInfoTable>
      <InfoRow>
        <InfoLabel>
          <InlineDocMissingLink
            content={walletBalanceExplanation(MainnetSOLToken.info.name)}
          >
            Wallet balance
          </InlineDocMissingLink>
        </InfoLabel>
        <InfoDatum>
          <BlackAndWhiteText variant="bodyXl">
            {!wallet.connected ? (
              <span className="greyed">not connected</span>
            ) : (
              MainnetSOLToken.format(deposits10.solBalance)
            )}
          </BlackAndWhiteText>
        </InfoDatum>
      </InfoRow>
    </CompactInfoTable>
  );

  const confirmDisableForLidoSection =
    selectedCard.deposits?.claimableWithdrawals.greaterThan(0)
      ? `You have an unclaimed withdrawal. Claim it in the Withdraw tab before depositing`
      : rawDepositAmountForLidoSection === ""
      ? "Input amount is empty"
      : parsedDepositAmountForLidoSection === null
      ? `Unable to parse input "${rawDepositAmountForLidoSection}"`
      : parsedDepositAmountForLidoSection.lessThanOrEqualTo(0)
      ? "Amount needs to be greater than 0"
      : deposits10.solBalance &&
        parsedDepositAmountForLidoSection.greaterThan(deposits10.solBalance)
      ? `Amount is greater than wallet balance of ${deposits10.solBalance} SOL`
      : deposits10.solBalance &&
        deposits10.solBalance
          .sub(parsedDepositAmountForLidoSection)
          .lessThan(0.008)
      ? "Amount can not be the entire balance, because you need some SOL left for Solana network fees. Try using the max button"
      : !selectedCard.deposits?.totalDeposits
      ? `Waiting for data to load...`
      : false;

  const depositLabelForLidoSection =
    selectedCard.deposits?.claimableWithdrawals.greaterThan(0)
      ? `Claim required (see Withdraw tab)`
      : `Create ${
          parsedDepositAmountForLidoSection && solToLidoStakedSolMultiplier
            ? `~${selectedCard.def.formatMaxWithoutSymbol(
                parsedDepositAmountForLidoSection.mul(
                  new Decimal(solToLidoStakedSolMultiplier)
                )
              )}`
            : ""
        } stSOL and Deposit into volt`;

  const depositForLidoSectionButton = (
    <ConfirmButtonWrapper className="confirmButton">
      <AsyncButton09
        theme={selectedCard.volt}
        disabled={
          confirmDisableForLidoSection ? confirmDisableForLidoSection : false
        }
        label={depositLabelForLidoSection}
        onClick={async (goodies) => {
          if (
            selectedCard &&
            (await depositIntoVolt1(
              goodies,
              subvoltInfo,
              ownedTokenAccountsContext,
              null,
              depositLabelForLidoSection,
              parsedDepositAmountForLidoSection === null
                ? undefined
                : parsedDepositAmountForLidoSection,
              selectedCard.data?.extraVaultData ?? undefined
            ))
          ) {
            setDepositAmount("");
            setDepositAmountForLidoSection("");
          }
        }}
      />
    </ConfirmButtonWrapper>
  );

  const amountInputForLidoSection = (
    <div
      css={css`
        display: flex;
      `}
    >
      <AmountInput
        type="text"
        pattern="[0-9\.,]*"
        inputMode="decimal"
        onChange={(e) => {
          let value = e.target.value;
          if (!selectedCard?.def) {
            errorToast(
              "App error on deposit/withdraw",
              `Selected Card def not found`
            );
            close();
            return;
          }
          setDepositAmountForLidoSection(
            sanitizeInputNumber(
              MainnetSOLToken.decimals,
              value,
              rawDepositAmountForLidoSection
            )
          );
        }}
        value={rawDepositAmountForLidoSection}
        id="managementModalInput"
        placeholder={"0"}
        css={css`
          font-size: ${fontSizeReducer(rawDepositAmountForLidoSection)};
        `}
        maxLength={18}
        // onInput={(e) => console.log(e.currentTarget.textContent)}
      />
      <InputSymbolContainer htmlFor={"managementModalInput"}>
        <InputSymbolText>
          {"SOL "}
          <img src={MainnetSOLToken.icon} alt="" />
        </InputSymbolText>
      </InputSymbolContainer>
    </div>
  );

  const extraLidoContentShownIfLidoVolt = (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        z-index: 1;
      `}
    >
      <div
        css={css`
          align-items: center;
          justify-content: center;
          display: flex;
          font-family: "Euclid Circular B";
          font-weight: 500;
          height: 35px;
          width: 100%;
          background: ${BlueGradient} !important;
          font-size: 12px;
          color: black;
          cursor: pointer;
        `}
        onClick={() => {
          setIsLidoSectionExpanded(!isLidoSectionExpanded);
        }}
      >
        No stSOL? Create some with SOL here
        <ExpandMore
          htmlColor="black"
          fontSize="small"
          className={isLidoSectionExpanded ? "expanded" : ""}
          css={css`
            transition: transform 0.2s ease-in-out;
            &.expanded {
              transform: rotate(180deg);
            }
          `}
        />
      </div>
      <InteractionContainer
        className={isLidoSectionExpanded ? "expanded" : ""}
        css={css`
          max-height: 0;
          opacity: 0;
          transition: max-height 0.2s ease-in-out, opacity 0.2s ease-in-out;
          &.expanded {
            max-height: 235px;
            opacity: 1;
          }
        `}
      >
        <AmountInputContainer>
          <AmountInputRow>
            <Button09
              className="maxButton"
              disabled={isLidoMaxDisabled}
              onClick={() => {
                if (
                  selectedCard &&
                  selectedCard.deposits &&
                  deposits10.solBalance
                ) {
                  let depositableAmount = deposits10.solBalance;
                  depositableAmount = depositableAmount.sub(0.00889);
                  if (depositableAmount.lessThanOrEqualTo(0)) {
                    depositableAmount = new Decimal(0);
                  } else {
                    depositableAmount = depositableAmount
                      .mul(10 ** (MainnetSOLToken.displayDecimals - 1))
                      .ceil()
                      .div(10 ** (MainnetSOLToken.displayDecimals - 1));
                  }
                  setDepositAmountForLidoSection(
                    decimalFloorN(
                      new Decimal(depositableAmount),
                      MainnetSOLToken.info.decimals
                    ).toString()
                  );
                }
              }}
            >
              <Typography
                variant="bodyS"
                css={(theme) =>
                  css`
                    color: ${!isLidoMaxDisabled
                      ? theme.palette.mode === "dark"
                        ? "#FFF"
                        : "#000"
                      : theme.palette.mode === "dark"
                      ? "hsl(230, 15%, 60%)"
                      : theme.palette.grey[600]} !important;
                  `
                }
              >
                MAX
              </Typography>
            </Button09>
            {amountInputForLidoSection}
            <ApproximateValue>
              <span>
                {solSpotPrice && parsedDepositAmountForLidoSection
                  ? "≈" +
                    formatUSDCentsSilly(
                      parsedDepositAmountForLidoSection
                        .mul(solSpotPrice)
                        .toNumber()
                    )
                  : rawDepositAmountForLidoSection === "..."
                  ? "≈" + formatUSDCentsRoundNearest(0)
                  : ""}
              </span>
            </ApproximateValue>
            <AmountInputRowHoverlayer />
          </AmountInputRow>
        </AmountInputContainer>
        {personalInfoTableForLidoSection}
        {depositForLidoSectionButton}
      </InteractionContainer>
    </div>
  );

  const result = (
    <DialogOverlay
      isOpen={showDialog}
      onDismiss={close}
      allowPinchZoom={true} // sometimes, text input will zoom in on iOS
      dangerouslyBypassScrollLock
    >
      <CloseButtonContainer>
        <CloseButton onClick={close}>
          <VisuallyHidden>Close</VisuallyHidden>
          <span aria-hidden>×</span>
        </CloseButton>
      </CloseButtonContainer>
      <DialogContentContainer>
        <DialogContent css={dialogStyles} aria-label="Manage Volt">
          {showDialog ? (
            <ModalContainer>
              {voltageBoxes}
              <div
                css={css`
                  box-shadow: 0px 3px 20px 4px rgba(0, 0, 0, 0.8);
                  border-radius: 4px;
                  overflow: hidden;
                `}
              >
                <ModalPagePicker className="modalPagePicker">
                  <PagePickerTabButton
                    className={page === "deposit" ? "selected" : "deselected"}
                    onClick={() => setPage("deposit")}
                  >
                    <div>
                      {page === "deposit" ? (
                        <ColorBar className="glowBar" />
                      ) : null}
                    </div>
                    <Typography
                      css={css`
                        font-weight: 400;
                      `}
                      variant="bodyS"
                    >
                      Deposit
                    </Typography>
                  </PagePickerTabButton>
                  {!selectedCard.def.shouldHideSwapTab && (
                    <PagePickerTabButton
                      className={page === "swap" ? "selected" : "deselected"}
                      onClick={() => {
                        setPage("swap");
                        setIsLidoSectionExpanded(false);
                      }}
                    >
                      <div>
                        {page === "swap" ? (
                          <ColorBar className="glowBar" />
                        ) : null}
                      </div>
                      <Typography
                        css={css`
                          font-weight: 400;
                        `}
                        variant="bodyS"
                      >
                        Swap
                      </Typography>
                    </PagePickerTabButton>
                  )}
                  <PagePickerTabButton
                    className={page === "withdraw" ? "selected" : "deselected"}
                    onClick={() => {
                      setPage("withdraw");
                      setIsLidoSectionExpanded(false);
                    }}
                  >
                    <div>
                      {page === "withdraw" ? (
                        <ColorBar className="glowBar" />
                      ) : null}
                    </div>
                    <Typography
                      css={css`
                        font-weight: 400;
                      `}
                      variant="bodyS"
                    >
                      Withdraw
                    </Typography>
                  </PagePickerTabButton>
                  {sesameOpened ||
                  quarryData[selectedCard.def.globalId] !== null ||
                  selectedCard.def.doesHaveAutomatedEmissions ? (
                    <PagePickerTabButton
                      className={page === "stake" ? "selected" : "deselected"}
                      onClick={() => {
                        setPage("stake");
                        setIsLidoSectionExpanded(false);
                      }}
                    >
                      <div>
                        {page === "stake" ? (
                          <ColorBar className="glowBar" />
                        ) : null}
                      </div>
                      <Typography
                        css={css`
                          font-weight: 400;
                        `}
                        variant="bodyS"
                      >
                        Stake
                      </Typography>
                    </PagePickerTabButton>
                  ) : null}
                </ModalPagePicker>
                <ModalContent>
                  {iContainer}
                  {page === "deposit" &&
                    selectedCard.def.globalId === "mainnet_income_call_stsol" &&
                    extraLidoContentShownIfLidoVolt}
                  {diaperWrapper}
                </ModalContent>
              </div>
            </ModalContainer>
          ) : null}
        </DialogContent>
      </DialogContentContainer>
    </DialogOverlay>
  );

  return result;
};

// ZeroNineManagementModal.whyDidYouRender = true;

/**
 * NaN => null
 * "" => null
 * 1e10 => null
 * "12.34.56" => null
 * "12.34,56" => null (no localization on inputs)
 */
const parseInputNumber = (
  ultra: UltraToken,
  value: string | null | undefined
) => {
  if (value === null || value === undefined) return null;
  if (value.includes("e")) return null;
  if (value.split(".").length > 2) return null;
  if (/.*\..*,/.test(value)) return null; //
  let parsed;
  if (isNaN(ultra.info.decimals)) {
    console.log(`ultra.info.decimals was NaN: ${ultra.info.decimals}`);
  }
  try {
    parsed = new Decimal(value.replace(/,/g, "").replace(/ /g, ""))
      .mul(10 ** ultra.info.decimals)
      .floor()
      .div(10 ** ultra.info.decimals);
  } catch (e) {
    if (value !== "") {
      console.log(`parseInputNumber error on input "${value}":`, e);
    }
    return null;
  }
  return parsed;
};

/**
 * Limits raw input to max precision and sanitizes comma to dot
 *
 * 124,1234.123456789 => 1234.123456
 */
const sanitizeInputNumber = (
  maxDecimals: number,
  value: string,
  old: string
): string => {
  let result = value;

  result = result.replace(/[^0-9,. ]/g, "");
  const regex = `^(.*\\.[0-9]{0,${maxDecimals}})`;
  const valueBeforeMaxPrecision = value.match(regex);
  const oldBeforeMaxPrecision = old.match(regex);

  if (valueBeforeMaxPrecision !== null && valueBeforeMaxPrecision[1]) {
    result = valueBeforeMaxPrecision[1];

    // It is unintuitive if the user reaches the max precision, so we replace
    // the last character with the extra number they input
    if (
      value.indexOf(old) === 0 &&
      (oldBeforeMaxPrecision === null || oldBeforeMaxPrecision[1] !== value) &&
      value.length === result.length + 1
    ) {
      result = result.replace(/.$/, value.charAt(value.length - 1));
    }
  }

  if (result.length) {
    result = result.replace(/,$/, ".");
  }

  if (result.split(".").length > 2) {
    result = result.replace(/\.$/, "");
  }

  return result;
};

const VoltageBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;

  ${({ theme }) => theme.breakpoints.up("md")} {
    position: absolute;
    top: 20%;
    left: -46%;
    margin-bottom: 0px;
  }
`;

const Boxes = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;

  ${({ theme }) => theme.breakpoints.up("md")} {
    flex-direction: column;
  }
`;

const VoltageTitleRow = styled.div`
  align-self: center;
  display: flex;
  flex-direction: row;
  pointer-events: auto;
`;

const VoltageTitle = styled.div`
  font-family: "Euclid Circular B";
  color: #fff;
  align-self: center;
`;

const RiskInfoText = styled.div`
  font-family: "Euclid Circular B";
  max-width: 180px;
`;

const DiaperWrapper = styled.div`
  position: relative;
  /* padding: 0 20px; */
  /* background: hsl(230, 15%, 12%); */
  /* background: red; */
  margin-top: -5px;
  position: relative;
  z-index: 2;
  border-radius: 0 0 4px 4px;
`;

const DiaperBody = styled.div`
  /* box-shadow: 0px 3px 10px 0 rgba(0, 0, 0, 0.3) inset; */

  /* background: hsl(230, 15%, 12%); */
  padding: 20px 0 0 0;
  opacity: 0.8;
  z-index: 3;
`;

const DiaperBodyText = styled.div`
  font-family: "Euclid Circular B";
  /* box-shadow: 0px 3px 10px 0 rgba(0, 0, 0, 0.3) inset; */

  /* background: hsl(230, 15%, 12%); */
  padding: 0 35px 12px 35px;
  color: ${(props) =>
    props.theme.palette.mode === "dark" ? "#FFFFFF" : "#000000"} !important;
  a {
    color: ${(props) =>
      props.theme.palette.mode === "dark" ? "#FFFFFF" : "#000000"} !important;
    text-decoration: underline;
  }
`;

const StakeRewardsContainer = styled.div`
  padding: 0 20px 22px 20px;
`;

const StakeRewardsBox = styled.div`
  /* padding: 8px 15px 12px 15px; */
  /* background: linear-gradient(hsl(230, 15%, 23%) 20%, hsl(230, 15%, 22%) 80%); */
  border-radius: 4px;
  .Button09 {
    width: 100%;
  }
  display: flex;
  flex-direction: column;
  /* gap: 8px; */
`;

const StakeWarningContainer = styled.div`
  padding: 0 20px 22px 20px;
`;

const StakeWarningBox = styled.div`
  padding: 8px 15px;
  border: 1px solid #ffba3b;
  background: rgba(255, 186, 59, 0.1);
  border-radius: 4px;
`;

const AmountInputContainer = styled.div`
  padding: 22px 20px 18px;
`;
const AmountInputRow = styled.div`
  display: flex;
  position: relative;
  background: ${({ theme }) =>
    theme.palette.mode === "dark" ? "inherit" : theme.palette.grey[200]};
  border-radius: 4px;

  align-items: center;

  .maxButton {
    position: absolute;
    z-index: 6;
    min-width: 45px;
    width: 45px;
    line-height: 1;
    min-height: 34px;
    padding: 0;
    left: 15px;
    background: hsl(230, 15%, 35%);
    &:hover {
      background: hsl(230, 15%, 40%);
    }
  }
`;
/** Compact refers to space after */
const CompactInfoTable = styled.div`
  padding: 0 35px 0 35px;
  @media only screen and (max-width: 350px) {
    padding: 0 20px 0 20px;
  }
`;
const GeneralInfoTable = styled.div`
  padding: 0 35px 20px 35px;
  display: flex;
  flex-direction: column;
  /* padding: 0 35px 20px 35px;

  @media only screen and (max-width: 350px) {
    padding: 0 20px 20px 20px;
  } */
  .analyticsButton {
    margin-top: 7px;
    font-family: "Euclid Circular B";
    color: hsl(230, 15%, 90%);
    background: hsl(230, 15%, 25%);
    min-height: 32px;
    height: 32px;
    line-height: 14px;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    padding: 4px 16px;
    &:hover {
      color: hsl(230, 15%, 95%);
    }
  }
`;

const TopInfoTable = styled.div`
  padding: 0 35px 0 35px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  line-height: 1.5;
  align-items: center;
`;

const InfoLabel = styled.div`
  color: hsl(230, 15%, 65%);
  font-family: "Euclid Circular B";
  .clickableItem {
    /* margin-left: 4px; */
    cursor: pointer;
    text-decoration: dotted underline;
    text-decoration-thickness: 1px;
  }
`;

const InfoDatum = styled.div`
  text-align: right;
  font-family: "Euclid Circular B";
  white-space: nowrap;
  color: hsl(230, 15%, 90%);
  .greyed {
    color: hsl(230, 15%, 65%);
  }
  a {
    color: ${(props) =>
      props.theme.palette.mode === "dark" ? "#FFFFFF" : "#000000"} !important;
    text-decoration: dotted underline;
    &:hover {
      text-decoration: solid underline;
    }
  }
  &.clickable {
    cursor: pointer;
    &:hover {
      text-decoration: dotted underline;
      text-decoration-thickness: 1px;
    }
  }
`;

const InputSymbolText = styled.span`
  ${({ theme }) => theme.typography.bodyXl};
  color: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? theme.palette.grey[50]
      : theme.palette.grey[950]};
  line-height: inherit;
  position: relative;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 5px;
  img {
    height: 20px;
    width: 20px;
    display: inline;
    margin-left: 4px;
  }
  z-index: 2;
`;
const inputSymbolContainerBaseCss = (theme: Theme) => css`
  ${theme.typography.bodyXl};
  text-align: right;
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 68px;
  margin: 0;
  padding: 0;
  padding-right: 20px; // 20 + 50 .. weird magic
  user-select: none;
  pointer-events: none;
  text-align: right;
  position: relative;

  border-radius: 0 4px 4px 0;
  z-index: 4;
`;
const InputSymbolContainer = styled.label`
  ${({ theme }) => inputSymbolContainerBaseCss(theme)}
`;
const InputSymbolContainerPickable = styled.label`
  ${({ theme }) => inputSymbolContainerBaseCss(theme)}
  padding-right: 14px;
  pointer-events: auto;
  display: flex;
  align-items: center;

  .selectAssetButton {
    display: flex;
    align-items: center;
    min-width: auto;
    width: auto;
    font-size: 18px;
    padding-left: 13px;
    padding-right: 9px;

    background: ${({ theme }) =>
      theme.palette.mode === "dark"
        ? theme.palette.grey[700]
        : theme.palette.grey[300]};
    &:hover {
      background: ${({ theme }) =>
        lighten(
          theme.palette.mode === "dark"
            ? theme.palette.grey[700]
            : theme.palette.grey[300],
          0.4
        )};
    }
    .LightLayer {
      background: none !important;
    }
  }
  img {
    width: 18px;
    height: 18px;
  }

  .downIcon {
    width: 18px;
    height: 18px;
    margin-left: 4px;
  }
`;

const AssetPickListContainer = styled.div`
  margin-top: -12px;
  margin-bottom: -18px;
  margin-left: -12px;
  margin-right: -12px;
`;

const AssetPickListWindow = styled.div`
  min-width: 200px;
  display: inline-block;
  max-width: 300px;
  max-height: 370px;
  overflow-y: scroll;
  padding-top: 12px;
  padding-left: 12px;
  padding-right: 12px;
  position: relative;
  z-index: 4;
`;
const AssetPickListFadeTop = styled.div`
  position: absolute;
  top: 16px;
  left: 0;
  right: 0;
  height: 14px;
  background: red;
  pointer-events: none;
  z-index: 5;
  border-radius: 4px 4px 0 0;
  background: linear-gradient(hsla(230, 15%, 25%, 0.8), transparent 100%);
`;
const AssetPickListFadeBottom = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 14px;
  background: red;
  pointer-events: none;
  z-index: 5;
  border-radius: 0 0 4px 4px;

  background: linear-gradient(transparent, hsla(230, 15%, 25%, 0.8) 100%);
`;
const AssetPickListCell = css`
  display: flex;
  min-width: auto;
  width: 100%;
  padding: 10px;

  /* box-shadow: 0 0.66px 0 0 rgba(250, 250, 255, 0.08) inset; */

  background: hsl(230, 15%, 35%);
  color: hsl(230, 15%, 75%);
  &:hover {
    background: hsl(230, 15%, 40%);
  }
  .LightLayer {
    background: none !important;
  }
  margin-bottom: 12px;
  border-radius: 4px;
  align-items: center;
`;
const AssetPickListText = styled.div`
  line-height: 1.2;
  padding-left: 10px;
  color: #fff;
  text-align: left;
`;
const AssetPickListOnlyExplainer = styled.div`
  padding: 4px 12px 14px 12px;
  font-size: 13px;
  line-height: 1.2;
  color: hsl(230, 15%, 85%);
`;
const AssetPickListLoading = styled.div`
  width: 240px;
  text-align: center;
  padding: 24px;
  color: hsl(230, 15%, 85%);
`;
const AssetPickList: React.FC<{
  jupSupportedTokensOwnedByUser:
    | null
    | {
        tokenInfo: SPLTokenInfo;
        amount: Decimal;
      }[];
  selectAsset: (tokenInfo: SPLTokenInfo, amount: string) => void;
  hide: () => void;
}> = ({ jupSupportedTokensOwnedByUser, selectAsset, hide }) => {
  const { publicKey } = useAppWallet();

  if (publicKey === null) {
    return (
      <AssetPickListLoading>
        Connect wallet to see assets that you can swap
      </AssetPickListLoading>
    );
  }
  if (jupSupportedTokensOwnedByUser === null) {
    return <AssetPickListLoading>Loading owned assets</AssetPickListLoading>;
  }

  return (
    <AssetPickListContainer>
      <AssetPickListFadeTop />
      <AssetPickListFadeBottom />
      <AssetPickListWindow>
        {jupSupportedTokensOwnedByUser.map((j, i) => {
          return (
            <Button09
              css={AssetPickListCell}
              key={i}
              onClick={() => {
                if (j.tokenInfo.symbol === "SOL") {
                  let reducedAmount = j.amount.sub(0.00889);
                  if (reducedAmount.lt(0)) {
                    reducedAmount = new Decimal(0);
                  }
                  selectAsset(j.tokenInfo, reducedAmount.toString());
                } else {
                  selectAsset(j.tokenInfo, j.amount.toString());
                }
                hide();
              }}
            >
              <img
                src={j.tokenInfo.logoURI || ""}
                alt=""
                width={32}
                height={32}
              />
              <AssetPickListText>
                <div>
                  <strong>
                    {j.amount.toString()} {j.tokenInfo.symbol}
                  </strong>
                </div>
                <div>{j.tokenInfo.name}</div>
              </AssetPickListText>
            </Button09>
          );
        })}
        <AssetPickListOnlyExplainer>
          Only assets that you own and are supported by Jupiter are shown here.
        </AssetPickListOnlyExplainer>
      </AssetPickListWindow>
    </AssetPickListContainer>
  );
};

const AmountInputRowHoverlayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  border-radius: 4px;
  background: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? "hsla(230, 15%, 50%, 0.1)"
      : lighten(theme.palette.grey[200], 0.2)};
`;

const AmountInput = styled.input`
  ${({ theme }) => theme.typography.h4};
  font-family: "Euclid Circular B";
  position: relative;
  z-index: 3;
  text-align: right;
  background: transparent;
  border: none;
  outline: none;
  line-height: 1.5;
  height: 68px;
  padding: 0;
  flex-grow: 1;
  width: 100%;
  padding-right: 98px;
  margin-right: -90px;
  z-index: 2;

  ::placeholder {
    ${({ theme }) => theme.typography.h4};
    font-family: "Euclid Circular B";
    font-size: 24px;
    color: ${({ theme }) => theme.palette.grey[500]};
  }
  &:hover,
  &:focus {
    border-radius: 4px 0 0 4px;
    background: transparent;
    ::placeholder {
      color: ${({ theme }) =>
        theme.palette.mode === "dark"
          ? lighten(theme.palette.grey[500], 0.55)
          : darken(theme.palette.grey[500], 0.55)};
    }
  }
  /* &:hover,
  &:hover + ${InputSymbolContainer}, &:focus,
  &:focus + ${InputSymbolContainer} {
    color: hsl(230, 15%, 100%);
  } */
  /* &:hover ~ ${AmountInputRowHoverlayer} {
    background: linear-gradient(hsl(230, 15%, 24%) 20%, hsl(230, 15%, 23%) 80%);
  }
  &:focus ~ ${AmountInputRowHoverlayer} {
    background: linear-gradient(hsl(230, 15%, 26%) 20%, hsl(230, 15%, 25%) 80%);
  } */
`;

const ApproximateValue = styled.div`
  text-align: right;
  padding: 8px 0 0 0;
  z-index: 5;
  position: relative;
  width: 0;
  pointer-events: none;
  user-select: none;
  span {
    white-space: nowrap;
    position: absolute;
    top: 15px;
    left: -20px;
    transform: translateX(-100%);
    color: ${({ theme }) =>
      theme.palette.mode === "dark"
        ? theme.palette.grey[400]
        : theme.palette.grey[600]};
  }
`;
const ConfirmButtonWrapper = styled.div`
  padding: 22px 20px 22px 20px;
  .Button09 {
    width: 100%;
    margin: 0 auto;
  }
  .DisabledButton09 {
    background: ${({ theme }) =>
      theme.palette.mode === "dark"
        ? "linear-gradient(180deg, #474A5B 0%, #404353 100%)"
        : darken(theme.palette.background.modal, 0.1)};
  }
`;
const DualTopConfirmButtonWrapper = styled.div`
  padding: 22px 20px 15px 20px;
  .Button09 {
    width: 100%;
    min-width: initial;
    margin: 0 auto;
  }
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 15px;
  justify-content: space-between;
`;

const dialogStyles = css`
  &[data-reach-dialog-overlay] {
    /* background: hsl(230, 15%, 20%); */
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    /* outline: 2px solid red; */
  }

  &[data-reach-dialog-content] {
    /* width: 50vw; */
    /* width: 350px; */
    width: 100%;
    height: 100%;
    outline: 2px solid green;

    /* margin: 10vh auto; */
    margin: 0 auto;
    position: relative;
    padding: 0;
    /* background: #444; */
    /* padding: 2re#251e1e/
    /* background: none; */
    outline: none;
    background: none;
    pointer-events: none;
    display: flex;
    justify-content: center;
  }

  border-radius: 4px;
`;

const CloseButtonContainer = styled.div`
  position: sticky;
  top: 24px;
  z-index: ${({ theme }) => theme.zIndex.fab};
`;

const CloseButton = styled.button`
  ${button09Reset}
  border: none;
  width: 40px;
  height: 40px;
  color: #fff;
  cursor: pointer;
  opacity: 0.9;
  z-index: 1;
  position: absolute;
  right: 24px;
  border-radius: 4px;
  background: hsl(230, 15%, 25%);
  text-align: center;
  &:hover {
    opacity: 1;
  }
  pointer-events: auto;
`;

/**
 * man .. don't even try to make this thing scroll... you will enter a world of hurt
 */
const ModalContainer = styled.div`
  position: relative;
  max-height: 100%;
  cursor: auto;
  width: 100%;
  max-width: 370px;
  pointer-events: auto;
`;

const ModalPagePicker = styled.div`
  background: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? theme.palette.grey[900]
      : darken(theme.palette.background.modal, 0.2)};
  border-radius: 4px 4px 0 0;
  display: flex;
  justify-content: center;
`;
const PagePickerTabButton = styled.button`
  ${button09Reset}
  width: 100%;
  flex-basis: 1;
  flex-grow: 1;
  flex-shrink: 1;

  border-radius: 0;
  background: transparent;
  &:hover {
    background: ${({ theme }) =>
      theme.palette.mode === "dark"
        ? "hsl(230, 15%, 15%)"
        : darken(theme.palette.background.modal, 0.15)};
  }
  &:focus {
    z-index: 3;
  }

  div:nth-of-type(1) {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    border-radius: 0;
  }
  &:first-of-type,
  &:first-of-type .glowBar {
    border-top-left-radius: 4px;
  }
  &:last-child,
  &:last-child .glowBar {
    border-top-right-radius: 4px;
  }

  padding-top: 16px;
  padding-bottom: 16px;

  outline: none;

  &.selected {
    background: ${({ theme }) =>
      theme.palette.mode === "dark"
        ? "hsl(230, 15%, 20%)"
        : theme.palette.background.modal};
  }
`;
// const DWModePickerButton = styled.button`
//   background: #666;
//   display: flex;
//   justify-content: space-between;

//   /* width: 350px; */
// `;

const InteractionContainer = styled.form`
  /* padding: 0 15px 10px 15px; */
  /* background: hsl(230, 15%, 20%); */
  /* background: linear-gradient(hsl(230, 15%, 20%) 10%, hsl(230, 15%, 17%) 90%); */
  /* background: ${({ theme }) => theme.palette.background.modal};
  border-radius: 0 0 4px 4px; */
  z-index: 2;
  position: relative;
  background: hsl(230, 15%, 20%);
  margin-top: -1px; // thin seam artifact on ios some times
`;

const QuarryUnstakeButton: React.FC<{
  selectedCard: Card09Props;
  qsm: QuarrySingleMine;
  setExpectingPositiveBalance: React.Dispatch<
    React.SetStateAction<Record<string, true>>
  >;
}> = (props) => {
  const singleWithdraw = useSingleWithdraw(props.qsm);
  const amountDeposited = props.selectedCard.deposits?.singleQuarryDeposits;
  return (
    <AsyncButton09
      theme={props.selectedCard.volt}
      disabled={
        !singleWithdraw
          ? "Loading..."
          : !amountDeposited?.gt(0)
          ? "No deposits"
          : false
      }
      label={"Unstake all"}
      onClick={async (goodies) => {
        if (!amountDeposited) {
          throw new Error("Deposit balance in app has minor bug.");
        }
        const withdrawTx = await singleWithdraw(amountDeposited);
        const txResult = await goodies.handleTXWrapped(
          `Unstaking ${props.selectedCard.def?.depositToken.format(
            amountDeposited,
            props.selectedCard.def.shareTokenSymbol
          )}`,
          withdrawTx
        );

        if (txResult.success) {
          props.setExpectingPositiveBalance((prevState) => ({
            ...prevState,
            ["wallet:" + props.qsm.stakedToken]: true,
          }));
        }
      }}
    />
  );
};

const QuarryStakeButton: React.FC<{
  selectedCard: Card09Props;
  qsm: QuarrySingleMine;
  sharesInWallet: Decimal | undefined;
  setExpectingPositiveBalance: React.Dispatch<
    React.SetStateAction<Record<string, true>>
  >;
}> = (props) => {
  const singleDeposit = useSingleDeposit(props.qsm);
  return (
    <AsyncButton09
      theme={props.selectedCard.volt}
      disabled={
        props.sharesInWallet === undefined
          ? "Unable to find volt tokens in wallet"
          : props.sharesInWallet.isZero()
          ? "Volt token balance in your wallet is 0"
          : false
      }
      label={"Stake all"}
      onClick={async (goodies) => {
        if (!props.sharesInWallet) {
          throw new Error("Volt Token balance in app has minor bug.");
        }
        const depositTx = await singleDeposit(props.sharesInWallet);
        const txResult = await goodies.handleTXWrapped(
          `Staking ${props.selectedCard.def?.depositToken.format(
            props.sharesInWallet,
            props.selectedCard.def.shareTokenSymbol
          )}`,
          depositTx
        );

        if (txResult.success) {
          props.setExpectingPositiveBalance((prevState) => ({
            ...prevState,
            ["quarry:" + props.qsm.stakedToken]: true,
          }));
        }
      }}
    />
  );
};

const CrossChainDepositContainer = styled.div`
  padding: 0 20px;
`;

const CrossChainDepositCard = styled.div`
  padding: 8px 15px 8px 15px;
  gap: 8px;
  align-items: center;
  background: hsla(230, 15%, 50%, 0.1);
  border-radius: 4px;
`;

const ChainPickerContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1px;
`;

const Tag = styled.button<{
  selected?: boolean;
  disabled?: boolean;
}>`
  ${({ selected, disabled }) => css`
    display: flex;
    align-items: center;
    outline: none !important;
    border: 0;
    margin: 0 2px;
    border-radius: 4px;
    padding: 4px 8px;
    cursor: ${disabled ? "default" : "pointer"};
    align-self: normal;
    background: ${selected ? "hsla(230, 15%, 40%, 0.4)" : "transparent"};
    &:hover {
      background: ${disabled ? "transparent" : "hsla(230, 15%, 40%, 0.5)"};
    }

    img {
      height: 20px;
      width: 20px;
      display: inline;
      margin-right: 4px;
      filter: ${disabled ? "grayscale(100%)" : "none"};
    }
  `}
`;

const TagRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-flow: wrap;
`;

const GreyText = styled(Typography)`
  color: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? theme.palette.grey[300]
      : theme.palette.grey[700]};
  font-size: 14px;
`;

const blackAndWhiteTextStyles = (theme: Theme) => css`
  color: ${theme.palette.mode === "dark" ? "#FFFFFF" : "#000000"} !important;
  font-size: 14px;
`;
const BlackAndWhiteText = styled(Typography)<{ disabled?: boolean }>`
  ${({ theme }) => blackAndWhiteTextStyles(theme)};
  color: ${({ disabled, theme }) =>
    disabled
      ? "rgba(255, 255, 255, 0.26)"
      : theme.palette.mode === "dark"
      ? "#FFFFFF"
      : "#000000"} !important;
  line-height: inherit !important;
`;

const ModalContent = styled.div`
  flex: 1 1 auto;
  background: ${({ theme }) => theme.palette.background.modal};
`;

const CLOSE_BUTTON_WIDTH = 40 + 24 + 24;
const EndOfArrowRight = styled.div`
  position: absolute;
  width: 0;
  height: 0;
  border: 4px solid transparent;
  border-right: 0;
  border-left: 6px solid rgba(255, 255, 255, 0.8);
  right: -6px;
  top: -4px;
  z-index: 10;
  transform: translateX(-50%);
  -ms-transform: translateX(-50%);
  -moz-transform: translateX(-50%);
  -webkit-transform: translateX(-50%);
  -o-transform: translateX(-50%);
`;

const DialogContentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 24px;
  min-height: calc(100% - 24px - 24px);

  ${({ theme }) => theme.breakpoints.down(370 + 2 * CLOSE_BUTTON_WIDTH)} {
    margin-top: 76px;
    margin-bottom: 76px;
    min-height: calc(100% - 76px - 76px);
  }
`;

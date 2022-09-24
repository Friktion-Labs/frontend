// If not used more than once, don't include here!

import { css } from "@emotion/react";
import { EpochCountdown } from "./FormattedCountdown";
import {
  AllAssetsUnion,
  getChainIdFromAsset,
  getChainNetworkNameFromAsset,
  getTickerFromWormholeChainId,
} from "../features/wormhole";
import { inlineDocPopoverStyles } from "./misc09";

export const apyDisclaimerFragmentStartingWiththe = (windowSize: number) =>
  `the ${
    windowSize > 1
      ? `time-weighted average of the latest ${windowSize} epochs' premiums`
      : `latest (and only) epoch's premia`
  }. If there were epochs that ended with a negative return, the yield for that epoch is counted as 0% for the purposes of this extrapolation, but the negative PnL is not included in the calculation. For calculations inclusive of epochs with losses, see the analytics page.`;
export const apyDisclaimer = (windowSize: number) =>
  `The extrapolated premiums displayed are calculated from ${apyDisclaimerFragmentStartingWiththe(
    windowSize
  )} APY depends on market conditions. Past performance is no guarantee of future results`;

export const newListingAPY =
  "This asset is entering its first epoch, and APY displayed here is a forecast";

export const autoCompoundingExplanation =
  "Time until the start of the next epoch; your deposits and yield will automatically be re-invested to maximize your returns! Epochs currently last for 7 days each";

export const autoCompoundingExplanationCrab =
  "Time until the start of the next epoch; your deposits and yield will automatically be re-invested to maximize your returns! Epochs lengths are variable depending on market and liquidity conditions.";

export const totalDepositsExplanation =
  "Your total current deposits in Friktion, including pending deposits, volt tokens in your wallet, and tokens staked in a quarry; but excluding pending withdrawals";

export const getCrossChainDepositsExplanation = (
  wormholeAsset: AllAssetsUnion
) => (
  <span>{
    `Friktion supports cross chain deposits for this Volt. Once you connect your ${getChainNetworkNameFromAsset(
      wormholeAsset
    )} wallet, you can bridge your ${getTickerFromWormholeChainId(
      getChainIdFromAsset(wormholeAsset)
    )} to Solana (as a SPL Token) using Wormhole to deposit into the Volt.` /*`Learn more (link to docs)`*/
  }</span>
);

export const snowflakeCrossChainDisabledText = (
  <span css={inlineDocPopoverStyles}>
    Cross chain deposits are not supported with Snowflake Safe.
  </span>
);

export const getCrossChainDepositInProgressText = (
  wormholeAsset: AllAssetsUnion
) =>
  `You have a cross chain deposit in progress. Connect your ${getChainNetworkNameFromAsset(
    wormholeAsset
  )} wallet and click on the "Continue Deposit" button to proceed with the deposit.`;

export const getCrossChainBalanceExplanation = (
  fullTokenName: string,
  wormholeAsset: AllAssetsUnion
) =>
  `Your balance of ${fullTokenName} tokens in your ${getChainNetworkNameFromAsset(
    wormholeAsset
  )} wallet (that are not yet deposited into Friktion)`;

export const estimatedYieldExplanation = () => (
  <span>
    An estimate of the amount of yield you might earn at the end of this epoch
    if the option is not exercised. Amount displayed already takes into account
    the 10% performance fee. This is based on the current and latest epoch
    performance. The final number may be slightly different due to how the
    auto-compounding buys back the deposit token
    <br />
    <br />
    This number does not include staking yields from liquidity mining. However,
    it includes estimated strategy yield for tokens staked in a quarry.
  </span>
);

export const walletBalanceExplanation = (fullTokenName: string) =>
  `Your balance of ${fullTokenName} tokens in your wallet (that are not yet deposited into Friktion)`;

export const pendingDepositsExplanation = () => (
  <span>
    Your deposits which will begin generating income during the next epoch. Next
    epoch begins in <EpochCountdown />
  </span>
);

export const additionalLidoStakingBoostExplanation = () => (
  <span>
    <span
      css={css`
        font-weight: 600;
      `}
    >
      Automatically
    </span>{" "}
    earn extra rewards from depositing into this stSOL volt. You will receive
    LDO rewards monthly.
  </span>
);

export const pendingWithdrawalsExplanation = () => (
  <span>
    Your pending withdrawals (deposits + yield) which can be claimed after the
    coming auto-compounding event; values estimated using market data. Next
    epoch begins in <EpochCountdown />
  </span>
);

export const claimableWithdrawalsExplanation =
  "Your withdrawals are ready to be claimed into your wallet using the withdraw button; note you need to claim all rewards before depositing again";

export const mintableVoltTokensExplanation = () => (
  <span>
    You have mintable volt tokens, which can optionally be mint in the withdraw
    tab. These volt tokens represent your ownership of assets in the Volt. You
    can see the relative price between the volt token and the underlying by
    referring to the "Volt token price" data below. You will still earn yield
    regardless if you mint the volt tokens. <br />
    <br />
    See the docs for more about{" "}
    <a
      href="https://docs.friktion.fi/what-are-volts/volts-flow-epochs-deposits-withdraws#withdraw"
      target="_blank"
      rel="noreferrer"
    >
      minting and withdrawing
    </a>
  </span>
);

export const withdrawFeeExplanation =
  "Fee charged on the total amount withdrawn when withdrawing from a Volt. This is only charged when you manually initiate a withdrawal";
export const performanceFeeExplanation =
  "Fee taken on positive yields earned by the Volt. This is only applied on the yield earned; it is NOT applied on the total balance of deposits";
export const aumFeeExplanation =
  "Fee charged on a recurring basis per Epoch on total deposits in the Volt. This fee covers operations and management of the strategy. It is amortized over a year.";

export const newFeesExplanation = (includeAUMFee: boolean) => (
  <span>
    <span
      css={css`
        font-weight: 500;
      `}
    >
      Performance fee:
    </span>{" "}
    on positive yields earned by the Volt, per Epoch
    <br />
    <span
      css={css`
        font-weight: 500;
      `}
    >
      Withdrawal fee:
    </span>{" "}
    upon withdrawing from a Volt, one time
    {includeAUMFee && (
      <>
        <br />
        <span
          css={css`
            font-weight: 500;
          `}
        >
          Execution fee:
        </span>{" "}
        for actively traded Volts, a recurring fee on total deposits in the
        Volt, per Epoch
      </>
    )}
    <br />
    <div
      css={css`
        margin-top: 8px;
      `}
    >
      <a
        href="https://docs.friktion.fi/products/faq/fees"
        target="_blank"
        rel="noreferrer"
      >
        Learn more
      </a>
    </div>
  </span>
);

export const volt5FeesExplanation = () => (
  <span>
    <span
      css={css`
        font-weight: 500;
      `}
    >
      Performance fee:
    </span>{" "}
    taken on the yield generated by the options when in-the-money
    <br />
    <span
      css={css`
        font-weight: 500;
      `}
    >
      Withdrawal fee:
    </span>{" "}
    upon withdrawing from a Volt, one time
    <br />
    <span
      css={css`
        font-weight: 500;
      `}
    >
      Execution fee:
    </span>{" "}
    a recurring fee on total deposits in the Volt, per Epoch
    <br />
    <br />
    <span
      css={css`
        font-weight: 500;
      `}
    >
      No fees for Genesis Wielders for the first 2 weeks!
    </span>
    <div
      css={css`
        margin-top: 8px;
      `}
    >
      <a
        href="https://docs.friktion.fi/products/faq/fees"
        target="_blank"
        rel="noreferrer"
      >
        Learn more
      </a>
    </div>
  </span>
);

export const genericVoltNumExplanation =
  "The number distinguishes the type of Volt in Friktion's suite of structured products";

export const voltNumExplanations: Record<number, string> = {
  1: `Volt #01 is the income generation volt. ${genericVoltNumExplanation}`,
  2: `Volt #02 is the sustainable stables volt. ${genericVoltNumExplanation}`,
  3: `Volt #03 is the crab strategy volt. ${genericVoltNumExplanation}`,
  4: `Volt #04 is the basis volt. ${genericVoltNumExplanation}`,
  5: `Volt #05 is the capital protection volt. ${genericVoltNumExplanation}`,
};

export const basisFundingExplanation = () => (
  <span>
    The total amount of USDC received as funding payments from the delta-hedged
    long basis position
  </span>
);
export const basisBorrowInterestExplanation = () => (
  <span>
    The total amount of SOL paid as interest for borrowing SOL on Mango, since
    Volt inception
  </span>
);
export const basisSupplyInterestExplanation = () => (
  <span>
    The total amount of USDC received as interest for depositing USDC on Mango,
    since Volt inception
  </span>
);
export const shareTokenOverviewExplanation = () => (
  <span>
    The volt token has a price which represents the amount of deposited assets
    that can be redeemed for 1 volt token. When the Volt makes a profit, the
    value of a share increases.
    <br />
    <br />
    See the docs for more about{" "}
    <a
      href="https://docs.friktion.fi/what-are-volts/volts-flow-epochs-deposits-withdraws#design-goals-behind-the-complexity"
      target="_blank"
      rel="noreferrer"
    >
      volt tokens and composability
    </a>
  </span>
);
export const swapInputExplanation = (symbol: string) =>
  `Your balance of ${symbol} tokens in your wallet that can be sold`;

export const coingeckoPriceDisclaimer = (coingeckoId: string) => (
  <span>
    Price according to{" "}
    <a
      href={`https://www.coingecko.com/en/coins/${coingeckoId}`}
      rel="noreferrer"
      target="_blank"
    >
      CoinGecko for asset with ID "{coingeckoId}"
    </a>
    . This is data provided by a third-party and there is no guarantee of
    accuracy or liquidity
  </span>
);
export const swapOutputExplanation = (symbol: string) =>
  `Your balance of ${symbol} tokens currently in your wallet. This is the token that can be deposited into Friktion`;

export const swapYouPayExplanation = `The amount of tokens you will sell`;
export const swapYouReceiveExplanation = `An estimate of the amount of tokens you will receive. Slippage may occur, and the final execution amount may be different. This amount is net after any fees.`;
export const swapRentExplanation = `The amount of SOL that the Solana network charges for rent. This may be refundable by closing a token account or closing Serum order accounts.`;
export const swapRateExplanation = `The effective estimate exchange rate of this swap. Click to change which asset is set to 1.`;
export const swapProtocolsExplanation = `The DEXes that this swap will take place on. This is for informational purposes, as Jupiter handles it all for you.`;
export const swapRouteExplanation = `The path that swaps will take. This path is determined by Jupiter Aggregator. This is for informational purposes, as Jupiter handles it all for you.`;
export const swapPlatformFeeExplanation = `The platform fee that will be charged for this swap. Amounted displayed in "You receive" already takes into account all fees (except Solana rent deposits).`;
export const quarryExplanation = () => (
  <span>
    Quarry is an open source liquidity mining platform used for the staking
    rewards in Friktion
  </span>
);
export const automatedEmissionsExplanation = () => (
  <span>
    By just holding fcstSOL in your wallet, Friktion automatically sends LDO
    rewards to that wallet.
  </span>
);

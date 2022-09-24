import {
  ExtraVoltData,
  VoltSDK,
  toConnectedSDK,
} from "@friktion-labs/friktion-sdk";
import { SolanaProvider, TransactionEnvelope } from "@saberhq/solana-contrib";
import { getOrCreateATA } from "@saberhq/token-utils";
import { AccountLayout, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  Signer,
  TransactionInstruction,
} from "@solana/web3.js";
import BN from "bn.js";
import Decimal from "decimal.js";
import { OwnedTokenAccountsContextT } from "../contexts/OwnedTokenAccounts";
import { WRAPPED_SOL_ADDRESS } from "../friktionConstants";
import { betterInvariant } from "../utils/betterInvariant";
import {
  createAssociatedTokenAccountInstruction,
  getHighestAccount,
  getMintSupplyOrZero,
  initializeTokenAccountTx,
} from "../utils/token";
import { errorToast } from "../utils/yummyNotifications";
import { Goodies } from "./Button09";
import { STRONG_SUBVOLTS, SubvoltDef10 } from "./registry10";
import { SolidoSDK } from "@lidofinance/solido-sdk";

/**
 * Returns boolean indicating success
 */
export const depositIntoVolt1 = async (
  goodies: Goodies,
  subvoltDef: SubvoltDef10,
  ownedTokenAccountsContext: OwnedTokenAccountsContextT,
  humanAmount: Decimal | null,
  actionLabel: string,
  stakeInLidoHumanAmount?: Decimal | undefined,
  extraVoltData?: ExtraVoltData | undefined
): Promise<boolean> => {
  const cVoltSDK = toConnectedSDK(
    await goodies.sdk.loadVoltSDKByKey(
      subvoltDef.voltVaultId,
      undefined,
      extraVoltData
    ),
    goodies.providerMut.connection,
    goodies.providerMut.wallet.publicKey
  );
  const voltVault = cVoltSDK.voltVault;

  const connection = goodies.providerMut.connection;
  const ownedTokenAccounts = ownedTokenAccountsContext.ownedTokenAccounts;

  try {
    let lidoStakeTransaction: Transaction | null = null;
    let stSolAccountAddress: PublicKey | null = null;
    let solToLidoStakedSolMultiplier: number | null = null;
    if (stakeInLidoHumanAmount !== undefined) {
      const solidoSDK = new SolidoSDK(
        "mainnet-beta",
        goodies.providerMut.connection,
        "6JPMBNYswWcb3QNiAu1LiSrzTE3tvFhNpf7n5xjo9gFc"
      );
      const { transaction, stSolAccountAddress: stSolAccountAddy } =
        await solidoSDK.getStakeTransaction({
          amount: stakeInLidoHumanAmount.toNumber(),
          payerAddress: goodies.publicKey,
        });

      const { SOLToStSOL } = await solidoSDK.getExchangeRate();
      solToLidoStakedSolMultiplier = SOLToStSOL;
      lidoStakeTransaction = transaction;
      stSolAccountAddress = stSolAccountAddy;
    }

    let depositInstructions: TransactionInstruction[] = lidoStakeTransaction
      ? lidoStakeTransaction.instructions
      : [];
    const signers: Signer[] = [];

    let depositTokenAccountKey: PublicKey | null;
    if (!ownedTokenAccounts) {
      throw new Error(
        "Token account info not yet loaded. Wait a few seconds and try again"
      );
    }

    const vaultTokenAccounts =
      ownedTokenAccounts[voltVault.vaultMint.toString()];

    let vaultTokenAccount: PublicKey | null = null;
    if (vaultTokenAccounts) {
      const vaultTokenAccountEww = getHighestAccount(vaultTokenAccounts);
      if (vaultTokenAccountEww) {
        vaultTokenAccount = vaultTokenAccountEww.pubKey;
      }
    }
    if (!vaultTokenAccount) {
      const ataResult = await getOrCreateATA({
        provider: goodies.providerMut,
        mint: voltVault.vaultMint,
        owner: goodies.publicKey,
      });
      vaultTokenAccount = ataResult.address;

      if (ataResult.instruction) {
        depositInstructions.push(ataResult.instruction);
      }
    }

    let pendingDepositInfo;
    try {
      pendingDepositInfo = await cVoltSDK.getPendingDepositForUser();
    } catch (err) {
      pendingDepositInfo = null;
    }

    if (
      pendingDepositInfo &&
      pendingDepositInfo.roundNumber.lt(voltVault.roundNumber) &&
      pendingDepositInfo?.numUnderlyingDeposited?.gtn(0)
    ) {
      console.log(
        "claiming pending:",
        pendingDepositInfo?.numUnderlyingDeposited.toString()
      );
      betterInvariant(
        vaultTokenAccount,
        "vaultTokenAccount in deposit claimPending"
      );
      depositInstructions.push(
        await cVoltSDK.claimPendingDeposit(vaultTokenAccount)
      );
    }

    if (
      stakeInLidoHumanAmount !== undefined ||
      (humanAmount !== null && !humanAmount.eq(0))
    ) {
      if (
        depositInstructions.length === 0 &&
        (humanAmount === null || humanAmount.eq(0))
      ) {
        errorToast("Deposit error", "Amount can't be less than or equal to 0");
        return false;
      }

      if (subvoltDef.depositToken.address === WRAPPED_SOL_ADDRESS) {
        if (humanAmount === null || humanAmount.eq(0)) {
          errorToast(
            "Deposit error",
            "Amount can't be less than or equal to 0"
          );
          return false;
        }
        const rentBalance = await connection.getMinimumBalanceForRentExemption(
          AccountLayout.span
        );
        // Check if the wrapped token account already exists
        const {
          instructions: wrapSolInstructions,
          newTokenAccount: wrappedSolAccount,
        } = await initializeTokenAccountTx({
          connection: connection,
          payerKey: goodies.publicKey,
          mintPublicKey: new PublicKey(WRAPPED_SOL_ADDRESS),
          owner: goodies.publicKey,
          rentBalance: rentBalance,
          extraLamports: humanAmount.toNumber() * LAMPORTS_PER_SOL,
        });
        depositInstructions = depositInstructions.concat(wrapSolInstructions);
        signers.push(wrappedSolAccount);
        depositTokenAccountKey = wrappedSolAccount.publicKey;
      } else {
        if (stSolAccountAddress) {
          depositTokenAccountKey = stSolAccountAddress;
        } else {
          const depositTokenAccount = getHighestAccount(
            ownedTokenAccounts[subvoltDef.depositToken.address]
          );
          if (!depositTokenAccount) {
            errorToast("Deposit error:", "No underlying token balance");
            return false;
          }

          depositTokenAccountKey = depositTokenAccount.pubKey;
        }
      }

      betterInvariant(
        depositTokenAccountKey,
        "underlyingTokenAccountKey in deposit"
      );
      betterInvariant(
        goodies.providerMut,
        "wallet not connected (providerMut missing)"
      );

      if (stakeInLidoHumanAmount !== undefined) {
        betterInvariant(
          solToLidoStakedSolMultiplier,
          "solToLidoStakedSolMultiplier missing"
        );
        depositInstructions.push(
          await cVoltSDK.deposit(
            stakeInLidoHumanAmount.mul(
              new Decimal(solToLidoStakedSolMultiplier)
            ),
            depositTokenAccountKey,
            vaultTokenAccount,
            undefined,
            STRONG_SUBVOLTS[subvoltDef.globalId].depositToken.decimals
          )
        );
      } else {
        betterInvariant(humanAmount, "deposit amount missing");
        depositInstructions.push(
          await cVoltSDK.deposit(
            humanAmount,
            depositTokenAccountKey,
            vaultTokenAccount,
            undefined,
            STRONG_SUBVOLTS[subvoltDef.globalId].depositToken.decimals
          )
        );
      }

      if (subvoltDef.depositToken.address === WRAPPED_SOL_ADDRESS) {
        const closeWSolIx = Token.createCloseAccountInstruction(
          TOKEN_PROGRAM_ID,
          depositTokenAccountKey,
          goodies.publicKey, // Send any remaining SOL to the owner
          goodies.publicKey,
          []
        );
        depositInstructions.push(closeWSolIx);
      }
    }

    if (depositInstructions.length === 0) {
      errorToast(
        `${actionLabel} error`,
        stakeInLidoHumanAmount !== undefined
          ? `Deposit instructions are empty. Attempted to stake into lido and then deposit ${stakeInLidoHumanAmount.toNumber()}. Please report this bug on Discord.`
          : `Deposit instructions are empty. Attempted to deposit ${humanAmount?.toNumber()}. Please report this bug on Discord.`
      );
      return false;
    }

    const sProvider = SolanaProvider.load({
      connection: goodies.providerMut.connection,
      sendConnection: goodies.providerMut.connection,
      wallet: goodies.providerMut.wallet,
      opts: goodies.providerMut.opts,
    });

    const depositTx = new TransactionEnvelope(
      sProvider,
      depositInstructions,
      signers
    );

    const txResult = await goodies.handleTXWrapped(actionLabel, depositTx);
    setTimeout(ownedTokenAccountsContext.refresh, 5000);

    return txResult.success;
  } catch (err) {
    console.error(err);

    if (err instanceof Error) {
      errorToast("Deposit error", err.message);
    }
  }

  return false;
};

/**
 * humanAmount is amount of coins, not shares
 */
export const withdrawFromVolt1 = async (
  goodies: Goodies,
  subvoltDef: SubvoltDef10,
  ownedTokenAccountsContext: OwnedTokenAccountsContextT,
  estimatedTotalUnderlyingWithoutPending: Decimal | undefined,
  humanAmount: Decimal | null,
  /**
   * The withdraw button is complicated. So lets display the info consistently
   * between the frontend and the withdraw
   */
  actionLabel: string,
  extraVoltData?: ExtraVoltData | undefined
): Promise<boolean> => {
  if (!estimatedTotalUnderlyingWithoutPending) {
    throw new Error("estimatedTotalUnderlyingWithoutPending is null");
  }

  const cVoltSDK = toConnectedSDK(
    await goodies.sdk.loadVoltSDKByKey(
      subvoltDef.voltVaultId,
      undefined,
      extraVoltData
    ),
    goodies.providerMut.connection,
    goodies.providerMut.wallet.publicKey
  );
  const voltVault = cVoltSDK.voltVault;

  const connection = goodies.providerMut.connection;
  const ownedTokenAccounts = ownedTokenAccountsContext.ownedTokenAccounts;

  try {
    let withdrawInstructions: TransactionInstruction[] = [];
    const signers: Signer[] = [];
    if (!ownedTokenAccounts) {
      throw new Error(
        "Token account info not yet loaded. Wait a few seconds and try again"
      );
    }

    let depositTokenDest: PublicKey | null;
    const depositTokenAccounts =
      ownedTokenAccounts[subvoltDef.depositToken.address];

    if (subvoltDef.depositToken.address === WRAPPED_SOL_ADDRESS) {
      const rentBalance = await connection.getMinimumBalanceForRentExemption(
        AccountLayout.span
      );
      // Check if the wrapped token account already exists
      const {
        instructions: wrapSolInstructions,
        newTokenAccount: wrappedSolAccount,
      } = await initializeTokenAccountTx({
        connection: connection,
        payerKey: goodies.publicKey,
        mintPublicKey: new PublicKey(WRAPPED_SOL_ADDRESS),
        owner: goodies.publicKey,
        rentBalance: rentBalance,
      });
      withdrawInstructions = withdrawInstructions.concat(wrapSolInstructions);
      signers.push(wrappedSolAccount);
      depositTokenDest = wrappedSolAccount.publicKey;
    } else {
      if (!depositTokenAccounts) {
        const { tokenDest, createTokenAccountIx } =
          await createAssociatedTokenAccountInstruction(
            subvoltDef.depositToken.mintAccount,
            goodies.publicKey
          );
        withdrawInstructions.push(createTokenAccountIx);
        depositTokenDest = tokenDest;
      } else {
        betterInvariant(depositTokenAccounts, "depositTokenAccounts");

        depositTokenDest =
          getHighestAccount(depositTokenAccounts)?.pubKey ?? null;
        betterInvariant(depositTokenDest, "depositTokenDest");
      }
    }

    let pendingDepositInfo;

    try {
      pendingDepositInfo = await cVoltSDK.getPendingDepositForUser();
    } catch (err) {
      pendingDepositInfo = null;
    }
    const vaultTokenAccounts =
      ownedTokenAccounts[voltVault.vaultMint.toString()];

    let vaultTokenAccount: PublicKey | null = null;
    if (vaultTokenAccounts) {
      // previous if statement asserts that vaultTokenAccount will not be null
      const vaultTokenAccountEww = getHighestAccount(vaultTokenAccounts);
      if (vaultTokenAccountEww) {
        vaultTokenAccount = vaultTokenAccountEww.pubKey;
      }
    }
    if (!vaultTokenAccount) {
      const ataResult = await getOrCreateATA({
        provider: goodies.providerMut,
        mint: voltVault.vaultMint,
        owner: goodies.publicKey,
      });
      vaultTokenAccount = ataResult.address;

      if (ataResult.instruction) {
        withdrawInstructions.push(ataResult.instruction);
      }
    }

    if (
      pendingDepositInfo &&
      pendingDepositInfo.roundNumber.lt(voltVault.roundNumber) &&
      pendingDepositInfo?.numUnderlyingDeposited?.gtn(0)
    ) {
      console.log(
        "claiming pending LFG:",
        pendingDepositInfo?.numUnderlyingDeposited.toString()
      );
      betterInvariant(
        vaultTokenAccount,
        "vaultTokenAccount in withdraw claimPending"
      );
      withdrawInstructions.push(
        await cVoltSDK.claimPendingDeposit(vaultTokenAccount)
      );
    }

    let pendingWithdrawalInfo;

    try {
      pendingWithdrawalInfo = await cVoltSDK.getPendingWithdrawalForUser();
    } catch (err) {
      pendingWithdrawalInfo = null;
    }
    if (
      pendingWithdrawalInfo &&
      pendingWithdrawalInfo.roundNumber.lt(voltVault.roundNumber) &&
      pendingWithdrawalInfo?.numVoltRedeemed?.gtn(0)
    ) {
      console.log("adding claim pending withdrawal instruction");
      withdrawInstructions.push(
        await cVoltSDK.claimPendingWithdrawal(depositTokenDest)
      );
    }

    console.log("curr round # = ", voltVault.roundNumber.toString());
    console.log("pending deposit info =", pendingDepositInfo);
    console.log("pending withdrawal info =", pendingWithdrawalInfo);
    console.log("deposit token mint = ", subvoltDef.depositToken.address);

    if (
      withdrawInstructions.length === 0 &&
      (humanAmount === null || humanAmount.eq(0))
    ) {
      errorToast("Withdraw error", "Amount can't be less than or equal to 0");
      return false;
    }
    if (humanAmount !== null && !humanAmount.eq(0)) {
      if (subvoltDef.volt === 3) {
        const withdrawHumanAmountIns = await cVoltSDK.withdrawHumanAmount(
          humanAmount,
          vaultTokenAccount,
          depositTokenDest,
          undefined,
          subvoltDef.depositToken.normFactor
        );
        withdrawInstructions.push(withdrawHumanAmountIns);
      } else {
        const roundInfo = await cVoltSDK.getRoundByKey(
          (
            await VoltSDK.findRoundInfoAddress(
              cVoltSDK.voltKey,
              cVoltSDK.voltVault.roundNumber,
              cVoltSDK.sdk.programs.Volt.programId
            )
          )[0]
        );

        const vaultMintSupply = (
          await getMintSupplyOrZero(connection, voltVault.vaultMint)
        ).add(
          new Decimal(roundInfo.voltTokensFromPendingWithdrawals.toString())
        );

        if (vaultMintSupply.equals(0)) {
          errorToast("Withdraw error:", "Zero vault mint supply!");
          return false;
        }

        const normFactor = new Decimal(
          10 ** STRONG_SUBVOLTS[subvoltDef.globalId].depositToken.decimals
        );

        const calculateUserTokenBalance = (): Decimal | null => {
          const vaultTokenAccounts =
            ownedTokenAccounts[cVoltSDK.voltVault.vaultMint.toString()];
          if (!vaultTokenAccounts) {
            return null;
          }
          const vaultTokenAccount = getHighestAccount(vaultTokenAccounts);
          return vaultTokenAccount ? vaultTokenAccount.amount : null;
        };
        const userVoltTokenBalance = calculateUserTokenBalance();

        let withdrawalAmountNormalized = humanAmount.mul(normFactor);
        let withdrawalAmountVaultTokens = withdrawalAmountNormalized
          .mul(vaultMintSupply)
          .div(estimatedTotalUnderlyingWithoutPending.mul(normFactor))
          .toFixed(0);

        /** If user's is withdrawing between 99.8-102%, we set withdrawal to 100.0% */
        if (userVoltTokenBalance) {
          const withdrawalAmountVaultTokensDec = new Decimal(
            withdrawalAmountVaultTokens
          );
          const withdrawRatio = withdrawalAmountVaultTokensDec
            .div(userVoltTokenBalance)
            .toNumber();
          if (withdrawRatio > 0.998 && withdrawRatio < 1.02) {
            console.log("Fixing withdraw to 100%. Ratio was ", withdrawRatio);
            withdrawalAmountVaultTokens = userVoltTokenBalance.toString();
          } else {
            console.log(
              "Not fixing withdraw to 100%. Ratio: ",
              withdrawalAmountVaultTokensDec
                .div(userVoltTokenBalance)
                .toNumber()
            );
          }
        } else {
          console.error(
            "We dont have users volt token balance so cant fix to 100"
          );
        }

        if (humanAmount.gt(0)) {
          betterInvariant(
            vaultTokenAccount,
            `vaultTokenAccount is ${vaultTokenAccount} in withdraw`
          );

          const withdrawIns = await cVoltSDK.withdraw(
            new BN(withdrawalAmountVaultTokens.toString()),
            vaultTokenAccount,
            depositTokenDest
          );
          withdrawInstructions.push(withdrawIns);
        }
      }
    }

    if (subvoltDef.depositToken.address === WRAPPED_SOL_ADDRESS) {
      const closeWSolIx = Token.createCloseAccountInstruction(
        TOKEN_PROGRAM_ID,
        depositTokenDest,
        goodies.publicKey, // Send any remaining SOL to the owner
        goodies.publicKey,
        []
      );
      withdrawInstructions.push(closeWSolIx);
    }

    if (withdrawInstructions.length === 0) {
      errorToast(
        `${actionLabel} error`,
        `Withdraw instructions are empty. Attempted to withdraw ${humanAmount}. Please report this bug on Discord.`
      );
      return false;
    }

    console.log("hi starting withdraw ix logs:");
    withdrawInstructions.forEach((ix, index) => {
      console.log(
        `ix index: ${index} programId: ${ix.programId.toString()} keys:`
      );
      ix.keys.forEach((key, idx) => {
        console.log(
          `keys index: ${idx} isSigner: ${key.isSigner} isSigner: ${
            key.isWritable
          } pubKey: ${key.pubkey.toString()}`
        );
      });
    });

    const withdrawTx = new TransactionEnvelope(
      goodies.providerMut,
      withdrawInstructions,
      signers
    );

    const txResult = await goodies.handleTXWrapped(actionLabel, withdrawTx);

    setTimeout(ownedTokenAccountsContext.refresh, 5000);

    return txResult.success;
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      errorToast("Withdraw error", err.message);
    }
  }
  return false;
};

/**
 * Cancel pending withdrawals for a volt for user
 */
export const cancelPendingWithdrawalsForVolt = async (
  goodies: Goodies,
  subvoltDef: SubvoltDef10,
  ownedTokenAccountsContext: OwnedTokenAccountsContextT
) => {
  const cVoltSDK = toConnectedSDK(
    await goodies.sdk.loadVoltSDKByKey(subvoltDef.voltVaultId),
    goodies.providerMut.connection,
    goodies.providerMut.wallet.publicKey
  );

  const voltVault = cVoltSDK.voltVault;
  const ownedTokenAccounts = ownedTokenAccountsContext.ownedTokenAccounts;

  try {
    let instructions: TransactionInstruction[] = [];

    if (!ownedTokenAccounts) {
      throw new Error(
        "Token account info not yet loaded. Wait a few seconds and try again"
      );
    }

    let vaultTokenDest;
    const vaultTokenAccounts =
      ownedTokenAccounts[voltVault.vaultMint.toString()];
    console.log("vault token accounts = ", vaultTokenAccounts);

    if (!vaultTokenAccounts) {
      const { tokenDest, createTokenAccountIx } =
        await createAssociatedTokenAccountInstruction(
          voltVault.vaultMint,
          goodies.publicKey
        );
      instructions.push(createTokenAccountIx);
      vaultTokenDest = tokenDest;
    } else {
      betterInvariant(vaultTokenAccounts, "vaultTokenAccounts");

      vaultTokenDest = getHighestAccount(vaultTokenAccounts)?.pubKey;
    }
    betterInvariant(
      vaultTokenDest,
      "vaultTokenDest in cancel pending withdrawals"
    );
    betterInvariant(
      goodies.providerMut,
      "wallet not connected (providerMut missing)"
    );

    instructions.push(await cVoltSDK.cancelPendingWithdrawal(vaultTokenDest));

    if (instructions.length === 0) {
      errorToast(
        `Cancel Pending Withdrawals error`,
        `Cancel Pending Withdrawals instructions are empty. Please report this bug on Discord.`
      );
      return false;
    }

    const sProvider = SolanaProvider.load({
      connection: goodies.providerMut.connection,
      sendConnection: goodies.providerMut.connection,
      wallet: goodies.providerMut.wallet,
      opts: goodies.providerMut.opts,
    });

    const cancelPendingWithdrawalsTx = new TransactionEnvelope(
      sProvider,
      instructions
    );

    const txResult = await goodies.handleTXWrapped(
      "Cancel Pending Withdrawals",
      cancelPendingWithdrawalsTx
    );

    setTimeout(ownedTokenAccountsContext.refresh, 5000);
    return txResult.success;
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      errorToast("Cancel Pending Withdrawals error", err.message);
    }
  }
  return false;
};

/**
 * Cancel pending deposits for a volt for user
 */
export const cancelPendingDepositForVolt = async (
  goodies: Goodies,
  subvoltDef: SubvoltDef10,
  ownedTokenAccountsContext: OwnedTokenAccountsContextT
) => {
  const cVoltSDK = toConnectedSDK(
    await goodies.sdk.loadVoltSDKByKey(subvoltDef.voltVaultId),
    goodies.providerMut.connection,
    goodies.providerMut.wallet.publicKey
  );
  const connection = goodies.providerMut.connection;
  const ownedTokenAccounts = ownedTokenAccountsContext.ownedTokenAccounts;

  try {
    let instructions: TransactionInstruction[] = [];
    const signers: Signer[] = [];

    if (!ownedTokenAccounts) {
      throw new Error(
        "Token account info not yet loaded. Wait a few seconds and try again"
      );
    }

    let depositTokenDest: PublicKey | null;
    const depositTokenAccounts =
      ownedTokenAccounts[subvoltDef.depositToken.address];

    if (subvoltDef.depositToken.address === WRAPPED_SOL_ADDRESS) {
      const rentBalance = await connection.getMinimumBalanceForRentExemption(
        AccountLayout.span
      );
      // Check if the wrapped token account already exists
      const {
        instructions: wrapSolInstructions,
        newTokenAccount: wrappedSolAccount,
      } = await initializeTokenAccountTx({
        connection: connection,
        payerKey: goodies.publicKey,
        mintPublicKey: new PublicKey(WRAPPED_SOL_ADDRESS),
        owner: goodies.publicKey,
        rentBalance: rentBalance,
      });
      instructions = instructions.concat(wrapSolInstructions);
      signers.push(wrappedSolAccount);
      depositTokenDest = wrappedSolAccount.publicKey;
    } else {
      if (!depositTokenAccounts) {
        const ataResult = await getOrCreateATA({
          provider: goodies.providerMut,
          mint: subvoltDef.depositToken.mintAccount,
          owner: goodies.publicKey,
        });
        depositTokenDest = ataResult.address;

        if (ataResult.instruction) {
          instructions.push(ataResult.instruction);
        }
      } else {
        betterInvariant(depositTokenAccounts, "depositTokenAccounts");

        depositTokenDest =
          getHighestAccount(depositTokenAccounts)?.pubKey ?? null;
        betterInvariant(depositTokenDest, "depositTokenDest");
      }
    }

    instructions.push(await cVoltSDK.cancelPendingDeposit(depositTokenDest));

    if (instructions.length === 0) {
      errorToast(
        `Cancel Pending Deposit error`,
        `Cancel Pending Deposit instructions are empty. Please report this bug on Discord.`
      );
      return false;
    }

    if (subvoltDef.depositToken.address === WRAPPED_SOL_ADDRESS) {
      const closeWSolIx = Token.createCloseAccountInstruction(
        TOKEN_PROGRAM_ID,
        depositTokenDest,
        goodies.publicKey, // Send any remaining SOL to the owner
        goodies.publicKey,
        []
      );
      instructions.push(closeWSolIx);
    }

    const sProvider = SolanaProvider.load({
      connection: goodies.providerMut.connection,
      sendConnection: goodies.providerMut.connection,
      wallet: goodies.providerMut.wallet,
      opts: goodies.providerMut.opts,
    });

    const cancelPendingDepositTx = new TransactionEnvelope(
      sProvider,
      instructions,
      signers
    );

    const txResult = await goodies.handleTXWrapped(
      "Cancel Pending Deposit",
      cancelPendingDepositTx
    );

    setTimeout(ownedTokenAccountsContext.refresh, 5000);

    return txResult.success;
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      errorToast("Cancel Pending Deposit error", err.message);
    }
  }
  return false;
};

/**
 * Claim pending withdraw. Used for depracted mints as well
 */
export const claimPendingWithdraw = async (
  goodies: Goodies,
  subvoltDef: SubvoltDef10,
  ownedTokenAccountsContext: OwnedTokenAccountsContextT,
  tokenMint: PublicKey,
  /**
   * The withdraw button is complicated. So lets display the info consistently
   * between the frontend and the withdraw
   */
  actionLabel: string,
  extraVoltData?: ExtraVoltData | undefined
): Promise<boolean> => {
  const cVoltSDK = toConnectedSDK(
    await goodies.sdk.loadVoltSDKByKey(
      subvoltDef.voltVaultId,
      undefined,
      extraVoltData
    ),
    goodies.providerMut.connection,
    goodies.providerMut.wallet.publicKey
  );
  const voltVault = cVoltSDK.voltVault;

  const connection = goodies.providerMut.connection;
  const ownedTokenAccounts = ownedTokenAccountsContext.ownedTokenAccounts;

  try {
    let claimInstructions: TransactionInstruction[] = [];
    const signers: Signer[] = [];
    if (!ownedTokenAccounts) {
      throw new Error(
        "Token account info not yet loaded. Wait a few seconds and try again"
      );
    }

    let depositTokenDest: PublicKey | null;
    const depositTokenAccounts = ownedTokenAccounts[tokenMint.toString()];

    if (tokenMint.toString() === WRAPPED_SOL_ADDRESS) {
      const rentBalance = await connection.getMinimumBalanceForRentExemption(
        AccountLayout.span
      );
      // Check if the wrapped token account already exists
      const {
        instructions: wrapSolInstructions,
        newTokenAccount: wrappedSolAccount,
      } = await initializeTokenAccountTx({
        connection: connection,
        payerKey: goodies.publicKey,
        mintPublicKey: new PublicKey(WRAPPED_SOL_ADDRESS),
        owner: goodies.publicKey,
        rentBalance: rentBalance,
      });
      claimInstructions = claimInstructions.concat(wrapSolInstructions);
      signers.push(wrappedSolAccount);
      depositTokenDest = wrappedSolAccount.publicKey;
    } else {
      if (!depositTokenAccounts) {
        const { tokenDest, createTokenAccountIx } =
          await createAssociatedTokenAccountInstruction(
            // subvoltDef.depositToken.mintAccount,
            tokenMint,
            goodies.publicKey
          );
        claimInstructions.push(createTokenAccountIx);
        depositTokenDest = tokenDest;
      } else {
        betterInvariant(depositTokenAccounts, "depositTokenAccounts");

        depositTokenDest =
          getHighestAccount(depositTokenAccounts)?.pubKey ?? null;
        betterInvariant(depositTokenDest, "depositTokenDest");
      }
    }

    let pendingWithdrawalInfo;

    try {
      pendingWithdrawalInfo = await cVoltSDK.getPendingWithdrawalForUser();
    } catch (err) {
      pendingWithdrawalInfo = null;
    }
    if (
      pendingWithdrawalInfo &&
      pendingWithdrawalInfo.roundNumber.lt(voltVault.roundNumber) &&
      pendingWithdrawalInfo?.numVoltRedeemed?.gtn(0)
    ) {
      console.log("adding claim pending withdrawal instruction");
      claimInstructions.push(
        await cVoltSDK.claimPendingWithdrawal(depositTokenDest)
      );
    }

    console.log("curr round # = ", voltVault.roundNumber.toString());
    console.log("pending withdrawal info =", pendingWithdrawalInfo);
    console.log("deposit token mint = ", tokenMint.toString());

    if (tokenMint.toString() === WRAPPED_SOL_ADDRESS) {
      const closeWSolIx = Token.createCloseAccountInstruction(
        TOKEN_PROGRAM_ID,
        depositTokenDest,
        goodies.publicKey, // Send any remaining SOL to the owner
        goodies.publicKey,
        []
      );
      claimInstructions.push(closeWSolIx);
    }

    if (claimInstructions.length === 0) {
      errorToast(
        `${actionLabel}`,
        `You have no old tokens to claim! (before the wormhole migration)`
      );
      return false;
    }

    const claimTx = new TransactionEnvelope(
      goodies.providerMut,
      claimInstructions,
      signers
    );

    const txResult = await goodies.handleTXWrapped(actionLabel, claimTx);
    setTimeout(ownedTokenAccountsContext.refresh, 5000);

    return txResult.success;
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      errorToast("Claim error", err.message);
    }
  }
  return false;
};

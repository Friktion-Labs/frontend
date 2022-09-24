import React, { useCallback, useEffect, useMemo } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useAppWallet } from "features/wallet";
import { useState } from "react";
import { EwwTokenAccount } from "../all_types";
import useOwnedTokenAccounts from "../hooks/useOwnedTokenAccounts";
import useAssetList from "../hooks/useAssetList";
import { Transaction } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import { createAssociatedTokenAccountInstruction } from "../utils/instructions/token";
import { buildAirdropTokensIx } from "../utils/airdropInstructions";
import { PendingTransaction } from "@saberhq/solana-contrib";
import { getHighestAccount } from "../utils/token";
import { Decimal as BigNumber } from "decimal.js";
import BN from "bn.js";
import invariant from "tiny-invariant";
import {
  localhostAlertForTypescriptError,
  softInvariant,
} from "../utils/localhostAlert";
import {
  errorToast,
  simpleToast,
  successToast,
} from "../utils/yummyNotifications";
import styled from "@emotion/styled";
import { AsyncButton09 } from "./Button09";
import { css } from "@emotion/react";
import { useProviders } from "../hooks/useProvider";
import { ImportantAssetLogos } from "./greatLogos/assetLogos";
import { useAppConnection } from "features/connection";

// Old type
type FaucetToken = {
  faucetAddress: string;
  mint: string; // 🗑 This thing used to be mint? ... huh? why would it ever be not null. Why is this not a PublicKey
  decimals: number;
};

const REACT_APP_DEVNET_FAUCET_BTC = process.env.REACT_APP_DEVNET_FAUCET_BTC;
const REACT_APP_DEVNET_FAUCET_USDC = process.env.REACT_APP_DEVNET_FAUCET_USDC;
invariant(
  REACT_APP_DEVNET_FAUCET_BTC,
  "REACT_APP_DEVNET_FAUCET_BTC not found in assets in views/faucet"
);
invariant(
  REACT_APP_DEVNET_FAUCET_USDC,
  "REACT_APP_DEVNET_FAUCET_USDC not found in assets in views/faucet"
);

export const ZeroNineFaucet = () => {
  const { network } = useAppConnection();
  const { readonlyProvider } = useProviders();
  const connection = readonlyProvider.connection;
  const { publicKey, sendTransaction } = useAppWallet();
  const { normalizationFactor } = useAssetList();
  const { ownedTokenAccounts: accounts, refresh } = useOwnedTokenAccounts();

  const btcAsset = useMemo(
    () => ({
      name: "Bitcoin",
      symbol: "BTC",
      mint: new PublicKey("C6kYXcaRUMqeBF5fhg165RWU7AnpT9z92fvKNoMqjmz6"),
      iconLink: ImportantAssetLogos.BTC,
      decimals: 9,
    }),
    []
  );
  console.log("BTC", btcAsset);
  const BTC: FaucetToken = useMemo(() => {
    return {
      mint: btcAsset.mint.toString(),
      decimals: btcAsset.decimals,
      faucetAddress: REACT_APP_DEVNET_FAUCET_BTC,
    };
  }, [btcAsset]);

  const usdcAsset = useMemo(
    () => ({
      name: "USDC",
      symbol: "USDC",
      mint: new PublicKey("EDAgjAqGP39wRLZ4yqWJyNb1AExbzcvX12zNe9b89b9G"),
      iconLink: ImportantAssetLogos.USDC,
      decimals: 2,
    }),
    []
  );
  const USDC: FaucetToken | null = useMemo(() => {
    if (!usdcAsset) return null;
    return {
      mint: usdcAsset.mint.toString(),
      decimals: usdcAsset.decimals,
      faucetAddress: REACT_APP_DEVNET_FAUCET_USDC,
    };
  }, [usdcAsset]);

  const btcAccount = useMemo(() => {
    if (!BTC) return null;
    return getHighestAccount(accounts?.[BTC?.mint ?? ""] || []);
  }, [accounts, BTC]);
  const usdcAccount = useMemo(() => {
    if (!USDC) return null;
    console.log("updating usdc account");
    return getHighestAccount(accounts?.[USDC?.mint ?? ""] || []);
  }, [accounts, USDC]);

  const [btcBalance, setBtcBalance] = useState<number | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!connection || !BTC || !BTC?.mint) return;

    const helper = async () => {
      softInvariant(BTC.mint);
      const normFactor = await normalizationFactor(connection, BTC?.mint);
      const newBtcBalance = btcAccount
        ? btcAccount.amount.div(normFactor).toNumber()
        : 0;
      console.log("btc: ", newBtcBalance);
      setBtcBalance(newBtcBalance);
    };

    helper();
  }, [normalizationFactor, btcAccount, BTC, connection]);

  useEffect(() => {
    if (!connection || !USDC || !USDC?.mint) return;

    const helper = async () => {
      softInvariant(USDC.mint);

      const normFactor = await normalizationFactor(connection, USDC.mint);
      const newUsdcBalance = usdcAccount
        ? usdcAccount.amount.div(normFactor).toNumber()
        : 0;
      setUsdcBalance(newUsdcBalance);
    };

    helper();
  }, [normalizationFactor, usdcAccount, USDC, connection]);

  const [balance, setBalance] = useState<number | null>(null);

  const refetchSOL = useCallback(async () => {
    if (publicKey && connection) {
      setBalance(await connection.getBalance(publicKey));
    }
  }, [connection, publicKey]);

  useEffect(() => {
    refetchSOL();
  }, [refetchSOL]);

  const handleClaimSOL = useCallback(async () => {
    if (!connection || !publicKey) {
      return;
    }
    simpleToast(`Claiming SOL...`);
    try {
      const txSig = await connection.requestAirdrop(
        publicKey,
        LAMPORTS_PER_SOL * 2
      );
      console.log("waiting on pending transaction");
      await new PendingTransaction(connection, txSig).wait({
        commitment: "confirmed",
        retries: 3,
        maxRetryTime: 2000,
      });
      successToast("Claim SOL", `Success!`);
    } catch (err) {
      errorToast(`Claim sol`, `Rate limited, please try again in a minute!`);
    }

    await refetchSOL();
  }, [publicKey, connection, refetchSOL]);

  const createAccountsAndAirdrop = useCallback(
    async (
      asset: FaucetToken,
      existingAccount: EwwTokenAccount | undefined | null,
      amount: number,
      message: string
    ) => {
      if (!publicKey || !connection) {
        return;
      }
      try {
        if (!asset.mint) {
          localhostAlertForTypescriptError(
            "why does FaucetToken allow mint to be false?"
          );
        }
        invariant(asset.mint, "asset.mint in FaucetToken was false?");
        let receivingAccountPublicKey = existingAccount?.pubKey;
        const tx = new Transaction();
        const mintPublicKey = new PublicKey(asset.mint);

        if (!existingAccount) {
          const [ix, associatedTokenPublicKey] =
            await createAssociatedTokenAccountInstruction({
              payer: publicKey,
              owner: publicKey,
              mintPublicKey,
            });
          tx.add(ix);
          receivingAccountPublicKey = associatedTokenPublicKey;
        }

        const normFactor = await normalizationFactor(
          connection,
          asset.mint.toString()
        );
        const amountToDrop = new BigNumber(amount).mul(normFactor);

        const airdropIx = await buildAirdropTokensIx(
          new BN(amountToDrop.toString()),
          undefined as unknown as PublicKey, // admin key, not needed
          mintPublicKey,
          receivingAccountPublicKey as PublicKey,
          new PublicKey(asset.faucetAddress)
        );
        tx.add(airdropIx);

        await sendTransaction(tx, connection);

        invariant(
          receivingAccountPublicKey,
          "receivingAccountPublicKey in views/faucet"
        );

        refresh();
        successToast(message, `Successfully claimed `);
      } catch (err) {
        console.log("problem when airdropping: error");
        console.log(err);
        if (err instanceof Error) {
          errorToast("Airdrop claim error", err.message);
        }
        // pushErrorNotification(err);
      }
    },
    [publicKey, connection, normalizationFactor, refresh, sendTransaction]
  );

  const handleClaimBTC = useCallback(async () => {
    if (!BTC) return null;
    await createAccountsAndAirdrop(
      BTC,
      btcAccount,
      10,
      "Claim 10 BTC" // 🗑 unused by createAccountsAndAirdrop()
    );
  }, [createAccountsAndAirdrop, BTC, btcAccount]);

  const handleClaimUSDC = useCallback(async () => {
    if (!USDC) return null;
    await createAccountsAndAirdrop(
      USDC,
      usdcAccount ?? undefined,
      100_000,
      "Claim 100,000 USDC" // 🗑 huh, this is unused by createAccountsAndAirdrop()
    );
  }, [createAccountsAndAirdrop, USDC, usdcAccount]);

  if (network !== "devnet") {
    <div>The devnet faucet is only available on devnet.</div>;
  }
  return (
    <div>
      <DevnetFaucet>
        <DevnetInfo>
          <h2>Devnet Faucets</h2>
          <p>
            Claim devnet tokens here. These faucets give Devnet tokens for
            testing only, they are not real and have no value.
          </p>
          <p>
            To return to mainnet, go to{" "}
            <a href="https://friktion.fi">https://friktion.fi</a>
          </p>
        </DevnetInfo>
        <div>
          <SimpleRow>
            <SimpleRowLeft>
              <img
                css={css`
                  width: 28px;
                  height: 28px;
                `}
                alt=""
                src={ImportantAssetLogos.SOL}
              />
              <SimpleRowLeftInfo>
                Devnet SOL
                <br />
                Balance: {((balance ?? 0) / LAMPORTS_PER_SOL).toFixed(2)}
              </SimpleRowLeftInfo>
            </SimpleRowLeft>
            <AsyncButton09 onClick={handleClaimSOL} label={"Claim 2 SOL"} />
          </SimpleRow>

          <SimpleRow>
            <SimpleRowLeft>
              <img
                css={css`
                  width: 28px;
                  height: 28px;
                `}
                alt=""
                src="https://raw.githubusercontent.com/trustwallet/assets/f3ffd0b9ae2165336279ce2f8db1981a55ce30f8/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
              />
              <SimpleRowLeftInfo>
                Devnet USDC
                <br />
                Balance: {usdcBalance?.toFixed(2)}
              </SimpleRowLeftInfo>
            </SimpleRowLeft>
            <AsyncButton09
              disabled={
                !balance ? "Need SOL in wallet to claim this asset" : false
              }
              onClick={handleClaimUSDC}
              label={"Claim 100,000 USDC"}
            />
          </SimpleRow>
          <SimpleRow>
            <SimpleRowLeft>
              <img
                css={css`
                  width: 28px;
                  height: 28px;
                `}
                alt=""
                src={ImportantAssetLogos.BTC}
              />
              <SimpleRowLeftInfo>
                Devnet BTC
                <br />
                Balance: {btcBalance?.toFixed(4)}
              </SimpleRowLeftInfo>
            </SimpleRowLeft>
            <AsyncButton09
              disabled={
                !balance ? "Need SOL in wallet to claim this asset" : false
              }
              onClick={handleClaimBTC}
              label={"Claim 10 BTC"}
            />
          </SimpleRow>
        </div>
      </DevnetFaucet>
      <DevnetFaucet>
        <DevnetInfo>
          <h2>Devnet Faucets</h2>
          <p>
            Claim devnet tokens here. These faucets give Devnet tokens for
            testing only, they are not real and have no value.
          </p>
          <p>
            To return to mainnet, go to{" "}
            <a href="https://friktion.fi">https://friktion.fi</a>
          </p>
        </DevnetInfo>
        <div>
          <SimpleRow>
            <SimpleRowLeft>
              <img
                css={css`
                  width: 28px;
                  height: 28px;
                `}
                alt=""
                src="https://raw.githubusercontent.com/trustwallet/assets/f3ffd0b9ae2165336279ce2f8db1981a55ce30f8/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
              />
              <SimpleRowLeftInfo>
                Devnet USDC
                <br />
                Balance: {usdcBalance?.toFixed(2)}
              </SimpleRowLeftInfo>
            </SimpleRowLeft>
            <AsyncButton09
              disabled={
                !balance ? "Need SOL in wallet to claim this asset" : false
              }
              onClick={handleClaimUSDC}
              label={"Claim 100,000 USDC"}
            />
          </SimpleRow>
        </div>
      </DevnetFaucet>
    </div>
  );
};

const DevnetFaucet = styled.div`
  max-width: 500px;
  margin: 50px auto;
  border-radius: 4px;
  /* background: #222; */
  padding: 0 20px;
`;
const DevnetInfo = styled.div`
  max-width: 380px;
  font-size: 15px;
  margin: 0 auto;
  padding: 16px 20px 16px 20px;
`;

const SimpleRow = styled.div`
  display: flex;
  justify-content: space-between;
  background: hsl(230, 15%, 20%);
  margin-bottom: 18px;
  border-radius: 4px;
  &:last-child {
    border-bottom: none;
  }
  padding: 16px 20px;
  @media screen and (max-width: 490px) {
    flex-wrap: wrap;
    padding: 20px 20px;
    justify-content: center;
  }

  .Button09 {
    min-width: 200px;
  }
`;

const SimpleRowLeft = styled.div`
  display: flex;
  align-items: center;

  @media screen and (max-width: 490px) {
    width: 100%;
    justify-content: center;
    margin-bottom: 10px;
  }
`;

const SimpleRowLeftInfo = styled.div`
  margin-left: 20px;
  line-height: 1.3;

  @media screen and (max-width: 490px) {
    margin-left: 16px;
    min-width: 140px;
  }
`;

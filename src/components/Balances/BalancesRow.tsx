import React, { useEffect, useMemo, useState } from "react";
import useOwnedTokenAccounts from "../../hooks/useOwnedTokenAccounts";
import { getHighestAccount } from "../../utils/token";
import Decimal from "decimal.js";
import { useAppWallet } from "features/wallet";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useFriktionSDK } from "../../hooks/useFriktionSDK";
import { UltraToken } from "../../09/registry10";
import styled from "@emotion/styled";
import { useMarkPrices } from "../../09/MarkPrices10";
import {
  formatUSDCentsRoundDown,
  ultraGreatFloorLocaleN,
} from "../../09/format09";
interface Props {
  token: UltraToken;
}

export const BalancesRow: React.FC<Props> = ({ token }: Props) => {
  const sdk = useFriktionSDK();
  const connection = sdk.readonlyProvider.connection;
  const { publicKey } = useAppWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const { ownedTokenAccounts: accounts } = useOwnedTokenAccounts();
  const account = useMemo(() => {
    return getHighestAccount(accounts?.[token.mintAccount.toString()] || []);
  }, [accounts, token.mintAccount]);

  const { markPrices } = useMarkPrices();

  useEffect(() => {
    if (!connection || !publicKey) return;

    const helper = async () => {
      if (
        token.mintAccount.toString() !==
        "So11111111111111111111111111111111111111112"
      ) {
        const newBalance = account
          ? account.amount.div(token.normFactor).toNumber()
          : 0;
        setBalance(newBalance);
      } else {
        const lamports = await connection.getBalance(publicKey);
        setBalance(lamports / LAMPORTS_PER_SOL);
      }
    };

    helper();
  }, [token.normFactor, account, token.mintAccount, connection, publicKey]);

  // Do not remove the classname. The class name is used in the e2e test
  return (
    <BalancesRowContainer
      key={token.name}
      className={
        "balanceRow " +
        "myBalancesForTesting" +
        token.mintAccount.toString() +
        " " +
        (!balance ? " falsyBalance" : "")
      }
    >
      <BalancesRowLeft>
        <img src={token.icon} width="32px" height="32px" alt="" />
      </BalancesRowLeft>
      <BalancesRowRight>
        <div>
          {balance
            ? ultraGreatFloorLocaleN(
                token,
                new Decimal(balance),
                token.displayDecimals
              )
            : "..."}{" "}
          {token.symbol}
        </div>
        <div>
          &nbsp;{" "}
          {balance && markPrices
            ? "≈" + formatUSDCentsRoundDown(markPrices[token.symbol] * balance)
            : ""}
        </div>
      </BalancesRowRight>
    </BalancesRowContainer>
  );
};

const BalancesRowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  color: #fff;
  padding: 8px 16px;
  line-height: 1.3;
  align-items: center;
  background: linear-gradient(hsl(230, 15%, 32%), hsl(230, 15%, 25%) 80%);
  border-radius: 4px;

  &.falsyBalance {
    opacity: 0.5;
    background: linear-gradient(hsl(230, 15%, 24%), hsl(230, 15%, 15%) 80%);
  }
`;

const BalancesRowLeft = styled.div`
  /* background: red; */
`;

const BalancesRowRight = styled.div`
  /* background: green; */
  text-align: right;
`;

import { css, SerializedStyles } from "@emotion/react";
import { Typography } from "common/components/Typography";
import { useAppWallet } from "features/wallet";
import useOwnedTokenAccounts from "hooks/useOwnedTokenAccounts";
import { useTotalDepositedValue } from "./useTotalDepositedValue";

interface WalletInfoChipProps {
  forceShowDepositValue: boolean;
  css?: SerializedStyles;
}

export const WalletInfoChip: React.VFC<WalletInfoChipProps> = ({
  forceShowDepositValue,
  ...rest
}) => {
  const totalDepositedValue = useTotalDepositedValue();
  const { loadingOwnedTokenAccounts, isMarketMaker } = useOwnedTokenAccounts();
  const { isSafeApp } = useAppWallet();

  return (
    <div
      className="walletInfoChip"
      css={(theme) => css`
        border-radius: 20px;
        padding: 2px 8px;
        min-width: 64px;
        text-align: center;
        background-color: ${theme.palette.mode === "dark"
          ? theme.palette.grey[800]
          : theme.palette.grey[200]};
      `}
      {...rest}
    >
      <Typography variant="bodyXs">
        {forceShowDepositValue
          ? totalDepositedValue
          : isSafeApp
          ? "Snowflake Safe"
          : loadingOwnedTokenAccounts
          ? "..."
          : isMarketMaker
          ? "Institution"
          : totalDepositedValue}
      </Typography>
    </div>
  );
};

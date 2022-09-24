import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useTheme } from "@mui/material";
import { AppButton } from "common/components/Button";
import { useWeb3React } from "@web3-react/core";
import { useAppWallet } from "features/wallet";
import { useAppConnection } from "features/connection";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { getName } from "features/wormhole";

export const WalletActions = () => {
  const theme = useTheme();
  const { account: evmWalletAddress, connector, isActive } = useWeb3React();
  const { disconnect, isSafeApp } = useAppWallet();
  const { setNetwork, network } = useAppConnection();

  return (
    <WalletActionsLayout>
      <ActionButton
        variant="outlined"
        color={theme.palette.friktion.linear}
        onClick={() => {
          if (network === "devnet") {
            setNetwork(WalletAdapterNetwork.Mainnet);
            localStorage.setItem("lastNetwork", "mainnet-beta");
            window.location.reload();
          } else {
            setNetwork(WalletAdapterNetwork.Devnet);
            localStorage.setItem("lastNetwork", "devnet");
            window.location.reload();
          }
        }}
      >
        {`Switch to ${network === "devnet" ? "mainnet-beta" : "devnet"}`}
      </ActionButton>
      {!isSafeApp && (
        <ActionButton
          css={css`
            color: #000000;
          `}
          onClick={disconnect}
          color={theme.palette.friktion.linear}
        >
          Disconnect wallet
        </ActionButton>
      )}
      {evmWalletAddress && isActive && (
        <ActionButton
          css={css`
            color: #000000;
          `}
          color={theme.palette.friktion.linear}
          onClick={() => {
            connector.deactivate();
          }}
        >
          {`Disconnect ${getName(connector)}`}
        </ActionButton>
      )}
    </WalletActionsLayout>
  );
};

const WalletActionsLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ActionButton = styled(AppButton)`
  width: 100%;
  padding-top: 8px;
  padding-bottom: 8px;
`;

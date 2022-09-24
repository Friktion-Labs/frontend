import { css, Interpolation, Theme } from "@emotion/react";
import styled from "@emotion/styled";
import { useTheme } from "@mui/material";
import { AppButton } from "common/components/Button";
import { Typography } from "common/components/Typography";
import walletIllustration from "../assets/wallet-illustration.svg";
import { useAppWalletModal } from "../hooks/useAppWalletModal";

interface WalletsIntroProps {
  css?: Interpolation<Theme>;
  goToGetWalletScreen: () => void;
}

export const WalletIntro = ({
  goToGetWalletScreen,
  ...rest
}: WalletsIntroProps) => {
  const theme = useTheme();
  const { setWalletToDownload } = useAppWalletModal();

  return (
    <WalletIntroContainer {...rest}>
      <WalletIntroContent>
        <img
          css={css`
            margin: auto;
          `}
          src={walletIllustration}
          alt="walletIllustration"
        />
        <Typography
          variant="h4"
          css={(theme) => css`
            font-weight: 600;
            color: ${theme.palette.mode === "dark"
              ? theme.palette.grey[900]
              : theme.palette.grey[900]};
          `}
        >
          New to wallets?
        </Typography>
        <Typography
          variant="bodyS"
          css={(theme) => css`
            font-weight: 500;
            color: ${theme.palette.mode === "dark"
              ? theme.palette.grey[600]
              : theme.palette.grey[600]};
            margin-bottom: 24px;
          `}
        >
          Wallets help you safely manage your crypto and sign into web3 apps
          like Friktion.
        </Typography>
        <AppButton
          css={css`
            height: 38px;
            padding-top: 0;
            padding-bottom: 0;
          `}
          color={theme.palette.pink[700]}
          onClick={() => {
            setWalletToDownload(null);
            goToGetWalletScreen();
          }}
        >
          Get a wallet
        </AppButton>
      </WalletIntroContent>
    </WalletIntroContainer>
  );
};

const WalletIntroContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

const WalletIntroContent = styled.div`
  text-align: center;
`;

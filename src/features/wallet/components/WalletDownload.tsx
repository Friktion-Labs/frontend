import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Button, useTheme } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
  PhantomWalletAdapter,
  PhantomWalletName,
} from "@solana/wallet-adapter-wallets";
import { AppButton } from "common/components/Button";
import { Typography } from "common/components/Typography";
import { useEffect } from "react";
import { useAppWalletModal } from "../hooks/useAppWalletModal";
import { WalletIconContainer } from "./WalletIconContainer";
import cntrlRButton from "../../../09/utilImages/cntrlR.png";
import exportIcon from "../../../09/utilImages/exportIcon.png";

interface WalletDownloadProps {
  goToGetWalletScreen: () => void;
  goToConnectWalletScreen: () => void;
}

const PHANTOM_WALLET = new PhantomWalletAdapter();

export const WalletDownload = ({
  goToGetWalletScreen,
  goToConnectWalletScreen,
}: WalletDownloadProps) => {
  const theme = useTheme();
  const { walletToDownload } = useAppWalletModal();

  useEffect(() => {
    if (walletToDownload) {
      goToGetWalletScreen();
    }
  }, [walletToDownload, goToGetWalletScreen]);

  return (
    <WalletDownloadContainer>
      <Button
        css={(theme) => css`
          outline: 0 !important;
          font-weight: 500;
          ${theme.typography.bodyM};
          color: #000000;
          align-self: flex-start;
          text-transform: none;
          margin: 14px 0 0 12px;
        `}
        startIcon={<ChevronLeftIcon htmlColor={theme.palette.common.black} />}
        onClick={goToConnectWalletScreen}
      >
        Back
      </Button>
      <ContentLayout>
        <WalletIconContainer
          solanaWallet={walletToDownload}
          css={css`
            margin-bottom: 20px;
          `}
        >
          <img
            width="62px"
            height="62px"
            src={walletToDownload?.adapter.icon ?? PHANTOM_WALLET.icon}
            alt={walletToDownload?.adapter.name ?? PhantomWalletName}
          />
        </WalletIconContainer>
        <Typography
          variant="h4"
          css={(theme) => css`
            font-weight: 500;
            color: ${theme.palette.grey[900]};
            margin-bottom: 4px;
          `}
        >
          {walletToDownload !== null
            ? `Get ${walletToDownload?.adapter.name}`
            : "Get a Wallet"}
        </Typography>
        <Typography
          variant="bodyS"
          css={(theme) => css`
            font-weight: 500;
            color: ${theme.palette.grey[600]};
            margin-bottom: 16px;
          `}
        >
          {walletToDownload !== null ? (
            `Proceed to ${walletToDownload.adapter.name}'s website to install their wallet. Come back here and refresh page when done!`
          ) : (
            <span>
              We recommend Phantom Wallet!
              <br />
              It’s safe and easy to use Friktion with.
              <br />
              Proceed to their website to install.
            </span>
          )}
        </Typography>
        <AppButton
          as="a"
          target="_blank"
          href={walletToDownload?.adapter.url ?? "https://phantom.app/download"}
          rel="noopener noreferrer"
          css={css`
            height: 38px;
            color: #ffffff !important;
            padding: 8px 16px;
            margin-bottom: 20px;
          `}
          color={theme.palette.pink[700]}
        >
          {walletToDownload !== null ? (
            `Visit ${walletToDownload.adapter.name}`
          ) : (
            <div
              css={css`
                display: flex;
                align-items: center;
                gap: 8px;
              `}
            >
              Download <img height="14" src={exportIcon} alt="new page icon" />
            </div>
          )}
        </AppButton>
        {walletToDownload === null && (
          <Typography
            variant="bodyS"
            css={(theme) => css`
              font-weight: 500;
              color: ${theme.palette.grey[600]};
              margin-bottom: 16px;
              gap: 8px;
              display: flex;
              align-items: center;
            `}
          >
            Refresh
            <img
              css={css`
                cursor: pointer;
              `}
              height="30"
              src={cntrlRButton}
              alt="control plus r button"
              onClick={() => {
                window.location.reload();
              }}
            />
            when done!
          </Typography>
        )}
      </ContentLayout>
    </WalletDownloadContainer>
  );
};

const WalletDownloadContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentLayout = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px 40px 40px 40px;
  max-width: 365px;
  text-align: center;
  overflow: auto;
`;

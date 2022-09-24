import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Typography } from "common/components/Typography";
import { AppWallet } from "../hooks/useAppWallet";
import { WalletIcon } from "./WalletIcon";
import { WalletIconContainer } from "./WalletIconContainer";
import { XDEFIWalletName } from "@solana/wallet-adapter-wallets";

interface WalletButtonProps {
  walletName: string;
  solanaWallet?: AppWallet;
  imgSrc: string;
  detected?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const WalletButton = ({
  solanaWallet,
  walletName,
  imgSrc,
  detected,
  onClick,
  disabled,
}: WalletButtonProps) => (
  <StyledListItem title={walletName}>
    <WalletButtonContainer disabled={disabled} onClick={onClick}>
      <WalletInfoContainer>
        <WalletIconContainer solanaWallet={solanaWallet}>
          <WalletIcon
            css={css`
              filter: ${disabled
                ? "grayscale(100%)"
                : solanaWallet?.adapter.name === XDEFIWalletName
                ? "brightness(0%)"
                : "none"};
            `}
            src={imgSrc}
            alt={walletName}
          />
        </WalletIconContainer>
        <WalletName disabled={disabled} variant="bodyM">
          {walletName}
        </WalletName>
      </WalletInfoContainer>
      {detected && (
        <DetectedContainer>
          <DetectedIndicator />
          <Typography
            variant="bodyXs"
            css={(theme) => css`
              color: ${theme.palette.mode === "dark"
                ? theme.palette.grey[600]
                : theme.palette.grey[600]};
            `}
          >
            Detected
          </Typography>
        </DetectedContainer>
      )}
    </WalletButtonContainer>
  </StyledListItem>
);

const StyledListItem = styled.li`
  margin: 4px 0px;
`;

const WalletButtonContainer = styled.button<{ disabled?: boolean }>`
  text-align: left;
  gap: 8px;
  width: 100%;
  justify-content: space-between;
  display: flex;
  align-items: center;
  border: none;
  border-radius: 8px;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  margin: 0;
  outline: 0 !important;
  background: transparent;
  padding: 8px;

  ${({ disabled, theme }) =>
    disabled
      ? css``
      : css`
          &:hover {
            background: ${theme.palette.mode === "dark"
              ? theme.palette.grey[100]
              : theme.palette.grey[100]};
          }
        `}
`;

const WalletInfoContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  min-width: 0;
  flex: 1 1 auto;
`;

const DetectedContainer = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const DetectedIndicator = styled.div`
  background-color: ${({ theme }) => theme.palette.success.main};
  border-radius: 50%;
  width: 8px;
  height: 8px;
`;

const WalletName = styled(Typography)<{ disabled?: boolean }>`
  font-weight: 500;
  color: ${({ theme, disabled }) =>
    disabled
      ? "rgba(0, 0, 0, 0.26)"
      : theme.palette.mode === "dark"
      ? theme.palette.grey[900]
      : theme.palette.grey[900]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
`;

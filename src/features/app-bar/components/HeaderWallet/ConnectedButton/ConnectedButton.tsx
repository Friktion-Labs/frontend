import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useTheme } from "@mui/material";
import { AppButton } from "common/components/Button";
import { Typography } from "common/components/Typography";
import { useAppWallet } from "features/wallet";
import { useSolanaTps } from "./useSolanaTps";
import { WalletDropdown } from "./WalletDropdown";
import { WalletInfoChip } from "./WalletInfoChip";

export const ConnectedButton = () => {
  const tps = useSolanaTps();
  const { publicKey } = useAppWallet();
  const theme = useTheme();
  const windowWidth = window.innerWidth;

  if (!publicKey) {
    return null;
  }

  return (
    <WalletDropdown tps={tps}>
      <AppButton
        css={css`
          min-width: 164px;
          @media (max-width: 470px) {
            min-width: auto;
            padding: 12px 8px;
          }
        `}
        variant="outlined"
        color={theme.palette.darkBlue[600]}
      >
        <ButtonContent>
          <WalletAddress
            css={css`
              margin-right: 12px;
              @media (max-width: 470px) {
                margin-right: 4px;
              }
            `}
            variant="bodyS"
          >
            {publicKey.toBase58()}
          </WalletAddress>

          <WalletInfoChip forceShowDepositValue={windowWidth < 470} />
        </ButtonContent>
      </AppButton>
    </WalletDropdown>
  );
};

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const WalletAddress = styled(Typography)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 56px;
`;

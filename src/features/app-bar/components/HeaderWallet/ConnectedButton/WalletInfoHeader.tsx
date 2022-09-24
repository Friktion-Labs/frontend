import { css, Interpolation, Theme } from "@emotion/react";
import styled from "@emotion/styled";
import { Typography } from "common/components/Typography";
import { useAppConnection } from "features/connection";
import { useAppWallet } from "features/wallet";
import { WalletImage } from "./WalletImage";

interface WalletInfoHeaderProps {
  css?: Interpolation<Theme>;
  className?: string;
}
export const WalletInfoHeader = (props: WalletInfoHeaderProps) => {
  const { network } = useAppConnection();
  const { wallet } = useAppWallet();

  if (!wallet) {
    return null;
  }

  return (
    <HeaderContainer {...props}>
      <WalletImage />
      <WalletInfo
        css={css`
          margin-left: 14px;
        `}
      >
        <Typography
          variant="bodyXs"
          css={css`
            font-weight: 600;
          `}
        >
          {wallet.adapter.name}
        </Typography>
        <Typography
          variant="bodyXs"
          css={(theme) => css`
            color: ${theme.palette.mode === "dark"
              ? theme.palette.grey[400]
              : theme.palette.grey[600]};
            font-size: 10px;
            text-transform: capitalize;
          `}
        >
          {network}
        </Typography>
      </WalletInfo>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
`;

const WalletInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

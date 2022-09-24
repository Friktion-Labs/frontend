import { getVoltBolt } from "09/glow09";
import { css, Interpolation, Theme } from "@emotion/react";
import { useAppWalletModal } from "features/wallet";
import { Typography } from "common/components/Typography";
import { CardFooter } from "./CardFooter";
import { CardHeader } from "./CardHeader";
import { CardTitle } from "./CardTitle";
import { DesktopCardInner } from "./DesktopCardInner";

export const ConnectWalletCard = (props: { css?: Interpolation<Theme> }) => {
  const Bolt = getVoltBolt(6);
  const { setVisible } = useAppWalletModal();

  return (
    <DesktopCardInner
      css={(theme) => css`
        background: ${theme.palette.friktion.radial};
        border: none !important;
      `}
      {...props}
    >
      <CardHeader
        css={css`
          margin-bottom: 24px;
        `}
      >
        <Bolt
          css={css`
            width: 24px;
            height: 24px;
          `}
        />
        <Typography
          variant="bodyM"
          css={css`
            color: #ffffff;
          `}
        >
          Your Portfolio
        </Typography>
      </CardHeader>
      <CardTitle
        css={css`
          margin-bottom: 16px;
          color: #ffffff;
        `}
      >
        It's your turn
      </CardTitle>
      <Typography
        variant="bodyXl"
        css={css`
          flex: 1 1 auto;
          color: #ffffff;
        `}
      >
        Connect your wallet now to start building your portfolio with{" "}
        <span
          css={css`
            font-weight: 700;
          `}
        >
          Friktion.
        </span>
      </Typography>
      <CardFooter
        onClick={() => {
          setVisible(true);
        }}
        css={css`
          color: #ffffff;
        `}
      >
        Connect Wallet
        <div
          css={(theme) => css`
            clip-path: url(#chevronRightPathRelative);
            width: 6px;
            height: 12px;
            background-color: ${theme.palette.pink[600]};
          `}
        />
      </CardFooter>
    </DesktopCardInner>
  );
};

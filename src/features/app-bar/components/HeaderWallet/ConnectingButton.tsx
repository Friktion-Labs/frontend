import { css } from "@emotion/react";
import { useAppWallet } from "features/wallet";
import { WalletOutlinedButton } from "./WalletOutlinedButton";
import CancelIcon from "@mui/icons-material/Cancel";
import { IconButton } from "@mui/material";

export const ConnectingButton = () => {
  const { disconnect } = useAppWallet();

  return (
    <WalletOutlinedButton
      css={css`
        cursor: default;
        min-width: 164px;
        & > div {
          display: flex;
          gap: 4px;
          justify-content: center;
          align-items: center;
        }
        &:hover {
          background-color: initial;
        }
      `}
    >
      <span>Connecting...</span>
      <IconButton
        component="div"
        css={css`
          width: 18px;
          height: 18px;
        `}
        onClick={() => {
          disconnect().then(() => {
            window.location.reload();
          });
        }}
      >
        <CancelIcon
          css={css`
            width: 16px;
            height: 16px;
          `}
        />
      </IconButton>
    </WalletOutlinedButton>
  );
};

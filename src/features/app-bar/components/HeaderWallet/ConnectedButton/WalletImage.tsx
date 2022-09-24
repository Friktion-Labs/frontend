import { css } from "@emotion/react";
import { useAppWallet } from "features/wallet";

const imageStyles = css`
  width: 32px;
  height: 32px;
`;

export const WalletImage = () => {
  const { wallet } = useAppWallet();

  if (!wallet) {
    return null;
  }

  return (
    <img
      css={imageStyles}
      src={wallet.adapter.icon}
      alt={wallet.adapter.name + "wallet icon"}
    />
  );
};

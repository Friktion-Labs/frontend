import { useAppWallet } from "features/wallet";
import { ConnectButton } from "./ConnectButton";
import { ConnectedButton } from "./ConnectedButton";
import { ConnectingButton } from "./ConnectingButton";

export const HeaderWallet = () => {
  const { connecting, connected } = useAppWallet();

  if (connected) {
    return <ConnectedButton />;
  } else if (connecting) {
    return <ConnectingButton />;
  }

  return <ConnectButton />;
};

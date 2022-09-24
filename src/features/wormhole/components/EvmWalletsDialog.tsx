import React, { useEffect } from "react";
import styled from "@emotion/styled";
import {
  connectors,
  getName,
  getIcon,
  getIsInstalled,
} from "../utils/evmConnectors";
import { WalletDialog, WalletDialogSectionHeader } from "features/wallet";
import { WalletButton, WalletListItems } from "features/wallet";
import { WalletConnect } from "@web3-react/walletconnect";
import { css } from "@emotion/react";
import { errorToast } from "utils/yummyNotifications";

interface EvmWalletsDialogProps {
  isOpen: boolean;
  onDismiss: () => void;
  evmChainId?: number;
}

export const EvmWalletsDialog: React.VFC<EvmWalletsDialogProps> = ({
  isOpen,
  onDismiss,
  evmChainId,
}) => {
  useEffect(
    function showExodusError() {
      if (isOpen) {
        const isExodusInstalled =
          (window.ethereum as any)?.isExodus ||
          !!(window.ethereum as any)?.providers?.some(
            (provider: any) => provider.isExodus
          );
        if (isExodusInstalled) {
          errorToast(
            "Metamask wallet disabled",
            "We detected that you have Exodus wallet installed. Exodus wallet is known to cause issues with Metamask functionality. Please disable or uninstall Exodus and refresh the page in order to connect with Metamask.",
            { autoClose: false }
          );
        }
      }
    },
    [isOpen]
  );

  return (
    <WalletDialog
      aria-label="Connect EVM Wallets"
      isOpen={isOpen}
      onDismiss={onDismiss}
      css={css`
        max-width: 320px;
        height: 100%;
      `}
    >
      <EvmWalletsDialogContainer>
        <WalletDialogSectionHeader variant="bodyS">
          Connect a wallet
        </WalletDialogSectionHeader>
        <WalletListItems>
          {connectors
            .sort(([connectorA], [connectorB]) => {
              if (getIsInstalled(connectorA) && !getIsInstalled(connectorB)) {
                return -1;
              } else if (
                getIsInstalled(connectorB) &&
                !getIsInstalled(connectorA)
              ) {
                return 1;
              }

              return 0;
            })
            .map(([connector]) => {
              const walletName = getName(connector);
              const detected = getIsInstalled(connector);

              return (
                <WalletButton
                  key={`evm-wallet-${walletName}`}
                  onClick={() => {
                    connector.activate(evmChainId);
                    onDismiss();
                  }}
                  imgSrc={getIcon(connector)}
                  walletName={walletName}
                  detected={detected && !(connector instanceof WalletConnect)}
                  disabled={!detected}
                />
              );
            })}
        </WalletListItems>
      </EvmWalletsDialogContainer>
    </WalletDialog>
  );
};

const EvmWalletsDialogContainer = styled.div`
  padding: 28px 24px 8px 24px;
`;

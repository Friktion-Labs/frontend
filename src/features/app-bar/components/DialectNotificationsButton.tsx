import { useCallback, useEffect, useState } from "react";
import { ClassNames } from "@emotion/react";
import * as anchor from "@project-serum/anchor";
import {
  IncomingThemeVariables,
  NotificationsButton,
} from "@dialectlabs/react-ui";
import _ from "lodash";
import { useOnResize } from "common/hooks/useOnResize";
import { useProviders } from "hooks/useProvider";
import { appBarButtonStyles } from "./AppBarButton";
import { useTheme } from "@mui/material";
import { useAppConnection } from "features/connection";
import { useAppWallet } from "features/wallet";

const FRIKTION_PUBLIC_KEY = new anchor.web3.PublicKey(
  "CaM5p7HcvWToxbnFyEnfxJ7xJ5TPCqoL6DfhiyPnxf81"
);

interface DialectNotificationsButtonProps {
  parentContainer: HTMLDivElement;
}
export function DialectNotificationsButton({
  parentContainer,
}: DialectNotificationsButtonProps) {
  const theme = useTheme();
  const wallet = useAppWallet();
  const { providerMut } = useProviders();
  const { network } = useAppConnection();

  const [modalTop, setModalTop] = useState<number>(Number.MIN_SAFE_INTEGER);
  const updateModalTop = useCallback((parentContainer: HTMLElement) => {
    const boundingClientRect = parentContainer.getBoundingClientRect();
    setModalTop(boundingClientRect.bottom);
  }, []);
  const updateModalTopThrottled = _.throttle(updateModalTop, 100);
  const { listeningElementRef } = useOnResize(updateModalTopThrottled, {
    enableOnScrollListener: true,
  });

  useEffect(() => {
    listeningElementRef(parentContainer);
  }, [parentContainer, listeningElementRef]);

  return (
    <ClassNames>
      {({ css }) => {
        const themeVariables: IncomingThemeVariables = {
          dark: {
            bellButton: css`
              // margin-left: 0.25rem;
              // width: 42px;
              // height: 42px;
              // border-radius: 6px !important;
              background-color: hsla(230, 15%, 50%, 0.15) !important;

              ${appBarButtonStyles(theme)}
              box-shadow: none;
              @media (max-width: 834px) {
                display: none;
              }
            `,
            modalWrapper: css`
              position: fixed;
              z-index: 50;
              top: ${modalTop + 12}px;
              width: 90%;
              max-height: calc(100% - ${modalTop + 16}px);
              height: 37rem;
              left: 50%;
              transform: translateX(-50%);

              @media (min-width: 640px) {
                width: 29rem;
                left: initial;
                transform: initial;
              }
            `,
            modal: css`
              border: 1px solid #272536;
              border-radius: 0.5rem !important;
              background-color: #08070e;
            `,
          },
        };
        return (
          <NotificationsButton
            wallet={wallet}
            network={network === "mainnet-beta" ? "mainnet" : network}
            publicKey={FRIKTION_PUBLIC_KEY}
            // rpcUrl="https://solana-api.syndica.io/access-token/6sW38nSZ1Qm4WVRN4Vnbjb9EF2QudlpGZBToMtPyqoXqkIenDwJ5FVK1HdWSqqah/rpc"
            rpcUrl={providerMut?.connection?.rpcEndpoint}
            theme={"dark"}
            variables={themeVariables}
            notifications={[{ name: "Volt Rewards", detail: "Event" }]}
            channels={["web3", "email", "sms", "telegram"]}
          />
        );
      }}
    </ClassNames>
  );
}

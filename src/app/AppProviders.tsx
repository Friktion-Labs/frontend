import React, { PropsWithChildren, useMemo } from "react";
import { AssetListProvider } from "../contexts/AssetListContext";
import { OwnedTokenAccountsProvider } from "../contexts/OwnedTokenAccounts";
import { QuarrySDKProvider } from "@quarryprotocol/react-quarry";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "@emotion/styled";
import { SubvoltLoader10Provider } from "../09/SubvoltLoader10";
import { MarkPrices10Provider } from "../09/MarkPrices10";
import { UserDeposits10Provider } from "../09/UserDeposits10";
import { EvilTwinSisterOfVFACProvider } from "../contexts/EvilTwinSisterOfVFAC";
import { JupiterWrapperProvider } from "../09/JupiterWrapper";
import { CrabDataProvider } from "../09/CrabData";
import { AuctionResultsProvider } from "../09/AuctionResults";
import { QuarryDataProvider } from "../09/useQuarryData";
import ReactDOM from "react-dom";
import { AppConnectionProvider, useAppConnection } from "features/connection";
import { BasisDataProvider } from "../09/BasisData";
import {
  CrossChainBalancesProvider,
  WormholeProgressProvider,
} from "features/wormhole";
import { SearchedWalletForPortfolioPageProvider } from "../09/useSearchedWalletForPortfolioPage";
import { Container } from "@nivo/core";
import {
  AvanaWalletAdapter,
  BackpackWalletAdapter,
  BitKeepWalletAdapter,
  BitpieWalletAdapter,
  BloctoWalletAdapter,
  BraveWalletAdapter,
  CoinbaseWalletAdapter,
  GlowWalletAdapter,
  ExodusWalletAdapter,
  CloverWalletAdapter,
  Coin98WalletAdapter,
  CoinhubWalletAdapter,
  HuobiWalletAdapter,
  PhantomWalletAdapter,
  HyperPayWalletAdapter,
  KeystoneWalletAdapter,
  LedgerWalletAdapter,
  MathWalletAdapter,
  NightlyWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  SolongWalletAdapter,
  SlopeWalletAdapter,
  StrikeWalletAdapter,
  TorusWalletAdapter,
  TokenaryWalletAdapter,
  WalletConnectWalletAdapter,
  XDEFIWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { SentreWalletAdapter } from "@sentre/connector";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { AppWalletModalProvider } from "features/wallet";
import { AppWalletProvider } from "features/wallet";
import { AppSailProvider } from "./AppSailProvider";
import { EvmWalletProvider } from "features/wormhole";
import { SafeProvider } from "@snowflake-so/safe-apps-provider";
import { ProtectionDataProvider } from "09/ProtectionData";

// Render toast container as sibling of body so as to have higher z-index than ZeroNineManagementModal
const Toast = () =>
  ReactDOM.createPortal(<ToastContainerStyled />, document.body);

// add supportedTransactionVersions to SentreWalletAdapter, if not there will be a typecheck error
class SentreWalletAdapterWithSupportedTransactionVersions extends SentreWalletAdapter {
  readonly supportedTransactionVersions = null;
}

const WalletProviderWithWallets: React.FC<PropsWithChildren<unknown>> = ({
  children,
}) => {
  const { network } = useAppConnection();
  const wallets = useMemo(
    () => [
      /**
       * Select the wallets you wish to support, by instantiating wallet adapters here.
       *
       * Common adapters can be found in the npm package `@solana/wallet-adapter-wallets`.
       * That package supports tree shaking and lazy loading -- only the wallets you import
       * will be compiled into your application, and only the dependencies of wallets that
       * your users connect to will be loaded.
       */
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new CoinbaseWalletAdapter(),
      new LedgerWalletAdapter(),
      new SlopeWalletAdapter(),
      new WalletConnectWalletAdapter({
        network: network as
          | WalletAdapterNetwork.Mainnet
          | WalletAdapterNetwork.Devnet,
        options: {
          relayUrl: "wss://relay.walletconnect.com",

          // projectId from https://cloud.walletconnect.com/
          projectId: "",
          metadata: {
            name: "Friktion",
            description: "Friktion",
            url: "https://app.friktion.fi/",
            icons: [
              "https://pbs.twimg.com/profile_images/1554955845041020930/qsReid3Q_400x400.png",
            ],
          },
        },
      }),
      new SolletWalletAdapter(),
      new SolletExtensionWalletAdapter(),
      new SolongWalletAdapter(),
      new AvanaWalletAdapter(),
      new BackpackWalletAdapter(),
      new BitKeepWalletAdapter(),
      new BitpieWalletAdapter(),
      new BloctoWalletAdapter(),
      new BraveWalletAdapter(),
      new CloverWalletAdapter(),
      new Coin98WalletAdapter(),
      new CoinhubWalletAdapter(),
      new ExodusWalletAdapter(),
      new GlowWalletAdapter({
        network: network as
          | WalletAdapterNetwork.Mainnet
          | WalletAdapterNetwork.Devnet,
      }),
      new HuobiWalletAdapter(),
      new HyperPayWalletAdapter(),
      new KeystoneWalletAdapter(),
      new MathWalletAdapter(),
      new NightlyWalletAdapter(),
      new SentreWalletAdapterWithSupportedTransactionVersions({
        appId: "friktion",
      }),
      new StrikeWalletAdapter(),
      new TokenaryWalletAdapter(),
      new TorusWalletAdapter(),
      new XDEFIWalletAdapter(),
    ],
    [network]
  );
  return (
    <SafeProvider>
      <AppWalletProvider wallets={wallets} autoConnect>
        <AppWalletModalProvider>{children}</AppWalletModalProvider>
      </AppWalletProvider>
    </SafeProvider>
  );
};

export const AppProviders = ({ children }: { children?: React.ReactNode }) => (
  <EvmWalletProvider>
    <AppConnectionProvider>
      <WalletProviderWithWallets>
        <AppSailProvider>
          <SearchedWalletForPortfolioPageProvider>
            <OwnedTokenAccountsProvider>
              <AssetListProvider>
                <QuarrySDKProvider>
                  <MarkPrices10Provider>
                    <QuarryDataProvider>
                      <AuctionResultsProvider>
                        <CrabDataProvider>
                          <BasisDataProvider>
                            <ProtectionDataProvider>
                              <SubvoltLoader10Provider>
                                <EvilTwinSisterOfVFACProvider>
                                  <CrossChainBalancesProvider>
                                    <UserDeposits10Provider>
                                      <Container>
                                        <JupiterWrapperProvider>
                                          <WormholeProgressProvider>
                                            {children}
                                          </WormholeProgressProvider>
                                        </JupiterWrapperProvider>
                                        <Toast />
                                      </Container>
                                    </UserDeposits10Provider>
                                  </CrossChainBalancesProvider>
                                </EvilTwinSisterOfVFACProvider>
                              </SubvoltLoader10Provider>
                            </ProtectionDataProvider>
                          </BasisDataProvider>
                        </CrabDataProvider>
                      </AuctionResultsProvider>
                    </QuarryDataProvider>
                  </MarkPrices10Provider>
                </QuarrySDKProvider>
              </AssetListProvider>
            </OwnedTokenAccountsProvider>
          </SearchedWalletForPortfolioPageProvider>
        </AppSailProvider>
      </WalletProviderWithWallets>
    </AppConnectionProvider>
  </EvmWalletProvider>
);

const ToastContainerStyled = styled(ToastContainer)`
  .single-line-toast__body {
    min-width: 0;
    & > div {
      min-width: 0;
    }
  }
`;

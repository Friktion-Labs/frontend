import { useState } from "react";
import { css, Interpolation, Theme } from "@emotion/react";
import { WalletListItem } from "./WalletListItem";
import styled from "@emotion/styled";
import { Typography } from "common/components/Typography";
import { WalletSearch } from "./WalletSearch";
import { useWalletList } from "../hooks/useWalletList";
import { useWalletSearch } from "../hooks/useWalletSearch";
import { WalletDialogSectionHeader } from "./WalletDialogSectionHeader";
import { WalletListItems } from "./WalletListItems";

interface WalletsSectionProps {
  css?: Interpolation<Theme>;
}

export const WalletsSection = (props: WalletsSectionProps) => {
  const [detectedWallets, otherWallets] = useWalletList();

  const [searchTerm, setSearchTerm] = useState("");
  const searchResults = useWalletSearch(searchTerm);

  return (
    <WalletsSectionContainer {...props}>
      <WalletSearch
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        css={css`
          flex: 0 0 auto;
        `}
      />
      <WalletListItemsContainer>
        {searchResults === null ? (
          <>
            {detectedWallets.length > 0 && (
              <>
                <WalletDialogSectionHeader variant="bodyS">
                  Connect a wallet
                </WalletDialogSectionHeader>
                <WalletListItems>
                  {detectedWallets.map((wallet) => (
                    <WalletListItem key={wallet.adapter.name} wallet={wallet} />
                  ))}
                </WalletListItems>
              </>
            )}
            <WalletDialogSectionHeader
              variant="bodyS"
              css={css`
                margin-top: ${detectedWallets.length > 0 ? "12px" : "0px"};
              `}
            >
              {`${detectedWallets.length > 0 ? "More" : "Supported"} wallets`}
            </WalletDialogSectionHeader>
            <WalletListItems
              css={css`
                padding: 0 0 50px 0;
              `}
            >
              {otherWallets.map((wallet) => (
                <WalletListItem key={wallet.adapter.name} wallet={wallet} />
              ))}
            </WalletListItems>
          </>
        ) : (
          <>
            <WalletDialogSectionHeader variant="bodyS">
              Search results
            </WalletDialogSectionHeader>
            <WalletListItems>
              {searchResults.length === 0 ? (
                <EmptySearchResults variant="bodyXs">
                  No exact matches found
                </EmptySearchResults>
              ) : (
                searchResults.map((wallet) => (
                  <WalletListItem key={wallet.adapter.name} wallet={wallet} />
                ))
              )}
            </WalletListItems>
          </>
        )}
      </WalletListItemsContainer>
    </WalletsSectionContainer>
  );
};

const WalletsSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const WalletListItemsContainer = styled.div`
  overflow: auto;
  padding: 28px 10px 8px 24px;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &:hover::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(192, 192, 192, 0);
    border-radius: 20px;
  }
  &:hover::-webkit-scrollbar-thumb {
    background-color: rgba(192, 192, 192, 1);
  }

  scrollbar-color: rgba(192, 192, 192, 0) transparent;
  scrollbar-width: thin;
  &:hover {
    scrollbar-color: rgba(192, 192, 192, 1) transparent;
  }
`;

const EmptySearchResults = styled(Typography)`
  text-align: center;
  color: ${({ theme }) => theme.palette.grey[400]};
`;

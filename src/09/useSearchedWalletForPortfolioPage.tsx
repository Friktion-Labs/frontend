import { PublicKey } from "@solana/web3.js";
import React, { createContext, useContext, useState } from "react";

export type SearchedWalletForPortfolioPageType = {
  searchedWalletForPortfolioPage: PublicKey | null;
  setSearchedWalletForPortfolioPage: React.Dispatch<
    React.SetStateAction<PublicKey | null>
  >;
};

/**
 * If searchedWalletForPortfolioPage is set that means user wants to stalk this portfolio hehehe
 */
export const SearchedWalletForPortfolioPageContext =
  createContext<SearchedWalletForPortfolioPageType>({
    searchedWalletForPortfolioPage: null,
    setSearchedWalletForPortfolioPage: () => {},
  });

export const SearchedWalletForPortfolioPageProvider: React.FC<{
  children: any;
}> = ({ children }) => {
  const [searchedWalletForPortfolioPage, setSearchedWalletForPortfolioPage] =
    useState<PublicKey | null>(null);

  return (
    <SearchedWalletForPortfolioPageContext.Provider
      value={{
        searchedWalletForPortfolioPage,
        setSearchedWalletForPortfolioPage,
      }}
    >
      {children}
    </SearchedWalletForPortfolioPageContext.Provider>
  );
};

export const useSearchedWalletForPortfolioPage = () =>
  useContext(SearchedWalletForPortfolioPageContext);

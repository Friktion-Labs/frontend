import React, {
  createContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  PropsWithChildren,
} from "react";
import { Connection, PublicKey, Signer } from "@solana/web3.js";
import { TokenInfo, tokens } from "../mock/tokens";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Decimal } from "decimal.js";
import { USDC_NAME } from "../friktionConstants";
import { useAppConnection } from "features/connection";

type TokenMap = Record<string, TokenInfo>;
type addTokenToTokenMapCall = (
  connection: Connection,
  mint: string,
  tokenMap: TokenMap
) => Promise<TokenInfo | null>;
export type normalizationFactorCall = (
  connection: Connection,
  mint: string
) => Promise<Decimal>;

type AssetListContextType = {
  USDCPublicKey: PublicKey | null;
  USDCToken: TokenInfo | null;
  /**
   * @deprecated Stop using this normalizationFactor call.
   */
  normalizationFactor: normalizationFactorCall;
};

const AssetListContext = createContext<AssetListContextType>({
  USDCPublicKey: null,
  USDCToken: null,
  // @ts-ignore
  normalizationFactor: () => null,
});

const AssetListProvider: React.FC<PropsWithChildren<unknown>> = ({
  children,
}) => {
  const { network } = useAppConnection();
  const [tokenMap, setTokenMap] = useState<TokenMap>({});
  const [USDCPublicKey, USDCToken] = useMemo(() => {
    const usdc = tokens[network].find((asset) => asset.name === USDC_NAME);
    return usdc ? [new PublicKey(usdc.mint), usdc] : [null, null];
  }, [network]);

  const addTokenToTokenMap: addTokenToTokenMapCall = async (
    connection: Connection,
    mint: string,
    tokenMap: TokenMap
  ): Promise<TokenInfo | null> => {
    const token = tokenMap[mint];
    if (token) return token;

    try {
      const mintKey = new PublicKey(mint);
      let decimals = (
        await new Token(
          connection,
          mintKey,
          TOKEN_PROGRAM_ID,
          null as unknown as Signer
        ).getMintInfo()
      ).decimals;

      const newToken: TokenInfo = {
        mint: mintKey,
        decimals,
      } as unknown as TokenInfo;
      setTokenMap((prev) => {
        return {
          ...prev,
          [mint]: newToken,
        };
      });
      return newToken;
    } catch (err) {
      console.error("error: ", err);
      return null;
    }
  };

  const normalizationFactor = useCallback(
    async (connection: Connection, mint: string): Promise<Decimal> => {
      const token = tokenMap[mint];
      let decimals = 0;

      if (token) {
        decimals = token.decimals;
      } else {
        // console.log("minttttt: ", mint);
        const newToken = await addTokenToTokenMap(connection, mint, tokenMap);
        if (!newToken) {
          throw new Error("Not getting mint info successfully!");
        }
        decimals = newToken.decimals;
      }

      return new Decimal(10).toPower(new Decimal(decimals.toString()));
    },
    [tokenMap]
  );

  useEffect(() => {
    if (!network) return;
    const _tokenMap = tokens[network].reduce((acc, token) => {
      // @ts-ignore
      acc[token.mint.toString()] = token;
      return acc;
    }, {});
    setTokenMap(_tokenMap);
  }, [network]);

  const value = {
    USDCPublicKey,
    USDCToken,
    normalizationFactor,
  };

  return (
    <AssetListContext.Provider value={value}>
      {children}
    </AssetListContext.Provider>
  );
};

export { AssetListContext, AssetListProvider };

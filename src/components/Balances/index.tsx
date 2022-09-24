import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useAppWallet } from "features/wallet";
import {
  DevnetUSDCToken,
  MainnetUSDCToken,
  SUBVOLT_LIST,
} from "../../09/registry10";
import { useFriktionSDK } from "../../hooks/useFriktionSDK";
import "./balances.less";
import { BalancesRow } from "./BalancesRow";

export const Balances: React.FC = () => {
  const sdk = useFriktionSDK();
  const { publicKey } = useAppWallet();
  const subvolts = SUBVOLT_LIST[sdk.network];
  const usdcToken =
    sdk.network === "mainnet-beta" ? MainnetUSDCToken : DevnetUSDCToken;
  const tokensMayHaveDuplicates = subvolts.map((def) => def.depositToken);

  const tokens = tokensMayHaveDuplicates.filter(
    (item, pos) => tokensMayHaveDuplicates.indexOf(item) === pos
  );
  if (tokens.find((t) => t.mintAccount === usdcToken.mintAccount) === undefined)
    tokens.push(usdcToken);

  return (
    <BalancesTableContainer>
      <h2
        css={css`
          font-size: 20px;
          margin-bottom: 30px;
          text-align: center;
        `}
      >
        Wallet: {publicKey ? publicKey.toString() : "not connected"}
      </h2>
      <BalancesTableBalaceHolder>
        {tokens.map((token) => (
          <BalancesRow token={token} key={token.name} />
        ))}
      </BalancesTableBalaceHolder>
    </BalancesTableContainer>
  );
};

const BalancesTableContainer = styled.div`
  margin-top: 50px;
  margin-bottom: 50px;
`;

const BalancesTableBalaceHolder = styled.div`
  width: 900px;
  margin: 0 auto;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
`;

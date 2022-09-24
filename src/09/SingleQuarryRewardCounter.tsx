import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { findMinerAddress } from "@quarryprotocol/quarry-sdk";
import {
  makeCalculateClaimableAmount,
  PARSE_MINER,
  PARSE_QUARRY,
  PARSE_REWARDER,
  useGeneratedRef,
} from "@quarryprotocol/react-quarry";
import { useParsedAccountData, useToken } from "@saberhq/sail";
import { PublicKey } from "@solana/web3.js";
import { useCallback } from "react";
import { AsyncButton09, Button09Props } from "./Button09";
import { ImportantAssetLogos } from "./greatLogos/assetLogos";
import { useFind, useSingleClaim } from "./quarryUtils";
import { QuarrySingleMine } from "./registry10";

export const SingleQuarryRewardCounter: React.FC<{
  walletKey?: PublicKey;
  quarrySingleMine: QuarrySingleMine;
  voltNum: Button09Props["theme"];
  quarryDPR: number | undefined;
}> = (props) => {
  // 1. Load the primary quarry mine
  // 2. Load the rewarder
  // 3. Load the user's miner
  const primaryRewardsTokenResult = useToken(props.quarrySingleMine.iouToken);

  const iouToken = primaryRewardsTokenResult.data;
  const minerAddress = useFind(
    findMinerAddress,
    props.walletKey
      ? [props.quarrySingleMine.quarryMine, props.walletKey]
      : undefined
  );

  const miner = useParsedAccountData(minerAddress, PARSE_MINER);
  const rewarder = useParsedAccountData(
    props.quarrySingleMine.rewarder,
    PARSE_REWARDER
  );
  const quarry = useParsedAccountData(
    props.quarrySingleMine.quarryMine,
    PARSE_QUARRY
  );

  const calculateLegacyAmountClaimable =
    iouToken && quarry.data && miner.data
      ? makeCalculateClaimableAmount({
          rewardsToken: iouToken,
          quarryData: quarry.data.accountInfo.data,
          minerData: miner.data.accountInfo.data,
        })
      : null;

  const { elementRef: internalRef } = useGeneratedRef(
    useCallback(() => {
      const amount = calculateLegacyAmountClaimable?.get();
      if (!amount) {
        return "...";
      }
      return amount.toFixed(8);
    }, [calculateLegacyAmountClaimable])
  );

  const singleClaim = useSingleClaim(props.quarrySingleMine);

  return (
    <>
      <StakeRewardRowWrap
        css={css`
          margin-bottom: -6px;
        `}
      >
        <StakeRewardRow>
          <StakeRewardCoin>
            <img src={ImportantAssetLogos["MNDE"]} alt="" />{" "}
            <span ref={internalRef} />
            <span>&nbsp;</span>
            {props.quarrySingleMine.realRewardToken.symbol}
          </StakeRewardCoin>
          <StakeRewardNumber
            css={css`
              font-size: 14px;
            `}
          >
            {props.quarryDPR !== undefined
              ? props.quarryDPR * 365 < 1 && props.quarryDPR > 0
                ? Number(props.quarryDPR * 365).toFixed(4)
                : Number(props.quarryDPR * 365).toFixed(1)
              : "..."}
            % APR
          </StakeRewardNumber>
        </StakeRewardRow>
      </StakeRewardRowWrap>

      <AsyncButton09
        theme={props.voltNum}
        disabled={
          !singleClaim || !quarry || !rewarder
            ? "Loading..."
            : !calculateLegacyAmountClaimable ||
              calculateLegacyAmountClaimable.get() < 0.000000001
            ? "No rewards to claim yet"
            : false
        }
        label={"Claim all rewards"}
        onClick={async (goodies) => {
          if (!singleClaim || !quarry.data || !rewarder.data)
            throw new Error(
              "Claim code had a minor bug. Please report this to the devs"
            );
          const claimTx = await singleClaim(
            goodies,
            quarry.data,
            rewarder.data
          );
          await goodies.handleTXWrapped(
            `Claim ${calculateLegacyAmountClaimable?.get().toFixed(8)} ${
              props.quarrySingleMine.realRewardToken.symbol
            }`,
            claimTx
          );
        }}
      />
    </>
  );
};

const StakeRewardRowWrap = styled.div`
  /* padding: 0 15px; */
`;
export const StakeRewardRow = styled.div`
  font-family: "Euclid Circular B";
  display: flex;
  justify-content: space-between;
  padding: 8px 15px 14px 15px;
  gap: 8px;
  align-items: center;
  background: hsla(230, 15%, 50%, 0.1);
  border-radius: 4px;
`;
export const StakeRewardCoin = styled.div`
  display: flex;
  align-items: center;
  img {
    height: 24px;
    width: 24px;
    display: block;
    margin-right: 8px;
  }
  font-size: 16px;
`;
export const StakeRewardNumber = styled.div`
  font-variant-numeric: tabular-nums;
  font-size: 16px;
`;

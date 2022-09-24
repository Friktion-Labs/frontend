import { useAuctionResults } from "09/AuctionResults";
import { ImportantAssetLogos } from "09/greatLogos/assetLogos";
import { VoltNumber } from "09/registry10";
import { useQuarantineChristmas10VFACWarningOnlyWorksWithCoveredCalls } from "09/useChristmasCard10";
import { apyFromData } from "09/YieldTooltip";
import { css, Theme } from "@emotion/react";
import styled, { Interpolation } from "@emotion/styled";
import { ScrollingGallery } from "common/components/ScrollingGallery";
import { Typography } from "common/components/Typography";
import { voltageDefAdjustedCards } from "common/utils/voltageDefAdjustedCards";
import { useMemo } from "react";

const DURATION_PER_VOLT = 2;

interface ApyScrollProps {
  voltNumber: VoltNumber;
  css?: Interpolation<Theme>;
}

export const ApyScroll = ({ voltNumber, ...rest }: ApyScrollProps) => {
  const vfac09 = useQuarantineChristmas10VFACWarningOnlyWorksWithCoveredCalls();
  const { yieldDataPerVolt } = useAuctionResults();
  const cards = useMemo(
    () => voltageDefAdjustedCards(vfac09.cards, yieldDataPerVolt, voltNumber),
    [vfac09, voltNumber, yieldDataPerVolt]
  );

  return (
    <ScrollingGallery
      disableDrag
      spaceBetween={20}
      loopDuration={DURATION_PER_VOLT * cards.length}
      containerStyles={(_, isContainerLargerThanChildren) =>
        css(
          isContainerLargerThanChildren
            ? {
                margin: "0 -34px !important",
                padding: "0 24px",
              }
            : {}
        )
      }
      {...rest}
    >
      {cards.map((card, i) => {
        const yieldData = card.def ? yieldDataPerVolt[card.def.globalId] : null;
        const apyWithPercentSign = apyFromData(
          card.data,
          yieldData ? yieldData.averagedEpochYield : null
        );

        return (
          <ApyContainer key={i}>
            <img
              width="32px"
              height="32px"
              src={ImportantAssetLogos[card.underlyingAssetSymbol]}
              alt={card.underlyingAssetSymbol}
            />
            <Typography variant="bodyL">
              {card.underlyingAssetSymbol}
            </Typography>
            <Typography variant="bodyL">{apyWithPercentSign}</Typography>
          </ApyContainer>
        );
      })}
    </ScrollingGallery>
  );
};

const ApyContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

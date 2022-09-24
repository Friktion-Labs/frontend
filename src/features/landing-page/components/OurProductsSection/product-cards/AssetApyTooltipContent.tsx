import { VoltNumber } from "09/registry10";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Typography } from "common/components/Typography";

interface AssetApyTooltipContentProps {
  apy: string;
  assetName: string;
  voltNumber: VoltNumber;
}

export const AssetApyTooltipContent = ({
  apy,
  assetName,
  voltNumber,
}: AssetApyTooltipContentProps) => (
  <AssetApyTooltipContentLayout>
    <TitleAsset variant="bodyS">{assetName}</TitleAsset>

    <ApyLayout
      css={css`
        margin-top: 12px;
      `}
    >
      <ApyPercentage voltNumber={voltNumber} variant="h4" component="p">
        {apy}
      </ApyPercentage>
      <ApyText>APY</ApyText>
    </ApyLayout>
  </AssetApyTooltipContentLayout>
);

const AssetApyTooltipContentLayout = styled.div`
  padding: 6px 12px;
`;

const TitleAsset = styled(Typography)`
  color: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? theme.palette.grey[300]
      : theme.palette.grey[700]};
  font-weight: 500;
`;

const ApyLayout = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 2px;
`;

const ApyPercentage = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "voltNumber",
})<{ voltNumber: VoltNumber }>`
  color: ${({ theme, voltNumber }) =>
    theme.palette[
      voltNumber === 1
        ? "sky"
        : voltNumber === 2
        ? "electricity"
        : voltNumber === 3
        ? "neon"
        : voltNumber === 4
        ? "pink"
        : "lavender"
    ][theme.palette.mode === "dark" ? 500 : 800]};
  font-weight: 600;
  font-size: 23px;
  line-height: 1;
`;

const ApyText = styled(Typography)`
  color: ${({ theme }) => theme.palette.grey[500]};
  font-weight: 500;
`;

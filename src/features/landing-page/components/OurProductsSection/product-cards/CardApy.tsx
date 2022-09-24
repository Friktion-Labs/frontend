import { VoltNumber } from "09/registry10";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { MeanApyDisplay } from "common/components/MeanApyDisplay";
import { Typography } from "common/components/Typography";
import { useVoltMeanApyAndIcons } from "common/hooks/useVoltMeanApyAndIcons";
import { Interpolation, Theme } from "@emotion/react";
import { Popover } from "antd";
import { AssetApyTooltipContent } from "./AssetApyTooltipContent";
import React from "react";

const MAX_ICON_COUNT = 5;

interface CardApyProps {
  voltNumber: VoltNumber;
  css?: Interpolation<Theme>;
}

export const CardApy = ({ voltNumber, ...rest }: CardApyProps) => {
  const { allValidIcons, meanApy, apyByAsset } =
    useVoltMeanApyAndIcons(voltNumber);

  return (
    <CardApyLayout {...rest}>
      <MeanApyDisplay voltNumber={voltNumber}>{meanApy}</MeanApyDisplay>
      <div
        css={css`
          display: flex;
          align-items: center;
        `}
      >
        <div
          css={css`
            padding-right: 10px;
          `}
        >
          {allValidIcons.slice(0, MAX_ICON_COUNT).map(({ src, card }) => {
            const imgComponent = (
              <img
                css={css`
                  width: 32px;
                  height: 32px;
                  margin-right: -10px;
                `}
                src={src}
                alt={card.underlyingAssetSymbol}
              />
            );

            const apy = apyByAsset[card.underlyingAssetSymbol];
            const def = card.def;

            if (!apy || !def) {
              return <React.Fragment key={src}>{imgComponent}</React.Fragment>;
            }

            return (
              <Popover
                key={src}
                destroyTooltipOnHide
                placement="top"
                content={
                  <AssetApyTooltipContent
                    voltNumber={voltNumber}
                    apy={apy}
                    assetName={def.underlying.name}
                  />
                }
              >
                {imgComponent}
              </Popover>
            );
          })}
        </div>
        {allValidIcons.length > MAX_ICON_COUNT && (
          <Typography
            variant="bodyXs"
            css={(theme) => css`
              color: ${theme.palette.mode === "dark"
                ? theme.palette.grey[400]
                : theme.palette.grey[600]};
              margin-left: 6px;
              flex: 1 0 auto;
              display: flex;
              flex-direction: column;
            `}
          >
            <span>&amp;</span>
            <span>MORE</span>
          </Typography>
        )}
      </div>
    </CardApyLayout>
  );
};

const CardApyLayout = styled.div`
  display: flex;
  justify-content: space-between;
`;

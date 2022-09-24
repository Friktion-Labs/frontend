import { Card09Props } from "09/Card10";
import { ImportantAssetLogos } from "09/greatLogos/assetLogos";
import { css, Interpolation, Theme } from "@emotion/react";

interface AssetLogoPairProps {
  card: Card09Props;
  css?: Interpolation<Theme>;
  className?: string;
  LeftImgProps?: React.ImgHTMLAttributes<HTMLImageElement> & {
    css?: Interpolation<Theme>;
  };
  RightImgProps?: React.ImgHTMLAttributes<HTMLImageElement> & {
    css?: Interpolation<Theme>;
  };
}

export const AssetLogoPair = ({
  card,
  LeftImgProps,
  RightImgProps,
  ...rest
}: AssetLogoPairProps) => (
  <div
    css={css`
      width: 72px;
    `}
    {...rest}
  >
    <img
      width="48px"
      height="48px"
      src={ImportantAssetLogos[card.quoteAssetSymbol]}
      alt={`${card.quoteAssetSymbol} logo`}
      {...LeftImgProps}
    />
    <img
      width="48px"
      height="48px"
      css={css`
        margin-left: -24px;
        z-index: -1;
        position: relative;
      `}
      src={ImportantAssetLogos[card.underlyingAssetSymbol]}
      alt={`${card.underlyingAssetSymbol} logo`}
      {...RightImgProps}
    />
  </div>
);

import { css } from "@emotion/react";

export const GlowClipPaths = () => (
  <>
    {/* Relatively sized bolt path, width and height styles must be supplied to elements using this as clip */}
    <svg
      css={css`
        position: absolute;
        width: 0;
        height: 0;
      `}
    >
      <clipPath id="boltPathRelative" clipPathUnits="objectBoundingBox">
        <path d="M0.884,0.544 L0.233,1 L0.41,0.649 L0.884,0.544 M0,0.7 L1,0 L0.728,0.54 L0,0.7"></path>
      </clipPath>
    </svg>
    {/* Relatively sized right chevron path, width and height styles must be supplied to elements using this as clip */}
    <svg
      css={css`
        position: absolute;
        width: 0;
        height: 0;
      `}
    >
      <clipPath id="chevronRightPathRelative" clipPathUnits="objectBoundingBox">
        <path d="M0.19,0,0,0.118,0.618,0.5 L0,0.883 L0.19,1 L1,0.5"></path>
      </clipPath>
    </svg>
    {/* Relatively sized performance icon path, width and height styles must be supplied to elements using this as clip */}
    <svg
      css={css`
        position: absolute;
        width: 0;
        height: 0;
      `}
    >
      <clipPath id="performancePathRelative" clipPathUnits="objectBoundingBox">
        <path d="M0.611,0.05 L0.056,0.65 H0.556 L0.5,1 L1,0.45 H0.556 L0.611,0.05"></path>
      </clipPath>
    </svg>
  </>
);

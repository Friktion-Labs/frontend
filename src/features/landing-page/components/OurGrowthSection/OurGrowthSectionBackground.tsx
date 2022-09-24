import { css } from "@emotion/react";
import { AspectRatioBox } from "common/components/AspectRatioBox";
import { Ellipse } from "common/components/Ellipse";

export const OurGrowthSectionBackground = () => (
  <AspectRatioBox
    paddingTop="100%"
    css={css`
      z-index: -99;
      position: absolute;
      filter: blur(100px);
      width: 70%;
      right: 0;
      bottom: 0;
      transform: translate(3%, 5%);
      -webkit-backface-visibility: hidden;
      -moz-backface-visibility: hidden;
      -webkit-transform: translate3d(0, 0, 0);
      -moz-transform: translate3d(0, 0, 0);
    `}
  >
    <Ellipse />
  </AspectRatioBox>
);

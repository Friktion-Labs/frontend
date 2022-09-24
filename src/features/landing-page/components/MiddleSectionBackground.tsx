import { css } from "@emotion/react";
import { AspectRatioBox } from "common/components/AspectRatioBox";
import { Ellipse } from "common/components/Ellipse";

export const MiddleSectionBackground = () => (
  <>
    <AspectRatioBox
      paddingTop="100%"
      css={css`
        z-index: -99;
        position: absolute;
        filter: blur(100px);
        width: 100%;
        right: 0;
        top: 0;
        transform: translate(50%, 15%);
        -webkit-backface-visibility: hidden;
        -moz-backface-visibility: hidden;
        -webkit-transform: translate3d(0, 0, 0);
        -moz-transform: translate3d(0, 0, 0);
      `}
    >
      <Ellipse />
    </AspectRatioBox>
    <AspectRatioBox
      paddingTop="100%"
      css={css`
        z-index: -99;
        position: absolute;
        filter: blur(100px);
        width: 80%;
        left: 50%;
        top: 25%;
        transform: translate(-50%, 0);
        -webkit-backface-visibility: hidden;
        -moz-backface-visibility: hidden;
        -webkit-transform: translate3d(0, 0, 0);
        -moz-transform: translate3d(0, 0, 0);
      `}
    >
      <Ellipse
        css={css`
          opacity: 0.4;
        `}
      />
    </AspectRatioBox>
    <AspectRatioBox
      paddingTop="100%"
      css={css`
        z-index: -99;
        position: absolute;
        filter: blur(100px);
        width: 80%;
        left: 0;
        top: 50%;
        transform: translate(-40%, -30%);
        -webkit-backface-visibility: hidden;
        -moz-backface-visibility: hidden;
        -webkit-transform: translate3d(0, 0, 0);
        -moz-transform: translate3d(0, 0, 0);
      `}
    >
      <Ellipse
        css={css`
          opacity: 0.6;
        `}
      />
    </AspectRatioBox>
    <AspectRatioBox
      paddingTop="100%"
      css={css`
        z-index: -99;
        position: absolute;
        filter: blur(100px);
        width: 100%;
        right: 0;
        top: 30%;
        transform: translate(30%, 0);
        -webkit-backface-visibility: hidden;
        -moz-backface-visibility: hidden;
        -webkit-transform: translate3d(0, 0, 0);
        -moz-transform: translate3d(0, 0, 0);
      `}
    >
      <Ellipse />
    </AspectRatioBox>
  </>
);
